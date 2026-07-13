"use client";

import { useConfiguratore } from "../ConfiguratoreProvider";
import { FileUpload } from "../FileUpload";
import {
  COLORI_TELO,
  PERSONALIZZAZIONI,
  personalizzazioneRichiedeUpload,
  type ColoreTelo,
} from "@/lib/configuratore/colore";

/**
 * STEP 3 — Colore telo (spec §2). Shown only for macro categories that involve
 * a tarp (branching in reducer.ts skips it for Riparazione / Sostituzione).
 * Colour swatch pick → personalization → (for logo/artwork) uploads + notes.
 */
export function StepColoreTelo() {
  const { state, dispatch } = useConfiguratore();
  const { colore, personalizzazione } = state.coloreTelo;
  const showBranding = personalizzazioneRichiedeUpload(personalizzazione);

  return (
    <div>
      <header className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-primary md:text-4xl">
          Colore e personalizzazione
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-avorio/70">
          Scegli il colore del telo e come vuoi personalizzarlo.
        </p>
      </header>

      {/* Colour swatches */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-avorio/50">Colore</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {COLORI_TELO.map((c) => (
            <ColoreSwatch
              key={c.id}
              colore={c}
              selected={colore === c.id}
              onSelect={() => dispatch({ type: "SET_COLORE_TELO", patch: { colore: c.id } })}
            />
          ))}
        </div>
      </fieldset>

      {/* Personalization */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-avorio/50">
          Personalizzazione
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONALIZZAZIONI.map((p) => {
            const sel = personalizzazione === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={sel}
                onClick={() => dispatch({ type: "SET_COLORE_TELO", patch: { personalizzazione: p.id } })}
                className={[
                  "flex min-h-[44px] items-center gap-3 rounded-md border-[1.5px] bg-navy-deep px-4 py-3 text-left transition-colors",
                  sel ? "border-primary" : "border-avorio/[0.14] hover:border-primary/60",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-4 w-4 flex-none items-center justify-center rounded-full border-[1.5px]",
                    sel ? "border-primary" : "border-avorio/35",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {sel && <span className="h-2 w-2 rounded-full bg-primary" />}
                </span>
                <span className="text-sm font-medium text-avorio">{p.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Branding fields (logo / artwork) */}
      {showBranding && (
        <div className="mt-6 rounded-lg border border-primary/25 bg-navy-deep p-5">
          <span className="mb-4 block text-[11px] uppercase tracking-[0.2em] text-primary">
            Logo e grafica
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FileUpload
              label="Logo aziendale"
              slot="logo"
              accept="image/*,.pdf"
              value={state.coloreTelo.logoFileName}
              onChange={(path) => dispatch({ type: "SET_COLORE_TELO", patch: { logoFileName: path } })}
            />
            <FileUpload
              label="Bozza grafica"
              slot="bozza-grafica"
              accept="image/*,.pdf"
              value={state.coloreTelo.bozzaFileName}
              onChange={(path) => dispatch({ type: "SET_COLORE_TELO", patch: { bozzaFileName: path } })}
            />
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">
              Note colore aziendale
            </span>
            <textarea
              value={state.coloreTelo.note}
              onChange={(e) => dispatch({ type: "SET_COLORE_TELO", patch: { note: e.target.value } })}
              rows={3}
              placeholder="Es. Pantone / RAL del brand, posizionamento del logo…"
              className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
            />
          </label>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={state.coloreTelo.richiedeBozza}
              onChange={(e) => dispatch({ type: "SET_COLORE_TELO", patch: { richiedeBozza: e.target.checked } })}
              className="h-4 w-4 flex-none accent-primary"
            />
            <span className="text-sm text-avorio">Vuoi una bozza grafica da noi?</span>
          </label>
        </div>
      )}
    </div>
  );
}

function ColoreSwatch({
  colore,
  selected,
  onSelect,
}: {
  colore: ColoreTelo;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        "flex min-h-[44px] items-center gap-3 rounded-md border-[1.5px] bg-navy-deep px-3 py-3 text-left transition-colors",
        selected ? "border-primary" : "border-avorio/[0.14] hover:border-primary/60",
      ].join(" ")}
    >
      <Swatch colore={colore} />
      <span className="text-[13px] font-medium leading-tight text-avorio">{colore.label}</span>
    </button>
  );
}

function Swatch({ colore }: { colore: ColoreTelo }) {
  if (colore.special === "custom") {
    return (
      <span
        className="h-6 w-6 flex-none rounded-full border border-avorio/40"
        style={{ background: "conic-gradient(#E7B924, #C1272D, #1E5AA8, #2E6B3B, #E7B924)" }}
        aria-hidden="true"
      />
    );
  }
  if (colore.special === "da-definire") {
    return (
      <span
        className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-dashed border-avorio/40 text-[13px] font-bold text-avorio/60"
        aria-hidden="true"
      >
        ?
      </span>
    );
  }
  return (
    <span
      className="h-6 w-6 flex-none rounded-full border border-avorio/40"
      style={{ background: colore.hex ?? "transparent" }}
      aria-hidden="true"
    />
  );
}
