import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal/LegalPlaceholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sul trattamento dei dati personali di Di Riso Teloni / Italia Coperta.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPlaceholder
      title="Privacy Policy"
      intro="Informativa sul trattamento dei dati personali raccolti tramite questo sito (form di contatto, preventivo, configuratore e prenotazioni)."
    />
  );
}
