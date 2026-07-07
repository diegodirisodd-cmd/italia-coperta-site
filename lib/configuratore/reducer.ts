// Pure reducer + branching logic for the Configuratore wizard (spec §2, §3).
//
// No React/Next imports on purpose: getVisibleSteps and the reducer are pure
// functions, so the branching rules can be exercised in isolation
// (`node --experimental-strip-types scripts/verify-branching.ts`) and reused by
// the ProgressBar and navigation without duplicating logic. This is the single
// source of truth for "which steps/fields are shown" (spec §3).

import type {
  ConfiguratoreAction,
  ConfiguratoreState,
  MacroCategoria,
  StepId,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Step order & metadata                                                       */
/* -------------------------------------------------------------------------- */

/** Every step in canonical order. getVisibleSteps() returns a subset of this. */
export const STEP_ORDER: readonly StepId[] = [
  "tipologia-mezzo",
  "tipo-richiesta",
  "colore-telo",
  "misure",
  "extra-optional",
  "urgenza",
  "sede-zona",
  "dati-cliente",
  "riepilogo",
] as const;

/** Short labels for the progress bar / stepper. */
export const STEP_META: Record<StepId, { label: string; title: string }> = {
  "tipologia-mezzo": { label: "Mezzo", title: "Seleziona il tuo mezzo" },
  "tipo-richiesta": { label: "Richiesta", title: "Di cosa hai bisogno?" },
  "colore-telo": { label: "Colore", title: "Colore e personalizzazione del telo" },
  misure: { label: "Misure", title: "Misure e rilievo" },
  "extra-optional": { label: "Extra", title: "Extra e optional" },
  urgenza: { label: "Tempi", title: "Urgenza e tempistiche" },
  "sede-zona": { label: "Zona", title: "Sede e zona di servizio" },
  "dati-cliente": { label: "Dati", title: "I tuoi dati" },
  riepilogo: { label: "Riepilogo", title: "Riepilogo e invio" },
};

/* -------------------------------------------------------------------------- */
/* Branching rules (spec §2)                                                   */
/* -------------------------------------------------------------------------- */

/**
 * STEP 3 (Colore telo) is shown only for these macro categories. Skipped for
 * `riparazione` and `sostituzione`: you don't pick a tarp colour to repair or
 * to swap a component.
 */
const COLORE_TELO_MACRO: ReadonlySet<MacroCategoria> = new Set<MacroCategoria>([
  "telo-completo",
  "solo-laterali",
  "solo-tetto",
  "portellone",
  "accessori",
]);

/**
 * STEP 4 (Misure) is skipped entirely for these macro categories. Per spec §2
 * only the `riparazione` branch drops it (a torn eyelet needs no tarp length);
 * `sostituzione` still keeps measures.
 */
const MISURE_SKIP_MACRO: ReadonlySet<MacroCategoria> = new Set<MacroCategoria>([
  "riparazione",
]);

/**
 * Single source of truth for the dynamic path (spec §3): given the current
 * state, return the ordered list of steps the user actually sees. The progress
 * bar ("Step 3 di 6") and next/prev navigation both derive from this.
 */
export function getVisibleSteps(state: ConfiguratoreState): StepId[] {
  const macro = state.macroCategoria;
  return STEP_ORDER.filter((step) => {
    if (step === "colore-telo") {
      // Until a macro is chosen we keep the step in the path (optimistic);
      // once chosen, honour the branching rule.
      return macro === null || COLORE_TELO_MACRO.has(macro);
    }
    if (step === "misure") {
      return macro === null || !MISURE_SKIP_MACRO.has(macro);
    }
    return true;
  });
}

/* -------------------------------------------------------------------------- */
/* Navigation helpers                                                          */
/* -------------------------------------------------------------------------- */

const canonicalIndex = (step: StepId): number => STEP_ORDER.indexOf(step);

/**
 * Keep `currentStep` valid after a branching change. If the step the user is on
 * has just been pruned from the visible path (e.g. they went back and switched
 * to Riparazione while sitting on "Colore telo"), snap to the nearest earlier
 * visible step so navigation never points at a hidden step.
 */
function normalizeCurrentStep(state: ConfiguratoreState): ConfiguratoreState {
  const visible = getVisibleSteps(state);
  if (visible.includes(state.currentStep)) return state;

  const target = canonicalIndex(state.currentStep);
  let snapped: StepId = visible[0];
  for (const step of visible) {
    if (canonicalIndex(step) <= target) snapped = step;
    else break;
  }
  return { ...state, currentStep: snapped };
}

/** 0-based index of the current step within the dynamic (visible) path. */
export function currentStepIndex(state: ConfiguratoreState): number {
  return getVisibleSteps(state).indexOf(state.currentStep);
}

/**
 * Whether the user is allowed to advance past `step` given the current state.
 * Centralized here (next to the branching) so the nav button and GO_NEXT share
 * one gate. Per-step rules are filled in as each step lands; unlisted steps are
 * optional (return true).
 */
export function canLeaveStep(state: ConfiguratoreState, step: StepId): boolean {
  switch (step) {
    case "tipologia-mezzo":
      if (!state.tipologiaMezzo) return false;
      // "Altro mezzo" needs at least a free-text specifica to be actionable.
      if (state.tipologiaMezzo === "altro" && !state.mezzoAltro.specifica.trim()) return false;
      return true;
    case "tipo-richiesta":
      if (!state.macroCategoria) return false;
      // Every macro except "accessori" (free-text) requires a sub-option.
      if (state.macroCategoria !== "accessori" && !state.sottoOpzione) return false;
      return true;
    default:
      return true;
  }
}

/* -------------------------------------------------------------------------- */
/* Initial state                                                               */
/* -------------------------------------------------------------------------- */

export const initialState: ConfiguratoreState = {
  currentStep: "tipologia-mezzo",
  tipologiaMezzo: null,
  mezzoAltro: { specifica: "", note: "" },
  macroCategoria: null,
  sottoOpzione: null,
  richiestaNote: "",
  coloreTelo: { colore: null, personalizzazione: null, note: "", richiedeBozza: false },
  misure: { modalita: null, campi: {}, rilievo: {} },
  extraOptional: [],
  urgenza: { livello: null, dataPreferita: "", mezzoFermo: false, giorniFermo: "", note: "" },
  sedeZona: {
    sede: null,
    citta: "",
    provincia: "",
    indirizzo: "",
    dovMezzo: "",
    preferenzaMontaggio: null,
    servizi: [],
  },
  datiCliente: {
    nomeCognome: "",
    azienda: "",
    telefono: "",
    email: "",
    citta: "",
    provincia: "",
    partitaIva: "",
    targaMezzo: "",
    note: "",
    preferenzaContatto: null,
    privacy: false,
    autorizzoRicontatto: false,
    preventivoSenzaImpegno: false,
  },
  fotoUrls: [],
};

/* -------------------------------------------------------------------------- */
/* Reducer                                                                     */
/* -------------------------------------------------------------------------- */

export function reducer(
  state: ConfiguratoreState,
  action: ConfiguratoreAction,
): ConfiguratoreState {
  switch (action.type) {
    /* ---- navigation ---- */
    case "GO_NEXT": {
      // Guard forward navigation with the same gate the nav button uses, so a
      // programmatic advance can't skip a required selection.
      if (!canLeaveStep(state, state.currentStep)) return state;
      const visible = getVisibleSteps(state);
      const i = visible.indexOf(state.currentStep);
      const next = visible[Math.min(i + 1, visible.length - 1)];
      return { ...state, currentStep: next };
    }
    case "GO_PREV": {
      const visible = getVisibleSteps(state);
      const i = visible.indexOf(state.currentStep);
      const prev = visible[Math.max(i - 1, 0)];
      return { ...state, currentStep: prev };
    }
    case "GO_TO_STEP": {
      const visible = getVisibleSteps(state);
      return visible.includes(action.step) ? { ...state, currentStep: action.step } : state;
    }
    case "RESET":
      return initialState;
    case "HYDRATE":
      // Restore persisted state, then re-validate the current step against the
      // branching rules in case the schema/logic changed since it was saved.
      return normalizeCurrentStep(action.state);

    /* ---- step 1 ---- */
    case "SET_TIPOLOGIA_MEZZO":
      return { ...state, tipologiaMezzo: action.value };
    case "SET_MEZZO_ALTRO":
      return { ...state, mezzoAltro: { ...state.mezzoAltro, ...action.patch } };

    /* ---- step 2 (branching driver) ---- */
    case "SET_MACRO_CATEGORIA":
      // Changing the macro category can prune later steps, so re-normalize.
      return normalizeCurrentStep({
        ...state,
        macroCategoria: action.value,
        // A different macro invalidates the previously chosen sub-option.
        sottoOpzione: action.value === state.macroCategoria ? state.sottoOpzione : null,
      });
    case "SET_SOTTO_OPZIONE":
      return { ...state, sottoOpzione: action.value };
    case "SET_RICHIESTA_NOTE":
      return { ...state, richiestaNote: action.value };

    /* ---- step 3 ---- */
    case "SET_COLORE_TELO":
      return { ...state, coloreTelo: { ...state.coloreTelo, ...action.patch } };

    /* ---- step 4 ---- */
    case "SET_MISURE":
      return { ...state, misure: { ...state.misure, ...action.patch } };

    /* ---- step 5 ---- */
    case "TOGGLE_EXTRA": {
      const has = state.extraOptional.includes(action.value);
      return {
        ...state,
        extraOptional: has
          ? state.extraOptional.filter((x) => x !== action.value)
          : [...state.extraOptional, action.value],
      };
    }

    /* ---- step 6 ---- */
    case "SET_URGENZA":
      return { ...state, urgenza: { ...state.urgenza, ...action.patch } };

    /* ---- step 7 ---- */
    case "SET_SEDE_ZONA":
      return { ...state, sedeZona: { ...state.sedeZona, ...action.patch } };

    /* ---- step 8 ---- */
    case "SET_DATI_CLIENTE":
      return { ...state, datiCliente: { ...state.datiCliente, ...action.patch } };

    /* ---- photos ---- */
    case "SET_FOTO":
      return { ...state, fotoUrls: action.urls };

    default:
      return state;
  }
}
