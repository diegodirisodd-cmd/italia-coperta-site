// Wizard type model for the multi-step Configuratore (spec §2).
//
// This module is intentionally free of React/Next imports so the reducer that
// consumes these types stays a pure, Node-runnable unit (see reducer.ts) —
// which keeps the branching logic easy to test in isolation.

/* -------------------------------------------------------------------------- */
/* STEP 1 — Tipologia mezzo                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Vehicle types shown in step 1. `altro` is the open-ended "mezzo speciale"
 * card that reveals extra free-text fields instead of using a real photo.
 */
export type TipologiaMezzoId =
  | "bilico-centinato"
  | "motrice-telonata"
  | "rimorchio-telonato"
  | "furgone-centinato"
  | "semirimorchio-collo-doca"
  | "altro";

/* -------------------------------------------------------------------------- */
/* STEP 2 — Tipo di richiesta (two levels)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Macro request categories (step 2, level 1). These two — `riparazione` and
 * `sostituzione` — are the branching drivers that prune later steps:
 * see COLORE_TELO_MACRO / MISURE_SKIP_MACRO in reducer.ts.
 */
export type MacroCategoria =
  | "telo-completo"
  | "solo-laterali"
  | "solo-tetto"
  | "portellone"
  | "riparazione"
  | "sostituzione"
  | "accessori";

/**
 * Sub-option id (step 2, level 2). The concrete set depends on the chosen
 * macro category; validation of "does this sotto-opzione belong to that macro"
 * lives in the catalogue of later blocks, so here it is a free id string.
 */
export type SottoOpzioneId = string;

/* -------------------------------------------------------------------------- */
/* STEP 3 — Colore telo                                                        */
/* -------------------------------------------------------------------------- */

export type PersonalizzazioneTelo =
  | "tinta-unita"
  | "logo-aziendale"
  | "grafica-pubblicitaria"
  | "da-valutare";

export type ColoreTeloState = {
  colore: string | null;
  personalizzazione: PersonalizzazioneTelo | null;
  /** Free notes for a custom / brand colour. */
  note: string;
  /** Checkbox "Vuoi una bozza grafica da noi?". */
  richiedeBozza: boolean;
  /** Selected file names (display only for now; the actual upload to Supabase
   *  storage is wired in a later block). */
  logoFileName: string;
  bozzaFileName: string;
};

/* -------------------------------------------------------------------------- */
/* STEP 4 — Misure / rilievo                                                   */
/* -------------------------------------------------------------------------- */

export type MisureModalita = "conosco" | "richiedo-rilievo" | "non-sicuro";

export type MisureState = {
  modalita: MisureModalita | null;
  /**
   * Measure fields kept as a flexible bag — which fields are relevant depends
   * on the macro category (laterali / tetto / portellone). Later blocks render
   * the right subset; the reducer does not need to know each key.
   */
  campi: Record<string, string>;
  /** Fields for the "richiedo rilievo" branch (città, provincia, giorni…). */
  rilievo: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/* STEP 6 — Urgenza                                                            */
/* -------------------------------------------------------------------------- */

export type UrgenzaLivello =
  | "nessuna"
  | "entro-30gg"
  | "entro-15gg"
  | "entro-7gg"
  | "urgente"
  | "mezzo-fermo"
  | "da-concordare";

export type UrgenzaState = {
  livello: UrgenzaLivello | null;
  dataPreferita: string;
  mezzoFermo: boolean;
  giorniFermo: string;
  note: string;
};

/* -------------------------------------------------------------------------- */
/* STEP 7 — Sede / zona                                                        */
/* -------------------------------------------------------------------------- */

export type SedeZonaId = "angri" | "brescia" | "altro" | "presso-cliente" | "da-definire";

export type SedeZonaState = {
  sede: SedeZonaId | null;
  citta: string;
  provincia: string;
  indirizzo: string;
  dovMezzo: string;
  preferenzaMontaggio: "sede-di-riso" | "presso-cliente" | null;
  servizi: string[];
};

/* -------------------------------------------------------------------------- */
/* STEP 8 — Dati cliente                                                       */
/* -------------------------------------------------------------------------- */

export type PreferenzaContatto = "whatsapp" | "telefonata" | "email";

export type DatiClienteState = {
  nomeCognome: string;
  azienda: string;
  telefono: string;
  email: string;
  citta: string;
  provincia: string;
  partitaIva: string;
  targaMezzo: string;
  note: string;
  preferenzaContatto: PreferenzaContatto | null;
  privacy: boolean;
  autorizzoRicontatto: boolean;
  preventivoSenzaImpegno: boolean;
  /** Selected file names keyed by upload slot (display only for now; the real
   *  Supabase upload is wired at submit time in a later block). */
  allegati: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/* Step ids & full wizard state                                                */
/* -------------------------------------------------------------------------- */

/** Canonical id of every possible step, in canonical order (see STEP_ORDER). */
export type StepId =
  | "tipologia-mezzo"
  | "tipo-richiesta"
  | "colore-telo"
  | "misure"
  | "extra-optional"
  | "urgenza"
  | "sede-zona"
  | "dati-cliente"
  | "riepilogo";

export type ConfiguratoreState = {
  /** Id of the step currently shown. Always one of getVisibleSteps(state). */
  currentStep: StepId;

  /** Client-generated request reference, also used as the storage folder for
   *  uploads so files land under the same id the row is inserted with. Set by
   *  the provider on mount / reset. */
  reference: string;

  // STEP 1
  tipologiaMezzo: TipologiaMezzoId | null;
  mezzoAltro: { specifica: string; note: string };

  // STEP 2
  macroCategoria: MacroCategoria | null;
  sottoOpzione: SottoOpzioneId | null;
  /** Free-text request note — used by the "Accessori vari" branch (no fixed
   *  sub-options), and available as a general note for step 2. */
  richiestaNote: string;

  // STEP 3
  coloreTelo: ColoreTeloState;

  // STEP 4
  misure: MisureState;

  // STEP 5
  extraOptional: string[];
  /** Free-text "esigenze particolari" for step 5. */
  extraNote: string;

  // STEP 6
  urgenza: UrgenzaState;

  // STEP 7
  sedeZona: SedeZonaState;

  // STEP 8
  datiCliente: DatiClienteState;

  /** Uploaded photo URLs (Supabase storage), collected across steps. */
  fotoUrls: string[];
};

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export type ConfiguratoreAction =
  // navigation
  | { type: "GO_NEXT" }
  | { type: "GO_PREV" }
  | { type: "GO_TO_STEP"; step: StepId }
  | { type: "RESET"; reference: string }
  | { type: "SET_REFERENCE"; value: string }
  | { type: "HYDRATE"; state: ConfiguratoreState }
  // step 1
  | { type: "SET_TIPOLOGIA_MEZZO"; value: TipologiaMezzoId }
  | { type: "SET_MEZZO_ALTRO"; patch: Partial<ConfiguratoreState["mezzoAltro"]> }
  // step 2
  | { type: "SET_MACRO_CATEGORIA"; value: MacroCategoria }
  | { type: "SET_SOTTO_OPZIONE"; value: SottoOpzioneId | null }
  | { type: "SET_RICHIESTA_NOTE"; value: string }
  // step 3
  | { type: "SET_COLORE_TELO"; patch: Partial<ColoreTeloState> }
  // step 4
  | { type: "SET_MISURE"; patch: Partial<MisureState> }
  // step 5
  | { type: "TOGGLE_EXTRA"; value: string }
  | { type: "SET_EXTRA_NOTE"; value: string }
  // step 6
  | { type: "SET_URGENZA"; patch: Partial<UrgenzaState> }
  // step 7
  | { type: "SET_SEDE_ZONA"; patch: Partial<SedeZonaState> }
  // step 8
  | { type: "SET_DATI_CLIENTE"; patch: Partial<DatiClienteState> }
  // photos
  | { type: "SET_FOTO"; urls: string[] };
