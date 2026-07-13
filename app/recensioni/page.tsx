import type { Metadata } from "next";
import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { RecensioniList } from "./RecensioniList";
import { googleReviewUrl } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Recensioni clienti | Di Riso Teloni",
  description:
    "Leggi le recensioni dei clienti Di Riso Teloni su produzione, riparazione, personalizzazione e montaggio di teloni per camion e veicoli industriali.",
};

// NB: nessun markup strutturato Review/AggregateRating riferito a Di Riso Teloni
// (recensioni autopubblicate non vanno segnalate come rich snippet). Restano
// solo visive, con link alla fonte originale (Google).

export default function RecensioniPage() {
  return (
    <main className="bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <SectionKicker label="La voce dei clienti" />
          <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-6xl">
            Recensioni clienti
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-avorio/80">
            La qualità del nostro lavoro raccontata da chi ci ha scelto: produzione, riparazione,
            personalizzazione e montaggio di teloni per camion e veicoli industriali.
          </p>
          <div className="mt-6">
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-primary no-underline hover:underline"
            >
              Vedi la scheda Google →
            </a>
          </div>
        </div>

        <div className="mt-12">
          <RecensioniList />
        </div>

        {/* CTA finali */}
        <div className="mt-16 flex flex-wrap gap-3 border-t border-avorio/10 pt-10">
          <Link
            href="/preventivo"
            className="rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline transition-colors hover:bg-primary-light"
          >
            Richiedi un preventivo
          </Link>
          <Link
            href="/configuratore"
            className="rounded-md border-[1.5px] border-avorio/40 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
          >
            Apri il configuratore
          </Link>
        </div>
      </div>
    </main>
  );
}
