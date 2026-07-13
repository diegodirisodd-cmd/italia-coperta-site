// Site-wide contact constants.
// WhatsApp business: +39 352 033 1778 (wa.me wants no "+"/spaces → 393520331778).
export const WHATSAPP_NUMBER = "393520331778";
export const WHATSAPP_DISPLAY = "+39 352 033 1778";
export const EMAIL = "dirisoteloniitalia@dodiitalia.it";

// PLACEHOLDERS still pending real data (see TODO.md).
export const TEL_ANGRI = "081 000 0000"; // TODO: telefono reale sede Angri
export const TEL_BRESCIA = "030 000 0000"; // TODO: telefono reale sede Brescia

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
