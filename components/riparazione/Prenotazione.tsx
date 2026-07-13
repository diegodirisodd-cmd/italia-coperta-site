"use client";

import { useEffect, useMemo, useState } from "react";
import {
  INTERVENTI,
  SEDI,
  FASCE,
  buildGiorni,
  slotDisponibile,
  labelIntervento,
  labelSede,
  labelFascia,
  type Giorno,
} from "@/lib/riparazione";
import { waLink } from "@/lib/site";

const chip = (active: boolean, disabled = false) =>
  [
    "rounded-full border-[1.5px] px-4 py-2.5 text-[13px] font-medium transition-colors",
    disabled
      ? "cursor-not-allowed border-avorio/10 text-avorio/30"
      : active
        ? "border-primary bg-primary/[0.16] text-primary"
        : "border-avorio/20 bg-navy-deep text-avorio/80 hover:border-primary/60",
  ].join(" ");

export function Prenotazione() {
  const [intervento, setIntervento] = useState(INTERVENTI[0].id);
  const [sede, setSede] = useState<string>(SEDI[0].id);
  const [giornoIso, setGiornoIso] = useState("");
  const [fascia, setFascia] = useState("");
  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  // Generate the calendar only on the client, so statically-served HTML never
  // freezes build-day dates and there's no SSR/timezone hydration mismatch.
  const [giorni, setGiorni] = useState<Giorno[]>([]);
  useEffect(() => {
    setGiorni(buildGiorni(new Date(), 6));
  }, []);

  // When sede or day changes, drop a slot that is no longer available.
  useEffect(() => {
    if (fascia && giornoIso && !slotDisponibile(sede, giornoIso, fascia)) setFascia("");
  }, [sede, giornoIso, fascia]);

  const canBook = Boolean(giornoIso && fascia && nome.trim() && telefono.trim());

  const waText = useMemo(
    () =>
      `Ciao Di Riso Teloni, vorrei prenotare una riparazione: ${labelIntervento(intervento)}, sede ${labelSede(sede)}.`,
    [intervento, sede],
  );

  async function book() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/prenotazione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intervento, sede, giorno: giornoIso, fascia, nome, telefono }),
      });
      if (!res.ok) throw new Error("Prenotazione non riuscita");
      const json = (await res.json()) as { reference: string };
      setReference(json.reference);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    const giorno = giorni.find((g) => g.iso === giornoIso);
    return (
      <div className="rounded-xl border border-primary/25 bg-navy p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-navy">
          ✓
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold uppercase text-avorio">Richiesta inviata</h3>
        <p className="mt-2 text-avorio/75">Ti richiamiamo per confermare l&apos;appuntamento.</p>
        <p className="mt-1 text-sm text-avorio/50">
          Riferimento: <span className="text-primary">{reference}</span>
        </p>
        <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-lg border border-avorio/12 text-left">
          <Row k="Intervento" v={labelIntervento(intervento)} />
          <Row k="Sede" v={labelSede(sede)} />
          <Row k="Giorno" v={giorno ? `${giorno.dow} ${giorno.day}` : giornoIso} />
          <Row k="Fascia" v={labelFascia(fascia)} last />
        </div>
        <button
          onClick={() => setReference(null)}
          className="mt-6 rounded-md border-[1.5px] border-avorio/40 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio"
        >
          Nuova prenotazione
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/[0.28] bg-navy p-6 md:p-8">
      <h3 className="mb-6 font-display text-2xl font-semibold uppercase tracking-[0.03em] text-avorio">
        Prenota il tuo intervento
      </h3>

      <FieldLabel>Tipo di intervento</FieldLabel>
      <div className="mb-6 flex flex-wrap gap-2">
        {INTERVENTI.map((i) => (
          <button key={i.id} onClick={() => setIntervento(i.id)} className={chip(intervento === i.id)}>
            {i.label}
          </button>
        ))}
      </div>

      <FieldLabel>Sede</FieldLabel>
      <div className="mb-6 flex gap-2">
        {SEDI.map((s) => (
          <button key={s.id} onClick={() => setSede(s.id)} className={chip(sede === s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <FieldLabel>Giorno</FieldLabel>
      <div className="mb-6 flex flex-wrap gap-2">
        {giorni.length === 0 ? (
          <span className="py-2 text-sm text-avorio/40">Caricamento disponibilità…</span>
        ) : (
          giorni.map((g) => {
            const active = giornoIso === g.iso;
            return (
              <button
                key={g.iso}
                onClick={() => setGiornoIso(g.iso)}
                className={`min-w-[58px] rounded-lg border-[1.5px] px-3.5 py-2.5 text-center transition-colors ${
                  active ? "border-primary bg-primary/[0.16] text-primary" : "border-avorio/20 bg-navy-deep text-avorio/80 hover:border-primary/60"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.1em] opacity-70">{g.dow}</span>
                <span className="block font-display text-lg font-semibold leading-tight">{g.day}</span>
              </button>
            );
          })
        )}
      </div>

      <FieldLabel>Fascia oraria{giornoIso ? "" : " (scegli prima il giorno)"}</FieldLabel>
      <div className="mb-6 flex flex-wrap gap-2">
        {FASCE.map((f) => {
          const disp = giornoIso ? slotDisponibile(sede, giornoIso, f.id) : true;
          const disabled = !giornoIso || !disp;
          return (
            <button
              key={f.id}
              onClick={() => !disabled && setFascia(f.id)}
              disabled={disabled}
              className={chip(fascia === f.id, disabled)}
            >
              {f.label}
              {giornoIso && !disp ? " · Completo" : ""}
            </button>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <FieldLabel>Nome *</FieldLabel>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <FieldLabel>Telefono *</FieldLabel>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-primary"
          />
        </label>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      <button
        onClick={book}
        disabled={!canBook || submitting}
        className="w-full rounded-md bg-primary px-6 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy disabled:cursor-not-allowed disabled:bg-primary/25 disabled:text-avorio/40"
      >
        {submitting ? "Invio in corso…" : canBook ? "Prenota intervento" : "Scegli giorno, fascia e dati"}
      </button>

      <a
        href={waLink(waText)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block rounded-md border-[1.5px] border-primary/50 px-6 py-3.5 text-center font-display text-[14px] font-semibold uppercase tracking-[0.05em] text-primary no-underline"
      >
        Oppure scrivici su WhatsApp
      </a>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">{children}</span>;
}

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 px-4 py-3 ${last ? "" : "border-b border-avorio/10"}`}>
      <span className="text-xs uppercase tracking-[0.1em] text-avorio/55">{k}</span>
      <span className="text-sm font-semibold text-avorio">{v}</span>
    </div>
  );
}
