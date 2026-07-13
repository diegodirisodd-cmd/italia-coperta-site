import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { Reveal } from "@/components/motion/Reveal";
import { RecensioniCarousel } from "@/components/recensioni/RecensioniCarousel";
import { reviews, googleReviewUrl } from "@/data/reviews";

/** Home "Dicono di noi" section: carousel + CTAs. */
export function Recensioni() {
  return (
    <section id="recensioni" className="border-b border-primary/[0.14] bg-navy px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <SectionKicker label="La voce dei clienti" />
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
            Dicono di noi
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-avorio/70">
            La qualità del nostro lavoro raccontata da chi ci ha scelto.
          </p>
        </div>

        <Reveal>
          <RecensioniCarousel reviews={reviews} />
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/recensioni"
            className="rounded-md bg-primary px-6 py-3.5 font-display text-[14px] font-semibold uppercase tracking-[0.05em] text-navy no-underline transition-colors hover:bg-primary-light"
          >
            Leggi tutte le recensioni
          </Link>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border-[1.5px] border-avorio/40 px-6 py-3.5 font-display text-[14px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
          >
            Lascia una recensione su Google
          </a>
        </div>
      </div>
    </section>
  );
}
