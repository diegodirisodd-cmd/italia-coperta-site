import type { Metadata } from "next";
import { SectionKicker } from "@/components/SectionKicker";
import { RichiestaForm } from "@/components/contatti/RichiestaForm";
import { WHATSAPP_DISPLAY, TEL_ANGRI, TEL_BRESCIA, EMAIL, waLink } from "@/lib/site";
import { localBusinessSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Contatti — sedi Angri (SA) e Brescia, WhatsApp",
  description:
    "Contatta Di Riso Teloni: sede principale ad Angri (SA), Via dei Goti 183, e sede Nord a Brescia. Scrivici su WhatsApp, per email o compila il form.",
};

const SEDI = [
  {
    nome: "Angri (SA)",
    ruolo: "Sede principale",
    indirizzo: "Via dei Goti 183, Angri (SA)",
    servizi: "Produzione · Vendita · Riparazione · Configuratore",
    tel: TEL_ANGRI,
  },
  {
    nome: "Brescia",
    ruolo: "Sede Nord",
    indirizzo: "Brescia", // TODO: indirizzo completo Brescia
    servizi: "Produzione · Vendita · Riparazione rapida",
    tel: TEL_BRESCIA,
  },
];

export default function ContattiPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(localBusinessSchema())}
      />

      {/* hero */}
      <section className="border-b border-oro/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Parliamone" />
          <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-6xl">
            Contatti
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-avorio/80">
            Due sedi produttive e un servizio attivo in tutta Italia. Scrivici su WhatsApp per una risposta
            veloce, chiamaci o compila il form: ti ricontattiamo noi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href={waLink("Ciao Di Riso Teloni, avrei una richiesta.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-oro px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
            >
              Scrivici su WhatsApp
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="rounded-md border-[1.5px] border-avorio/50 px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline"
            >
              {EMAIL}
            </a>
          </div>
        </div>
      </section>

      {/* sedi + form */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="flex flex-col gap-5">
            {SEDI.map((s) => (
              <div key={s.nome} className="rounded-lg border border-oro/25 bg-navy p-7">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">{s.ruolo}</span>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase text-avorio">{s.nome}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-avorio/80">{s.indirizzo}</p>
                <p className="mt-1 text-[14px] text-oro">{s.servizi}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`tel:${s.tel.replace(/\s/g, "")}`}
                    className="font-display text-lg font-semibold tracking-[0.03em] text-avorio no-underline"
                  >
                    {s.tel}
                  </a>
                </div>
              </div>
            ))}
            <p className="text-xs text-avorio/40">
              WhatsApp: {WHATSAPP_DISPLAY} · telefoni sedi e indirizzo Brescia in aggiornamento.
            </p>
          </div>
          <RichiestaForm tipo="contatto" />
        </div>
      </section>
    </main>
  );
}
