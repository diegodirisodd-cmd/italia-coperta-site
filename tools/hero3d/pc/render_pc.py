"""Rendering sul PC di Diego (Windows + NVIDIA). Lanciato da renderizza.bat:
blender -b scena_<serie>.blend -P render_pc.py -- --series desktop --start 1 --end 150 --samples 64
Scrive frames/<serie>/NNNN.png accanto al .blend, saltando quelli gia' presenti.
"""
import argparse
import sys
import time
from pathlib import Path

import bpy

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--series", default="desktop")
ap.add_argument("--start", type=int, default=1)
ap.add_argument("--end", type=int, default=150)
ap.add_argument("--samples", type=int, default=64)
a = ap.parse_args(argv)

scn = bpy.context.scene
prefs = bpy.context.preferences.addons["cycles"].preferences
device = "CPU"
for backend in ("OPTIX", "CUDA"):
    try:
        prefs.compute_device_type = backend
        prefs.get_devices()
        gpus = [d for d in prefs.devices if d.type == backend]
        if gpus:
            for d in prefs.devices:
                d.use = d.type == backend
            device = backend
            break
    except TypeError:
        continue
scn.cycles.device = "GPU" if device != "CPU" else "CPU"
print(f"[hero3d] dispositivo: {device}")

scn.cycles.samples = a.samples
scn.cycles.use_adaptive_sampling = True
scn.cycles.adaptive_threshold = 0.02
scn.cycles.use_denoising = True
scn.cycles.denoiser = "OPTIX" if device == "OPTIX" else "OPENIMAGEDENOISE"
scn.render.use_persistent_data = True
scn.render.resolution_percentage = 100
scn.render.image_settings.file_format = "PNG"

out = Path(bpy.path.abspath("//")) / "frames" / a.series
out.mkdir(parents=True, exist_ok=True)
t0 = time.time()
for f in range(a.start, a.end + 1):
    target = out / f"{f:04d}.png"
    if target.exists():
        continue
    t = time.time()
    scn.frame_set(f)
    scn.render.filepath = str(target)
    bpy.ops.render.render(write_still=True)
    print(f"[hero3d] {a.series} {f:04d} in {time.time() - t:.1f}s")
print(f"[hero3d] {a.series} finito in {(time.time() - t0) / 60:.1f} minuti")
