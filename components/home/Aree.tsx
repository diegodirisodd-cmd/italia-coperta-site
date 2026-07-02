import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { SETTORI } from "@/lib/settori";

// Home teaser shows the first four sectors; full list lives at /settori.
const AREE = SETTORI.slice(0, 4);

export function Aree() {
  return (
    <section className="border-b border-oro/[0.14] bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionKicker label="Cosa realizziamo" />
            <h2 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
              Le nostre aree di lavorazione
            </h2>
          </div>
          <Link
            href="/settori"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-oro no-underline"
          >
            Tutti i settori →
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AREE.map((area) => (
            <Link
              key={area.slug}
              href={`/settori/${area.slug}`}
              className="rounded-md border-[1.5px] border-avorio/[0.14] bg-navy p-6 no-underline transition-colors hover:border-oro/60"
            >
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                {area.cardTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-avorio/65">{area.tagline}</p>
              <span className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-oro">
                Scopri di più →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
