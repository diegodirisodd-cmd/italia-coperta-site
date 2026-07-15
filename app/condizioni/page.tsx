import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";
import { AZIENDA, EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Condizioni d'uso",
  description: "Condizioni d'uso del sito Di Riso Teloni / Italia Coperta.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/condizioni" },
};

export default function CondizioniPage() {
  return (
    <LegalArticle title="Termini e Condizioni" lastUpdated="15 luglio 2026">
      <LegalSection heading="1. Oggetto">
        <p>
          Le presenti condizioni regolano l&apos;utilizzo del sito dirisoteloni1950.com e i rapporti tra{" "}
          {AZIENDA.ragioneSociale} (di seguito &quot;Di Riso Teloni&quot;) e chiunque richieda un preventivo,
          prenoti un servizio, o acquisti un prodotto attraverso questo sito. Utilizzando il sito o effettuando
          un acquisto, accetti integralmente questi termini.
        </p>
      </LegalSection>

      <LegalSection heading="2. Chi siamo">
        <p>{AZIENDA.ragioneSociale}</p>
        <p>Sede: {AZIENDA.sedeLegale}</p>
        <p>
          P.IVA/CF: {AZIENDA.piva} — REA {AZIENDA.rea}
        </p>
        <p>
          PEC:{" "}
          <a href={`mailto:${AZIENDA.pec}`} className="text-primary no-underline hover:underline">
            {AZIENDA.pec}
          </a>{" "}
          — Email:{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
            {EMAIL}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="3. Preventivi e configuratore online">
        <p>
          Le richieste di preventivo inviate tramite il configuratore, il modulo preventivo o la prenotazione
          riparazione rapida non costituiscono un ordine vincolante né un contratto: sono una richiesta di
          valutazione. Il preventivo definitivo (prezzo, tempi, fattibilità) viene comunicato successivamente
          da Di Riso Teloni e diventa vincolante solo dopo conferma esplicita da entrambe le parti.
        </p>
      </LegalSection>

      <LegalSection heading="4. Vendita di prodotti online (shop)">
        <p>
          <strong className="font-semibold text-avorio/90">4.1 Prezzi e pagamento.</strong> I prezzi dei
          prodotti indicati sul sito sono espressi in Euro. Il pagamento avviene esclusivamente tramite
          Stripe, fornitore terzo di servizi di pagamento — Di Riso Teloni non riceve né conserva i dati della
          tua carta.
        </p>
        <p>
          <strong className="font-semibold text-avorio/90">4.2 Spedizione.</strong> I costi e i tempi di
          spedizione sono indicati chiaramente prima della conclusione dell&apos;acquisto. Gli ordini vengono
          spediti dopo la conferma del pagamento.
        </p>
        <p>
          <strong className="font-semibold text-avorio/90">4.3 Diritto di recesso.</strong> Se acquisti come
          consumatore (persona fisica che agisce per scopi estranei alla propria attività professionale), hai
          diritto di recedere dal contratto entro 14 giorni dal ricevimento del prodotto, senza necessità di
          motivazione, ai sensi degli artt. 52-59 del Codice del Consumo. Per esercitare il recesso scrivi a{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
            {EMAIL}
          </a>
          . Il prodotto va restituito integro, nella confezione originale se possibile; le spese di
          restituzione sono a carico del cliente salvo diversamente concordato. Il rimborso avviene entro 14
          giorni dalla ricezione del reso.
        </p>
        <p>
          <strong className="font-semibold text-avorio/90">4.4 Garanzia legale di conformità.</strong> Tutti i
          prodotti venduti sono coperti dalla garanzia legale di conformità di 24 mesi prevista dagli artt.
          128-135 del Codice del Consumo per i consumatori. Per difetti riscontrati, contatta{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
            {EMAIL}
          </a>
          .
        </p>
        <p>
          <strong className="font-semibold text-avorio/90">4.5 Clienti professionali (B2B).</strong> Per
          acquisti effettuati da imprese o professionisti nell&apos;esercizio della propria attività, il
          diritto di recesso di cui al punto 4.3 non si applica automaticamente; restano validi gli accordi
          commerciali specifici concordati caso per caso.
        </p>
      </LegalSection>

      <LegalSection heading="5. Servizi di produzione e riparazione">
        <p>
          I lavori di produzione, riparazione o personalizzazione di teloni, coperture e allestimenti vengono
          eseguiti secondo le specifiche concordate nel preventivo confermato. Tempi di consegna e modalità di
          ritiro/consegna del mezzo vengono comunicati caso per caso in base alla lavorazione richiesta.
        </p>
      </LegalSection>

      <LegalSection heading="6. Recensioni">
        <p>
          Le recensioni mostrate sul sito provengono dalla scheda Google Business Profile pubblica di Di Riso
          Teloni, pubblicate autonomamente dagli utenti su Google. Di Riso Teloni non altera né seleziona le
          recensioni mostrate se non nella scelta di quali estratti evidenziare a scopo illustrativo,
          rimanendo sempre fedele al contenuto originale.
        </p>
      </LegalSection>

      <LegalSection heading="7. Proprietà intellettuale">
        <p>
          Contenuti, testi, immagini, marchio e logo presenti sul sito sono di proprietà di Di Riso Teloni o
          utilizzati con relativa autorizzazione. È vietata la riproduzione non autorizzata.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitazione di responsabilità">
        <p>
          Di Riso Teloni non è responsabile per disservizi del sito dovuti a cause di forza maggiore,
          manutenzione tecnica o problemi dei fornitori di hosting e servizi terzi (Vercel, Supabase, Stripe,
          Resend).
        </p>
      </LegalSection>

      <LegalSection heading="9. Legge applicabile e foro competente">
        <p>
          Le presenti condizioni sono regolate dalla legge italiana. Per le controversie con consumatori è
          competente il foro del luogo di residenza o domicilio del consumatore, se in Italia; per le
          controversie con clienti professionali è competente il Foro di Salerno.
        </p>
      </LegalSection>

      <LegalSection heading="10. Modifiche">
        <p>
          Queste condizioni possono essere aggiornate; la versione in vigore è sempre quella pubblicata su
          questa pagina, con data di ultimo aggiornamento indicata in cima.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contatti">
        <p>
          Per qualsiasi domanda su questi termini:{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary no-underline hover:underline">
            {EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
