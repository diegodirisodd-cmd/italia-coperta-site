# Hero 3D — pipeline di rendering

Sequenza pre-renderizzata dell'hero della home (spec: `docs/superpowers/specs/2026-11-26-hero-3d-scroll-design.md`).
Non fa parte del bundle del sito: serve solo a produrre i fotogrammi in `public/sequenze/hero/`.

Requisiti: Python 3.11+ con `pip install bpy` (Blender 5.3 come modulo), Node per `npx @gltf-transform/cli`.

1. `bash tools/hero3d/prepare_models.sh` — copia e decomprime i GLB di Diego in `work/` (i file originali non si toccano).
2. `python3 tools/hero3d/scene.py --series desktop` (e `--series mobile`) — costruisce `work/scene_<serie>.blend`.
3. `python3 tools/hero3d/render.py --series desktop --start 1 --end 150 --samples 32` — riprendibile, salta i fotogrammi già fatti. Usa la GPU se c'è.

## Tempi misurati

- Cloud di lavoro (2 CPU): 1920×1080, 32 campioni + denoise ≈ 70 s a fotogramma.

## Baseline Lighthouse (prima dell'hero 3D)

PageSpeed Insights su https://www.dirisoteloni1950.com/, 26/11/2026 17:21:
- Mobile: Prestazioni 97 · Accessibilità 97 · Best practice 100 · SEO 100 · LCP 2,6 s · TBT 0 ms · CLS 0
- Desktop: LCP 0,5 s · TBT 10 ms · CLS 0
