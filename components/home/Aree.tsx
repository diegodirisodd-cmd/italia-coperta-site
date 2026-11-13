import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionKicker } from "@/components/SectionKicker";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SETTORI } from "@/lib/settori";

// Home teaser shows the first four sectors; full list lives at /settori.
const AREE = SETTORI.slice(0, 4);

/** Sector cards as full-photo tiles: the work itself is the visual. */
export function Aree() {
  return (
    <section className="bg-ink px-6 py-24 md:px-10 md:py-32">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-avorio/85 no-underline transition-colors hover:border-primary/70 hover:text-avorio"
          >
            Tutti i settori <ArrowUpRight size={14} />
          </Link>
        </div>
        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AREE.map((area) => (
            <StaggerItem key={area.slug} className="h-full">
              <Link
                href={`/settori/${area.slug}`}
                className="group relative flex aspect-[4/3] h-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 no-underline sm:aspect-[3/4]"
              >
                {area.image && (
                  <Image
                    src={area.image}
                    alt={area.imageAlt ?? area.cardTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(7,8,15,0.95) 0%, rgba(7,8,15,0.7) 38%, rgba(7,8,15,0.1) 70%, rgba(7,8,15,0) 100%)",
                  }}
                />
                <div className="relative p-6">
                  <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-[0.02em] text-white">
                    {area.cardTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{area.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    Scopri di più
                    <ArrowUpRight
                      size={14}
                      className="text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
