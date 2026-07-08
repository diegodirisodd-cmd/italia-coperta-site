"use client";

import { useConfiguratore } from "../ConfiguratoreProvider";
import { FileUpload } from "../FileUpload";
import { CheckboxRow, Legend, OptionButton, StepHeader, TextAreaField, TextField } from "../ui";
import { ALLEGATI_SLOT, PREFERENZE_CONTATTO } from "@/lib/configuratore/opzioni";

/**
 * STEP 8 — Dati cliente (spec §2). Required contact fields (gated with privacy
 * in canLeaveStep), optional fields, contact preference, uploads and consents.
 */
export function StepDatiCliente() {
  const { state, dispatch } = useConfiguratore();
  const d = state.datiCliente;
  const set = (patch: Partial<typeof d>) => dispatch({ type: "SET_DATI_CLIENTE", patch });
  const setAllegato = (key: string, name: string) =>
    set({ allegati: { ...d.allegati, [key]: name } });

  return (
    <div>
      <StepHeader title="I tuoi dati" sub="Ti ricontattiamo con il preventivo, senza impegno." />

      {/* Required */}
      <fieldset className="mt-8">
        <Legend>Dati di contatto</Legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TextField label="Nome e cognome" required value={d.nomeCognome} onChange={(v) => set({ nomeCognome: v })} />
          <TextField label="Azienda" required value={d.azienda} onChange={(v) => set({ azienda: v })} />
          <TextField label="Telefono" required type="tel" value={d.telefono} onChange={(v) => set({ telefono: v })} />
          <TextField label="Email" required type="email" value={d.email} onChange={(v) => set({ email: v })} />
          <TextField label="Città" required value={d.citta} onChange={(v) => set({ citta: v })} />
          <TextField label="Provincia" required value={d.provincia} onChange={(v) => set({ provincia: v })} />
        </div>
      </fieldset>

      {/* Optional */}
      <fieldset className="mt-8">
        <Legend>Dati facoltativi</Legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TextField label="P.IVA" value={d.partitaIva} onChange={(v) => set({ partitaIva: v })} />
          <TextField
            label="Targa / marca / modello / anno"
            value={d.targaMezzo}
            onChange={(v) => set({ targaMezzo: v })}
          />
        </div>
        <div className="mt-4">
          <TextAreaField
            label="Note aggiuntive"
            value={d.note}
            onChange={(v) => set({ note: v })}
            placeholder="Tutto ciò che può aiutarci a preparare il preventivo."
          />
        </div>
      </fieldset>

      {/* Contact preference */}
      <fieldset className="mt-8">
        <Legend>Preferenza di contatto</Legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {PREFERENZE_CONTATTO.map((p) => (
            <OptionButton
              key={p.id}
              label={p.label}
              selected={d.preferenzaContatto === p.id}
              onClick={() => set({ preferenzaContatto: p.id })}
            />
          ))}
        </div>
      </fieldset>

      {/* Uploads */}
      <fieldset className="mt-8">
        <Legend>Allegati (facoltativi)</Legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALLEGATI_SLOT.map((slot) => (
            <FileUpload
              key={slot.id}
              label={slot.label}
              slot={slot.id}
              accept="image/*,.pdf"
              value={d.allegati[slot.id] ?? ""}
              onChange={(path) => setAllegato(slot.id, path)}
            />
          ))}
        </div>
      </fieldset>

      {/* Consents */}
      <div className="mt-8 space-y-3 border-t border-avorio/10 pt-6">
        <CheckboxRow
          required
          label="Ho letto e accetto l'informativa sulla privacy"
          checked={d.privacy}
          onChange={(v) => set({ privacy: v })}
        />
        <CheckboxRow
          label="Autorizzo a essere ricontattato per questa richiesta"
          checked={d.autorizzoRicontatto}
          onChange={(v) => set({ autorizzoRicontatto: v })}
        />
        <CheckboxRow
          label="Voglio un preventivo senza impegno"
          checked={d.preventivoSenzaImpegno}
          onChange={(v) => set({ preventivoSenzaImpegno: v })}
        />
      </div>
    </div>
  );
}
