// Builds a human-readable summary of the wizard state — only the fields that
// were actually filled for the chosen branch (spec §2, step 9). Pure, no React,
// so it is shared by the Step 9 UI and the server-side email/PDF.

import type { ConfiguratoreState } from "./types";
import { getVisibleSteps } from "./reducer";
import { mezzoLabel } from "./mezzi";
import { macroLabel, sottoOpzioneLabel } from "./richiesta";
import { coloreLabel, personalizzazioneLabel } from "./colore";
import {
  MISURE_BASE,
  MISURE_LATERALI,
  MISURE_TETTO,
  MISURE_PORTELLONE,
  RILIEVO_FIELDS,
} from "./misure";
import {
  contattoLabel,
  extraLabel,
  sedeLabel,
  servizioLabel,
  urgenzaLabel,
} from "./opzioni";

export type RiepilogoRow = { label: string; value: string };
export type RiepilogoSection = { title: string; rows: RiepilogoRow[] };

const CAMPO_LABELS: Record<string, string> = Object.fromEntries(
  [...MISURE_BASE, ...MISURE_LATERALI, ...MISURE_TETTO, ...MISURE_PORTELLONE, ...RILIEVO_FIELDS].map(
    (c) => [c.key, c.label],
  ),
);

const yn = (b: boolean) => (b ? "Sì" : "No");
const basename = (p: string) => p.split("/").pop() ?? p;

/** Collect every uploaded attachment across the wizard as {label, path}. */
export function collectAllegati(state: ConfiguratoreState): { label: string; path: string }[] {
  const out: { label: string; path: string }[] = [];
  if (state.coloreTelo.logoFileName) out.push({ label: "Logo", path: state.coloreTelo.logoFileName });
  if (state.coloreTelo.bozzaFileName) out.push({ label: "Bozza grafica", path: state.coloreTelo.bozzaFileName });
  if (state.misure.campi["foto-misure"]) out.push({ label: "Foto misure", path: state.misure.campi["foto-misure"] });
  const slotLabels: Record<string, string> = {
    "foto-mezzo": "Foto mezzo",
    "foto-telo": "Foto telo attuale",
    "foto-danno": "Foto danno",
    logo: "Logo",
    "bozza-grafica": "Bozza grafica",
    libretto: "Libretto / misure tecniche",
  };
  for (const [slot, path] of Object.entries(state.datiCliente.allegati)) {
    if (path) out.push({ label: slotLabels[slot] ?? slot, path });
  }
  return out;
}

function pushIf(rows: RiepilogoRow[], label: string, value: string | undefined | null) {
  if (value && value.trim() !== "") rows.push({ label, value: value.trim() });
}

export function buildRiepilogo(state: ConfiguratoreState): RiepilogoSection[] {
  const visible = getVisibleSteps(state);
  const sections: RiepilogoSection[] = [];

  // Mezzo
  {
    const rows: RiepilogoRow[] = [];
    pushIf(rows, "Tipologia mezzo", mezzoLabel(state.tipologiaMezzo));
    if (state.tipologiaMezzo === "altro") {
      pushIf(rows, "Specifica mezzo", state.mezzoAltro.specifica);
      pushIf(rows, "Note mezzo", state.mezzoAltro.note);
    }
    if (rows.length) sections.push({ title: "Mezzo", rows });
  }

  // Richiesta
  {
    const rows: RiepilogoRow[] = [];
    pushIf(rows, "Tipo di richiesta", macroLabel(state.macroCategoria));
    if (state.macroCategoria === "accessori") {
      pushIf(rows, "Dettaglio", state.richiestaNote);
    } else {
      pushIf(rows, "Dettaglio", sottoOpzioneLabel(state.macroCategoria, state.sottoOpzione));
    }
    if (rows.length) sections.push({ title: "Richiesta", rows });
  }

  // Colore telo
  if (visible.includes("colore-telo")) {
    const rows: RiepilogoRow[] = [];
    pushIf(rows, "Colore", coloreLabel(state.coloreTelo.colore));
    pushIf(rows, "Personalizzazione", personalizzazioneLabel(state.coloreTelo.personalizzazione));
    pushIf(rows, "Note colore", state.coloreTelo.note);
    if (state.coloreTelo.richiedeBozza) rows.push({ label: "Bozza grafica da noi", value: "Sì" });
    if (rows.length) sections.push({ title: "Colore telo", rows });
  }

  // Misure
  if (visible.includes("misure") && state.misure.modalita) {
    const rows: RiepilogoRow[] = [];
    const modalitaLabel = {
      conosco: "Conosco le misure",
      "richiedo-rilievo": "Richiedo un rilievo",
      "non-sicuro": "Non sono sicuro",
    }[state.misure.modalita];
    pushIf(rows, "Modalità", modalitaLabel);
    const bag = state.misure.modalita === "richiedo-rilievo" ? state.misure.rilievo : state.misure.campi;
    for (const [key, val] of Object.entries(bag)) {
      if (key === "foto-misure") continue; // shown under Allegati
      const label = key === "note" ? "Note" : CAMPO_LABELS[key] ?? key;
      pushIf(rows, label, val);
    }
    if (rows.length) sections.push({ title: "Misure", rows });
  }

  // Extra
  {
    const rows: RiepilogoRow[] = [];
    if (state.extraOptional.length) {
      rows.push({ label: "Optional", value: state.extraOptional.map(extraLabel).join(", ") });
    }
    pushIf(rows, "Esigenze particolari", state.extraNote);
    if (rows.length) sections.push({ title: "Extra e optional", rows });
  }

  // Urgenza
  {
    const rows: RiepilogoRow[] = [];
    pushIf(rows, "Urgenza", state.urgenza.livello ? urgenzaLabel(state.urgenza.livello) : "");
    pushIf(rows, "Data preferita", state.urgenza.dataPreferita);
    if (state.urgenza.mezzoFermo) {
      rows.push({ label: "Mezzo può restare fermo", value: yn(true) });
      pushIf(rows, "Giorni fermo", state.urgenza.giorniFermo);
    }
    pushIf(rows, "Note disponibilità", state.urgenza.note);
    if (rows.length) sections.push({ title: "Urgenza e tempistiche", rows });
  }

  // Sede / zona
  {
    const s = state.sedeZona;
    const rows: RiepilogoRow[] = [];
    pushIf(rows, "Sede / zona", s.sede ? sedeLabel(s.sede) : "");
    pushIf(rows, "Città", s.citta);
    pushIf(rows, "Provincia", s.provincia);
    pushIf(rows, "Indirizzo", s.indirizzo);
    pushIf(rows, "Dove si trova il mezzo", s.dovMezzo);
    if (s.preferenzaMontaggio) {
      pushIf(rows, "Montaggio", s.preferenzaMontaggio === "sede-di-riso" ? "Presso sede Di Riso" : "Presso il cliente");
    }
    if (s.servizi.length) rows.push({ label: "Servizi", value: s.servizi.map(servizioLabel).join(", ") });
    if (rows.length) sections.push({ title: "Sede e zona", rows });
  }

  // Dati cliente
  {
    const d = state.datiCliente;
    const rows: RiepilogoRow[] = [];
    pushIf(rows, "Nome e cognome", d.nomeCognome);
    pushIf(rows, "Azienda", d.azienda);
    pushIf(rows, "Telefono", d.telefono);
    pushIf(rows, "Email", d.email);
    pushIf(rows, "Città", d.citta);
    pushIf(rows, "Provincia", d.provincia);
    pushIf(rows, "P.IVA", d.partitaIva);
    pushIf(rows, "Mezzo (targa/marca/modello/anno)", d.targaMezzo);
    pushIf(rows, "Note", d.note);
    if (d.preferenzaContatto) pushIf(rows, "Preferenza contatto", contattoLabel(d.preferenzaContatto));
    if (d.autorizzoRicontatto) rows.push({ label: "Autorizza ricontatto", value: "Sì" });
    if (d.preventivoSenzaImpegno) rows.push({ label: "Preventivo senza impegno", value: "Sì" });
    if (rows.length) sections.push({ title: "Dati cliente", rows });
  }

  // Allegati
  {
    const allegati = collectAllegati(state);
    if (allegati.length) {
      sections.push({
        title: "Allegati",
        rows: allegati.map((a) => ({ label: a.label, value: basename(a.path) })),
      });
    }
  }

  return sections;
}
