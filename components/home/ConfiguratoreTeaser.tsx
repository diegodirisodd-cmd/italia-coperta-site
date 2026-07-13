import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { MagneticCTA } from "@/components/motion/MagneticCTA";

const STEPS = [
  { n: "01", t: "Veicolo" },
  { n: "02", t: "Tipo di telo" },
  { n: "03", t: "Misura" },
  { n: "04", t: "Extra" },
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
            Quattro passi e ricevi un preventivo su misura. Ti richiamiamo noi, senza impegno.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-primary/20 bg-primary/[0.16] md:grid-cols-[1.25fr_0.9fr]">
          <div className="bg-navy p-9">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.n} className="rounded-md border border-avorio/10 bg-navy-deep px-4 py-5 text-center">
                  <span className="block font-display text-lg font-bold text-primary">{step.n}</span>
                  <span className="mt-1 block text-sm font-medium text-avorio/80">{step.t}</span>
                </div>
              ))}
            </div>
            <MagneticCTA
              href="/configuratore"
              className="mt-8 inline-block rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
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
