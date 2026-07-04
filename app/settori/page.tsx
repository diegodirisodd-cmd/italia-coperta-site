import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SETTORI } from "@/lib/settori";

export const metadata: Metadata = {
  title: "Settori di applicazione — teloni e coperture su misura",
  description:
    "I settori Di Riso Teloni: teloni per automezzi, tensostrutture industriali, coperture in PVC, teloni pubblicitari, gazebo e pergole, coperture civili. Su misura, dal 1950.",
};

export default function SettoriPage() {
  return (
    <main className="bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <SectionKicker label="Settori di applicazione" />
          <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
            Un telo su misura per ogni settore
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-avorio/80">
            Dal telone da camion alla copertura industriale, dalla pubblicità sui mezzi al gazebo di casa: dal
            1950 lavoriamo il PVC su misura per chi ha bisogno di coprire, proteggere e durare.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SETTORI.map((settore) => (
            <Link
              key={settore.slug}
              href={`/settori/${settore.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-avorio/[0.14] bg-navy no-underline transition-colors hover:border-primary/60"
            >
              {settore.image ? (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-primary/[0.14]">
                  <Image
                    src={settore.image}
                    alt={settore.imageAlt ?? settore.cardTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <PhotoPlaceholder caption={settore.photoCaption} aspect="16 / 10" className="rounded-none border-0 border-b border-dashed" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl font-semibold uppercase tracking-[0.02em] text-avorio">
                  {settore.cardTitle}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-avorio/65">{settore.tagline}</p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Scopri di più →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
