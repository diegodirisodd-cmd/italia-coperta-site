"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { WordReveal } from "@/components/motion/WordReveal";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { EASE_OUT, EASE_TARP } from "@/components/motion/variants";

const ctaPrimary =
  "rounded-md border-2 border-white/85 bg-primary px-6 py-3 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:px-7 md:py-4";
const ctaSecondary =
  "rounded-md border-[1.5px] border-white/60 px-6 py-3 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] md:px-7 md:py-4";

const textShadowSoft = "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.7)";

const heroAlt =
  "Telone rosso Di Riso Teloni con adesivo del marchio, fascia rifrangente e tenditori a cricchetto";

// Art direction: two different crops (landscape vs portrait), not one image
// squeezed via CSS. <picture> lets the browser fetch only the file that
// matches, so mobile never downloads the desktop frame and vice versa.
const { props: heroDesktopImg } = getImageProps({
  src: "/images/hero-telone-rosso.jpg",
  alt: heroAlt,
  width: 1916,
  height: 821,
  priority: true,
  sizes: "100vw",
});
const { props: heroMobileImg } = getImageProps({
  src: "/images/hero-telone-rosso-mobile.jpg",
  alt: heroAlt,
  width: 1080,
  height: 1440,
  priority: true,
  sizes: "100vw",
});

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[520px] flex-col justify-center overflow-hidden border-b border-primary/[0.18] md:min-h-[660px]"
    >
      {/* real hero photo — branded red tarp with the DiRiso Teloni sticker (above the fold).
         Portrait crop below md, landscape crop from md up — true art direction via <picture>,
         so only one file is ever downloaded. The wrapper is its own relative+overflow-hidden
         box so the <img>'s absolute+cover sizing never depends on an ancestor further up. */}
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroDesktopImg.srcSet} sizes="100vw" />
          <img
            {...heroMobileImg}
            alt={heroAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
      </div>
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
    </section>
  );
}

function HeroKicker() {
  return (
    <div className="mb-3 flex items-center gap-3 md:mb-5">
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
    <div className="relative z-[6] mx-auto w-full max-w-6xl px-6 pb-8 pt-7 md:px-10 md:pb-14 md:pt-10">
      <m.div className="relative flex max-w-[660px] flex-col" {...groupProps}>
        {/* local scrim, scoped to the text block itself — tracks it at every breakpoint.
           Breakpoint matches the <picture> art direction (md): below md the portrait crop
           is tighter and needs a stronger veil; md+ shows more of the frame and needs only
           a light touch. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 blur-2xl md:hidden"
          style={{
            background:
              "radial-gradient(ellipse 85% 90% at 32% 42%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.22) 82%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 hidden blur-2xl md:block"
          style={{
            background:
              "radial-gradient(ellipse 75% 80% at 30% 40%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.12) 80%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Visual order on mobile (order-*) moves "Italia Coperta" + paragraph below the
           CTAs, where the removed keyword strip used to sit. DOM order is untouched — kicker,
           title, subtitle, paragraph, CTAs — so reading order and tab order stay linear and
           match the md+ visual order exactly; only mobile is remapped. */}
        <m.div {...itemProps} className="order-1 md:order-none">
          <HeroKicker />
        </m.div>
        {/* H1 keeps the ranking keyword phrase; "Italia Coperta" carries the brand as a tagline.
           The space between "dal" and "1950" below is U+00A0 (non-breaking), not a regular
           space -- keeps the year from wrapping onto its own orphan line on narrow screens. */}
        <h1
          className="order-2 font-display text-4xl font-bold uppercase leading-[0.95] text-white md:order-none md:text-6xl lg:text-[64px]"
          style={{ textShadow: textShadowSoft }}
        >
          <WordReveal text={"Teli per bilico completi e professionali — dal 1950"} delay={0.7} />
        </h1>
        <m.p
          {...itemProps}
          className="order-4 mt-6 font-display text-2xl font-semibold uppercase tracking-[0.02em] text-white md:order-none md:mt-4"
          style={{ textShadow: textShadowSoft }}
        >
          Italia Coperta
        </m.p>
        <m.p
          {...itemProps}
          className="order-5 mt-4 max-w-[520px] text-lg leading-normal text-white/85 md:order-none md:mt-6 md:leading-relaxed"
          style={{ textShadow: textShadowSoft }}
        >
          Il telo che copre l&apos;Italia — e ti copre in tutta Italia. Teloni su misura per bilici, motrici e
          rimorchi, cuciti a mano dalla terza generazione della famiglia Di Riso.
        </m.p>
        <m.div {...itemProps} className="order-3 mt-6 flex flex-wrap gap-2 md:order-none md:mt-8 md:gap-3.5">
          <MagneticCTA href="/preventivo" className={ctaPrimary}>Richiedi preventivo</MagneticCTA>
          <Link href="/configuratore" className={ctaSecondary}>Configura il tuo telone</Link>
        </m.div>
      </m.div>
    </div>
  );
}
