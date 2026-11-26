"""Fasi 1-2: la sagoma dell'Italia (in PVC rosso) fluttua davanti al bilico, si allarga fino a diventare
il telo intero e cala sul fianco sinistro. Al fotogramma 60 coincide con il telo vero, che da li' in poi
prende il suo posto.

Tecnica: copia del telo laterale con maschera alfa (sagoma Italia + rettangolo che si allarga), trasformazione
animata del pezzo intero e modificatore Wave che si spegne all'arrivo.
"""
import math
import sys
from pathlib import Path

import bpy
import mathutils

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import ASSETS, PHASES  # noqa: E402
from materials import TELO_Y, TELO_Z  # noqa: E402

# Larghezza della sagoma sul telo, in frazione della lunghezza (sagoma alta quanto il telo).
ITALIA_U = (TELO_Z[1] - TELO_Z[0]) * (260 / 313.3) / (TELO_Y[1] - TELO_Y[0])


def masked_material(base):
    m = base.copy()
    m.name = "PVCTeloVolante"
    nt = m.node_tree
    p = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    # In volo il telo e' molto vicino alla key: meno lucido, se no la sagoma sbianca verso il rosa.
    p.inputs["Specular IOR Level"].default_value = 0.15
    p.inputs["Coat Weight"].default_value = 0.0
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    uv = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(uv.outputs["UV"], sep.inputs[0])
    # Sagoma Italia centrata sul telo.
    mapn = nt.nodes.new("ShaderNodeMapping")
    mapn.inputs["Scale"].default_value = (1 / ITALIA_U, 1, 1)
    mapn.inputs["Location"].default_value = (0.5 - 0.5 / ITALIA_U, 0, 0)
    nt.links.new(uv.outputs["UV"], mapn.inputs["Vector"])
    img = nt.nodes.new("ShaderNodeTexImage")
    img.image = bpy.data.images.load(str(ASSETS / "italia_mask.png"), check_existing=True)
    img.image.colorspace_settings.name = "Non-Color"
    img.extension = "CLIP"
    nt.links.new(mapn.outputs["Vector"], img.inputs["Vector"])
    # Rettangolo che si allarga dal centro: |u - 0.5| < g (g animato), bordo morbido.
    du = nt.nodes.new("ShaderNodeMath")
    du.operation = "SUBTRACT"
    du.inputs[1].default_value = 0.5
    nt.links.new(sep.outputs["X"], du.inputs[0])
    ab = nt.nodes.new("ShaderNodeMath")
    ab.operation = "ABSOLUTE"
    nt.links.new(du.outputs[0], ab.inputs[0])
    g = nt.nodes.new("ShaderNodeValue")
    g.name = "Crescita"
    rng = nt.nodes.new("ShaderNodeMapRange")
    rng.inputs["From Max"].default_value = 0.012
    # rect = 1 - mapRange(|u-0.5| - g, 0..0.012)
    diff = nt.nodes.new("ShaderNodeMath")
    diff.operation = "SUBTRACT"
    nt.links.new(ab.outputs[0], diff.inputs[0])
    nt.links.new(g.outputs[0], diff.inputs[1])
    nt.links.new(diff.outputs[0], rng.inputs["Value"])
    inv = nt.nodes.new("ShaderNodeMath")
    inv.operation = "SUBTRACT"
    inv.inputs[0].default_value = 1.0
    nt.links.new(rng.outputs["Result"], inv.inputs[1])
    mx = nt.nodes.new("ShaderNodeMath")
    mx.operation = "MAXIMUM"
    nt.links.new(img.outputs["Color"], mx.inputs[0])
    nt.links.new(inv.outputs[0], mx.inputs[1])
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(mx.outputs[0], mix.inputs["Fac"])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(p.outputs[0], mix.inputs[2])
    # Sagoma in rosso pieno; il logo compare mentre il telo si allarga.
    tono = nt.nodes.new("ShaderNodeMix")
    tono.data_type = "RGBA"
    tono.blend_type = "MIX"
    tono.name = "Tono"
    tono.inputs["B"].default_value = (0.30, 0.004, 0.004, 1)  # rosso pieno: la sagoma e' solo Italia, senza pezzi di logo
    base_link = p.inputs["Base Color"].links[0]
    nt.links.new(base_link.from_socket, tono.inputs["A"])
    nt.links.new(tono.outputs["Result"], p.inputs["Base Color"])
    fac = tono.inputs["Factor"]
    fac.default_value = 1.0
    fac.keyframe_insert("default_value", frame=1)
    fac.keyframe_insert("default_value", frame=PHASES["forma"][0] + 4)
    fac.default_value = 0.0
    fac.keyframe_insert("default_value", frame=PHASES["forma"][0] + 22)
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    a, b = PHASES["forma"]
    g.outputs[0].default_value = -0.03  # all'inizio solo la sagoma, nessuna striscia centrale
    g.outputs[0].keyframe_insert("default_value", frame=a + 4)
    g.outputs[0].default_value = 0.52
    g.outputs[0].keyframe_insert("default_value", frame=b - 6)
    return m


def build_italia_telo() -> None:
    real = bpy.data.objects["TeloLato_sx"]
    fly = real.copy()
    fly.data = real.data.copy()
    fly.name = "TeloVolante"
    real.users_collection[0].objects.link(fly)
    fly.data.materials.clear()
    fly.data.materials.append(masked_material(real.data.materials[0]))

    # Origine al centro del telo, cosi' rotazioni e spostamenti sono naturali.
    cx, cy, cz = -1.3, sum(TELO_Y) / 2, sum(TELO_Z) / 2
    fly.data.transform(mathutils.Matrix.Translation((-cx, -cy, -cz)))
    fly.location = (cx, cy, cz)

    wave = fly.modifiers.new("Onda", "WAVE")
    wave.use_normal = True
    wave.use_x = wave.use_y = False
    wave.width, wave.speed, wave.narrowness = 1.6, 0.06, 1.2

    a1, b1 = PHASES["apertura"]
    a2, b2 = PHASES["forma"]
    # Partenza: piu' vicino alla camera, sollevato, girato verso l'obiettivo, con un'onda morbida.
    start_loc = (cx - 7.5, cy - 5.5, cz + 0.9)
    start_rot = (math.radians(-4), math.radians(5), math.radians(40))
    for f, loc, rot, h, sc in (
        (1, start_loc, start_rot, 0.12, 1.6),
        (b1, (start_loc[0] + 0.4, start_loc[1] + 0.3, start_loc[2] - 0.15), start_rot, 0.12, 1.55),
        (b2, (cx, cy, cz), (0, 0, 0), 0.0, 1.0),
    ):
        fly.location, fly.rotation_euler, fly.scale = loc, rot, (sc, sc, sc)
        fly.keyframe_insert("location", frame=f)
        fly.keyframe_insert("rotation_euler", frame=f)
        fly.keyframe_insert("scale", frame=f)
        wave.height = h
        wave.keyframe_insert("height", frame=f)

    # Il telo vero compare quando quello in volo arriva; prima il fianco del semirimorchio e' scoperto.
    for ob, before, after in ((real, True, False), (fly, False, True)):
        ob.hide_render = before
        ob.keyframe_insert("hide_render", frame=1)
        ob.hide_render = after
        ob.keyframe_insert("hide_render", frame=b2 + 1)
