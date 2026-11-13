import Link from "next/link";
import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";

const STEPS = [
  "Scegli il tipo di intervento e la sede",
  "Prenoti giorno e fascia oraria",
  "Confermiamo e ti aspettiamo — anche in giornata per le urgenze",
];

export function RiparazionePreview() {
  return (
    <section id="riparazione" className="bg-ink-soft px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-14 md:grid-cols-[0.95fr_1.05fr] md:items-center">
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
                <span className="w-6 font-display text-lg font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] text-avorio/80">{step}</span>
              </div>
            ))}
          </div>
          <Link
            href="/riparazione-rapida"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-white no-underline"
          >
            Prenota un intervento →
          </Link>
        </div>

        <div className="relative min-h-[600px] overflow-hidden rounded-2xl border border-white/10 md:min-h-[560px]">
          <Image
            src="/images/home/controllo-telo.jpg"
            alt="Controllo del telone laterale di un bilico Di Riso Teloni"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[60%_35%]"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(7,8,15,0.92) 0%, rgba(7,8,15,0.55) 35%, rgba(7,8,15,0) 60%)",
            }}
          />
          <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-ink/60 p-6 backdrop-blur-xl md:inset-x-6 md:bottom-6">
            <h3 className="font-display text-xl font-semibold uppercase tracking-[0.03em] text-white">
              Prenota in pochi passi
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Scegli intervento, sede, giorno e fascia oraria in tempo reale.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Strappo / foro", "Occhielli e cinghie", "Teli laterali", "Centinato", "Manutenzione"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[12.5px] text-white/85"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
