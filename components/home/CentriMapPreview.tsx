import { SectionKicker } from "@/components/SectionKicker";
import { CentriExplorer } from "@/components/centri/CentriExplorer";

export function CentriMapPreview() {
  return (
    <section id="centri" className="border-b border-primary/[0.14] bg-navy px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionKicker label="Presenti in tutta Italia" center />
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
            Centri Autorizzati Italia Coperta
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-avorio/70">
            Vendita, montaggio e riparazione vicino a te. Tocca un centro sulla mappa per i contatti.
          </p>
        </div>
        <CentriExplorer footerHref="/centri" />
      </div>
    </section>
  );
}
