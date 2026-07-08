"use client";

import { useConfiguratore } from "../ConfiguratoreProvider";
import { Legend, OptionButton, StepHeader, TextField } from "../ui";
import { SEDI_ZONA, SERVIZI } from "@/lib/configuratore/opzioni";

/**
 * STEP 7 — Sede / zona di servizio (spec §2). Single-select location, a few
 * fields, mounting preference and a multi-select of services. Requires a
 * location (canLeaveStep).
 */
export function StepSedeZona() {
  const { state, dispatch } = useConfiguratore();
  const s = state.sedeZona;
  const set = (patch: Partial<typeof s>) => dispatch({ type: "SET_SEDE_ZONA", patch });

  const toggleServizio = (id: string) =>
    set({ servizi: s.servizi.includes(id) ? s.servizi.filter((x) => x !== id) : [...s.servizi, id] });

  return (
    <div>
      <StepHeader title="Sede e zona di servizio" sub="Dove ti serve l'intervento?" />

      <fieldset className="mt-8">
        <Legend>Sede / zona</Legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SEDI_ZONA.map((z) => (
            <OptionButton
              key={z.id}
              label={z.label}
              desc={z.desc}
              selected={s.sede === z.id}
              onClick={() => set({ sede: z.id })}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField label="Città" value={s.citta} onChange={(v) => set({ citta: v })} />
        <TextField label="Provincia" value={s.provincia} onChange={(v) => set({ provincia: v })} />
        <TextField
          label="Indirizzo (facoltativo)"
          value={s.indirizzo}
          onChange={(v) => set({ indirizzo: v })}
        />
        <TextField
          label="Dove si trova il mezzo"
          value={s.dovMezzo}
          onChange={(v) => set({ dovMezzo: v })}
          placeholder="Es. deposito, cliente, in viaggio…"
        />
      </div>

      <fieldset className="mt-8">
        <Legend>Preferenza montaggio</Legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <OptionButton
            label="Presso sede Di Riso"
            selected={s.preferenzaMontaggio === "sede-di-riso"}
            onClick={() => set({ preferenzaMontaggio: "sede-di-riso" })}
          />
          <OptionButton
            label="Presso il cliente"
            selected={s.preferenzaMontaggio === "presso-cliente"}
            onClick={() => set({ preferenzaMontaggio: "presso-cliente" })}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <Legend>Servizi richiesti</Legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVIZI.map((srv) => (
            <OptionButton
              key={srv.id}
              variant="check"
              label={srv.label}
              selected={s.servizi.includes(srv.id)}
              onClick={() => toggleServizio(srv.id)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
