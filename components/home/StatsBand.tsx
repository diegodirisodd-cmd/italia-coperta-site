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

/** Glass stats card that overlaps the bottom of the hero photo. */
export function StatsBand() {
  return (
    <section className="relative z-10 -mt-16 px-6 md:-mt-24 md:px-10">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-10 md:py-9">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div
                className="font-display text-4xl font-semibold leading-none text-white md:text-5xl"
                aria-hidden="true"
              >
                <CountUp value={stat.value} />
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-avorio/65" aria-hidden="true">
                <span className="h-px w-4 flex-none bg-primary" />
                {stat.label}
              </div>
              {/* Real value for screen readers / SEO — the animated number above
                  starts from 0, so the true figure lives here. */}
              <span className="sr-only">{stat.aria}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-avorio/55">Dati produttivi aggiornati al 31 dicembre 2025</p>
      </div>
    </section>
  );
}
