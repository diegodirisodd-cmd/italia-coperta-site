import { SectionKicker } from "@/components/SectionKicker";
import { AZIENDA, EMAIL } from "@/lib/site";

/**
 * Placeholder scaffold for the legal pages (privacy, cookie policy, terms) until
 * the real legal text is provided. Still names the data controller / company so
 * the pages are usable in the meantime.
 */
export function LegalPlaceholder({ title, intro }: { title: string; intro: string }) {
  return (
    <main className="bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <SectionKicker label="Note legali" />
        <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-avorio/80">{intro}</p>

        <div className="mt-8 rounded-lg border border-primary/25 bg-navy p-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Documento in arrivo
          </span>
          <p className="mt-2 text-[15px] leading-relaxed text-avorio/70">
            Il testo completo di questa informativa è in fase di redazione e sarà pubblicato a breve. Nel
            frattempo, per qualsiasi richiesta puoi scriverci a{" "}
            <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </div>

        <div className="mt-8 border-t border-avorio/10 pt-6 text-sm leading-relaxed text-avorio/55">
          <p className="font-semibold text-avorio/70">Titolare del trattamento</p>
          <p className="mt-1">
            {AZIENDA.ragioneSociale} — {AZIENDA.gruppo}
          </p>
          <p>Sede legale: {AZIENDA.sedeLegale}</p>
          <p>
            P.IVA / C.F. {AZIENDA.piva} · REA {AZIENDA.rea} · Cap. soc. {AZIENDA.capitaleSociale}
          </p>
          <p>
            PEC:{" "}
            <a href={`mailto:${AZIENDA.pec}`} className="no-underline hover:text-avorio">
              {AZIENDA.pec}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
