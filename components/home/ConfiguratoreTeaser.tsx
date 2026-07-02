import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";

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
            <Link
              href="/configuratore"
              className="mt-8 inline-block rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
            >
              Apri il configuratore →
            </Link>
          </div>

          <div className="flex flex-col justify-center bg-navy-black p-9">
            <span className="mb-5 text-[11px] uppercase tracking-[0.24em] text-avorio/50">
              Anteprima configurazione
            </span>
            <svg viewBox="0 0 440 180" className="w-full">
              <line x1="10" y1="150" x2="430" y2="150" stroke="rgba(243,233,204,.2)" strokeWidth={2} />
              <path d="M30 150 L30 96 Q30 88 40 86 L78 78 L98 100 L98 150 Z" fill="#12335c" stroke="#F3E9CC" strokeWidth={2} />
              <rect x="44" y="90" width="30" height="20" rx="2" fill="#000000" stroke="rgba(243,233,204,.6)" strokeWidth={1.5} />
              <rect x="104" y="60" width="308" height="90" rx="3" fill="#12335c" stroke="#F3E9CC" strokeWidth={2} />
              <g stroke="rgba(243,233,204,.28)" strokeWidth={2}>
                {[130, 160, 190, 220, 250, 280, 310, 340, 370].map((x) => (
                  <line key={x} x1={x} y1="62" x2={x} y2="148" />
                ))}
              </g>
              <rect x="104" y="132" width="308" height="7" fill="#E31919" />
              <g fill="#000000" stroke="#F3E9CC" strokeWidth={2}>
                {[70, 300, 340, 380].map((cx) => (
                  <circle key={cx} cx={cx} cy="150" r="12" />
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
