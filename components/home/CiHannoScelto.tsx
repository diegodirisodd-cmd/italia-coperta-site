import { SectionKicker } from "@/components/SectionKicker";

// No real client logos supplied yet — showing the segments served rather
// than inventing company names/logos. Swap for a real logo strip once
// clients agree to be featured.
const SETTORI = [
  "Trasporto conto terzi",
  "Cooperative agricole",
  "Cantieristica",
  "Logistica e magazzini",
  "Grande distribuzione",
];

export function CiHannoScelto() {
  return (
    <section className="bg-navy-deep px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl text-center">
        <SectionKicker label="Un partner per chi lavora ogni giorno su strada" center />
        <h2 className="font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
          Ci scelgono da 75 anni
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SETTORI.map((settore) => (
            <span
              key={settore}
              className="rounded-full border-[1.5px] border-avorio/20 px-5 py-2.5 text-sm text-avorio/70"
            >
              {settore}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
