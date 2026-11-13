import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { MagneticCTA } from "@/components/motion/MagneticCTA";

// Mirrors the real 9-step wizard, grouped into 3 phases for readability.
const STEPS = [
  { n: "01", t: "Il mezzo", d: "Mezzo · Richiesta" },
  { n: "02", t: "I dettagli", d: "Colore · Misure · Extra · Tempi" },
  { n: "03", t: "La richiesta", d: "Zona · Dati · Riepilogo" },
];

export function ConfiguratoreTeaser() {
  return (
    <section id="configuratore" className="border-b border-primary/[0.14] bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionKicker label="Costruisci la tua richiesta" />
            <h2 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
              Configura il tuo telone
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-avorio/70">
            Nove passaggi guidati, anche con le foto del tuo mezzo. Ricevi un preventivo su misura: ti richiamiamo noi, senza impegno.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-primary/20 bg-primary/[0.16] md:grid-cols-[1.25fr_0.9fr]">
          <div className="bg-navy p-9">
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.n} className="rounded-md border border-avorio/10 bg-navy-deep px-4 py-5">
                  <span className="block font-display text-lg font-bold text-primary">{step.n}</span>
                  <span className="mt-1 block font-display text-base font-semibold uppercase tracking-[0.03em] text-avorio">
                    {step.t}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-avorio/65">{step.d}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-avorio/70">
              <span className="font-semibold text-avorio">9 passaggi</span> · rilievo misure gratuito in tutta Italia · nessun impegno
            </p>
            <MagneticCTA
              href="/configuratore"
              className="mt-6 inline-block rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
            >
              Apri il configuratore →
            </MagneticCTA>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-navy-black md:aspect-auto">
            <Image
              src="/images/configuratore/anteprima-configuratore.jpg"
              alt="Anteprima del configuratore telone Italia Coperta"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
