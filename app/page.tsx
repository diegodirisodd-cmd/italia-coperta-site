import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { Storia } from "@/components/home/Storia";
import { Aree } from "@/components/home/Aree";
import { ConfiguratoreTeaser } from "@/components/home/ConfiguratoreTeaser";
import { RiparazionePreview } from "@/components/home/RiparazionePreview";
import { CentriMapPreview } from "@/components/home/CentriMapPreview";
import { Finanziamento } from "@/components/home/Finanziamento";
import { CiHannoScelto } from "@/components/home/CiHannoScelto";
import { organizationSchema, localBusinessSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Teli per bilico e teloni per camion dal 1950 — Di Riso Teloni",
  description:
    "Teli per bilico, teloni per camion dal 1950 e tensostrutture industriali su misura. Terza generazione, produzione ad Angri (SA) e Brescia — Italia Coperta, servizio in tutta Italia.",
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(organizationSchema())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(localBusinessSchema())}
      />
      <Hero />
      <StatsBand />
      <Storia />
      <Aree />
      <ConfiguratoreTeaser />
      <RiparazionePreview />
      <CentriMapPreview />
      <Finanziamento />
      <CiHannoScelto />
    </main>
  );
}
