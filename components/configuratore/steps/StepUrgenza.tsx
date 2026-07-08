"use client";

import { useConfiguratore } from "../ConfiguratoreProvider";
import { CheckboxRow, Legend, OptionButton, StepHeader, TextAreaField, TextField } from "../ui";
import { URGENZA_LIVELLI } from "@/lib/configuratore/opzioni";

/**
 * STEP 6 — Urgenza e tempistiche (spec §2). Single-select urgency level plus a
 * few timing fields. Requires a level (canLeaveStep).
 */
export function StepUrgenza() {
  const { state, dispatch } = useConfiguratore();
  const u = state.urgenza;
  const set = (patch: Partial<typeof u>) => dispatch({ type: "SET_URGENZA", patch });

  return (
    <div>
      <StepHeader title="Urgenza e tempistiche" sub="Quanto è urgente e quando ti serve pronto?" />

      <fieldset className="mt-8">
        <Legend>Urgenza</Legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {URGENZA_LIVELLI.map((l) => (
            <OptionButton
              key={l.id}
              label={l.label}
              selected={u.livello === l.id}
              onClick={() => set({ livello: l.id })}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Data preferita"
          type="date"
          value={u.dataPreferita}
          onChange={(v) => set({ dataPreferita: v })}
        />
        {u.mezzoFermo && (
          <TextField
            label="Per quanti giorni può restare fermo?"
            value={u.giorniFermo}
            onChange={(v) => set({ giorniFermo: v })}
            placeholder="Es. 2-3 giorni"
          />
        )}
      </div>

      <div className="mt-4">
        <CheckboxRow
          label="Il mezzo può restare fermo per l'intervento"
          checked={u.mezzoFermo}
          onChange={(v) => set({ mezzoFermo: v })}
        />
      </div>

      <div className="mt-6">
        <TextAreaField
          label="Note disponibilità"
          value={u.note}
          onChange={(v) => set({ note: v })}
          placeholder="Vincoli di consegna, finestre temporali, ecc."
        />
      </div>
    </div>
  );
}
