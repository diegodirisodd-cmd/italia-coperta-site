import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";
import { AZIENDA, EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sul trattamento dei dati personali di Di Riso Teloni / Italia Coperta.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalArticle title="Privacy Policy" lastUpdated="15 luglio 2026">
      <LegalSection heading="Titolare del trattamento">
        <p>{AZIENDA.ragioneSociale}</p>
        <p>Sede: {AZIENDA.sedeLegale}</p>
        <p>
          P.IVA/CF: {AZIENDA.piva} — REA {AZIENDA.rea}
        </p>
        <p>
          PEC:{" "}
          <a href={`mailto:${AZIENDA.pec}`} className="text-primary no-underline hover:underline">
            {AZIENDA.pec}
          </a>
        </p>
        <p>
          Email:{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
            {EMAIL}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Dati raccolti e finalità">
        <p>
          Raccogliamo dati personali esclusivamente per le finalità connesse ai servizi richiesti attraverso
          questo sito:
        </p>

        <p>
          <strong className="font-semibold text-avorio/90">Richiesta preventivo e configuratore online</strong>
          <br />
          Nome, ragione sociale, email, numero di telefono, indirizzo, dettagli della richiesta (tipo di
          lavorazione, misure, colore) ed eventuali fotografie caricate volontariamente dall&apos;utente per la
          valutazione del lavoro. Base giuridica: esecuzione di misure precontrattuali su richiesta
          dell&apos;interessato (art. 6.1.b GDPR).
        </p>

        <p>
          <strong className="font-semibold text-avorio/90">Prenotazione riparazione rapida</strong>
          <br />
          Nome, contatti, dettagli del mezzo e del problema segnalato. Stessa base giuridica del punto
          precedente.
        </p>

        <p>
          <strong className="font-semibold text-avorio/90">Candidatura come centro partner</strong>
          <br />
          Dati aziendali e di contatto forniti volontariamente per la valutazione della candidatura.
        </p>

        <p>
          <strong className="font-semibold text-avorio/90">Acquisto prodotti (shop online)</strong>
          <br />
          L&apos;acquisto viene elaborato interamente da Stripe, fornitore terzo specializzato in pagamenti
          online. Non riceviamo né conserviamo i dati della tua carta di pagamento. Riceviamo solo i dati
          necessari a evadere l&apos;ordine: nome, indirizzo di spedizione, email, eventuale numero di
          telefono. Base giuridica: esecuzione del contratto di vendita (art. 6.1.b GDPR).
        </p>

        <p>
          <strong className="font-semibold text-avorio/90">Recensioni</strong>
          <br />
          Le recensioni mostrate sul sito provengono dalla nostra scheda Google Business Profile pubblica e
          sono pubblicate da terzi in autonomia su Google; non raccogliamo né pubblichiamo recensioni per conto
          degli utenti attraverso questo sito.
        </p>
      </LegalSection>

      <LegalSection heading="Conservazione dei dati">
        <p>
          I dati vengono conservati per il tempo necessario a evadere la richiesta e, per obblighi
          contabili/fiscali relativi a ordini e fatturazione, per il periodo previsto dalla normativa vigente
          (10 anni per la documentazione fiscale, art. 2220 c.c.).
        </p>
      </LegalSection>

      <LegalSection heading="Soggetti terzi che trattano i dati (responsabili del trattamento)">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-avorio/90">Supabase</strong> (hosting database, UE — regione
            eu-central-1): conservazione strutturata delle richieste
          </li>
          <li>
            <strong className="font-semibold text-avorio/90">Resend</strong>: invio delle email di conferma e
            notifica
          </li>
          <li>
            <strong className="font-semibold text-avorio/90">Stripe</strong>: elaborazione dei pagamenti online
          </li>
          <li>
            <strong className="font-semibold text-avorio/90">Vercel</strong>: hosting ed erogazione del sito
          </li>
        </ul>
        <p>
          Questi fornitori operano in qualità di responsabili del trattamento o, per i trasferimenti extra-UE
          eventualmente necessari al loro funzionamento, adottano garanzie adeguate previste dal GDPR (clausole
          contrattuali standard).
        </p>
      </LegalSection>

      <LegalSection heading="Diritti dell'interessato">
        <p>
          Hai diritto di accedere ai tuoi dati, richiederne la rettifica, la cancellazione, la limitazione del
          trattamento, la portabilità, e di opporti al trattamento, scrivendo a{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
            {EMAIL}
          </a>
          . Hai inoltre diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary no-underline hover:underline"
          >
            www.garanteprivacy.it
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection heading="Modifiche">
        <p>
          Questa informativa può essere aggiornata; la data di ultimo aggiornamento è indicata in cima alla
          pagina.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
