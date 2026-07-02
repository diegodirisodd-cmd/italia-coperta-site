import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionKicker } from "@/components/SectionKicker";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SETTORI, getSettore } from "@/lib/settori";
import { serviceSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export function generateStaticParams() {
  return SETTORI.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const settore = getSettore(params.slug);
  if (!settore) return {};
  return {
    title: settore.metaTitle,
    description: settore.metaDescription,
  };
}

export default function SettoreSlugPage({ params }: { params: { slug: string } }) {
  const settore = getSettore(params.slug);
  if (!settore) notFound();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          serviceSchema({ name: settore.h1, description: settore.metaDescription }),
        )}
      />

      {/* hero */}
      <section className="border-b border-oro/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/settori"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-oro no-underline"
          >
            ← Tutti i settori
          </Link>
          <div className="mt-6 grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionKicker label="Settore" />
              <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-5xl">
                {settore.h1}
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-avorio/80">{settore.tagline}</p>
            </div>
            <PhotoPlaceholder caption={settore.photoCaption} aspect="16 / 11" />
          </div>
        </div>
      </section>

      {/* body + highlights */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-col gap-5">
            {settore.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.7] text-avorio/80"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-oro/25 bg-navy p-7">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">
              In sintesi
            </span>
            <ul className="flex flex-col gap-3.5">
              {settore.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-snug text-avorio/80">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-oro" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-lg border border-oro/25 bg-navy-black px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Un preventivo su misura, senza impegno
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-avorio/75">
              Raccontaci cosa ti serve: ti prepariamo una proposta concreta con materiali, misure e tempi.
            </p>
          </div>
          <Link
            href={settore.cta.href}
            className="whitespace-nowrap rounded-md bg-oro px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
          >
            {settore.cta.label}
          </Link>
        </div>
      </section>
    </main>
  );
}
