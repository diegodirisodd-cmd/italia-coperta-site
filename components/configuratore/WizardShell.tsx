"use client";

import type { ComponentType } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useConfiguratore } from "./ConfiguratoreProvider";
import { ProgressBar } from "./ProgressBar";
import { STEP_META } from "@/lib/configuratore/reducer";
import { EASE_OUT } from "@/components/motion/variants";
import type { StepId } from "@/lib/configuratore/types";
import { StepTipologiaMezzo } from "./steps/StepTipologiaMezzo";
import { StepTipoRichiesta } from "./steps/StepTipoRichiesta";
import { StepColoreTelo } from "./steps/StepColoreTelo";
import { StepMisure } from "./steps/StepMisure";
import { StepExtraOptional } from "./steps/StepExtraOptional";
import { StepUrgenza } from "./steps/StepUrgenza";
import { StepSedeZona } from "./steps/StepSedeZona";
import { StepDatiCliente } from "./steps/StepDatiCliente";
import { StepRiepilogo } from "./steps/StepRiepilogo";

/**
 * Common layout frame for the wizard: progress bar, the animated step slot, and
 * the back/next navigation. It reads everything from the ConfiguratoreProvider,
 * so individual step components only own their own fields — navigation and the
 * dynamic path stay in one place (spec §3).
 *
 * Step UI components are registered per-StepId in later blocks. Until then the
 * shell renders a lightweight placeholder so the architecture (branching,
 * navigation, progress) is verifiable on its own.
 */

/** Registry of step content components, filled in by later blocks. */
const STEP_COMPONENTS: Partial<Record<StepId, ComponentType>> = {
  "tipologia-mezzo": StepTipologiaMezzo,
  "tipo-richiesta": StepTipoRichiesta,
  "colore-telo": StepColoreTelo,
  misure: StepMisure,
  "extra-optional": StepExtraOptional,
  urgenza: StepUrgenza,
  "sede-zona": StepSedeZona,
  "dati-cliente": StepDatiCliente,
  riepilogo: StepRiepilogo,
};

export function WizardShell() {
  const { dispatch, visibleSteps, stepIndex, isFirst, isLast, canProceed } = useConfiguratore();
  const reduced = useReducedMotion();
  const step = visibleSteps[stepIndex];
  const StepComponent = STEP_COMPONENTS[step];

  return (
    <div className="overflow-hidden rounded-lg border border-primary/20 bg-navy p-6 md:p-9">
      <ProgressBar />

      <div className="relative min-h-[16rem]">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
          >
            {StepComponent ? <StepComponent /> : <StepPlaceholder step={step} />}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-avorio/10 pt-6">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_PREV" })}
          disabled={isFirst}
          className="rounded-md border-[1.5px] border-avorio/40 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio transition-colors hover:border-primary/70 disabled:cursor-not-allowed disabled:border-avorio/10 disabled:text-avorio/30"
        >
          ← Indietro
        </button>

        {isLast ? (
          <span className="font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio/50">
            Ultimo passo
          </span>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ type: "GO_NEXT" })}
            disabled={!canProceed}
            className="rounded-md bg-primary px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-navy transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-primary/25 disabled:text-avorio/40"
          >
            Avanti →
          </button>
        )}
      </div>
    </div>
  );
}

/** Temporary stand-in until each step's real UI lands (Block 2+). */
function StepPlaceholder({ step }: { step: StepId }) {
  return (
    <div className="flex min-h-[16rem] flex-col items-start justify-center">
      <span className="mb-2 text-[11px] uppercase tracking-[0.24em] text-avorio/45">
        {STEP_META[step].label}
      </span>
      <h2 className="font-display text-2xl font-bold uppercase tracking-[0.02em] text-avorio md:text-3xl">
        {STEP_META[step].title}
      </h2>
      <p className="mt-3 max-w-md text-sm text-avorio/55">
        Contenuto dello step in arrivo. L&apos;architettura del wizard (branching,
        navigazione, avanzamento) è già attiva.
      </p>
    </div>
  );
}
