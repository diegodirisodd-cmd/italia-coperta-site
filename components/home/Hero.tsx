"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ItaliaEmblem } from "@/components/ItaliaEmblem";

function segClass(active: boolean) {
  return [
    "rounded-full px-4 py-2 text-xs font-semibold tracking-[0.02em] transition-colors",
    active ? "bg-primary text-navy" : "bg-transparent text-avorio/75",
  ].join(" ");
}

const ctaPrimary =
  "rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline shadow-[0_8px_24px_rgba(227,25,25,0.28)]";
const ctaSecondary =
  "rounded-md border-[1.5px] border-avorio/50 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline";

export function Hero() {
  const [mode, setMode] = useState<"foto" | "emblema">("foto");
  const isFoto = mode === "foto";

  return (
    <section
      id="top"
      className="relative flex min-h-[660px] flex-col justify-center overflow-hidden border-b border-primary/[0.18]"
    >
      {/* real hero photo — truck with branded tarp at sunset (above the fold) */}
      <Image
        src="/images/hero-camion.jpg"
        alt="Camion Di Riso Teloni con telone brandizzato al tramonto in autostrada"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/[0.97] via-navy-deep/[0.86] to-navy/[0.55]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/90 to-transparent" />

      {/* hero variant switcher */}
      <div className="absolute right-5 top-5 z-[8] flex items-center gap-2">
        <span className="hidden text-[10px] uppercase tracking-[0.2em] text-avorio/50 sm:inline">
          Variante hero
        </span>
        <div className="flex gap-1 rounded-full border border-primary/30 bg-navy-deep/[0.72] p-1">
          <button onClick={() => setMode("foto")} className={segClass(isFoto)}>
            Foto protagonista
          </button>
          <button onClick={() => setMode("emblema")} className={segClass(!isFoto)}>
            Emblema protagonista
          </button>
        </div>
      </div>

      {isFoto ? <FotoVariant /> : <EmblemaVariant />}

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
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
        Teloni per camion · dal 1950
      </span>
    </div>
  );
}

function FotoVariant() {
  return (
    <div className="relative z-[6] mx-auto w-full max-w-6xl px-6 pb-14 pt-10 md:px-10">
      <div className="max-w-[660px]">
        <HeroKicker />
        {/* H1 keeps the ranking keyword phrase; "Italia Coperta" carries the brand as a tagline. */}
        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] text-avorio md:text-6xl lg:text-[64px]">
          Teli per bilico completi e professionali — dal 1950
        </h1>
        <p className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.02em] text-primary">
          Italia Coperta
        </p>
        <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-avorio/80">
          Il telo che copre l&apos;Italia — e ti copre in tutta Italia. Teloni su misura per bilici, motrici e
          rimorchi, cuciti a mano dalla terza generazione della famiglia Di Riso.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link href="/preventivo" className={ctaPrimary}>Richiedi preventivo</Link>
          <Link href="/configuratore" className={ctaSecondary}>Configura il tuo telone</Link>
        </div>
      </div>
    </div>
  );
}

function EmblemaVariant() {
  return (
    <div className="relative z-[6] mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-10">
      <div>
        <HeroKicker />
        <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] text-avorio md:text-5xl">
          Teli per bilico completi e professionali — dal 1950
        </h1>
        <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.02em] text-primary">
          Italia Coperta
        </p>
        <p className="mt-5 max-w-[460px] text-[18px] leading-relaxed text-avorio/80">
          Un solo telo copre tutta la penisola. Lo stesso principio del nostro servizio: presenti, capillari,
          dovunque tu debba viaggiare.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link href="/preventivo" className={ctaPrimary}>Richiedi preventivo</Link>
          <Link href="/configuratore" className={ctaSecondary}>Configura il tuo telone</Link>
        </div>
      </div>
      <div className="flex justify-center">
        <ItaliaEmblem variant="rich" width={330} height={396} />
      </div>
    </div>
  );
}
