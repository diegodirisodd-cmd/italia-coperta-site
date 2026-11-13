import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";

export function Finanziamento() {
  return (
    <section className="bg-ink px-6 pb-24 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-2xl border border-white/10 bg-gradient-to-r from-navy-deep via-[#14135f] to-ink px-8 py-10 md:flex-row md:items-center md:px-12">
        <div>
          <SectionKicker label="Su richiesta" />
          <h2 className="font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
            Finanziamento fino a 5 anni
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-avorio/75">
            Dilazioni su misura per l&apos;acquisto del tuo telone, pensate per chi lavora ogni giorno con il
            proprio mezzo. Ne parliamo insieme quando richiedi il preventivo.
          </p>
        </div>
        <Link
          href="/preventivo"
          className="whitespace-nowrap rounded-full bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline"
        >
          Chiedi informazioni
        </Link>
      </div>
    </section>
  );
}
