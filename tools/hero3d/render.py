"""Renderizza un intervallo di fotogrammi di una serie, saltando quelli gia' presenti.

Uso:  python3 tools/hero3d/render.py --series desktop --start 1 --end 10 --samples 32
"""
import argparse
import sys
import time
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import FRAMES, SERIES, WORK  # noqa: E402
from scene import setup_render  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--series", choices=list(SERIES), default="desktop")
    ap.add_argument("--start", type=int, default=1)
    ap.add_argument("--end", type=int, default=1)
    ap.add_argument("--samples", type=int, default=8)
    ap.add_argument("--scale", type=int, default=100, help="percentuale della risoluzione (per prove veloci)")
    a = ap.parse_args()

    bpy.ops.wm.open_mainfile(filepath=str(WORK / f"scene_{a.series}.blend"))
    setup_render(a.samples)
    scn = bpy.context.scene
    scn.render.resolution_percentage = a.scale
    # Scena statica tra un fotogramma e l'altro: riuso BVH e texture; campionamento adattivo.
    scn.render.use_persistent_data = True
    scn.cycles.use_adaptive_sampling = True
    scn.cycles.adaptive_threshold = 0.05
    outdir = FRAMES / a.series
    outdir.mkdir(parents=True, exist_ok=True)
    for f in range(a.start, a.end + 1):
        target = outdir / f"{f:04d}.png"
        if target.exists():
            continue
        t = time.time()
        scn.frame_set(f)
        scn.render.filepath = str(target)
        bpy.ops.render.render(write_still=True)
        print(f"[hero3d] {a.series} {f:04d} in {time.time() - t:.1f}s")


if __name__ == "__main__":
    main()
