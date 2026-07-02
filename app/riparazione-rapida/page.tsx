import type { Metadata } from "next";
import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { Faq } from "@/components/Faq";
import { Prenotazione } from "@/components/riparazione/Prenotazione";
import { TEMPI, FAQ_RIPARAZIONE } from "@/lib/riparazione";
import { waLink } from "@/lib/site";
import { serviceSchema, faqPageSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Riparazione rapida teloni per camion — prenotazione online",
  description:
    "Riparazione rapida di teloni per camion: strappi, occhielli, teli tetto. Prenota online nella sede di Angri o Brescia, o scrivici su WhatsApp. Un telo fermo è un mezzo fermo.",
};

const COME_FUNZIONA = [
  { n: "01", t: "Scegli intervento e sede", d: "Dicci cos'è successo al telo e dove ti è più comodo: Angri o Brescia." },
  { n: "02", t: "Prenoti giorno e fascia", d: "Scegli tra le disponibilità del centro il momento che ti serve." },
  { n: "03", t: "Confermiamo e ti aspettiamo", d: "Ti richiamiamo per confermare — anche in giornata per le urgenze." },
];

export default function RiparazioneRapidaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          serviceSchema({
            name: "Riparazione rapida teloni per camion",
            description:
              "Servizio di riparazione rapida di teloni per camion con prenotazione online: strappi, occhielli, cinghie, sostituzione teli tetto.",
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(faqPageSchema(FAQ_RIPARAZIONE))}
      />

      {/* hero */}
      <section className="border-b border-oro/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Servizio · Intervento rapido" />
          <div className="grid items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-6xl">
                Riparazione rapida
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-avorio/80">
                Strappi, fori, occhielli saltati, cinghie da sostituire: un telo fermo è un mezzo fermo. Prenoti
                online, ti diamo un appuntamento e rimetti il camion su strada.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  href="#prenota"
                  className="rounded-md bg-oro px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
                >
                  Prenota online
                </Link>
                <a
                  href={waLink("Ciao Di Riso Teloni, ho bisogno di una riparazione telo.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border-[1.5px] border-avorio/50 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline"
                >
                  Scrivici su WhatsApp
                </a>
              </div>
            </div>
            <div className="grid gap-3">
              {TEMPI.map((t) => (
                <div key={t.label} className="flex items-center gap-5 rounded-lg border border-avorio/[0.14] bg-navy-deep px-6 py-5">
                  <span className="min-w-[110px] font-display text-3xl font-bold text-oro">{t.valore}</span>
                  <span className="text-[15px] text-avorio/80">{t.label}</span>
                </div>
              ))}
              <p className="text-xs text-avorio/40">Tempi indicativi, confermati alla prenotazione.</p>
            </div>
          </div>
        </div>
      </section>

      {/* come funziona */}
      <section className="border-b border-oro/[0.14] bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Come funziona" />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {COME_FUNZIONA.map((s) => (
              <div key={s.n} className="rounded-lg border border-avorio/[0.14] bg-navy p-7">
                <span className="font-display text-2xl font-bold text-oro">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                  {s.t}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-avorio/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* prenotazione */}
      <section id="prenota" className="border-b border-oro/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <SectionKicker label="Prenota online" />
            <h2 className="font-display text-3xl font-bold uppercase leading-tight text-avorio md:text-4xl">
              Scegli quando, ci pensiamo noi
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-avorio/75">
              Disponibilità aggiornate per ciascuna sede. Prenoti in un minuto, senza telefonate: ti
              richiamiamo solo per confermare.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-avorio/60">
              Hai una flotta? Chiedi la <strong className="text-avorio">convenzione flotte</strong> per priorità
              e tariffe dedicate.
            </p>
          </div>
          <Prenotazione />
        </div>
      </section>

      {/* upsell flotte + kit */}
      <section className="border-b border-oro/[0.14] bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-oro/25 bg-navy p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">Per le aziende</span>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase text-avorio">Convenzione flotte</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-avorio/75">
              Se gestisci più mezzi, con la convenzione flotte hai priorità sugli interventi, tariffe dedicate e
              un referente unico per tutte le riparazioni. Meno fermi, costi prevedibili.
            </p>
            <Link href="/contatti" className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-oro no-underline">
              Richiedi la convenzione →
            </Link>
          </div>
          <div className="rounded-lg border border-avorio/[0.14] bg-navy p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">Per le urgenze</span>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase text-avorio">Kit riparazione</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-avorio/75">
              Per le piccole emergenze in viaggio, il kit riparazione fai-da-te ti permette di tamponare uno
              strappo e proseguire in sicurezza, in attesa dell&apos;intervento in sede.
            </p>
            <Link href="/contatti" className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-oro no-underline">
              Chiedi informazioni →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <SectionKicker label="Domande frequenti" center />
          <h2 className="mb-10 text-center font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
            Riparazione: le risposte
          </h2>
          <Faq items={FAQ_RIPARAZIONE} />
        </div>
      </section>
    </main>
  );
}
