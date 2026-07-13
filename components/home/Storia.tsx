import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { TarpReveal } from "@/components/motion/TarpReveal";
import { CountUp } from "@/components/motion/CountUp";
import { getYearsOfExperience } from "@/lib/azienda";

const yearsOfExperience = getYearsOfExperience();

const STATS = [
  { value: String(yearsOfExperience), label: "Anni di attività" },
  { value: "3ª", label: "Generazione" },
  { value: "2", label: "Sedi · Angri & Brescia" },
];

export function Storia() {
  return (
    <section id="storia" className="border-b border-primary/[0.14] bg-navy px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <TarpReveal trigger="scrub" className="relative h-[380px] w-full rounded-md md:h-[460px]">
            <Image
              src="/images/fondatore-storica.jpg"
              alt="Il fondatore di Di Riso Teloni negli anni '50, agli inizi dell'attività"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </TarpReveal>
          <div className="absolute bottom-0 left-0 bg-primary px-5 py-3.5 font-display font-bold text-navy">
            <span className="block text-[34px] leading-none">1950</span>
            <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.16em]">ANNO DI FONDAZIONE</span>
          </div>
        </div>
        <div>
          <SectionKicker label="Dal 1950 · Terza generazione" />
          <h2 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-5xl">
            Una famiglia, {yearsOfExperience} anni sulla strada
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-avorio/80">
            Dal 1950 la famiglia Di Riso cuce teloni per camion pensati per resistere al tempo e ai chilometri.
            Oggi l&apos;azienda è guidata da <strong className="font-semibold text-avorio">Domenico</strong> e{" "}
            <strong className="font-semibold text-avorio">Diego Di Riso</strong>, terza generazione: la stessa
            mano artigiana di allora, con processi e materiali di oggi.
          </p>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-avorio/70">
            Due sedi — Angri e Brescia — e un servizio attivo in tutta Italia, accanto a chi lavora ogni giorno
            con il proprio mezzo.
          </p>
          <div className="mt-9 grid grid-cols-3 gap-px border border-primary/20 bg-primary/20">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-navy px-5 py-6">
                <div className="font-display text-4xl font-bold leading-none text-primary">
                  <CountUp value={stat.value} />
                </div>
                <div className="mt-1.5 text-xs uppercase tracking-[0.1em] text-avorio/65">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
