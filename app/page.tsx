import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { Storia } from "@/components/home/Storia";
import { ServizioItalia } from "@/components/home/ServizioItalia";
import { Aree } from "@/components/home/Aree";
import { LavoriPreview } from "@/components/home/LavoriPreview";
import { ConfiguratoreTeaser } from "@/components/home/ConfiguratoreTeaser";
import { RiparazionePreview } from "@/components/home/RiparazionePreview";
import { CentriMapPreview } from "@/components/home/CentriMapPreview";
import { Finanziamento } from "@/components/home/Finanziamento";
import { Recensioni } from "@/components/home/Recensioni";
import { CiHannoScelto } from "@/components/home/CiHannoScelto";
import { organizationSchema, localBusinessSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Teli per bilico e teloni per camion dal 1950 — Di Riso Teloni",
  description:
    "Teli per bilico e teloni per camion su misura dal 1950. Veniamo noi da te in tutta Italia: rilievo misure gratuito e montaggio sul tuo mezzo. Produzione ad Angri (SA).",
  alternates: { canonical: "/" },
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
      <ServizioItalia />
      <Storia />
      <Aree />
      <LavoriPreview />
      <ConfiguratoreTeaser />
      <RiparazionePreview />
      <CentriMapPreview />
      <Finanziamento />
      <Recensioni />
      <CiHannoScelto />
    </main>
  );
}
