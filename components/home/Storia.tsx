import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { TarpReveal } from "@/components/motion/TarpReveal";
import { CountUp } from "@/components/motion/CountUp";
import { yearsOfExperience } from "@/lib/stats";

const STATS = [
  { value: String(yearsOfExperience), label: "Anni di attività", aria: `${yearsOfExperience} anni di attività` },
  { value: "3ª", label: "Generazione", aria: "Terza generazione" },
  { value: "2", label: "Poli · Angri & Lombardia", aria: "2 poli: Angri e Lombardia" },
];

export function Storia() {
  return (
    <section id="storia" className="bg-ink px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <TarpReveal trigger="scrub" className="relative h-[380px] w-full overflow-hidden rounded-2xl md:h-[480px]">
            <Image
              src="/images/fondatore-storica.jpg"
              alt="Il fondatore di Di Riso Teloni negli anni '50, agli inizi dell'attività"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </TarpReveal>
          <div className="absolute bottom-4 left-4 rounded-xl bg-primary px-5 py-3.5 font-display font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <span className="block text-[34px] leading-none">1950</span>
            <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.16em]">ANNO DI FONDAZIONE</span>
          </div>
        </div>
        <div>
          <SectionKicker label="Dal 1950 · Terza generazione" />
          <h2 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-5xl">
            Una famiglia, tre generazioni sulla strada
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-avorio/80">
            Dal 1950 la famiglia Di Riso cuce teloni per camion pensati per resistere al tempo e ai chilometri.
            Oggi l&apos;azienda è guidata da <strong className="font-semibold text-avorio">Domenico</strong> e{" "}
            <strong className="font-semibold text-avorio">Diego Di Riso</strong>, terza generazione: la stessa
            mano artigiana di allora, con processi e materiali di oggi.
          </p>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-avorio/70">
            Sede produttiva ad Angri (SA), copertura in Lombardia e un servizio attivo in tutta Italia, accanto
            a chi lavora ogni giorno con il proprio mezzo.
          </p>
          <div className="mt-9 grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-6">
                <div className="font-display text-4xl font-semibold leading-none text-white" aria-hidden="true">
                  <CountUp value={stat.value} />
                </div>
                <div className="mt-1.5 text-xs uppercase tracking-[0.1em] text-avorio/65" aria-hidden="true">
                  {stat.label}
                </div>
                <span className="sr-only">{stat.aria}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
