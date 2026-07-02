import { CENTRI_ATTIVI } from "@/lib/centri";

const STATS = [
  { value: "75", label: "Anni di attività · dal 1950" },
  { value: "3ª", label: "Generazione in azienda" },
  { value: String(CENTRI_ATTIVI.length), label: "Sedi produttive · Angri & Brescia" },
];

export function StatsBand() {
  return (
    <section className="border-b border-primary/[0.14] bg-navy-black px-6 py-10 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <div className="font-display text-4xl font-bold leading-none text-primary md:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.1em] text-avorio/65">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
