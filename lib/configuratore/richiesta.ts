// Catalogue for STEP 2 — Tipo di richiesta (spec §2).
// Two levels: macro categories (single-select) and macro-conditional
// sub-options, plus the dynamic highlight-image mapping. Pure data (no React).

import type { MacroCategoria } from "./types";

export type MacroCard = {
  id: MacroCategoria;
  label: string;
  descrizione: string;
};

/** Level 1 — macro categories, in spec order. */
export const MACRO_CATEGORIE: MacroCard[] = [
  { id: "telo-completo", label: "Telo completo", descrizione: "Tetto, laterali ed eventuale posteriore." },
  { id: "solo-laterali", label: "Solo laterali", descrizione: "Una o entrambe le fiancate." },
  { id: "solo-tetto", label: "Solo tetto", descrizione: "Copertura superiore del mezzo." },
  { id: "portellone", label: "Portellone / posteriore", descrizione: "Chiusura o telo posteriore." },
  { id: "riparazione", label: "Riparazione", descrizione: "Danni, strappi, componenti da sistemare." },
  { id: "sostituzione", label: "Sostituzione componenti", descrizione: "Ricambi di carrucole, cinghie, occhielli…" },
  { id: "accessori", label: "Accessori vari", descrizione: "Altre esigenze o componenti aggiuntivi." },
];

export type SottoOpzione = { id: string; label: string };

/**
 * Level 2 — sub-options conditional on the macro category. `accessori` has no
 * fixed list (free-text instead), so its array is empty.
 */
export const SOTTO_OPZIONI: Record<MacroCategoria, SottoOpzione[]> = {
  "telo-completo": [
    { id: "tetto-laterali", label: "Tetto + laterali" },
    { id: "tetto-laterali-posteriore", label: "Tetto + laterali + posteriore" },
  ],
  "solo-laterali": [
    { id: "coppia", label: "Coppia laterali" },
    { id: "destro", label: "Solo destro" },
    { id: "sinistro", label: "Solo sinistro" },
  ],
  "solo-tetto": [
    { id: "scorrevole", label: "Tetto scorrevole" },
    { id: "fisso", label: "Tetto fisso" },
    { id: "copri-scopri", label: "Tetto copri-scopri" },
  ],
  portellone: [
    { id: "telo-posteriore", label: "Telo posteriore" },
    { id: "chiusura-posteriore", label: "Chiusura posteriore" },
    { id: "personalizzato", label: "Portellone personalizzato" },
  ],
  riparazione: [
    { id: "strappo-foro", label: "Strappo o foro" },
    { id: "occhielli-saltati", label: "Occhielli saltati" },
    { id: "cinghie-rotte", label: "Cinghie rotte" },
    { id: "telo-consumato", label: "Telo consumato" },
    { id: "cuciture-aperte", label: "Cuciture aperte" },
    { id: "carrucole-danneggiate", label: "Carrucole danneggiate" },
    { id: "rinforzi-da-rifare", label: "Rinforzi da rifare" },
    { id: "altro-danno", label: "Altro danno" },
  ],
  sostituzione: [
    { id: "carrucole", label: "Carrucole" },
    { id: "cinghie", label: "Cinghie" },
    { id: "tenditori", label: "Tenditori" },
    { id: "occhielli", label: "Occhielli" },
    { id: "cricchetti", label: "Cricchetti" },
    { id: "banda-riflettente", label: "Banda riflettente" },
  ],
  accessori: [],
};

/** True when the macro category offers a fixed sub-option list. */
export function hasSottoOpzioni(macro: MacroCategoria): boolean {
  return SOTTO_OPZIONI[macro].length > 0;
}

export function sottoOpzioneLabel(macro: MacroCategoria | null, id: string | null): string {
  if (!macro || !id) return "—";
  return SOTTO_OPZIONI[macro].find((o) => o.id === id)?.label ?? id;
}

export function macroLabel(macro: MacroCategoria | null): string {
  return MACRO_CATEGORIE.find((m) => m.id === macro)?.label ?? "—";
}

/* -------------------------------------------------------------------------- */
/* Dynamic visual feedback (spec §2)                                           */
/* -------------------------------------------------------------------------- */

export type HighlightImage = { src: string; alt: string; caption: string };

const HIGHLIGHT = {
  tetto: {
    src: "/images/configuratore/highlight-tetto.jpg",
    alt: "Mezzo con il tetto evidenziato",
    caption: "Tetto evidenziato",
  },
  laterali: {
    src: "/images/configuratore/highlight-laterali.jpg",
    alt: "Mezzo con la fiancata evidenziata",
    caption: "Fiancata evidenziata",
  },
  posteriore: {
    src: "/images/configuratore/highlight-posteriore.jpg",
    alt: "Mezzo con il pannello posteriore evidenziato",
    caption: "Posteriore evidenziato",
  },
  riparazione: {
    src: "/images/configuratore/riparazione-strappo-esempio.jpg",
    alt: "Esempio illustrativo di strappo e rattoppo del telo",
    caption: "Esempio: strappo e rattoppo",
  },
} satisfies Record<string, HighlightImage>;

/**
 * Support image shown next to the options, driven by the current macro +
 * sub-option (spec §2 mapping):
 *  - solo-tetto / solo-laterali / portellone → the matching LED highlight
 *  - telo-completo → laterali by default, posteriore when the "+ posteriore"
 *    sub-option is chosen (responsive feedback rather than a fixed image)
 *  - riparazione → the illustrative strappo/rattoppo image (no LED)
 *  - sostituzione / accessori → no dedicated image (returns null)
 */
export function getHighlightImage(
  macro: MacroCategoria | null,
  sotto: string | null,
): HighlightImage | null {
  switch (macro) {
    case "solo-tetto":
      return HIGHLIGHT.tetto;
    case "solo-laterali":
      return HIGHLIGHT.laterali;
    case "portellone":
      return HIGHLIGHT.posteriore;
    case "telo-completo":
      return sotto === "tetto-laterali-posteriore" ? HIGHLIGHT.posteriore : HIGHLIGHT.laterali;
    case "riparazione":
      return HIGHLIGHT.riparazione;
    default:
      return null; // sostituzione, accessori, or nothing selected
  }
}
