"""Percorso camera della sequenza (fotogrammi 1-150) e dettaglio extra per i primi piani.

Camera vincolata (Track To) a un Empty "Mira" animato; profondita' di campo a fuoco sulla mira.
Desktop: il bilico sta nei 2/3 destri (fascia sinistra libera per i testi).
Mobile: il bilico sta nei 2/3 bassi (fascia alta libera).
"""
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))

# Cinghia scelta per il primo piano: la 10a sul lato sinistro (lato camera).
MACRO_Y = 0.83 + 10 * 0.64

# (fotogramma, posizione camera, punto mirato, focale mm, f-stop)
KEYS = [
    (1, (-19.0, -9.5, 2.6), (-4.5, 2.0, 1.7), 35, 11),
    (60, (-19.0, -9.5, 2.6), (-4.5, 2.0, 1.7), 35, 11),
    (90, (-27.0, 8.4, 2.4), (-4.8, 8.4, 2.3), 35, 11),  # fianco pieno: bilico nei 2/3 destri, logo leggibile
    (102, (-3.0, 5.9, 1.75), (-1.31, MACRO_Y, 1.45), 50, 4),  # cricchetto inox e cinghie
    (114, (-1.95, 2.6, 1.7), (-1.29, 9.5, 1.75), 45, 4),  # radente lungo la fascia rifrangente
    (127, (-5.4, 7.2, 2.95), (-1.3, 7.2, 2.95), 50, 5.6),  # logo e trama del PVC
    (150, (-16.5, -11.0, 3.3), (-3.6, 3.6, 1.7), 35, 11),  # chiusura larga a tre quarti
]
# Mobile: stessa coreografia; il punto mirato sale (camion piu' in basso) e la camera arretra un po' nei larghi.
MOBILE_TARGET_DZ = 1.1
MOBILE_BACK = 1.18


def keyframe_cameras(series: str, total: int = 150) -> None:
    scn = bpy.context.scene
    cam = scn.camera
    mira = bpy.data.objects.new("Mira", None)
    scn.collection.objects.link(mira)
    for c in list(cam.constraints):
        cam.constraints.remove(c)
    tt = cam.constraints.new("TRACK_TO")
    tt.target = mira
    tt.track_axis, tt.up_axis = "TRACK_NEGATIVE_Z", "UP_Y"
    cam.data.dof.use_dof = True
    cam.data.dof.focus_object = mira
    for f, loc, tgt, lens, fstop in KEYS:
        if series == "mobile":
            wide = lens <= 40
            if wide:
                loc = tuple(t + (l - t) * MOBILE_BACK for l, t in zip(loc, tgt))
                tgt = (tgt[0], tgt[1], tgt[2] + MOBILE_TARGET_DZ)
            lens = round(lens * 0.8)
        cam.location = loc
        mira.location = tgt
        cam.data.lens = lens
        cam.data.dof.aperture_fstop = fstop
        cam.keyframe_insert("location", frame=f)
        mira.keyframe_insert("location", frame=f)
        cam.data.keyframe_insert("lens", frame=f)
        cam.data.dof.keyframe_insert("aperture_fstop", frame=f)
    for ob in (cam, mira, cam.data):
        ad = ob.animation_data
        if ad and ad.action:
            for fc in _fcurves(ad.action):
                for kp in fc.keyframe_points:
                    kp.interpolation = "BEZIER"
                    kp.easing = "EASE_IN_OUT"
    scn.frame_start, scn.frame_end = 1, total


def _fcurves(action):
    """Blender 5: le f-curve stanno nei layer/strip/channelbag; fallback per versioni vecchie."""
    if hasattr(action, "fcurves") and action.fcurves:
        return list(action.fcurves)
    out = []
    for layer in getattr(action, "layers", []):
        for strip in layer.strips:
            for cb in strip.channelbags:
                out.extend(cb.fcurves)
    return out


def add_macro_detail() -> None:
    """Spigoli arrotondati su cricchetti e impugnature (si vedono in primo piano) e cinghia in poliestere."""
    for o in bpy.data.objects:
        if o.type == "MESH" and o.name.startswith(("Cricchetto inox", "Impugnatura cricchetto")):
            if not any(m.type == "BEVEL" for m in o.modifiers):
                b = o.modifiers.new("Bevel", "BEVEL")
                b.width, b.segments, b.limit_method = 0.004, 3, "ANGLE"
    strap = bpy.data.materials.get("Cinghia") or bpy.data.materials.new("Cinghia")
    strap.use_nodes = True
    nt = strap.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.012, 0.012, 0.014, 1)
    p.inputs["Roughness"].default_value = 0.55
    w = nt.nodes.new("ShaderNodeTexWave")
    w.inputs["Scale"].default_value = 260.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    nt.links.new(w.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    riflettente = bpy.data.materials.get("Riflettente") or bpy.data.materials.new("Riflettente")
    riflettente.use_nodes = True
    rp = riflettente.node_tree.nodes["Principled BSDF"]
    rp.inputs["Base Color"].default_value = (0.85, 0.86, 0.88, 1)
    rp.inputs["Roughness"].default_value = 0.12
    rp.inputs["Metallic"].default_value = 0.6
    for o in bpy.data.objects:
        if o.type != "MESH":
            continue
        if o.name.startswith("Cinghia verticale"):
            o.data.materials.clear()
            o.data.materials.append(strap)
        elif o.name.startswith("Banda riflettente laterale"):
            o.data.materials.clear()
            o.data.materials.append(riflettente)
