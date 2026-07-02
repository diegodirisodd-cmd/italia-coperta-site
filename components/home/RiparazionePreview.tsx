import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";

const STEPS = [
  "Scegli il tipo di intervento e la sede",
  "Prenoti giorno e fascia oraria",
  "Confermiamo e ti aspettiamo — anche in giornata per le urgenze",
];

export function RiparazionePreview() {
  return (
    <section id="riparazione" className="border-b border-oro/[0.14] bg-navy px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl items-start gap-14 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionKicker label="Servizio · Intervento in 48h" />
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
            Riparazione rapida
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-avorio/80">
            Strappi, fori, occhielli saltati, cinghie da sostituire: un telo fermo è un mezzo fermo. Prenoti
            online, ti diamo un appuntamento e rimetti il camion su strada.
          </p>
          <div className="mt-8 flex flex-col gap-3.5">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3.5">
                <span className="w-6 font-display text-lg font-bold text-oro">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] text-avorio/80">{step}</span>
              </div>
            ))}
          </div>
          <Link
            href="/riparazione-rapida"
            className="mt-8 inline-block rounded-md bg-oro px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
          >
            Prenota un intervento →
          </Link>
        </div>

        <div className="rounded-lg border border-oro/[0.28] bg-navy-deep p-9">
          <h3 className="font-display text-xl font-semibold uppercase tracking-[0.03em] text-avorio">
            Prenota in pochi passi
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-avorio/65">
            Il calendario completo con disponibilità per sede è nella pagina dedicata — scegli intervento, sede,
            giorno e fascia oraria in tempo reale.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Strappo / foro", "Occhielli e cinghie", "Teli laterali", "Centinato", "Manutenzione"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border-[1.5px] border-avorio/20 bg-navy px-4 py-2 text-[13px] text-avorio/75"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
