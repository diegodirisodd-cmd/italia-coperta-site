import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { LAVORI } from "@/lib/lavori";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo/schema";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lavori realizzati — teloni per camion e semirimorchi",
  description:
    "Foto reali dei nostri lavori: teli laterali personalizzati con logo, teli lucidi, montaggio sul mezzo. Teloni per camion su misura dal 1950, Di Riso Teloni.",
  alternates: { canonical: "/lavori" },
};

export default function LavoriPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbSchema([{ name: "Lavori realizzati", path: "/lavori" }]))}
      />

      <section className="bg-ink px-6 pb-12 pt-20 md:px-10 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Lavori realizzati" />
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-6xl">
            I nostri teloni, su strada
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-avorio/80">
            Foto reali dei lavori fatti per i nostri clienti: sostituzione dei teli, teli laterali con la grafica dell&apos;azienda, finiture
            lucide, montaggio direttamente sul mezzo.
          </p>
        </div>
      </section>

      <section className="bg-ink px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-6xl columns-1 gap-5 sm:columns-2 lg:columns-3">
          {LAVORI.map((l, i) => (
            <figure
              key={l.slug}
              className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <div className="overflow-hidden">
                <Image
                  src={l.image}
                  alt={l.alt}
                  width={l.width}
                  height={l.height}
                  priority={i < 2}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="p-5">
                {l.cliente && (
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-avorio/60">
                    {l.cliente}
                  </span>
                )}
                <span className="mt-1.5 block font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                  {l.titolo}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-avorio/70">{l.descrizione}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-navy-deep via-[#14135f] to-ink px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-none text-white md:text-4xl">
              Il prossimo è il tuo mezzo?
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
              Teli su misura con la grafica della tua azienda. Rilievo misure gratuito in tutta Italia.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/configuratore"
              className="rounded-full bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline transition-colors hover:bg-primary-dark"
            >
              Configura il tuo telone
            </Link>
            <a
              href={waLink("Ciao Di Riso Teloni, ho visto i vostri lavori e vorrei un preventivo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-[1.5px] border-white/40 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
