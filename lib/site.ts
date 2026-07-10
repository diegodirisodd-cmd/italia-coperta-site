// Site-wide contact constants.
// WhatsApp business: +39 352 033 1778 (wa.me wants no "+"/spaces → 393520331778).
export const WHATSAPP_NUMBER = "393520331778";
export const WHATSAPP_DISPLAY = "+39 352 033 1778";
export const EMAIL = "dirisoteloniitalia@dodiitalia.it";

// Single phone line for direct calls — same number as WhatsApp.
export const TEL_DISPLAY = "+39 352 033 1778";

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
