import type { Metadata } from "next";
import { SectionKicker } from "@/components/SectionKicker";
import { ConfiguratoreProvider } from "@/components/configuratore/ConfiguratoreProvider";
import { WizardShell } from "@/components/configuratore/WizardShell";
import { serviceSchema, breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo/schema";
import { ProvaSociale } from "@/components/recensioni/ProvaSociale";

export const metadata: Metadata = {
  title: "Configuratore teloni per camion su misura — preventivo gratuito",
  description:
    "Configura il telone per bilico, motrice o rimorchio in 9 passaggi: mezzo, intervento, colore, misure ed extra, anche con foto. Preventivo su misura gratuito e senza impegno.",
  alternates: { canonical: "/configuratore" },
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
                "Configuratore online per teloni per camion in 9 passaggi: tipo di mezzo, intervento, colore, misure ed extra, con richiesta di preventivo gratuita.",
            }),
          )}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbSchema([{ name: "Configuratore", path: "/configuratore" }]))}
        />
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionKicker label="Costruisci la tua richiesta" />
            <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
              Configura il tuo telone
            </h1>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-avorio/70">
            Rispondi a poche domande sul tuo mezzo e sull&apos;intervento: ti ricontattiamo
            noi con il preventivo su misura, senza impegno.
          </p>
        </div>

        <ConfiguratoreProvider>
          <WizardShell />
        </ConfiguratoreProvider>

        <div className="mt-12">
          <ProvaSociale service="Completo" />
        </div>
      </div>
    </main>
  );
}
