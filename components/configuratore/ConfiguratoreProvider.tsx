"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  initialState,
  reducer,
  getVisibleSteps,
  currentStepIndex,
  canLeaveStep,
} from "@/lib/configuratore/reducer";
import type {
  ConfiguratoreAction,
  ConfiguratoreState,
  DatiClienteState,
  StepId,
} from "@/lib/configuratore/types";

const STORAGE_KEY = "italiacoperta.configuratore.v1";

/** Durata massima dello stato salvato nel browser (S-15). Oltre questa soglia
 *  la bozza viene scartata alla riapertura invece di restare lì per sempre. */
const TTL_MS = 48 * 60 * 60 * 1000;

/**
 * Campi di `datiCliente` che NON vengono mai scritti su localStorage: restano
 * solo in memoria per la durata della sessione (S-15). Sono i dati personali
 * veri e propri — chi abbandona il wizard non deve lasciarli sul browser, a
 * maggior ragione su una postazione condivisa.
 *
 * Restano invece persistiti: preferenze di contatto, flag di consenso e i path
 * degli allegati già caricati (senza quelli un reload orfanerebbe i file).
 */
const DATI_CLIENTE_PII = [
  "nomeCognome",
  "azienda",
  "telefono",
  "email",
  "citta",
  "provincia",
  "partitaIva",
  "targaMezzo",
  "note",
] as const satisfies readonly (keyof DatiClienteState)[];

type Persisted = { savedAt: number; state: ConfiguratoreState };

/** Copia dello stato ripulita dai dati personali, pronta per localStorage. */
function stripPii(state: ConfiguratoreState): ConfiguratoreState {
  const datiCliente = { ...state.datiCliente };
  for (const k of DATI_CLIENTE_PII) datiCliente[k] = "";
  return {
    ...state,
    datiCliente,
    // L'indirizzo del cliente è PII quanto il resto, anche se vive nello step
    // "sede e zona".
    sedeZona: { ...state.sedeZona, indirizzo: "" },
  };
}

/** Human-ish unique request id, also used as the storage folder for uploads. */
export function newReference(): string {
  return (
    "IC-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

type ConfiguratoreContextValue = {
  state: ConfiguratoreState;
  dispatch: React.Dispatch<ConfiguratoreAction>;
  /** Dynamic path — the steps actually shown given the current branching. */
  visibleSteps: StepId[];
  /** 0-based position of the current step within visibleSteps. */
  stepIndex: number;
  isFirst: boolean;
  isLast: boolean;
  /** Whether the current step's required fields are satisfied (gates "Avanti"). */
  canProceed: boolean;
  /** Clear the wizard and mint a fresh reference. */
  resetWizard: () => void;
};

const ConfiguratoreContext = createContext<ConfiguratoreContextValue | null>(null);

export function ConfiguratoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Rehydrate from localStorage once on mount. We're in real production on
  // Vercel (not a sandboxed artifact), so localStorage is a valid place to keep
  // a long form alive across reloads (spec §3). Guarded for SSR.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const envelope = raw ? (JSON.parse(raw) as Partial<Persisted>) : null;
      const scaduto =
        !envelope ||
        typeof envelope.savedAt !== "number" ||
        Date.now() - envelope.savedAt > TTL_MS;

      // Scaduta, o salvata nel vecchio formato senza timestamp (che poteva
      // contenere dati personali): si butta e si riparte pulito.
      if (scaduto || !envelope?.state) {
        if (raw) window.localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "SET_REFERENCE", value: newReference() });
        return;
      }

      const parsed = envelope.state;
      dispatch({
        type: "HYDRATE",
        state: parsed.reference ? parsed : { ...parsed, reference: newReference() },
      });
    } catch {
      // Corrupt/blocked storage: fall back to a fresh wizard with a new ref.
      dispatch({ type: "SET_REFERENCE", value: newReference() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change — senza PII e con il timestamp per il TTL.
  useEffect(() => {
    try {
      const envelope: Persisted = { savedAt: Date.now(), state: stripPii(state) };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch {
      // Ignore quota / private-mode failures.
    }
  }, [state]);

  const visibleSteps = getVisibleSteps(state);
  const stepIndex = currentStepIndex(state);

  const value: ConfiguratoreContextValue = {
    state,
    dispatch,
    visibleSteps,
    stepIndex,
    isFirst: stepIndex <= 0,
    isLast: stepIndex >= visibleSteps.length - 1,
    canProceed: canLeaveStep(state, state.currentStep),
    resetWizard: () => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      dispatch({ type: "RESET", reference: newReference() });
    },
  };

  return (
    <ConfiguratoreContext.Provider value={value}>
      {children}
    </ConfiguratoreContext.Provider>
  );
}

/** Access the wizard state + dispatch. Throws if used outside the provider. */
export function useConfiguratore(): ConfiguratoreContextValue {
  const ctx = useContext(ConfiguratoreContext);
  if (!ctx) {
    throw new Error("useConfiguratore must be used within a ConfiguratoreProvider");
  }
  return ctx;
}
