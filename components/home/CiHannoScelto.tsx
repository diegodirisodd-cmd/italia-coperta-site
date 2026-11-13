import Image from "next/image";
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

/** Closing band over a real job photo (Climaconvenienza semi-trailer). */
export function CiHannoScelto() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-10 md:py-36">
      <Image
        src="/images/settori/teloni-pubblicitari-climaconvenienza.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-80 grayscale-[35%]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,13,24,0.95) 0%, rgba(26,25,128,0.86) 55%, rgba(11,13,24,0.97) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl text-center">
        <SectionKicker label="Un partner per chi lavora ogni giorno su strada" center />
        <h2 className="font-display text-4xl font-bold uppercase leading-none text-white md:text-5xl">
          Ci scelgono dal 1950
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SETTORI.map((settore) => (
            <span
              key={settore}
              className="rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm text-white/85 backdrop-blur-md"
            >
              {settore}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
