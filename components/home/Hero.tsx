"use client";

import Link from "next/link";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { WordReveal } from "@/components/motion/WordReveal";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { EASE_OUT, EASE_TARP } from "@/components/motion/variants";

const ctaPrimary =
  "rounded-md border-2 border-white/85 bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline shadow-[0_8px_28px_rgba(0,0,0,0.45)]";
const ctaSecondary =
  "rounded-md border-[1.5px] border-white/60 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]";

const textShadowSoft = "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.7)";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[660px] flex-col justify-center overflow-hidden border-b border-primary/[0.18]"
    >
      {/* real hero photo — branded red tarp with the DiRiso Teloni sticker (above the fold) */}
      <Image
        src="/images/hero-telone-rosso.jpg"
        alt="Telone rosso Di Riso Teloni con adesivo del marchio e gancio a cricchetto"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[30%_center] sm:object-[38%_center] lg:object-center"
      />
      {/* uniform, discreet veil — even left/right so the whole photo stays visible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.22) 32%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      {/* "telone che si scosta": a tarp panel slides off on load to reveal the truck */}
      {!reduced && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] will-change-transform"
          style={{ background: "linear-gradient(115deg, #1A1980 0%, #12103f 55%, #000000 100%)" }}
          initial={{ x: "0%" }}
          animate={{ x: "-101%" }}
          transition={{ duration: 1.05, ease: EASE_TARP, delay: 0.1 }}
        >
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(243,233,204,0.5) 0 1px, transparent 1px 15px)",
            }}
          />
          <div className="absolute inset-y-0 right-0 w-2 bg-primary" />
        </m.div>
      )}

      <FotoVariant />

      {/* bottom marquee strip */}
      <div className="relative z-[6] border-t border-primary/[0.16] bg-navy-black/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-7 px-6 py-4 text-[12.5px] uppercase tracking-[0.14em] text-avorio/60 md:px-10">
          <span>Bilici</span>
          <span className="text-primary">·</span>
          <span>Motrici</span>
          <span className="text-primary">·</span>
          <span>Rimorchi</span>
          <span className="text-primary">·</span>
          <span>Furgoni centinati</span>
          <span className="text-primary">·</span>
          <span>Riparazioni rapide</span>
          <span className="text-primary">·</span>
          <span>Servizio in tutta Italia</span>
        </div>
      </div>
    </section>
  );
}

function HeroKicker() {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-0.5 w-8 bg-primary" />
      <span
        className="text-xs font-semibold uppercase tracking-[0.28em] text-white"
        style={{ textShadow: textShadowSoft }}
      >
        Teloni per camion · dal 1950
      </span>
    </div>
  );
}

const fotoContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } },
};
const fotoItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

function FotoVariant() {
  const reduced = useReducedMotion();
  const groupProps = reduced
    ? {}
    : { variants: fotoContainer, initial: "hidden" as const, animate: "show" as const };
  const itemProps = reduced ? {} : { variants: fotoItem };

  return (
    <div className="relative z-[6] mx-auto w-full max-w-6xl px-6 pb-14 pt-10 md:px-10">
      <m.div className="relative max-w-[660px]" {...groupProps}>
        {/* local scrim, scoped to the text block itself — tracks it at every breakpoint.
           Mobile crops in tight on the sticker's bright artwork, so it gets a stronger veil;
           tablet/desktop see more of the frame and need only a light touch. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 blur-2xl sm:hidden"
          style={{
            background:
              "radial-gradient(ellipse 85% 90% at 32% 42%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.22) 82%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 hidden blur-2xl sm:block"
          style={{
            background:
              "radial-gradient(ellipse 75% 80% at 30% 40%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.12) 80%, rgba(0,0,0,0) 100%)",
          }}
        />
        <m.div {...itemProps}>
          <HeroKicker />
        </m.div>
        {/* H1 keeps the ranking keyword phrase; "Italia Coperta" carries the brand as a tagline. */}
        <h1
          className="font-display text-5xl font-bold uppercase leading-[0.95] text-white md:text-6xl lg:text-[64px]"
          style={{ textShadow: textShadowSoft }}
        >
          <WordReveal text="Teli per bilico completi e professionali — dal 1950" delay={0.7} />
        </h1>
        <m.p
          {...itemProps}
          className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.02em] text-white"
          style={{ textShadow: textShadowSoft }}
        >
          Italia Coperta
        </m.p>
        <m.p
          {...itemProps}
          className="mt-6 max-w-[520px] text-lg leading-relaxed text-white/85"
          style={{ textShadow: textShadowSoft }}
        >
          Il telo che copre l&apos;Italia — e ti copre in tutta Italia. Teloni su misura per bilici, motrici e
          rimorchi, cuciti a mano dalla terza generazione della famiglia Di Riso.
        </m.p>
        <m.div {...itemProps} className="mt-8 flex flex-wrap gap-3.5">
          <MagneticCTA href="/preventivo" className={ctaPrimary}>Richiedi preventivo</MagneticCTA>
          <Link href="/configuratore" className={ctaSecondary}>Configura il tuo telone</Link>
        </m.div>
      </m.div>
    </div>
  );
}
