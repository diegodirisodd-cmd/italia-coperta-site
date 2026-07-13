// Catalogue for STEP 3 — Colore telo (spec §2). Pure data, no React.

import type { PersonalizzazioneTelo } from "./types";

export type ColoreTelo = {
  id: string;
  label: string;
  /** Swatch colour. `null` for the two non-colour options (custom / to define),
   *  which render a special swatch instead. */
  hex: string | null;
  special?: "custom" | "da-definire";
};

export const COLORI_TELO: ColoreTelo[] = [
  { id: "bianco", label: "Bianco", hex: "#F4F1EA" },
  { id: "grigio-chiaro", label: "Grigio chiaro", hex: "#C2C7CE" },
  { id: "grigio-scuro", label: "Grigio scuro", hex: "#565B63" },
  { id: "nero", label: "Nero", hex: "#14161B" },
  { id: "blu", label: "Blu", hex: "#1E5AA8" },
  { id: "blu-navy", label: "Blu navy", hex: "#12335C" },
  { id: "rosso", label: "Rosso", hex: "#C1272D" },
  { id: "verde", label: "Verde", hex: "#2E6B3B" },
  { id: "giallo", label: "Giallo", hex: "#E7B924" },
  { id: "beige", label: "Beige / crema", hex: "#DDCDA6" },
  { id: "personalizzato", label: "Colore personalizzato", hex: null, special: "custom" },
  { id: "da-definire", label: "Da definire con consulente", hex: null, special: "da-definire" },
];

export type PersonalizzazioneOption = { id: PersonalizzazioneTelo; label: string };

export const PERSONALIZZAZIONI: PersonalizzazioneOption[] = [
  { id: "tinta-unita", label: "Tinta unita" },
  { id: "logo-aziendale", label: "Con logo aziendale" },
  { id: "grafica-pubblicitaria", label: "Con grafica pubblicitaria" },
  { id: "da-valutare", label: "Da valutare" },
];

/** Branding personalizations that need logo / artwork uploads + notes. */
export function personalizzazioneRichiedeUpload(p: PersonalizzazioneTelo | null): boolean {
  return p === "logo-aziendale" || p === "grafica-pubblicitaria";
}

export function coloreLabel(id: string | null): string {
  return COLORI_TELO.find((c) => c.id === id)?.label ?? "—";
}

export function personalizzazioneLabel(id: PersonalizzazioneTelo | null): string {
  return PERSONALIZZAZIONI.find((p) => p.id === id)?.label ?? "—";
}
