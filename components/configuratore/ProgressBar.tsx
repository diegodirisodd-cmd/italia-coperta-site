"use client";

import { useConfiguratore } from "./ConfiguratoreProvider";
import { STEP_META } from "@/lib/configuratore/reducer";

/**
 * Progress indicator for the wizard. Reflects the DYNAMIC path (spec §1): the
 * count and labels come from getVisibleSteps(), so a Riparazione request that
 * skips Colore telo + Misure reads "Step 3 di 7", not "di 9". Completed steps
 * are clickable to jump back; future steps are not (they may be gated).
 */
export function ProgressBar() {
  const { visibleSteps, stepIndex, dispatch } = useConfiguratore();
  const total = visibleSteps.length;

  return (
    <nav aria-label="Avanzamento configuratore" className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm font-bold uppercase tracking-[0.05em] text-primary">
          Step {stepIndex + 1} di {total}
        </span>
        <span className="text-[13px] text-avorio/60">
          {STEP_META[visibleSteps[stepIndex]]?.label}
        </span>
      </div>

      {/* Segmented bar */}
      <ol className="flex gap-1.5">
        {visibleSteps.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          const clickable = done;
          return (
            <li key={step} className="flex-1">
              <button
                type="button"
                onClick={() => clickable && dispatch({ type: "GO_TO_STEP", step })}
                disabled={!clickable}
                aria-current={active ? "step" : undefined}
                title={STEP_META[step]?.label}
                className={[
                  "h-1.5 w-full rounded-full transition-colors",
                  active ? "bg-primary" : done ? "bg-primary/60" : "bg-avorio/15",
                  clickable ? "cursor-pointer" : "cursor-default",
                ].join(" ")}
              >
                <span className="sr-only">
                  {STEP_META[step]?.label}
                  {active ? " (attuale)" : done ? " (completato)" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
