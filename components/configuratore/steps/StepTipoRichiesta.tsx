"use client";

import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useConfiguratore } from "../ConfiguratoreProvider";
import {
  MACRO_CATEGORIE,
  SOTTO_OPZIONI,
  getHighlightImage,
  hasSottoOpzioni,
  type HighlightImage,
} from "@/lib/configuratore/richiesta";
import type { MacroCategoria } from "@/lib/configuratore/types";
import { EASE_OUT } from "@/components/motion/variants";

/**
 * STEP 2 — Tipo di richiesta, two levels (spec §2).
 *
 * Level 1: macro category (single-select). Level 2: macro-conditional
 * sub-options — a fixed list for most macros, free text for "Accessori vari".
 * A support image on the right updates with the current macro/sub-option
 * (LED highlights for tetto/laterali/posteriore, illustrative image for
 * Riparazione, none for Sostituzione/Accessori) — see getHighlightImage.
 */
export function StepTipoRichiesta() {
  const { state, dispatch } = useConfiguratore();
  const { macroCategoria: macro, sottoOpzione: sotto } = state;
  const highlight = getHighlightImage(macro, sotto);

  return (
    <div>
      <header className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-primary md:text-4xl">
          Di cosa hai bisogno?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-avorio/70">
          Scegli il tipo di intervento, poi precisa la richiesta.
        </p>
      </header>

      {/* Level 1 — macro categories */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-avorio/50">
          Tipo di richiesta
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MACRO_CATEGORIE.map((cat) => {
            const selected = macro === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={selected}
                onClick={() => dispatch({ type: "SET_MACRO_CATEGORIA", value: cat.id })}
                className={[
                  "flex min-h-[44px] flex-col items-start rounded-md border-[1.5px] bg-navy-deep px-4 py-3 text-left transition-colors",
                  selected ? "border-primary" : "border-avorio/[0.14] hover:border-primary/60",
                ].join(" ")}
              >
                <span className="font-display text-[15px] font-semibold uppercase tracking-[0.02em] text-avorio">
                  {cat.label}
                </span>
                <span className="mt-1 text-[12px] leading-snug text-avorio/55">{cat.descrizione}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Level 2 — conditional detail + dynamic image */}
      {macro && (
        <div className={`mt-8 grid gap-6 ${highlight ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
          <div>
            {hasSottoOpzioni(macro) ? (
              <SottoOpzioni macro={macro} selected={sotto} />
            ) : (
              <AccessoriFreeText />
            )}
            {macro === "riparazione" && (
              <p className="mt-4 rounded-md border border-primary/25 bg-navy-deep px-4 py-3 text-[13px] leading-relaxed text-avorio/70">
                Una foto del danno ci aiuta a preparare il preventivo giusto: potrai
                allegarla negli step successivi.
              </p>
            )}
          </div>

          {highlight && <HighlightPanel image={highlight} />}
        </div>
      )}
    </div>
  );
}

function SottoOpzioni({
  macro,
  selected,
}: {
  macro: MacroCategoria;
  selected: string | null;
}) {
  const { dispatch } = useConfiguratore();
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-avorio/50">
        Precisa la richiesta
      </legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SOTTO_OPZIONI[macro].map((opt) => {
          const sel = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={sel}
              onClick={() => dispatch({ type: "SET_SOTTO_OPZIONE", value: opt.id })}
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
              <span className="text-sm font-medium text-avorio">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function AccessoriFreeText() {
  const { state, dispatch } = useConfiguratore();
  return (
    <label className="block">
      <span className="mb-3 block text-[11px] uppercase tracking-[0.2em] text-avorio/50">
        Descrivi cosa ti serve
      </span>
      <textarea
        value={state.richiestaNote}
        onChange={(e) => dispatch({ type: "SET_RICHIESTA_NOTE", value: e.target.value })}
        rows={5}
        placeholder="Es. cinghie aggiuntive, tasca portadocumenti, bande rifrangenti, kit riparazione…"
        className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
      />
    </label>
  );
}

function HighlightPanel({ image }: { image: HighlightImage }) {
  const reduced = useReducedMotion();
  return (
    <div className="lg:pt-7">
      <div className="overflow-hidden rounded-lg border border-primary/25 bg-navy-deep">
        <div className="relative aspect-[4/3]">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={image.src}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </m.div>
          </AnimatePresence>
        </div>
        <p className="border-t border-primary/15 px-4 py-2.5 text-center text-[11px] uppercase tracking-[0.18em] text-avorio/55">
          {image.caption}
        </p>
      </div>
    </div>
  );
}
