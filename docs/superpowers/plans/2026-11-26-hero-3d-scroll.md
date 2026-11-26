# Hero 3D a scorrimento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire la foto dell'hero della home di dirisoteloni1950.com con una sequenza 3D pre-renderizzata (circa 3 schermate) che avanza e torna indietro con lo scroll.

**Architecture:** Una pipeline offline in `tools/hero3d/` (Blender 5.3 come modulo Python `bpy`, Cycles su CPU) costruisce la scena dai GLB di Diego e renderizza due serie di fotogrammi (desktop 16:9, mobile 3:4), poi convertite in WebP in `public/sequenze/hero/`. Sul sito, il componente client `HeroSequence` disegna su `<canvas>` il fotogramma che corrisponde allo scroll di una sezione sticky. La logica pura (indice per progresso, ordine di caricamento, fotogramma più vicino) sta in `lib/heroSequence.ts` ed è testata con `node:test`.

**Tech Stack:** Next.js 14.2.35 App Router, Tailwind, framer-motion 12 (già presente), Blender `bpy` 5.3, `@gltf-transform/cli` (solo per decomprimere i GLB, via npx), `sharp`/`cwebp` per la conversione, Node 22 `node --test --experimental-strip-types`, Playwright via npx per i controlli in browser.

**Spec:** `docs/superpowers/specs/2026-11-26-hero-3d-scroll-design.md`

## Global Constraints

- Branch di lavoro: `claude/hero-3d-scroll`, creato da `origin/main`. Merge su `main` solo con OK esplicito di Diego.
- Niente `middleware.ts`; la CSP in `next.config.mjs` non si modifica: fotogrammi serviti same-origin da `/public`.
- Palette: gradiente #000000→#3533CD, rosso #E31919, rosso tricolore #D82427, verde #25904A, bianco. Niente oro (#C9A227).
- Bilico finito: teli laterali rossi #E31919, tetto bianco, cabina bianca, logo Di Riso Teloni grande al centro del fianco (da `public/images/logo-diriso-teloni.svg`), fascia rifrangente lungo i teli.
- Sezione sticky alta 300vh (3 schermate di scroll), poi StatsBand e il resto invariati.
- Budget pesi: serie mobile ≤ 3 MB totali e ≤ 50 KB a fotogramma; serie desktop ≤ 6 MB totali e ≤ 80 KB a fotogramma.
- Desktop circa 1920×1080, mobile 1080×1440, breakpoint md = 768 px come l'hero attuale.
- I file sorgente di Diego (`rilievo-teloni/public/models/*.glb`) non si modificano: si lavora su copie in `tools/hero3d/work/` (in `.gitignore`).
- Testi sovrapposti solo da affermazioni già presenti sul sito, nessun dato inventato.
- H1 "Teli per bilico completi e professionali — dal 1950" e i due CTA (`/preventivo`, `/configuratore`) restano HTML nel DOM dal primo render.
- `prefers-reduced-motion` → 3 fotogrammi statici; `saveData` o `effectiveType` 2g/slow-2g → solo immagine fissa.
- Lighthouse mobile della home: non sotto il valore misurato prima di iniziare (Task 1), CLS 0.
- Rendering sempre a lotti in primo piano (≤ 9 minuti per comando) e riprendibile: un fotogramma già presente su disco non si rifà.

## Review Focus

- **Scroll veloce prima che i fotogrammi siano caricati**: deve vedersi il fotogramma caricato più vicino, mai un canvas nero o vuoto → test `nearestLoaded` in Task 6.
- **Rotazione del telefono o resize durante lo scroll**: il canvas si ridimensiona e ridisegna il fotogramma corrente senza deformarlo (copertura tipo `object-fit: cover`), e la serie non viene riscaricata a ogni resize → test `coverRect` in Task 6, controllo Playwright in Task 7.
- **Ritorno con "indietro" a metà sezione** (scroll ripristinato dal browser): al montaggio va disegnato il fotogramma della posizione attuale, non lo 0 → controllo Playwright in Task 7.
- **Barra degli indirizzi di iOS che cambia altezza**: niente salti dell'inquadratura; altezze in `svh`/`lvh` invece che `vh` → controllo Playwright con viewport 390×664 e 390×844 in Task 7.
- **Scheda in background o sezione fuori schermo**: nessun ridisegno né download continuo (rAF solo quando la sezione è visibile) → controllo in Task 7.

---

### Task 1: Pipeline di rendering e fotogramma di prova

**Files:**
- Create: `tools/hero3d/README.md` (come si lancia, in italiano, 15 righe max)
- Create: `tools/hero3d/prepare_models.sh` (copia + decompressione GLB)
- Create: `tools/hero3d/scene.py` (costruisce la scena, salva `work/scene.blend`)
- Create: `tools/hero3d/render.py` (renderizza un intervallo di fotogrammi, riprendibile)
- Modify: `.gitignore` (aggiungere `tools/hero3d/work/`)

**Interfaces:**
- Produces: `python3 tools/hero3d/render.py --series {desktop|mobile} --start N --end M --samples S` scrive `tools/hero3d/work/frames/{series}/NNNN.png` (4 cifre, da 0001), saltando i file esistenti. `scene.py` espone `build_scene(series: str) -> None`.

- [ ] **Step 1:** Misurare Lighthouse mobile e desktop della home di produzione (`npx lighthouse https://www.dirisoteloni1950.com --preset=perf` per desktop, default per mobile; se la rete del workspace lo blocca, misurare `next build && next start` in locale). Salvare i quattro punteggi + LCP + CLS in `tools/hero3d/README.md` come baseline.
- [ ] **Step 2:** `prepare_models.sh`: copia `../rilievo-teloni/public/models/{trattore,semirimorchio}.glb` in `work/` e li decomprime con `npx -y @gltf-transform/cli copy --decompress` (rimuove meshopt + quantizzazione, che l'import di Blender non legge). Verifica: `python3 -c "import bpy; bpy.ops.import_scene.gltf(filepath='tools/hero3d/work/trattore.glb'); print(len(bpy.data.objects))"` stampa un numero > 0.
- [ ] **Step 3:** `scene.py`: importa i due GLB, aggancia il semirimorchio alla ralla (stesse costanti del rilievo: perno 0,9 m dietro il frontale), cabina bianca, sfondo con gradiente #000000→#3533CD, HDRI studio CC0 di Poly Haven scaricato in `work/` (se la rete lo blocca, luci area: key 30° + fill + rim), pavimento lucido scuro con riflesso, camera a tre quarti, Cycles CPU con denoise OpenImageDenoise, Filmic/AgX.
- [ ] **Step 4:** Renderizzare un fotogramma desktop di prova a 32 campioni e misurare il tempo. Stampare i secondi per fotogramma. Se superano 60 s, ridurre i campioni (minimo 16) o la risoluzione del render (minimo 1600×900, poi upscale non consentito: si accetta un rumore lieve denoised). Annotare il tempo in README.
- [ ] **Step 5:** Mandare il PNG di prova a Diego (SendUserFile) con una riga: "resa base, materiali definitivi nel prossimo passo".
- [ ] **Step 6:** Commit.

```bash
git checkout -b claude/hero-3d-scroll origin/main
git add .gitignore tools/hero3d docs/superpowers
git commit -m "feat(hero3d): pipeline di rendering Blender e fotogramma di prova"
```

### Task 2: Aspetto del bilico finito e inquadrature (fasi 3–5)

**Files:**
- Create: `tools/hero3d/materials.py` (`apply_finish() -> None`)
- Create: `tools/hero3d/camera_path.py` (`keyframe_cameras(series: str, total: int) -> None`)
- Create: `tools/hero3d/assets/telo_laterale.png` (texture del telo con logo e fascia, generata da script)
- Modify: `tools/hero3d/scene.py` (chiama `apply_finish` e `keyframe_cameras`)

**Interfaces:**
- Consumes: `build_scene(series)` (Task 1)
- Produces: `TOTAL_FRAMES = 150` in `tools/hero3d/config.py`, con `PHASES = {"apertura": (1, 22), "forma": (23, 60), "tensione": (61, 90), "dettagli": (91, 127), "chiusura": (128, 150)}`. Tutti gli script leggono da lì.

- [ ] **Step 1:** Generare `telo_laterale.png` (4096 px di lato lungo, proporzione del telo laterale del modello 13,60 m): rosso #E31919, logo SVG ufficiale bianco grande al centro (rasterizzato con `cairosvg` o `rsvg-convert`), fascia rifrangente bianca/argento lungo il bordo inferiore. Verifica a occhio del PNG.
- [ ] **Step 2:** `apply_finish`: sostituire i materiali dei teli laterali del semirimorchio con PVC (Principled: base color dalla texture, roughness 0.45, normal map trama tessuto CC0 da ambientCG a scala fitta), tetto bianco, fascia rifrangente con un leggero emissive/riflesso, cricchetti metallo inox (metallic 1, roughness 0.25). Per il primo piano dei dettagli aggiungere un cricchetto ad alto dettaglio modellato con primitive bevelled nello stesso punto del cricchetto del modello, visibile solo nel fotogramma macro.
- [ ] **Step 3:** `keyframe_cameras`: percorso camera per fasi 3–5 (giro attorno al bilico, macro su cricchetto, cinghia e trama, larga finale a tre quarti). Desktop: il camion occupa i 2/3 destri del fotogramma; mobile: i 2/3 inferiori. La fascia sinistra (desktop) e quella alta (mobile) restano libere per i testi.
- [ ] **Step 4:** Renderizzare i fotogrammi 75, 105, 118 e 150 per la serie desktop e controllarli: logo leggibile, niente geometria spigolosa nel macro, riflessi presenti.
- [ ] **Step 5:** Commit `feat(hero3d): finiture del bilico e percorso camera`.

### Task 3: Da sagoma Italia a telo (fasi 1–2)

**Files:**
- Create: `tools/hero3d/italia_telo.py` (`build_italia_telo() -> None`)
- Create: `tools/hero3d/assets/italia.svg` (contorno estratto dai dati geografici di `components/ItaliaEmblem.tsx`)

**Interfaces:**
- Consumes: `PHASES` (Task 2); l'oggetto telo laterale lato camera del semirimorchio, cercato per nome come nel GLB.
- Produces: oggetto `ItaliaTelo` animato tra i fotogrammi 1 e 60; al fotogramma 60 coincide con il telo laterale, che fino a lì è nascosto.

- [ ] **Step 1:** Estrarre il contorno (penisola, Sicilia, Sardegna) da `ItaliaEmblem.tsx` in `italia.svg`; importarlo in Blender, riempirlo e suddividerlo in una mesh fitta con lo stesso materiale PVC rosso.
- [ ] **Step 2:** Animazione: fotogrammi 1–22 sagoma sospesa con lieve ondulazione (modificatore Wave) e luce radente che la attraversa; 23–60 morph via shape key verso la forma del telo laterale (mesh-griglia ricampionata con lo stesso numero di vertici), più discesa sul fianco. La simulazione cloth è facoltativa: si usa solo se la shape key a metà strada sembra rigida.
- [ ] **Step 3:** Renderizzare i fotogrammi 1, 30 e 60 desktop; al 60 non deve vedersi lo stacco tra `ItaliaTelo` e il telo vero.
- [ ] **Step 4:** Commit `feat(hero3d): trasformazione sagoma Italia in telo`.

### Task 4: Approvazione dei fotogrammi chiave (cancello)

- [ ] **Step 1:** Renderizzare a qualità piena i 5 fotogrammi chiave della serie desktop (1, 40, 75, 110, 150) e i fotogrammi 1 e 150 della serie mobile.
- [ ] **Step 2:** Mandarli a Diego con una riga per fase e chiedere ok o correzioni. **Fermarsi qui** fino alla sua risposta; applicare le correzioni nei Task 2–3 e ripetere al massimo due giri.

### Task 5: Sequenza completa e conversione

**Files:**
- Create: `tools/hero3d/encode.mjs` (PNG → WebP + controllo budget)
- Create: `public/sequenze/hero/desktop/0001.webp` … `0150.webp`
- Create: `public/sequenze/hero/mobile/0001.webp` … `0150.webp`
- Create: `public/sequenze/hero/poster-desktop.webp`, `poster-mobile.webp` (fotogramma 1), `statici-{desktop|mobile}-{1,2,3}.webp` (fotogrammi 1, 75, 150 per reduced-motion)

**Interfaces:**
- Produces: `public/sequenze/hero/manifest.json` = `{ "frames": 150, "desktop": {"w":1920,"h":1080}, "mobile": {"w":1080,"h":1440} }`, letto dal componente.

- [ ] **Step 1:** Renderizzare le due serie a lotti (`render.py --start/--end`, un lotto per comando entro 9 minuti, riprendibile). Verifica: 150 PNG per serie.
- [ ] **Step 2:** `encode.mjs` con `sharp`: WebP qualità di partenza 72, poi la abbassa a passi di 4 (minimo 50) finché ogni fotogramma sta nel budget. Esce con codice 1 e stampa i file fuori budget se qualcosa resta sopra.
- [ ] **Step 3:** Run `node tools/hero3d/encode.mjs` → atteso: "desktop: N KB totali, max X KB · mobile: …" entro i budget dei Global Constraints, exit 0.
- [ ] **Step 4:** Commit `feat(hero3d): sequenza 3D desktop e mobile`.

### Task 6: Logica pura della sequenza

**Files:**
- Create: `lib/heroSequence.ts`
- Test: `lib/heroSequence.test.ts`
- Modify: `package.json` (script `"test": "node --test --experimental-strip-types lib/"`)

**Interfaces:**
- Produces:
  - `frameForProgress(progress: number, total: number): number` → indice 1-based, con clamp.
  - `loadOrder(total: number, stride?: number): number[]` → prima i multipli di `stride` (default 8) partendo da 1, poi i restanti in ordine; nessun duplicato, tutti presenti.
  - `nearestLoaded(target: number, loaded: ReadonlySet<number>): number | null`; a parità di distanza vince l'indice più basso.
  - `coverRect(srcW: number, srcH: number, dstW: number, dstH: number): { sx: number; sy: number; sw: number; sh: number }` → ritaglio centrato tipo object-fit cover.
  - `frameUrl(series: "desktop" | "mobile", i: number): string` → `/sequenze/hero/${series}/${String(i).padStart(4, "0")}.webp`.

- [ ] **Step 1: Scrivere i test**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { frameForProgress, loadOrder, nearestLoaded, coverRect, frameUrl } from "./heroSequence.ts";

test("frameForProgress agli estremi e con clamp", () => {
  assert.equal(frameForProgress(0, 150), 1);
  assert.equal(frameForProgress(1, 150), 150);
  assert.equal(frameForProgress(0.5, 150), 75);
  assert.equal(frameForProgress(-0.2, 150), 1);
  assert.equal(frameForProgress(1.7, 150), 150);
});
test("loadOrder: prima un fotogramma ogni 8, poi tutti, senza duplicati", () => {
  const o = loadOrder(150);
  assert.deepEqual(o.slice(0, 3), [1, 9, 17]);
  assert.equal(o.length, 150);
  assert.equal(new Set(o).size, 150);
});
test("nearestLoaded: mai vuoto se qualcosa è caricato", () => {
  assert.equal(nearestLoaded(50, new Set([1, 49, 57])), 49);
  assert.equal(nearestLoaded(53, new Set([49, 57])), 49);
  assert.equal(nearestLoaded(10, new Set()), null);
});
test("coverRect ritaglia centrato per schermi più stretti", () => {
  assert.deepEqual(coverRect(1920, 1080, 1080, 1080), { sx: 420, sy: 0, sw: 1080, sh: 1080 });
  assert.deepEqual(coverRect(1920, 1080, 1920, 1080), { sx: 0, sy: 0, sw: 1920, sh: 1080 });
});
test("frameUrl a 4 cifre", () => {
  assert.equal(frameUrl("mobile", 7), "/sequenze/hero/mobile/0007.webp");
});
```

- [ ] **Step 2:** Run `npm test` → atteso FAIL (modulo mancante).
- [ ] **Step 3:** Implementare le cinque funzioni in `lib/heroSequence.ts` (nessuna dipendenza).
- [ ] **Step 4:** Run `npm test` → atteso 5 test PASS.
- [ ] **Step 5:** Commit `feat(hero): logica pura della sequenza 3D con test`.

### Task 7: Componente HeroSequence al posto dell'hero

**Files:**
- Create: `components/home/HeroSequence.tsx` (client)
- Create: `components/home/HeroOverlay.tsx` (H1, paragrafo, CTA, frasi di fase, barra CTA compatta)
- Modify: `app/page.tsx` (`<Hero />` → `<HeroSequence />`)
- Keep: `components/home/Hero.tsx` invariato (non importato; si elimina solo dopo l'OK di Diego)
- Test: `tools/hero3d/check-hero.mjs` (script Playwright)

**Interfaces:**
- Consumes: tutte le funzioni di `lib/heroSequence.ts` (Task 6), `manifest.json` (Task 5), `MagneticCTA` e le classi `ctaPrimary`/`ctaSecondary` già in `Hero.tsx` (da spostare in `HeroOverlay.tsx`).
- Produces: `export function HeroSequence(): JSX.Element`.

- [ ] **Step 1:** Struttura: `<section id="top">` alta `300svh` con figlio `sticky top-0 h-[100svh]`. Dentro: `<picture>` col poster (come l'hero attuale: `getImageProps`, priority, art direction a 768 px) sotto il `<canvas>`; il canvas compare (opacity) quando il fotogramma corrente è disegnato.
- [ ] **Step 2:** Serie scelta una volta al montaggio con `matchMedia("(min-width: 768px)")`; al cambio di breakpoint si cambia serie, mentre un resize nello stesso breakpoint ridimensiona solo il canvas (devicePixelRatio max 2) e ridisegna.
- [ ] **Step 3:** Progresso da `useScroll({ target, offset: ["start start", "end end"] })` di framer-motion; disegno in `requestAnimationFrame` solo se il fotogramma richiesto cambia e la sezione è visibile (IntersectionObserver). Caricamento con `new Image()` + `decode()` secondo `loadOrder`, avviato dopo `requestIdleCallback` (fallback `setTimeout` 1500 ms); al montaggio disegnare subito il fotogramma della posizione attuale.
- [ ] **Step 4:** Fallback: `useReducedMotion()` true → niente canvas, i 3 `statici-*` impilati con le frasi di fase; `navigator.connection?.saveData` o `effectiveType` in `["slow-2g","2g"]` → solo poster.
- [ ] **Step 5:** `HeroOverlay`: 0–10% blocco testi attuale (copy identica a `Hero.tsx`); dal 10% titolo e paragrafo sfumano e compare la barra CTA compatta in basso; frasi di fase (da copy già presente: "Dal 1950, terza generazione", "Cuciti a mano dalla famiglia Di Riso", "Rilievo misure gratuito in tutta Italia") nei range di `PHASES`; 85–100% CTA grandi al centro.
- [ ] **Step 6:** `check-hero.mjs` (Playwright, `npm run build && npm start` su porta 3111): a 1440×900 e 390×844 verifica che (a) l'H1 e i due link siano nel DOM al primo paint; (b) dopo scroll al 50% e attesa di 2 s il canvas abbia pixel non neri al centro; (c) con `reducedMotion: "reduce"` non ci sia `<canvas>`; (d) caricando la pagina già scrollata al 60% il primo fotogramma disegnato non sia lo 0001 (intercettare le richieste); (e) a 390×664 → 390×844 la sezione non cambi offset del contenuto; (f) con la scheda nascosta (`page.evaluate` su `visibilitychange`) non partano nuove richieste di fotogrammi per 3 s. Run `node tools/hero3d/check-hero.mjs` → atteso "6/6 ok".
- [ ] **Step 7:** Run `npm run lint && npm run build` → atteso nessun errore.
- [ ] **Step 8:** Commit `feat(home): hero 3D a scorrimento al posto della foto`.

### Task 8: Prestazioni, anteprima e consegna

- [ ] **Step 1:** Lighthouse mobile e desktop sulla build locale con gli stessi parametri della baseline (Task 1): Performance non sotto la baseline, CLS 0, LCP non peggiore. Se peggiora: ridurre la qualità del poster o ritardare il caricamento della sequenza, poi rimisurare.
- [ ] **Step 2:** Push `git -c push.negotiate=true push -u origin claude/hero-3d-scroll`; aprire una PR draft verso `main` via `gh api repos/diegodirisodd-cmd/italia-coperta-site/pulls -f head=claude/hero-3d-scroll -f base=main -F draft=true -f title=... -f body=...`; leggere l'URL di anteprima Vercel con il connettore Vercel.
- [ ] **Step 3:** Controllare l'anteprima in Claude in Chrome (scroll completo desktop) e mandare a Diego link + numeri Lighthouse prima/dopo, chiedendo la prova su telefono reale.
- [ ] **Step 4:** Merge su `main` solo dopo il suo OK esplicito; poi eliminare `components/home/Hero.tsx` e la vecchia foto hero non più usata in un commit separato.
