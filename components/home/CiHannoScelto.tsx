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

/** Closing band over a real photo: a Di Riso Teloni semi-trailer on the road. */
export function CiHannoScelto() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-10 md:py-36">
      <Image
        src="/images/home/bilico-diriso-strada.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,13,24,0.96) 0%, rgba(11,13,24,0.86) 40%, rgba(11,13,24,0.3) 72%, rgba(11,13,24,0.15) 100%), linear-gradient(180deg, rgba(11,13,24,0.7) 0%, rgba(11,13,24,0) 25%, rgba(11,13,24,0) 75%, rgba(11,13,24,0.85) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-xl">
        <SectionKicker label="Un partner per chi lavora su strada" />
        <h2 className="font-display text-4xl font-bold uppercase leading-none text-white md:text-5xl">
          Ci scelgono dal 1950
        </h2>
        <div className="mt-9 flex flex-wrap gap-2.5">
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
      </div>
    </section>
  );
}
