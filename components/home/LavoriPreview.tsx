import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionKicker } from "@/components/SectionKicker";
import { LAVORI } from "@/lib/lavori";

// Three portrait shots read best side by side; the landscape one lives on /lavori.
const PREVIEW = ["eca-teli-laterali", "telo-nero-lucido", "montaggio-telo"]
  .map((slug) => LAVORI.find((l) => l.slug === slug))
  .filter((l): l is NonNullable<typeof l> => Boolean(l));

/** Home teaser: three real jobs, link to the full gallery. */
export function LavoriPreview() {
  return (
    <section className="bg-ink px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionKicker label="Lavori realizzati" />
            <h2 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
              I nostri teloni, su strada
            </h2>
          </div>
          <Link
            href="/lavori"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-avorio/85 no-underline transition-colors hover:border-primary/70 hover:text-avorio"
          >
            Tutti i lavori <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PREVIEW.map((l) => (
            <Link
              key={l.slug}
              href="/lavori"
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 no-underline"
            >
              <Image
                src={l.image}
                alt={l.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(7,8,15,0.9) 0%, rgba(7,8,15,0.2) 45%, rgba(7,8,15,0) 70%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                {l.cliente && (
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {l.cliente}
                  </span>
                )}
                <span className="mt-1 block font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                  {l.titolo}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
