"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import manifest from "@/public/sequenze/hero/manifest.json";
import { coverRect, frameForProgress, frameUrl, loadOrder, nearestLoaded, type Serie } from "@/lib/heroSequence";
import { FRASI, HeroOverlay } from "@/components/home/HeroOverlay";

const TOTAL = manifest.frames;
const alt = "Bilico Di Riso Teloni in 3D: la sagoma dell'Italia diventa il telo laterale rosso con il marchio";

// Primo fotogramma come immagine vera (LCP leggero, pagina mai vuota). Art direction a 768 px come l'hero precedente.
const { props: posterDesktop } = getImageProps({
  src: "/sequenze/hero/poster-desktop.webp",
  alt,
  width: manifest.desktop.w,
  height: manifest.desktop.h,
  priority: true,
  sizes: "100vw",
});
const { props: posterMobile } = getImageProps({
  src: "/sequenze/hero/poster-mobile.webp",
  alt,
  width: manifest.mobile.w,
  height: manifest.mobile.h,
  priority: true,
  sizes: "100vw",
});

type Modo = "sequenza" | "statico-movimento" | "statico-dati";

function rileva(reduced: boolean | null): Modo {
  if (reduced) return "statico-movimento";
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData || c?.effectiveType === "2g" || c?.effectiveType === "slow-2g") return "statico-dati";
  return "sequenza";
}

export function HeroSequence() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modo, setModo] = useState<Modo>("sequenza");
  const [pronto, setPronto] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const state = useRef({
    serie: "desktop" as Serie,
    images: new Map<number, HTMLImageElement>(),
    loaded: new Set<number>(),
    drawn: 0,
    visible: true,
    raf: 0,
    gen: 0,
  });

  useEffect(() => setModo(rileva(reduced)), [reduced]);

  // Disegno: solo se il fotogramma cambia e la sezione è visibile.
  const draw = () => {
    const s = state.current;
    s.raf = 0;
    const canvas = canvasRef.current;
    if (!canvas || !s.visible) return;
    const target = frameForProgress(scrollYProgress.get(), TOTAL);
    const i = nearestLoaded(target, s.loaded);
    if (i === null || i === s.drawn) return;
    const img = s.images.get(i);
    const ctx = canvas.getContext("2d");
    if (!img || !ctx) return;
    const r = coverRect(img.naturalWidth, img.naturalHeight, canvas.width, canvas.height);
    ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, canvas.width, canvas.height);
    s.drawn = i;
    if (!pronto) setPronto(true);
  };
  const schedule = () => {
    const s = state.current;
    if (!s.raf) s.raf = requestAnimationFrame(draw);
  };

  useMotionValueEvent(scrollYProgress, "change", schedule);

  useEffect(() => {
    if (modo !== "sequenza") return;
    const s = state.current;
    const canvas = canvasRef.current!;
    const mq = window.matchMedia("(min-width: 768px)");

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      s.drawn = 0; // forza il ridisegno del fotogramma corrente
      schedule();
    };

    const carica = () => {
      const gen = ++s.gen;
      s.serie = mq.matches ? "desktop" : "mobile";
      s.images.clear();
      s.loaded.clear();
      s.drawn = 0;
      // Il fotogramma della posizione attuale per primo (ritorno con "indietro" a metà sezione), poi l'ordine a fasi.
      const subito = frameForProgress(scrollYProgress.get(), TOTAL);
      const ordine = [subito, ...loadOrder(TOTAL).filter((i) => i !== subito)];
      let k = 0;
      const next = () => {
        if (gen !== s.gen) return;
        if (document.hidden || !s.visible) {
          setTimeout(next, 500); // in pausa con scheda nascosta o sezione fuori schermo
          return;
        }
        const batch = ordine.slice(k, k + 4);
        k += batch.length;
        if (!batch.length) return;
        Promise.all(
          batch.map(
            (i) =>
              new Promise<void>((res) => {
                const img = new Image();
                img.decoding = "async";
                img.src = frameUrl(s.serie, i);
                img
                  .decode()
                  .then(() => {
                    if (gen !== s.gen) return;
                    s.images.set(i, img);
                    s.loaded.add(i);
                    schedule();
                  })
                  .catch(() => {})
                  .finally(res);
              }),
          ),
        ).then(next);
      };
      next();
    };

    resize();
    // Il caricamento parte quando il browser è libero; se il componente si smonta o cambia modo
    // (riduci movimento / risparmio dati) prima di allora, non parte affatto.
    let annullato = false;
    const avvia = () => {
      if (!annullato) carica();
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const t = w.requestIdleCallback ? w.requestIdleCallback(avvia) : window.setTimeout(avvia, 1500);

    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (s.visible) schedule();
    });
    io.observe(sectionRef.current!);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onMq = () => carica(); // cambio di breakpoint: altra serie
    mq.addEventListener("change", onMq);

    return () => {
      annullato = true;
      s.gen++;
      if (s.raf) cancelAnimationFrame(s.raf);
      if (w.cancelIdleCallback) w.cancelIdleCallback(t);
      else clearTimeout(t);
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", onMq);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  const sequenza = modo === "sequenza";

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Di Riso Teloni — teli per bilico dal 1950"
      className={sequenza ? "relative h-[300svh] motion-reduce:h-auto" : "relative"}
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-black">
        <picture>
          <source media="(min-width: 768px)" srcSet={posterDesktop.srcSet} sizes="100vw" />
          <img {...posterMobile} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        {sequenza && (
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 motion-reduce:hidden ${pronto ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {/* fondo che sfuma nella pagina, come l'hero precedente */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56"
          style={{ background: "linear-gradient(to bottom, rgba(11,13,24,0) 0%, #0B0D18 100%)" }}
        />
        <HeroOverlay p={scrollYProgress} statico={!sequenza} />
      </div>

      {/* Sempre nel markup ma visibile solo con "riduci movimento" (CSS): nessun salto di layout dopo l'idratazione. */}
      {modo !== "statico-dati" && (
        <div className="mx-auto hidden max-w-6xl gap-6 px-6 py-16 motion-reduce:grid md:grid-cols-3 md:px-10">
          {FRASI.map((f, n) => (
            <figure key={f.testo} className="overflow-hidden rounded-2xl border border-white/10">
              <picture>
                <source media="(min-width: 768px)" srcSet={`/sequenze/hero/statici-desktop-${n + 1}.webp`} />
                <img
                  src={`/sequenze/hero/statici-mobile-${n + 1}.webp`}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </picture>
              <figcaption className="px-5 py-4 font-display text-lg font-semibold uppercase text-white">{f.testo}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
