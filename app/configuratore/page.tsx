import type { Metadata } from "next";
import { SectionKicker } from "@/components/SectionKicker";
import { Configuratore } from "@/components/configuratore/Configuratore";
import { serviceSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Configuratore telone su misura — stima istantanea",
  description:
    "Configura il tuo telone per camion passo passo: veicolo, telo, misura, materiale ed extra. Ricevi una stima istantanea e il centro Italia Coperta più vicino.",
};

export default function ConfiguratorePage() {
  return (
    <main className="bg-navy-deep px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScriptProps(
            serviceSchema({
              name: "Configuratore telone su misura",
              description:
                "Configuratore online per teloni per camion: stima istantanea del prezzo e assegnazione automatica del centro Italia Coperta più vicino.",
            }),
          )}
        />
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionKicker label="Costruisci la tua richiesta" />
            <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
              Configura il tuo telone
            </h1>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-avorio/70">
            Otto passi, una stima istantanea e il centro più vicino a te. Ti richiamiamo noi, senza impegno.
          </p>
        </div>

        <Configuratore />
      </div>
    </main>
  );
}
