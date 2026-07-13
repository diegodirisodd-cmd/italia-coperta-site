"use client";

import { useConfiguratore } from "../ConfiguratoreProvider";
import { OptionButton, StepHeader, TextAreaField } from "../ui";
import { EXTRA_OPTIONAL } from "@/lib/configuratore/opzioni";

/**
 * STEP 5 — Extra e optional (spec §2). Fixed multi-select checklist (no
 * branching) plus a free-text "esigenze particolari". Fully optional.
 */
export function StepExtraOptional() {
  const { state, dispatch } = useConfiguratore();

  return (
    <div>
      <StepHeader
        title="Extra e optional"
        sub="Seleziona tutti gli optional che ti servono. Nessuno è obbligatorio."
      />

      <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {EXTRA_OPTIONAL.map((opt) => (
          <OptionButton
            key={opt.id}
            variant="check"
            label={opt.label}
            selected={state.extraOptional.includes(opt.id)}
            onClick={() => dispatch({ type: "TOGGLE_EXTRA", value: opt.id })}
          />
        ))}
      </div>

      <div className="mt-6">
        <TextAreaField
          label="Esigenze particolari"
          value={state.extraNote}
          onChange={(v) => dispatch({ type: "SET_EXTRA_NOTE", value: v })}
          placeholder="Altre lavorazioni o richieste specifiche."
        />
      </div>
    </div>
  );
}
