"use client";

import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { useConfiguratore } from "../ConfiguratoreProvider";
import { MEZZI, type MezzoCard } from "@/lib/configuratore/mezzi";

/**
 * STEP 1 — Tipologia mezzo (spec §2).
 *
 * Centered flex-wrap grid (3 per row on desktop; a short last row stays
 * centered instead of leaving a hole). Reuses the Card Settori anatomy: same
 * rounded-lg border on bg-navy, Tilt-on-photo, group-hover zoom and the
 * Stagger/StaggerItem cascade — with a red title + circular CTA per the
 * Italia Coperta palette. Selecting a card sets `tipologiaMezzo`, which enables
 * "Avanti" (see canLeaveStep).
 */
export function StepTipologiaMezzo() {
  const { state, dispatch } = useConfiguratore();
  const selected = state.tipologiaMezzo;

  return (
    <div>
      <header className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-primary md:text-4xl">
          Seleziona il tuo mezzo
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-avorio/70">
          Scegli la tipologia di veicolo da coprire. Se non trovi il tuo, usa
          “Altro mezzo” e descrivilo.
        </p>
      </header>

      <Stagger className="mt-9 flex flex-wrap justify-center gap-5">
        {MEZZI.map((mezzo) => (
          <StaggerItem
            key={mezzo.id}
            className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
          >
            <MezzoCardButton
              mezzo={mezzo}
              selected={selected === mezzo.id}
              onSelect={() => dispatch({ type: "SET_TIPOLOGIA_MEZZO", value: mezzo.id })}
            />
          </StaggerItem>
        ))}
      </Stagger>

      {selected === "altro" && <AltroMezzoFields />}
    </div>
  );
}

function MezzoCardButton({
  mezzo,
  selected,
  onSelect,
}: {
  mezzo: MezzoCard;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "group flex h-full w-full flex-col overflow-hidden rounded-lg border bg-navy text-left transition-colors",
        selected
          ? "border-primary ring-1 ring-primary"
          : "border-avorio/[0.14] hover:border-primary/60",
      ].join(" ")}
    >
      {mezzo.image ? (
        <Tilt className="relative aspect-[4/3] overflow-hidden border-b border-primary/[0.14]">
          <Image
            src={mezzo.image}
            alt={mezzo.imageAlt ?? mezzo.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Tilt>
      ) : (
        <MezzoIconPlaceholder mezzo={mezzo} />
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
          {mezzo.label}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-avorio/65">
          {mezzo.descrizione}
        </p>

        {/* Circular CTA — red per Italia Coperta palette. Purely a visual
            affordance; the whole card is the button (min 44px touch area). */}
        <span
          className={[
            "mt-4 flex h-11 w-11 flex-none items-center justify-center self-center rounded-full border-[1.5px] transition-colors",
            selected
              ? "border-primary bg-primary text-navy"
              : "border-primary/70 text-primary group-hover:bg-primary group-hover:text-navy",
          ].join(" ")}
          aria-hidden="true"
        >
          {selected ? <CheckIcon /> : <ChevronIcon />}
        </span>
      </div>
    </button>
  );
}

/** Icon stand-in for cards without a photo (semirimorchio pending / altro). */
function MezzoIconPlaceholder({ mezzo }: { mezzo: MezzoCard }) {
  return (
    <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 border-b border-dashed border-primary/25 bg-gradient-to-br from-navy-black via-navy to-navy-deep">
      {mezzo.id === "altro" ? <SpecialIcon /> : <TruckIcon />}
      <span className="text-[11px] uppercase tracking-[0.18em] text-avorio/35">
        {mezzo.placeholderCaption}
      </span>
    </div>
  );
}

function AltroMezzoFields() {
  const { state, dispatch } = useConfiguratore();
  const { specifica, note } = state.mezzoAltro;
  return (
    <div className="mx-auto mt-6 max-w-xl rounded-lg border border-primary/25 bg-navy-deep p-5">
      <span className="mb-3 block text-[11px] uppercase tracking-[0.2em] text-primary">
        Descrivi il mezzo
      </span>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">
          Tipologia mezzo *
        </span>
        <input
          type="text"
          value={specifica}
          onChange={(e) => dispatch({ type: "SET_MEZZO_ALTRO", patch: { specifica: e.target.value } })}
          placeholder="Es. cisterna, ribaltabile, mezzo agricolo…"
          className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">Note</span>
        <textarea
          value={note}
          onChange={(e) => dispatch({ type: "SET_MEZZO_ALTRO", patch: { note: e.target.value } })}
          rows={3}
          placeholder="Dettagli utili sul mezzo o sull'intervento."
          className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
        />
      </label>
    </div>
  );
}

/* -- inline icons (currentColor) -- */

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-avorio/30">
      <path d="M1 3h13v11H1zM14 7h4l3 3v4h-7z" />
      <circle cx="5.5" cy="17" r="2" />
      <circle cx="17.5" cy="17" r="2" />
    </svg>
  );
}

function SpecialIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-avorio/30">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9a2.8 2.8 0 015.6.4c0 1.9-2.8 2.4-2.8 4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
