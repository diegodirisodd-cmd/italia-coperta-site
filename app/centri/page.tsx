import type { Metadata } from "next";
import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { CentriExplorer } from "@/components/centri/CentriExplorer";
import { CENTRI, CENTRI_ATTIVI } from "@/lib/centri";
import { localBusinessSchema, serviceSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Centri Autorizzati Italia Coperta — mappa e contatti",
  description:
    "La rete Centri Autorizzati Italia Coperta: sedi operative ad Angri (SA) e Brescia, con aperture in arrivo in Piemonte, Nord-Est, Lazio e Puglia. Trova il centro più vicino sulla mappa.",
};

const prossime = CENTRI.filter((c) => c.stato === "prossima-apertura");

export default function CentriPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(localBusinessSchema())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          serviceSchema({
            name: "Rete Centri Autorizzati Italia Coperta",
            description:
              "Vendita, montaggio e riparazione di teloni per camion presso i centri autorizzati Italia Coperta in tutta Italia.",
          }),
        )}
      />

      {/* hero */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <SectionKicker label="Presenti in tutta Italia" center />
          <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-6xl">
            Centri Autorizzati Italia Coperta
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-avorio/80">
            Due sedi produttive — <strong className="text-avorio">Angri (SA)</strong> e{" "}
            <strong className="text-avorio">Brescia</strong> — e una rete in crescita in tutta la penisola. Tocca
            un centro sulla mappa per contatti e servizi.
          </p>
        </div>
      </section>

      {/* map */}
      <section className="border-b border-primary/[0.14] bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <CentriExplorer />
        </div>
      </section>

      {/* prossime aperture */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="La rete cresce" />
          <h2 className="font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
            Prossime aperture
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-avorio/75">
            Stiamo ampliando la rete Italia Coperta. Fino all&apos;apertura, queste aree sono servite dalle sedi
            di Angri e Brescia.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {prossime.map((c) => (
              <div key={c.id} className="rounded-lg border border-avorio/[0.14] bg-navy-deep p-5">
                <div className="font-display text-lg font-semibold uppercase text-avorio">{c.citta}</div>
                <div className="mt-1 text-sm text-avorio/60">{c.area}</div>
                <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Prossima apertura
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* diventa centro CTA */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-lg border border-primary/25 bg-navy-black px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Vuoi portare Italia Coperta nella tua zona?
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-avorio/75">
              Cerchiamo partner locali per la rete. Fornitura prodotta da noi, richieste dal configuratore, un
              marchio riconoscibile. {CENTRI_ATTIVI.length} sedi oggi, molte di più domani.
            </p>
          </div>
          <Link
            href="/diventa-centro"
            className="whitespace-nowrap rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
          >
            Diventa centro
          </Link>
        </div>
      </section>
    </main>
  );
}
