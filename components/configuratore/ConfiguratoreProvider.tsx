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
} from "@/lib/configuratore/reducer";
import type {
  ConfiguratoreAction,
  ConfiguratoreState,
  StepId,
} from "@/lib/configuratore/types";

const STORAGE_KEY = "italiacoperta.configuratore.v1";

type ConfiguratoreContextValue = {
  state: ConfiguratoreState;
  dispatch: React.Dispatch<ConfiguratoreAction>;
  /** Dynamic path — the steps actually shown given the current branching. */
  visibleSteps: StepId[];
  /** 0-based position of the current step within visibleSteps. */
  stepIndex: number;
  isFirst: boolean;
  isLast: boolean;
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
      if (raw) {
        const parsed = JSON.parse(raw) as ConfiguratoreState;
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      // Corrupt/blocked storage: fall back to a fresh wizard silently.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
