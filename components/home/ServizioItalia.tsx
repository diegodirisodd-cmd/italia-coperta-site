import Image from "next/image";
import Link from "next/link";
import { Ruler, Factory, Wrench, MessageCircle } from "lucide-react";
import { SectionKicker } from "@/components/SectionKicker";
import { waLink } from "@/lib/site";

const STEPS = [
  {
    n: "01",
    icon: Ruler,
    t: "Rilievo misure da te",
    d: "Veniamo dove si trova il tuo mezzo e prendiamo noi le misure.",
  },
  {
    n: "02",
    icon: Factory,
    t: "Produzione ad Angri",
    d: "Il telo viene prodotto su misura nella nostra sede di Angri (SA).",
  },
  {
    n: "03",
    icon: Wrench,
    t: "Montaggio sul tuo mezzo",
    d: "Torniamo da te e lo montiamo sul posto: il camion non deve venire da noi.",
  },
];

/** The differentiator: measuring and fitting happen wherever the truck is, anywhere in Italy. */
export function ServizioItalia() {
  return (
    <section id="tutta-italia" className="bg-ink px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionKicker label="In tutta Italia" />
          <h2 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-6xl">
            Veniamo noi da te
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-avorio/80">
            Rilievo misure e montaggio dove si trova il tuo mezzo, in tutta Italia. Niente viaggi fino alla nostra
            sede, niente camion fermo più del necessario.
          </p>

          <ol className="mt-9 space-y-3">
            {STEPS.map(({ n, icon: Icon, t, d }) => (
              <li
                key={n}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                  <Icon size={20} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-base font-semibold uppercase tracking-[0.03em] text-white">
                    <span className="mr-2 text-primary-light">{n}</span>
                    {t}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-avorio/70">{d}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/preventivo"
              className="rounded-full bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline transition-colors hover:bg-primary-dark"
            >
              Richiedi il rilievo
            </Link>
            <a
              href={waLink("Ciao Di Riso Teloni, vorrei prenotare un rilievo misure sul mio mezzo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/40 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline"
            >
              <MessageCircle size={18} aria-hidden /> WhatsApp
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/images/lavori/montaggio-telo.jpg"
            alt="Montaggio di un telone direttamente sul semirimorchio del cliente"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(7,8,15,0.85) 0%, rgba(7,8,15,0) 45%)" }}
          />
          <p className="absolute inset-x-5 bottom-5 font-display text-xl font-semibold uppercase leading-tight text-white">
            Montaggio sul posto
            <span className="mt-1 block font-body text-sm font-normal normal-case text-white/75">
              Il tuo mezzo resta dove lavora.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
