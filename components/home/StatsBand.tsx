import { CENTRI_ATTIVI } from "@/lib/centri";
import { CountUp } from "@/components/motion/CountUp";
import { yearsOfExperience, ANNUAL_PVC_SQM, itThousands } from "@/lib/stats";

const STATS = [
  {
    value: String(yearsOfExperience),
    label: "Anni di attività · dal 1950",
    aria: `${yearsOfExperience} anni di attività, dal 1950`,
  },
  { value: "3ª", label: "Generazione in azienda", aria: "Terza generazione in azienda" },
  {
    value: String(CENTRI_ATTIVI.length),
    label: "Poli operativi · Angri & Lombardia",
    aria: `${CENTRI_ATTIVI.length} poli operativi: Angri e Lombardia`,
  },
  {
    value: `${itThousands(ANNUAL_PVC_SQM)} m²`,
    label: "m² di PVC lavorati ogni anno",
    aria: `${itThousands(ANNUAL_PVC_SQM)} m² di PVC lavorati ogni anno`,
  },
];

export function StatsBand() {
  return (
    <section className="border-b border-primary/[0.14] bg-navy-black px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div
                className="font-display text-4xl font-bold leading-none text-primary md:text-5xl"
                aria-hidden="true"
              >
                <CountUp value={stat.value} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.1em] text-avorio/65" aria-hidden="true">
                {stat.label}
              </div>
              {/* Real value for screen readers / SEO — the animated number above
                  starts from 0, so the true figure lives here. */}
              <span className="sr-only">{stat.aria}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-avorio/40 sm:text-left">
          Dati produttivi aggiornati al 31 dicembre 2025
        </p>
      </div>
    </section>
  );
}
