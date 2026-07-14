import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal/LegalPlaceholder";

export const metadata: Metadata = {
  title: "Condizioni d'uso",
  description: "Condizioni d'uso del sito Di Riso Teloni / Italia Coperta.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/condizioni" },
};

export default function CondizioniPage() {
  return (
    <LegalPlaceholder
      title="Condizioni d'uso"
      intro="Termini e condizioni di utilizzo di questo sito e dei suoi servizi online (configuratore, preventivi, prenotazioni)."
    />
  );
}
