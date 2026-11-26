"""Finiture definitive del bilico (Task 2): teli laterali in PVC con grafica, tetto bianco, inox, fascia rifrangente.

I teli del modello sono scatole senza UV: li nascondo e li sostituisco con griglie fitte
(TeloLato_sx / TeloLato_dx) che hanno UV corrette e una leggera bombatura tra le cinghie.
"""
import math
import sys
from pathlib import Path

import bpy
import mathutils

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import ASSETS  # noqa: E402

TELO_Y = (0.52, 13.94)
TELO_Z = (1.42, 3.87)
TELO_X = 1.28
CINGHIA_Y0, CINGHIA_PASSO = 0.83, 0.64
BOMBATURA = 0.035  # metri, il telo si gonfia tra le cinghie


def _node(nt, kind, **inputs):
    n = nt.nodes.new(kind)
    for k, v in inputs.items():
        n.inputs[k].default_value = v
    return n


def pvc_material():
    m = bpy.data.materials.get("PVCTelo") or bpy.data.materials.new("PVCTelo")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = _node(nt, "ShaderNodeBsdfPrincipled", Roughness=0.42)
    p.inputs["Coat Weight"].default_value = 0.1
    p.inputs["Coat Roughness"].default_value = 0.2
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(ASSETS / "telo_laterale.png"), check_existing=True)
    mask = nt.nodes.new("ShaderNodeTexImage")
    mask.image = bpy.data.images.load(str(ASSETS / "telo_laterale_mask.png"), check_existing=True)
    mask.image.colorspace_settings.name = "Non-Color"
    # Trama del PVC: fitta onda incrociata -> bump.
    uv = nt.nodes.new("ShaderNodeTexCoord")
    w1 = _node(nt, "ShaderNodeTexWave", Scale=900.0, Distortion=0.0)
    w2 = _node(nt, "ShaderNodeTexWave", Scale=900.0, Distortion=0.0)
    w2.bands_direction = "Y"
    add = nt.nodes.new("ShaderNodeMath")
    bump = _node(nt, "ShaderNodeBump", Strength=0.08, Distance=0.001)
    nt.links.new(uv.outputs["UV"], w1.inputs["Vector"])
    nt.links.new(uv.outputs["UV"], w2.inputs["Vector"])
    nt.links.new(w1.outputs["Fac"], add.inputs[0])
    nt.links.new(w2.outputs["Fac"], add.inputs[1])
    nt.links.new(add.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    nt.links.new(tex.outputs["Color"], p.inputs["Base Color"])
    # Fascia rifrangente: lucida e leggermente metallica dove c'e' la maschera.
    rough = nt.nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.42
    rough.inputs["To Max"].default_value = 0.12
    nt.links.new(mask.outputs["Color"], rough.inputs["Value"])
    nt.links.new(rough.outputs["Result"], p.inputs["Roughness"])
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m


def telo_mesh(name, side):
    """Griglia del telo laterale. side = -1 sinistro, +1 destro. UV: u dal frontale al retro visto da fuori."""
    nu, nv = 210, 40
    y0, y1 = TELO_Y
    z0, z1 = TELO_Z
    verts, faces, uvs = [], [], []
    for j in range(nv + 1):
        for i in range(nu + 1):
            u, v = i / nu, j / nv
            y = y0 + (y1 - y0) * u
            z = z0 + (z1 - z0) * v
            # bombatura: massima a meta' tra due cinghie, nulla sulle cinghie e sui bordi alti/bassi
            ph = ((y - CINGHIA_Y0) / CINGHIA_PASSO) % 1.0
            b = BOMBATURA * math.sin(math.pi * ph) * math.sin(math.pi * v) ** 0.6
            verts.append((side * (TELO_X + b), y, z))
    for j in range(nv):
        for i in range(nu):
            a = j * (nu + 1) + i
            q = (a, a + 1, a + nu + 2, a + nu + 1)
            faces.append(q if side > 0 else q[::-1])
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    uvl = me.uv_layers.new(name="UV")
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            i, j = vi % (nu + 1), vi // (nu + 1)
            u = i / nu
            # Visto da fuori, il lato sinistro (x<0) ha il frontale a sinistra; il destro a destra.
            uvl.data[li].uv = (1 - u if side < 0 else u, j / nv)
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.data.collections["Semirimorchio"].objects.link(ob)
    return ob


def apply_finish():
    pvc = pvc_material()
    for o in list(bpy.data.objects):
        if o.name.startswith("Telone laterale"):
            o.hide_render = True
            o.hide_viewport = True
    for side, n in ((-1, "TeloLato_sx"), (1, "TeloLato_dx")):
        ob = telo_mesh(n, side)
        ob.data.materials.append(pvc)

    from scene import paint, set_material  # import tardivo: scene importa questo modulo

    inox = paint("Inox", (0.82, 0.83, 0.85), rough=0.18, metal=1.0)
    bianco_tetto = paint("TettoBianco", (0.9, 0.9, 0.88), rough=0.55)
    bordo = paint("BordoTelo", (0.62, 0.06, 0.06), rough=0.5)
    alluminio = paint("Alluminio", (0.78, 0.79, 0.81), rough=0.3, metal=1.0)
    for o in bpy.data.objects:
        if o.type != "MESH":
            continue
        if o.name.startswith(("Cricchetto inox", "Asta tenditelo")):
            set_material(o, inox)
        elif "tetto" in o.name.lower() and not o.name.startswith("Cabina"):
            set_material(o, bianco_tetto)
        elif o.name.startswith(("Telone | bordo", "Telone | rinforzo")):
            set_material(o, bordo)
        elif o.name.startswith(("Guida superiore telone", "Semirimorchio | profilo inferiore alluminio", "Protezione laterale")):
            set_material(o, alluminio)
