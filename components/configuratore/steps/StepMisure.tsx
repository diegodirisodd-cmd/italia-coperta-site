"use client";

import { useConfiguratore } from "../ConfiguratoreProvider";
import { FileUpload } from "../FileUpload";
import {
  MISURE_BASE,
  MISURE_LATERALI,
  MISURE_TETTO,
  MISURE_PORTELLONE,
  RILIEVO_FIELDS,
  zonesForMisure,
  type CampoDef,
} from "@/lib/configuratore/misure";
import type { MisureModalita } from "@/lib/configuratore/types";

const MODALITA: { id: MisureModalita; label: string; desc: string }[] = [
  { id: "conosco", label: "Sì, conosco le misure", desc: "Le inserisci tu adesso." },
  { id: "richiedo-rilievo", label: "No, richiedo un rilievo", desc: "Veniamo noi a misurare." },
  { id: "non-sicuro", label: "Non sono sicuro", desc: "Ne parliamo insieme." },
];

/**
 * STEP 4 — Misure / rilievo (spec §2). Skipped only for Riparazione (branching
 * in reducer.ts). Modality first; "conosco" reveals base measures plus the
 * groups relevant to the step-2 choice, "richiedo-rilievo" the survey fields.
 */
export function StepMisure() {
  const { state, dispatch } = useConfiguratore();
  const { modalita, campi, rilievo } = state.misure;
  const zones = zonesForMisure(state.macroCategoria, state.sottoOpzione);

  const setCampo = (key: string, val: string) =>
    dispatch({ type: "SET_MISURE", patch: { campi: { ...campi, [key]: val } } });
  const setRilievo = (key: string, val: string) =>
    dispatch({ type: "SET_MISURE", patch: { rilievo: { ...rilievo, [key]: val } } });

  return (
    <div>
      <header className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-primary md:text-4xl">
          Misure e rilievo
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-avorio/70">
          Conosci già le misure o preferisci un rilievo sul posto?
        </p>
      </header>

      {/* Modality */}
      <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {MODALITA.map((m) => {
          const sel = modalita === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={sel}
              onClick={() => dispatch({ type: "SET_MISURE", patch: { modalita: m.id } })}
              className={[
                "flex min-h-[44px] flex-col items-start rounded-md border-[1.5px] bg-navy-deep px-4 py-3 text-left transition-colors",
                sel ? "border-primary" : "border-avorio/[0.14] hover:border-primary/60",
              ].join(" ")}
            >
              <span className="font-display text-[15px] font-semibold uppercase tracking-[0.02em] text-avorio">
                {m.label}
              </span>
              <span className="mt-1 text-[12px] text-avorio/55">{m.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Known measures */}
      {modalita === "conosco" && (
        <div className="mt-8 space-y-7">
          <CampoGruppo title="Misure base" campi={MISURE_BASE} values={campi} onChange={setCampo} />
          {zones.laterali && (
            <CampoGruppo title="Laterali" campi={MISURE_LATERALI} values={campi} onChange={setCampo} />
          )}
          {zones.tetto && (
            <CampoGruppo title="Tetto" campi={MISURE_TETTO} values={campi} onChange={setCampo} />
          )}
          {zones.portellone && (
            <CampoGruppo title="Posteriore" campi={MISURE_PORTELLONE} values={campi} onChange={setCampo} />
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">
                Note tecniche
              </span>
              <textarea
                value={campi["note"] ?? ""}
                onChange={(e) => setCampo("note", e.target.value)}
                rows={3}
                placeholder="Dettagli utili sulle misure o sul montaggio."
                className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
              />
            </label>
            <FileUpload
              label="Foto con misure"
              slot="foto-misure"
              accept="image/*,.pdf"
              value={campi["foto-misure"] ?? ""}
              onChange={(path) => setCampo("foto-misure", path)}
            />
          </div>
        </div>
      )}

      {/* Survey request */}
      {modalita === "richiedo-rilievo" && (
        <div className="mt-8">
          <CampoGruppo title="Dettagli per il rilievo" campi={RILIEVO_FIELDS} values={rilievo} onChange={setRilievo} />
          <label className="mt-6 block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">Note</span>
            <textarea
              value={rilievo["note"] ?? ""}
              onChange={(e) => setRilievo("note", e.target.value)}
              rows={3}
              placeholder="Indicazioni per raggiungere il mezzo, referente, ecc."
              className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
            />
          </label>
        </div>
      )}

      {/* Not sure */}
      {modalita === "non-sicuro" && (
        <div className="mt-8">
          <p className="rounded-md border border-primary/25 bg-navy-deep px-4 py-3 text-[13px] leading-relaxed text-avorio/70">
            Nessun problema: definiamo insieme le misure quando ti ricontattiamo, o
            organizziamo un rilievo se serve.
          </p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">Note</span>
            <textarea
              value={campi["note"] ?? ""}
              onChange={(e) => setCampo("note", e.target.value)}
              rows={3}
              placeholder="Quello che sai già del mezzo o dell'intervento."
              className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function CampoGruppo({
  title,
  campi,
  values,
  onChange,
}: {
  title: string;
  campi: CampoDef[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-avorio/50">{title}</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campi.map((def) => (
          <label key={def.key} className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">{def.label}</span>
            <div className="relative">
              <input
                type={def.type ?? "text"}
                inputMode={def.type === "number" ? "numeric" : undefined}
                value={values[def.key] ?? ""}
                onChange={(e) => onChange(def.key, e.target.value)}
                placeholder={def.placeholder}
                className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
              />
              {def.suffix && (
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-avorio/40">
                  {def.suffix}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
