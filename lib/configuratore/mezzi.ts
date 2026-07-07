// Catalogue for STEP 1 — Tipologia mezzo (spec §2).
// Pure data, no React, so it can be shared by the step UI and any server-side
// summary/label lookup later.

import type { TipologiaMezzoId } from "./types";

export type MezzoCard = {
  id: TipologiaMezzoId;
  label: string;
  /** Short two-line description shown under the title. */
  descrizione: string;
  /**
   * Studio photo in /public/images/mezzi/ (4:3, uniform light background).
   * `null` → render a generic icon placeholder instead of a photo:
   *  - semirimorchio: dedicated photo still pending from Diego
   *  - altro: open-ended category, never gets a photo
   */
  image: string | null;
  imageAlt?: string;
  /** Caption for the icon placeholder when image is null. */
  placeholderCaption?: string;
};

export const MEZZI: MezzoCard[] = [
  {
    id: "bilico-centinato",
    label: "Bilico centinato",
    descrizione: "Motrice e semirimorchio, telone ad archi apribile a soffietto.",
    image: "/images/mezzi/bilico-centinato.jpg",
    imageAlt: "Bilico centinato con telone ad archi",
  },
  {
    id: "motrice-telonata",
    label: "Motrice telonata",
    descrizione: "Camion rigido con cabina e cassone telonato.",
    image: "/images/mezzi/motrice-telonata.jpg",
    imageAlt: "Motrice telonata con cassone",
  },
  {
    id: "rimorchio-telonato",
    label: "Rimorchio telonato",
    descrizione: "Rimorchio con timone e corpo telonato.",
    image: "/images/mezzi/rimorchio-telonato.jpg",
    imageAlt: "Rimorchio telonato con timone",
  },
  {
    id: "furgone-centinato",
    label: "Furgone centinato",
    descrizione: "Furgone leggero con cassone centinato.",
    image: "/images/mezzi/furgone-centinato.jpg",
    imageAlt: "Furgone centinato con cassone telonato",
  },
  {
    id: "semirimorchio-collo-doca",
    label: "Semirimorchio collo d'oca",
    descrizione: "Pianale ribassato per trasporti eccezionali.",
    image: null,
    placeholderCaption: "Foto in arrivo",
  },
  {
    id: "altro",
    label: "Altro mezzo",
    descrizione: "Mezzo speciale o non in elenco: lo descrivi tu.",
    image: null,
    placeholderCaption: "Mezzo speciale",
  },
];

export function mezzoLabel(id: TipologiaMezzoId | null): string {
  return MEZZI.find((m) => m.id === id)?.label ?? "—";
}
