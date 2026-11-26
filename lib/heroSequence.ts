// Logica pura della sequenza 3D dell'hero (nessuna dipendenza dal DOM).
// Vedi docs/superpowers/plans/2026-11-26-hero-3d-scroll.md, Task 6.

export type Serie = "desktop" | "mobile";

/** Indice 1-based del fotogramma per un progresso di scroll 0..1 (con clamp). */
export function frameForProgress(progress: number, total: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.min(total, Math.max(1, Math.round(p * total)));
}

/** Ordine di caricamento: prima 1, 1+stride, 1+2·stride… poi i buchi in ordine. */
export function loadOrder(total: number, stride = 8): number[] {
  const first: number[] = [];
  for (let i = 1; i <= total; i += stride) first.push(i);
  if (first[first.length - 1] !== total) first.push(total);
  const seen = new Set(first);
  const rest: number[] = [];
  for (let i = 1; i <= total; i++) if (!seen.has(i)) rest.push(i);
  return [...first, ...rest];
}

/** Fotogramma già caricato più vicino a `target`; a parità vince il più basso. */
export function nearestLoaded(target: number, loaded: ReadonlySet<number>): number | null {
  if (loaded.has(target)) return target;
  let best: number | null = null;
  let bestD = Infinity;
  for (const i of loaded) {
    const d = Math.abs(i - target);
    if (d < bestD || (d === bestD && best !== null && i < best)) {
      best = i;
      bestD = d;
    }
  }
  return best;
}

/** Ritaglio della sorgente per riempire la destinazione come object-fit: cover, centrato. */
export function coverRect(srcW: number, srcH: number, dstW: number, dstH: number) {
  const scale = Math.max(dstW / srcW, dstH / srcH);
  const sw = Math.round(dstW / scale);
  const sh = Math.round(dstH / scale);
  return { sx: Math.round((srcW - sw) / 2), sy: Math.round((srcH - sh) / 2), sw, sh };
}

export function frameUrl(series: Serie, i: number): string {
  return `/sequenze/hero/${series}/${String(i).padStart(4, "0")}.webp`;
}
