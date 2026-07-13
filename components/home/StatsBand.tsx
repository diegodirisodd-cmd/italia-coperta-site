import { CENTRI_ATTIVI } from "@/lib/centri";
import { CountUp } from "@/components/motion/CountUp";
import { ANNUAL_PVC_SQUARE_METERS, DATI_PRODUTTIVI_AGGIORNATI_AL, getYearsOfExperience } from "@/lib/azienda";

const yearsOfExperience = getYearsOfExperience();

const STATS = [
  { value: String(yearsOfExperience), label: "Anni di attività · dal 1950" },
  { value: "3ª", label: "Generazione in azienda" },
  { value: String(CENTRI_ATTIVI.length), label: "Sedi produttive · Angri & Brescia" },
  { value: String(ANNUAL_PVC_SQUARE_METERS), label: "m² di PVC lavorati ogni anno" },
];

export function StatsBand() {
  return (
    <section className="border-b border-primary/[0.14] bg-navy-black px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="font-display text-4xl font-bold leading-none text-primary md:text-5xl">
                <CountUp value={stat.value} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.1em] text-avorio/65">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[11px] text-avorio/40 sm:text-left">
          Dati produttivi aggiornati al {DATI_PRODUTTIVI_AGGIORNATI_AL}
        </p>
      </div>
    </section>
  );
}
