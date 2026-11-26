"""Costruisce la scena del bilico Di Riso Teloni e la salva in work/scene_<serie>.blend.

Uso:  python3 tools/hero3d/scene.py --series desktop
"""
import argparse
import sys
from pathlib import Path

import bpy
import mathutils

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import BLU, PERNO_DIETRO_FRONTALE, ROSSO, SERIES, TOTAL_FRAMES, WORK  # noqa: E402


def lin(c):
    """sRGB 0..1 -> lineare (Blender lavora in lineare)."""
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def bounds(objs):
    pts = [o.matrix_world @ mathutils.Vector(c) for o in objs if o.type == "MESH" for c in o.bound_box]
    mn = mathutils.Vector([min(p[i] for p in pts) for i in range(3)])
    mx = mathutils.Vector([max(p[i] for p in pts) for i in range(3)])
    return mn, mx


def import_glb(path, collection_name):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path))
    new = [o for o in bpy.data.objects if o not in before]
    col = bpy.data.collections.new(collection_name)
    bpy.context.scene.collection.children.link(col)
    for o in new:
        for c in o.users_collection:
            c.objects.unlink(o)
        col.objects.link(o)
    return new


def paint(name, color, rough=0.3, metal=0.0, coat=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*lin(color), 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Coat Roughness"].default_value = 0.05
    return m


def set_material(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)


def setup_world():
    """Sfondo: gradiente del sito (nero -> blu) visto dalla camera; luce ambiente tenue e neutra."""
    w = bpy.data.worlds.new("Studio")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    mix = nt.nodes.new("ShaderNodeMixShader")
    lp = nt.nodes.new("ShaderNodeLightPath")
    amb = nt.nodes.new("ShaderNodeBackground")
    amb.inputs["Color"].default_value = (0.05, 0.05, 0.08, 1)
    amb.inputs["Strength"].default_value = 1.0
    cam_bg = nt.nodes.new("ShaderNodeBackground")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*lin((0.0, 0.0, 0.0)), 1)
    ramp.color_ramp.elements[1].position = 1.0
    ramp.color_ramp.elements[1].color = (*[c * 0.55 for c in lin(BLU)], 1)
    nt.links.new(tc.outputs["Window"], sep.inputs[0])
    nt.links.new(sep.outputs["X"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], cam_bg.inputs["Color"])
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs["Fac"])
    nt.links.new(amb.outputs[0], mix.inputs[1])
    nt.links.new(cam_bg.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])


CENTER_XY = (0.0, 0.0)


def setup_floor():
    bpy.ops.mesh.primitive_plane_add(size=200, location=(CENTER_XY[0], CENTER_XY[1], 0))
    floor = bpy.context.object
    floor.name = "Pavimento"
    m = bpy.data.materials.new("PavimentoLucido")
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.003, 0.003, 0.005, 1)
    p.inputs["Roughness"].default_value = 0.22
    # Il riflesso sfuma nel nero allontanandosi dal camion: niente bordo d'orizzonte.
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    grad = nt.nodes.new("ShaderNodeTexGradient")
    grad.gradient_type = "SPHERICAL"
    mapn = nt.nodes.new("ShaderNodeMapping")
    mapn.inputs["Scale"].default_value = (1 / 30, 1 / 30, 1)
    # Lontano dal camion il pavimento diventa lo stesso gradiente dello sfondo: orizzonte invisibile.
    black = nt.nodes.new("ShaderNodeEmission")
    black.inputs["Strength"].default_value = 1.0
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].color = (*[c * 0.55 for c in lin(BLU)], 1)
    nt.links.new(tc.outputs["Window"], sep.inputs[0])
    nt.links.new(sep.outputs["X"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], black.inputs["Color"])
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(tc.outputs["Object"], mapn.inputs["Vector"])
    nt.links.new(mapn.outputs["Vector"], grad.inputs["Vector"])
    nt.links.new(grad.outputs["Fac"], mix.inputs["Fac"])
    nt.links.new(black.outputs[0], mix.inputs[1])
    nt.links.new(p.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    set_material(floor, m)
    # Il pavimento riflette ma non si vede come "orizzonte": dalla camera sfuma nello sfondo.
    floor.visible_shadow = True


def area(name, loc, target, size, energy, color=(1, 1, 1)):
    bpy.ops.object.light_add(type="AREA", location=loc)
    l = bpy.context.object
    l.name = name
    l.data.size = size
    l.data.energy = energy
    l.data.color = color
    d = mathutils.Vector(target) - mathutils.Vector(loc)
    l.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return l


def setup_lights(center):
    c = tuple(center)
    # Key alta e morbida sul fianco, rim fredda da dietro per staccare la sagoma dallo sfondo.
    key = area("Key", (center.x - 10, center.y - 4, 9), c, 10, 3200, (1.0, 0.97, 0.93))
    fill = area("Fill", (center.x - 6, center.y - 16, 3), c, 8, 900, (0.85, 0.88, 1.0))
    fill.visible_glossy = False  # niente macchia bianca riflessa sul pavimento
    # Alta, così il suo riflesso sul pavimento cade fuori inquadratura.
    area("Rim", (center.x + 6, center.y + 12, 16), c, 6, 9000, (0.7, 0.78, 1.0))
    top = area("Top", (center.x, center.y, 11), c, 16, 1800)
    # Il pavimento non deve riflettere i pannelli grandi (macchia bianca): li escludo dai riflessi
    # e aggiungo una striscia sottile che disegna il riflesso lungo il fianco.
    key.visible_glossy = False
    top.visible_glossy = False
    strip = area("Striscia", (center.x - 12, center.y, 6), c, 1, 3000, (1, 1, 1))
    strip.data.shape = "RECTANGLE"
    strip.data.size, strip.data.size_y = 22, 0.4
    strip.visible_diffuse = False


def setup_camera(series, center):
    w, h = SERIES[series]
    scn = bpy.context.scene
    scn.render.resolution_x, scn.render.resolution_y = w, h
    bpy.ops.object.camera_add()
    cam = bpy.context.object
    cam.name = "Camera"
    scn.camera = cam
    cam.data.lens = 35 if series == "desktop" else 28
    # Tre quarti anteriore sinistro (il default di prova; il percorso vero lo fa camera_path.py).
    # Desktop: il bilico occupa i 2/3 destri, la fascia sinistra resta libera per i testi.
    cam.location = (center.x - 19, center.y - 15, 2.6)
    target = mathutils.Vector((center.x - 4.5, center.y - 3.5, 1.7))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    return cam


def setup_render(samples=32):
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.samples = samples
    scn.cycles.use_denoising = True
    scn.cycles.denoiser = "OPENIMAGEDENOISE"
    scn.cycles.max_bounces = 6
    scn.view_settings.view_transform = "AgX"
    scn.view_settings.look = "AgX - Medium High Contrast"
    scn.render.image_settings.file_format = "PNG"
    scn.render.film_transparent = False
    scn.frame_start, scn.frame_end = 1, TOTAL_FRAMES
    # Usa la GPU se c'è (sul PC di Diego), altrimenti CPU.
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for backend in ("OPTIX", "CUDA", "HIP", "ONEAPI", "METAL"):
            try:
                prefs.compute_device_type = backend
                prefs.get_devices()
                if any(d.type == backend for d in prefs.devices):
                    for d in prefs.devices:
                        d.use = d.type == backend
                    scn.cycles.device = "GPU"
                    print(f"[hero3d] GPU: {backend}")
                    return
            except TypeError:
                continue
    except Exception as e:  # noqa: BLE001
        print("[hero3d] GPU non disponibile:", e)
    scn.cycles.device = "CPU"
    print("[hero3d] rendering su CPU")


CABINA = ("Cabina", "Pannello posteriore cabina", "Profilo laterale cabina", "Deflettore", "Giunto cabina", "Tetto cabina", "Porta", "Parafango", "Calandra")


def apply_base_finish(tractor, trailer):
    """Finiture base (Task 1). Quelle definitive arrivano con materials.py (Task 2)."""
    bianco = paint("VerniceBianca", (0.93, 0.94, 0.95), rough=0.25, coat=1.0)
    rosso = paint("PVCRosso", ROSSO, rough=0.45)
    for o in tractor:
        if o.type == "MESH" and o.name.startswith(CABINA):
            set_material(o, bianco)
    for o in trailer:
        if o.type == "MESH" and o.name.startswith("Telone laterale"):
            set_material(o, rosso)


def build_scene(series):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    tractor = import_glb(WORK / "trattore_raw.glb", "Trattore")
    trailer = import_glb(WORK / "semirimorchio_raw.glb", "Semirimorchio")

    # Aggancio: il frontale del semirimorchio e' al suo minimo Y; la ralla del trattore e' "Ralla di accoppiamento".
    tmn, _ = bounds(trailer)
    ralla = next(o for o in tractor if o.name.startswith("Ralla di accoppiamento"))
    rc = sum((ralla.matrix_world @ mathutils.Vector(b) for b in ralla.bound_box), mathutils.Vector()) / 8
    dy = (tmn.y + PERNO_DIETRO_FRONTALE) - rc.y
    for o in tractor:
        if o.parent is None:
            o.location.y += dy
    bpy.context.view_layer.update()

    apply_base_finish(tractor, trailer)
    from materials import apply_finish
    apply_finish()
    mn, mx = bounds(tractor + trailer)
    center = (mn + mx) / 2
    global CENTER_XY
    CENTER_XY = (center.x, center.y)
    setup_world()
    setup_floor()
    setup_lights(center)
    setup_camera(series, center)
    from camera_path import add_macro_detail, keyframe_cameras
    add_macro_detail()
    keyframe_cameras(series, TOTAL_FRAMES)
    setup_render()
    out = WORK / f"scene_{series}.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(out))
    print(f"[hero3d] scena salvata: {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--series", choices=list(SERIES), default="desktop")
    args = ap.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:])
    build_scene(args.series)
