import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { MagneticCTA } from "@/components/motion/MagneticCTA";

// Mirrors the real 9-step wizard, grouped into 3 phases for readability.
const STEPS = [
  { n: "01", t: "Il mezzo", d: "Mezzo · Richiesta" },
  { n: "02", t: "I dettagli", d: "Colore · Misure · Extra · Tempi" },
  { n: "03", t: "La richiesta", d: "Zona · Dati · Riepilogo" },
];

/** Full-bleed photo band with a glass panel: the configurator as the centrepiece. */
export function ConfiguratoreTeaser() {
  return (
    <section id="configuratore" className="relative overflow-hidden px-6 py-24 md:px-10 md:py-40">
      <Image
        src="/images/hero-camion.jpg"
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover object-[70%_center] md:block"
      />
      {/* desktop: text column on the left, truck visible on the right */}
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,13,24,0.96) 0%, rgba(11,13,24,0.82) 38%, rgba(26,25,128,0.35) 75%, rgba(11,13,24,0.25) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, #0B0D18, rgba(11,13,24,0))" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, #0B0D18, rgba(11,13,24,0))" }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* mobile: the photo as its own rounded card above the text — as a
           background on a tall narrow section it only showed a sliver of trailer */}
        <div className="relative mb-9 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 md:hidden">
          <Image
            src="/images/hero-camion.jpg"
            alt="Bilico con telone Di Riso Teloni su strada al tramonto"
            fill
            sizes="100vw"
            className="object-cover object-[65%_center]"
          />
        </div>
        <div className="max-w-xl">
          <SectionKicker label="Costruisci la tua richiesta" />
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-white md:text-6xl">
            Configura il tuo telone
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-white/80">
            Nove passaggi guidati, anche con le foto del tuo mezzo. Ricevi un preventivo su misura: ti
            richiamiamo noi, senza impegno.
          </p>

          <ol className="mt-9 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md"
              >
                <span className="block font-display text-sm font-semibold text-primary-light">{step.n}</span>
                <span className="mt-1 block font-display text-base font-semibold uppercase tracking-[0.03em] text-white">
                  {step.t}
                </span>
                <span className="mt-1 block text-[12.5px] leading-snug text-white/65">{step.d}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <MagneticCTA
              href="/configuratore"
              className="inline-block rounded-full bg-primary px-8 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline shadow-[0_10px_30px_rgba(230,28,28,0.35)]"
            >
              Apri il configuratore →
            </MagneticCTA>
            <span className="text-sm text-white/70">Rilievo misure gratuito · nessun impegno</span>
          </div>
        </div>
      </div>
    </section>
  );
}
