// Site-wide contact constants.
// WhatsApp business: +39 352 033 1778 (wa.me wants no "+"/spaces → 393520331778).
export const WHATSAPP_NUMBER = "393520331778";
export const WHATSAPP_DISPLAY = "+39 352 033 1778";
export const EMAIL = "dirisoteloniitalia@dodiitalia.it";

// Single phone line for direct calls — same number as WhatsApp.
export const TEL_DISPLAY = "+39 352 033 1778";

// Legal entity (visura CCIAA Salerno). The billing/operating company behind the
// "Di Riso Teloni" / "Italia Coperta" brand.
export const AZIENDA = {
  ragioneSociale: "DODI Pubblicità Dinamica S.R.L.S.",
  gruppo: "parte del Gruppo Commerciale Partenopea",
  sedeLegale: "Via dei Goti 183, 84012 Angri (SA)",
  piva: "06207010650",
  rea: "SA-505437",
  pec: "dodipubblicita@pec.it",
  capitaleSociale: "€ 1.500,00 i.v.",
} as const;

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
