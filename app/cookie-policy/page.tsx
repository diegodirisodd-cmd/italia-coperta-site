import type { Metadata } from "next";
import Link from "next/link";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Come Di Riso Teloni / Italia Coperta usa i cookie e come gestire il consenso.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <>
      <LegalArticle title="Cookie Policy" lastUpdated="15 luglio 2026">
        <p className="text-[15px] leading-relaxed text-avorio/70">
          Questo sito utilizza cookie tecnici necessari al funzionamento del sito stesso e, dove presenti,
          cookie di terze parti strettamente funzionali ai servizi integrati.
        </p>

        <LegalSection heading="Cookie tecnici (sempre attivi)">
          <p>
            Necessari per il funzionamento base del sito: navigazione, memorizzazione delle preferenze sui
            cookie stessi, sicurezza. Non richiedono consenso secondo la normativa vigente.
          </p>
        </LegalSection>

        <LegalSection heading="Cookie di terze parti (funzionali)">
          <p>
            Se utilizzi il configuratore o il modulo di acquisto, Stripe potrebbe impostare cookie tecnici
            necessari a completare la transazione in sicurezza e a prevenire frodi. Consulta l&apos;informativa
            privacy di Stripe:{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary no-underline hover:underline"
            >
              stripe.com/privacy
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection heading="Gestione dei cookie">
          <p>
            Puoi gestire le preferenze sui cookie tramite il banner mostrato alla prima visita, o cancellare i
            cookie già salvati dalle impostazioni del tuo browser in qualsiasi momento.
          </p>
        </LegalSection>
      </LegalArticle>

      <section className="bg-navy-deep px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/preferenze-cookie"
            className="inline-block rounded-md border-[1.5px] border-primary/50 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-primary no-underline transition-colors hover:border-primary"
          >
            Gestisci le preferenze cookie
          </Link>
        </div>
      </section>
    </>
  );
}
