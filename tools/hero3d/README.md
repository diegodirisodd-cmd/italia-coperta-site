# Hero 3D — pipeline di rendering

Sequenza pre-renderizzata dell'hero della home (spec: `docs/superpowers/specs/2026-11-26-hero-3d-scroll-design.md`).
Non fa parte del bundle del sito: serve solo a produrre i fotogrammi in `public/sequenze/hero/`.

Requisiti: Python 3.11+ con `pip install bpy` (Blender 5.3 come modulo), Node per `npx @gltf-transform/cli`.

1. `bash tools/hero3d/prepare_models.sh` — copia e decomprime i GLB di Diego in `work/` (i file originali non si toccano).
2. `python3 tools/hero3d/scene.py --series desktop` (e `--series mobile`) — costruisce `work/scene_<serie>.blend`.
3. `python3 tools/hero3d/render.py --series desktop --start 1 --end 150` — riprendibile, salta i fotogrammi già fatti. Usa la GPU se c'è.

## Sul PC con RTX (consigliato)

Cartella `pc/`: copiare `scena_desktop.blend` e `scena_mobile.blend` (salvate con `pack_all`, texture incluse), `render_pc.py`, `renderizza.bat` ed `encode.py` in una cartella su Windows con Blender 5.3+. Doppio clic su `renderizza.bat` (OptiX, 64 campioni), poi `python3 encode.py` scrive `sito/`, da copiare in `public/sequenze/hero/`.

## Tempi misurati

- PC di Diego (RTX 3070, OptiX): 1920×1080, 64 campioni adattivi + denoise OptiX ≈ 3 s a fotogramma; 300 fotogrammi in circa 15 minuti. È la sequenza pubblicata.

- Cloud di lavoro (2 CPU): 1920×1080, 32 campioni + denoise ≈ 70 s a fotogramma; 8 campioni adattivi + denoise + dati persistenti ≈ 23 s (qualità equivalente, è il default).

## Baseline Lighthouse (prima dell'hero 3D)

PageSpeed Insights su https://www.dirisoteloni1950.com/, 26/11/2026 17:21:
- Mobile: Prestazioni 97 · Accessibilità 97 · Best practice 100 · SEO 100 · LCP 2,6 s · TBT 0 ms · CLS 0
- Desktop: LCP 0,5 s · TBT 10 ms · CLS 0

## Dopo l'hero 3D (Lighthouse 12 mobile in locale, stessa macchina, 2 run)

- main: Prestazioni 93 / 92 · Accessibilità 97 · LCP 3,0 s · TBT 160–180 ms · CLS 0
- hero 3D: Prestazioni 91 / 93 · Accessibilità 97 · LCP 2,6–2,8 s · TBT 220–250 ms · CLS 0
- (PageSpeed sull'anteprima Vercel non è utilizzabile: l'anteprima è protetta e misura la pagina di login.)

## Dopo la pubblicazione (26/11, PageSpeed su www.dirisoteloni1950.com)

- Prima versione live: mobile 92, LCP 3,3 s, 3,5 MB scaricati durante il test (i fotogrammi partivano a pagina ferma).
- Correzione: i fotogrammi partono al primo scroll/tocco/tasto o 5 s dopo il load. In locale: peso iniziale 373 KiB, Prestazioni 93–97, LCP 2,6–3,0 s, CLS 0.
