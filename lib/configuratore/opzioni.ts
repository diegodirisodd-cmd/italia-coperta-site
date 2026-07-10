// Catalogues for STEP 5–8 (spec §2). Pure data, no React.

import type { PreferenzaContatto, SedeZonaId, UrgenzaLivello } from "./types";

export type Opzione = { id: string; label: string };

/* STEP 5 — Extra e optional (fixed multi-select list) */
export const EXTRA_OPTIONAL: Opzione[] = [
  { id: "carrucole-scorrimento", label: "Carrucole di scorrimento" },
  { id: "cinghie", label: "Cinghie verticali / longitudinali" },
  { id: "rinforzi-piantoni", label: "Rinforzi su piantoni / travetti-compassi" },
  { id: "banda-riflettente", label: "Banda riflettente lineare / angolare" },
  { id: "tenditori-inox", label: "Tenditori inox" },
  { id: "occhielli", label: "Occhielli" },
  { id: "cricchetti", label: "Cricchetti" },
  { id: "ganci", label: "Ganci" },
  { id: "saldature-rinforzate", label: "Saldature rinforzate" },
  { id: "cuciture-rinforzate", label: "Cuciture rinforzate" },
  { id: "bordatura", label: "Bordatura perimetrale" },
  { id: "pvc-alta-grammatura", label: "PVC alta grammatura" },
  { id: "telo-lucido-opaco", label: "Telo lucido / opaco" },
  { id: "stampa-digitale", label: "Stampa digitale" },
  { id: "applicazione-logo", label: "Applicazione logo" },
  { id: "montaggio", label: "Montaggio" },
  { id: "smontaggio-vecchio", label: "Smontaggio vecchio telo" },
  { id: "smaltimento-vecchio", label: "Smaltimento vecchio telo" },
  { id: "intervento-urgente", label: "Intervento urgente" },
  { id: "materiale-spedizione", label: "Materiale pronto per spedizione" },
  { id: "installazione-sede-cliente", label: "Installazione sede / cliente" },
];

/* STEP 6 — Urgenza (single-select) */
export const URGENZA_LIVELLI: { id: UrgenzaLivello; label: string }[] = [
  { id: "nessuna", label: "Nessuna urgenza" },
  { id: "entro-30gg", label: "Entro 30 giorni" },
  { id: "entro-15gg", label: "Entro 15 giorni" },
  { id: "entro-7gg", label: "Entro 7 giorni" },
  { id: "urgente", label: "Urgente" },
  { id: "mezzo-fermo", label: "Mezzo fermo" },
  { id: "da-concordare", label: "Da concordare" },
];

/* STEP 7 — Sede / zona (single-select) */
export const SEDI_ZONA: { id: SedeZonaId; label: string; desc: string }[] = [
  { id: "angri", label: "Angri (SA)", desc: "Sede principale" },
  { id: "lombardia", label: "Lombardia", desc: "Area Nord" },
  { id: "altro", label: "Altro punto in Italia", desc: "Ti assegniamo il centro più vicino." },
  { id: "presso-cliente", label: "Servizio presso mia sede", desc: "Interveniamo da te." },
  { id: "da-definire", label: "Da definire", desc: "Ne parliamo insieme." },
];

export const SERVIZI: Opzione[] = [
  { id: "produzione", label: "Produzione" },
  { id: "montaggio", label: "Montaggio" },
  { id: "riparazione", label: "Riparazione" },
  { id: "rilievo", label: "Rilievo misure" },
  { id: "assistenza", label: "Assistenza" },
  { id: "spedizione", label: "Spedizione materiale" },
];

/* STEP 8 — Dati cliente */
export const PREFERENZE_CONTATTO: { id: PreferenzaContatto; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telefonata", label: "Telefonata" },
  { id: "email", label: "Email" },
];

/** Upload slots on the customer-data step. */
export const ALLEGATI_SLOT: Opzione[] = [
  { id: "foto-mezzo", label: "Foto mezzo" },
  { id: "foto-telo", label: "Foto telo attuale" },
  { id: "foto-danno", label: "Foto danno" },
  { id: "logo", label: "Logo" },
  { id: "bozza-grafica", label: "Bozza grafica" },
  { id: "libretto", label: "Libretto / misure tecniche" },
];

/* Label lookups for the summary step (Block 6). */
export function extraLabel(id: string): string {
  return EXTRA_OPTIONAL.find((o) => o.id === id)?.label ?? id;
}
export function urgenzaLabel(id: UrgenzaLivello | null): string {
  return URGENZA_LIVELLI.find((o) => o.id === id)?.label ?? "—";
}
export function sedeLabel(id: SedeZonaId | null): string {
  return SEDI_ZONA.find((o) => o.id === id)?.label ?? "—";
}
export function servizioLabel(id: string): string {
  return SERVIZI.find((o) => o.id === id)?.label ?? id;
}
export function contattoLabel(id: PreferenzaContatto | null): string {
  return PREFERENZE_CONTATTO.find((o) => o.id === id)?.label ?? "—";
}
