// Catalogue for STEP 4 — Misure / rilievo (spec §2). Pure data, no React.

import type { MacroCategoria } from "./types";

export type CampoDef = {
  key: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
  /** Unit shown inside the field (e.g. "cm"). */
  suffix?: string;
};

/** Base measures — always shown in the "conosco le misure" branch. */
export const MISURE_BASE: CampoDef[] = [
  { key: "lunghezza-telo", label: "Lunghezza telo", type: "number", suffix: "cm" },
  { key: "altezza-telo", label: "Altezza telo", type: "number", suffix: "cm" },
  { key: "larghezza-mezzo", label: "Larghezza mezzo", type: "number", suffix: "cm" },
  { key: "altezza-da-terra", label: "Altezza da terra", type: "number", suffix: "cm" },
  { key: "numero-centine", label: "N. centine / piantoni", type: "number" },
];

export const MISURE_LATERALI: CampoDef[] = [
  { key: "lat-dx-lunghezza", label: "Laterale dx — lunghezza", type: "number", suffix: "cm" },
  { key: "lat-dx-altezza", label: "Laterale dx — altezza", type: "number", suffix: "cm" },
  { key: "lat-sx-lunghezza", label: "Laterale sx — lunghezza", type: "number", suffix: "cm" },
  { key: "lat-sx-altezza", label: "Laterale sx — altezza", type: "number", suffix: "cm" },
];

export const MISURE_TETTO: CampoDef[] = [
  { key: "tetto-lunghezza", label: "Tetto — lunghezza", type: "number", suffix: "cm" },
  { key: "tetto-larghezza", label: "Tetto — larghezza", type: "number", suffix: "cm" },
  { key: "tetto-struttura", label: "Tipo struttura", type: "text", placeholder: "Es. centinato, fisso…" },
  { key: "tetto-travetti", label: "N. travetti / compassi", type: "number" },
];

export const MISURE_PORTELLONE: CampoDef[] = [
  { key: "post-larghezza", label: "Posteriore — larghezza", type: "number", suffix: "cm" },
  { key: "post-altezza", label: "Posteriore — altezza", type: "number", suffix: "cm" },
  { key: "post-chiusura", label: "Tipo chiusura", type: "text", placeholder: "Es. portellone, telo…" },
  { key: "post-barre", label: "Presenza barre", type: "text", placeholder: "Sì / No / quante" },
];

/** Fields for the "richiedo rilievo" branch. */
export const RILIEVO_FIELDS: CampoDef[] = [
  { key: "citta", label: "Città", type: "text" },
  { key: "provincia", label: "Provincia", type: "text" },
  { key: "mezzo-in-sede", label: "Mezzo disponibile in sede?", type: "text", placeholder: "Sì / No / dove" },
  { key: "giorni", label: "Giorni preferiti", type: "text", placeholder: "Es. lun–mer" },
  { key: "fascia-oraria", label: "Fascia oraria preferita", type: "text", placeholder: "Mattina / pomeriggio" },
];

export type MisureZone = { laterali: boolean; tetto: boolean; portellone: boolean };

/**
 * Which conditional measure groups to show, derived from the step-2 choice:
 *  - telo-completo → tetto + laterali (+ posteriore when "…+ posteriore")
 *  - solo-laterali / solo-tetto / portellone → the matching group
 *  - sostituzione / accessori → base only
 */
export function zonesForMisure(macro: MacroCategoria | null, sotto: string | null): MisureZone {
  switch (macro) {
    case "telo-completo":
      return { laterali: true, tetto: true, portellone: sotto === "tetto-laterali-posteriore" };
    case "solo-laterali":
      return { laterali: true, tetto: false, portellone: false };
    case "solo-tetto":
      return { laterali: false, tetto: true, portellone: false };
    case "portellone":
      return { laterali: false, tetto: false, portellone: true };
    default:
      return { laterali: false, tetto: false, portellone: false };
  }
}
