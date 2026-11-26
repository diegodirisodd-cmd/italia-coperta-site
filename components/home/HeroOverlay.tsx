"use client";

import Link from "next/link";
import { useState } from "react";
import { m, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";

/** Interpolazione lineare a tratti con clamp. Forma a funzione di useTransform: framer non la
 *  "accelera" con ScrollTimeline, che qui calcolava i valori sulla pagina intera invece che sulla sezione. */
function pw(v: number, xs: number[], ys: number[]): number {
  if (v <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (v <= xs[i]) return ys[i - 1] + ((v - xs[i - 1]) / (xs[i] - xs[i - 1])) * (ys[i] - ys[i - 1]);
  }
  return ys[ys.length - 1];
}
const map = (xs: number[], ys: number[]) => (v: number) => pw(v, xs, ys);
import { MagneticCTA } from "@/components/motion/MagneticCTA";

export const ctaPrimary =
  "rounded-full border-2 border-transparent bg-primary px-6 py-3 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:px-7 md:py-4";
export const ctaSecondary =
  "rounded-full border-[1.5px] border-white/60 bg-white/[0.06] px-6 py-3 backdrop-blur-sm font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] md:px-7 md:py-4";

const textShadowSoft = "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.7)";

/** Frasi di fase: solo affermazioni già presenti sul sito. Range in frazione di scroll (fasi in tools/hero3d/config.py). */
export const FRASI: { testo: string; da: number; a: number }[] = [
  { testo: "Il telo che copre l'Italia", da: 0.16, a: 0.38 },
  { testo: "Dal 1950 · terza generazione", da: 0.41, a: 0.58 },
  { testo: "Cuciti a mano dalla famiglia Di Riso", da: 0.62, a: 0.82 },
];

function Frase({ p, testo, da, a }: { p: MotionValue<number>; testo: string; da: number; a: number }) {
  const opacity = useTransform(p, map([da, da + 0.04, a - 0.04, a], [0, 1, 1, 0]));
  const y = useTransform(p, map([da, da + 0.04], [16, 0]));
  return (
    <m.p
      style={{ opacity, y, textShadow: textShadowSoft }}
      className="absolute left-0 top-0 max-w-[520px] opacity-0 font-display text-3xl font-bold uppercase leading-[1.02] text-white md:text-5xl"
    >
      {testo}
    </m.p>
  );
}

function Ctas() {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3.5">
      <MagneticCTA href="/preventivo" className={ctaPrimary}>Richiedi preventivo</MagneticCTA>
      <Link href="/configuratore" className={ctaSecondary}>Configura il tuo telone</Link>
    </div>
  );
}

/**
 * Testi sopra la sequenza.
 * 0–10%: blocco hero completo (H1, Italia Coperta, paragrafo, CTA) sempre nel DOM.
 * 10–85%: il blocco sfuma, i CTA restano in una barra compatta in basso; le frasi di fase scorrono.
 * 85–100%: CTA grandi sull'inquadratura finale.
 * Con `statico` (reduced motion / risparmio dati) non c'è animazione: blocco hero fisso.
 */
export function HeroOverlay({ p, statico }: { p: MotionValue<number>; statico: boolean }) {
  // Strato attivo: quelli invisibili diventano inert (niente Tab, niente lettori di schermo).
  type Strato = "intro" | "barra" | "finale";
  const strato = (v: number): Strato => (v < 0.11 ? "intro" : v < 0.91 ? "barra" : "finale");
  const [attivo, setAttivo] = useState<Strato>("intro");
  useMotionValueEvent(p, "change", (v) => setAttivo(strato(v)));
  const inert = (s: Strato) => (!statico && attivo !== s ? ({ inert: "", "aria-hidden": true } as Record<string, unknown>) : {});
  const introOpacity = useTransform(p, map([0, 0.08, 0.12], [1, 1, 0]));
  const introEvents = useTransform(p, (v) => (v < 0.11 ? "auto" : "none"));
  const barOpacity = useTransform(p, map([0.1, 0.14, 0.88, 0.92], [0, 1, 1, 0]));
  const barEvents = useTransform(p, (v) => (v > 0.11 && v < 0.91 ? "auto" : "none"));
  const finaleOpacity = useTransform(p, map([0.9, 0.94], [0, 1]));
  const scrimOpacity = useTransform(p, map([0.08, 0.14], [0, 1]));
  const finaleEvents = useTransform(p, (v) => (v > 0.92 ? "auto" : "none"));

  return (
    <div className="pointer-events-none absolute inset-0 z-[6]">
      {/* Blocco hero: in alto su mobile (camion nei 2/3 bassi), a sinistra su desktop. */}
      <m.div
        {...inert("intro")}
        style={statico ? undefined : { opacity: introOpacity, pointerEvents: introEvents }}
        className="pointer-events-auto mx-auto flex h-full w-full max-w-6xl flex-col justify-start px-6 pt-24 md:justify-center md:px-10 md:pt-0"
      >
        <div className="flex max-w-[600px] flex-col">
          <div className="mb-3 flex items-center gap-3 md:mb-5">
            <span className="h-0.5 w-8 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white" style={{ textShadow: textShadowSoft }}>
              Teloni per camion · dal 1950
            </span>
          </div>
          <h1
            className="font-display text-4xl font-bold uppercase leading-[0.95] text-white md:text-6xl lg:text-[64px]"
            style={{ textShadow: textShadowSoft }}
          >
            {"Teli per bilico completi e professionali — dal 1950"}
          </h1>
          <p className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.02em] text-white" style={{ textShadow: textShadowSoft }}>
            Italia Coperta
          </p>
          <p className="mt-3 hidden max-w-[520px] text-lg leading-relaxed text-white/85 md:block" style={{ textShadow: textShadowSoft }}>
            Il telo che copre l&apos;Italia — e ti copre in tutta Italia. Teloni su misura per bilici, motrici e rimorchi,
            cuciti a mano dalla terza generazione della famiglia Di Riso.
          </p>
          <div className="mt-6 md:mt-8">
            <Ctas />
            <p className="mt-3 text-sm font-medium text-white/90" style={{ textShadow: textShadowSoft }}>
              <span className="text-primary-light">✓</span> Rilievo misure gratuito in tutta Italia
            </p>
          </div>
        </div>
      </m.div>

      {!statico && (
        <>
          {/* Ombra morbida dietro le frasi: leggibili anche sui primi piani del telo e del logo. */}
          <m.div
            aria-hidden
            style={{ opacity: scrimOpacity }}
            className="absolute inset-0 opacity-0 [background:linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_45%)] md:[background:linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_38%,rgba(0,0,0,0)_60%),linear-gradient(to_top,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_35%)]"
          />
          <div className="absolute inset-x-0 top-24 mx-auto max-w-6xl px-6 md:top-1/2 md:-translate-y-1/2 md:px-10">
            <div className="relative h-40" aria-hidden>
              {FRASI.map((f) => (
                <Frase key={f.testo} p={p} {...f} />
              ))}
            </div>
          </div>

          <m.div
            {...inert("barra")}
            style={{ opacity: barOpacity, pointerEvents: barEvents }}
            className="absolute inset-x-0 bottom-6 mx-auto opacity-0 flex max-w-6xl justify-center px-4 md:bottom-10 md:justify-start md:px-10"
          >
            <Ctas />
          </m.div>

          <m.div
            {...inert("finale")}
            style={{ opacity: finaleOpacity, pointerEvents: finaleEvents }}
            className="absolute inset-x-0 bottom-20 mx-auto max-w-6xl px-6 opacity-0 md:bottom-14 md:px-10"
          >
            <p className="max-w-[560px] font-display text-3xl font-bold uppercase leading-[1.02] text-white md:text-5xl" style={{ textShadow: textShadowSoft }}>
              Rilievo misure gratuito in tutta Italia
            </p>
            <div className="mt-6 md:mt-8">
              <Ctas />
            </div>
          </m.div>
        </>
      )}
    </div>
  );
}
