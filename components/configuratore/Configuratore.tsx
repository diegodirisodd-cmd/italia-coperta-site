"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TruckPreview } from "./TruckPreview";
import {
  VEICOLI,
  TELI,
  MISURE,
  MATERIALI,
  COLORI,
  EXTRA,
  stimaPrezzo,
  labelOf,
} from "@/lib/configuratore";
import { REGIONI, getCentroForRegione } from "@/lib/regioni";

const STEPS = [
  { key: "veicolo", label: "Veicolo" },
  { key: "telo", label: "Telo" },
  { key: "misura", label: "Misura" },
  { key: "materiale", label: "Materiale" },
  { key: "extra", label: "Extra" },
  { key: "zona", label: "Zona" },
  { key: "dati", label: "Dati" },
  { key: "riepilogo", label: "Riepilogo" },
] as const;

type Dati = { nome: string; azienda: string; telefono: string; email: string; note: string };

export function Configuratore() {
  const [step, setStep] = useState(0);
  const [veicolo, setVeicolo] = useState("bilico");
  const [telo, setTelo] = useState("centinato");
  const [misura, setMisura] = useState("standard");
  const [materiale, setMateriale] = useState("pvc680");
  const [colore, setColore] = useState("navy");
  const [extra, setExtra] = useState<string[]>(["occhielli"]);
  const [regione, setRegione] = useState("");
  const [dati, setDati] = useState<Dati>({ nome: "", azienda: "", telefono: "", email: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const stima = useMemo(
    () => stimaPrezzo({ veicolo, telo, misura, materiale, extra }),
    [veicolo, telo, misura, materiale, extra],
  );
  const centro = useMemo(() => (regione ? getCentroForRegione(regione) : undefined), [regione]);
  const coloreHex = COLORI.find((c) => c.id === colore)?.hex ?? "#12335c";

  const toggleExtra = (id: string) =>
    setExtra((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const datiValidi = dati.nome.trim() && dati.telefono.trim() && dati.email.trim();
  const canProceed =
    (step === 5 ? !!regione : true) && (step === 6 ? !!datiValidi : true);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/preventivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selezione: { veicolo, telo, misura, materiale, colore, extra },
          regione,
          dati,
        }),
      });
      if (!res.ok) throw new Error("Invio non riuscito");
      const json = (await res.json()) as { reference: string };
      setReference(json.reference);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setReference(null);
    setStep(0);
    setRegione("");
    setDati({ nome: "", azienda: "", telefono: "", email: "", note: "" });
  }

  if (reference) {
    return (
      <Confirmation
        reference={reference}
        stima={stima.formatted}
        centro={centro}
        dati={dati}
        onReset={reset}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-oro/20 bg-oro/[0.16] lg:grid-cols-[1.35fr_0.9fr]">
      {/* LEFT: steps */}
      <div className="bg-navy p-6 md:p-9">
        {/* stepper */}
        <div className="mb-8 flex gap-1.5 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                className={[
                  "flex min-w-fit items-center gap-2 whitespace-nowrap rounded px-3 py-2 text-left transition-colors",
                  active ? "bg-navy-deep" : "bg-navy-black/50 hover:bg-navy-deep/70",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-display text-sm font-bold",
                    active ? "text-oro" : done ? "text-oro/70" : "text-avorio/35",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-[13px] ${active ? "text-avorio" : "text-avorio/55"}`}>{s.label}</span>
              </button>
            );
          })}
        </div>

        {step === 0 && (
          <StepShell title="Per quale veicolo?" sub="Seleziona il tipo di mezzo da coprire.">
            <OptionGrid options={VEICOLI} value={veicolo} onChange={setVeicolo} cols={2} />
          </StepShell>
        )}
        {step === 1 && (
          <StepShell title="Che tipo di telo?" sub="Ogni telo ha una tenuta e un utilizzo diversi.">
            <OptionGrid options={TELI} value={telo} onChange={setTelo} cols={1} withDesc />
          </StepShell>
        )}
        {step === 2 && (
          <StepShell title="Quale misura?" sub="Scegli il formato o indica che ti serve su misura.">
            <OptionGrid options={MISURE} value={misura} onChange={setMisura} cols={2} />
          </StepShell>
        )}
        {step === 3 && (
          <StepShell title="Materiale e colore" sub="Scegli grammatura del PVC e colore del telo.">
            <OptionGrid options={MATERIALI} value={materiale} onChange={setMateriale} cols={1} withDesc />
            <div className="mt-6">
              <span className="mb-3 block text-xs uppercase tracking-[0.14em] text-avorio/60">Colore</span>
              <div className="flex flex-wrap gap-3">
                {COLORI.map((c) => {
                  const sel = colore === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setColore(c.id)}
                      title={c.label}
                      className={`flex items-center gap-2 rounded-md border-[1.5px] px-3 py-2 text-[13px] transition-colors ${
                        sel ? "border-oro text-avorio" : "border-avorio/20 text-avorio/70 hover:border-oro/60"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-avorio/40" style={{ background: c.hex }} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </StepShell>
        )}
        {step === 4 && (
          <StepShell title="Aggiungi gli extra" sub="Opzionali. Puoi selezionarne quanti vuoi.">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {EXTRA.map((opt) => {
                const sel = extra.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleExtra(opt.id)}
                    className={`relative flex items-center gap-3 rounded-md border-[1.5px] bg-navy-deep px-4 py-4 text-left transition-colors ${
                      sel ? "border-oro" : "border-avorio/[0.14] hover:border-oro/60"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-none items-center justify-center rounded border-[1.5px] text-xs font-bold text-navy ${
                        sel ? "border-oro bg-oro" : "border-avorio/35 bg-transparent"
                      }`}
                    >
                      {sel ? "✓" : ""}
                    </span>
                    <span className="text-sm font-medium text-avorio">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}
        {step === 5 && (
          <StepShell title="In quale zona sei?" sub="Ti assegniamo automaticamente il centro Italia Coperta più vicino.">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-avorio/60">Regione</span>
              <select
                value={regione}
                onChange={(e) => setRegione(e.target.value)}
                className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3.5 text-avorio outline-none focus:border-oro"
              >
                <option value="">Seleziona la tua regione…</option>
                {REGIONI.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            {centro && (
              <div className="mt-5 rounded-md border border-oro/30 bg-navy-deep p-5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-oro">Centro assegnato</span>
                <div className="mt-1 font-display text-xl font-bold uppercase text-avorio">{centro.citta}</div>
                <div className="mt-1 text-sm text-avorio/70">{centro.indirizzo}</div>
                <div className="mt-1 text-sm text-oro">{centro.servizi}</div>
              </div>
            )}
          </StepShell>
        )}
        {step === 6 && (
          <StepShell title="I tuoi dati" sub="Ti ricontattiamo con il preventivo. Nessun impegno.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nome e cognome *" value={dati.nome} onChange={(v) => setDati({ ...dati, nome: v })} />
              <Field label="Azienda" value={dati.azienda} onChange={(v) => setDati({ ...dati, azienda: v })} />
              <Field label="Telefono *" value={dati.telefono} onChange={(v) => setDati({ ...dati, telefono: v })} type="tel" />
              <Field label="Email *" value={dati.email} onChange={(v) => setDati({ ...dati, email: v })} type="email" />
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-avorio/60">Note</span>
              <textarea
                value={dati.note}
                onChange={(e) => setDati({ ...dati, note: e.target.value })}
                rows={3}
                className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-oro"
              />
            </label>
          </StepShell>
        )}
        {step === 7 && (
          <StepShell title="Riepilogo richiesta" sub="Controlla e invia: ti richiamiamo noi.">
            <RiepilogoRows
              rows={[
                ["Veicolo", labelOf(VEICOLI, veicolo)],
                ["Telo", labelOf(TELI, telo)],
                ["Misura", labelOf(MISURE, misura)],
                ["Materiale", labelOf(MATERIALI, materiale)],
                ["Colore", labelOf(COLORI, colore)],
                ["Extra", extra.length ? extra.map((id) => labelOf(EXTRA, id)).join(", ") : "Nessuno"],
                ["Zona", regione || "—"],
                ["Centro", centro ? centro.citta : "—"],
                ["Contatto", dati.nome || "—"],
              ]}
            />
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
            <button
              onClick={submit}
              disabled={submitting}
              className="mt-6 w-full rounded-md bg-oro px-6 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Invio in corso…" : "Invia richiesta di preventivo"}
            </button>
          </StepShell>
        )}

        {/* nav */}
        <div className="mt-8 flex items-center justify-between border-t border-avorio/10 pt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md border-[1.5px] border-avorio/40 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio disabled:cursor-not-allowed disabled:border-avorio/10 disabled:text-avorio/30"
          >
            ← Indietro
          </button>
          <span className="text-xs uppercase tracking-[0.16em] text-avorio/50">
            Passo {step + 1} di {STEPS.length}
          </span>
          <button
            onClick={() => canProceed && setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1 || !canProceed}
            className="rounded-md bg-oro px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-navy disabled:cursor-not-allowed disabled:bg-oro/25 disabled:text-avorio/40"
          >
            Avanti →
          </button>
        </div>
      </div>

      {/* RIGHT: live preview + estimate */}
      <div className="flex flex-col bg-navy-black p-6 md:p-9">
        <span className="mb-5 text-[11px] uppercase tracking-[0.24em] text-avorio/50">Anteprima configurazione</span>
        <div className="mb-6 rounded-lg border border-oro/25 bg-navy p-5">
          <TruckPreview tarpColor={coloreHex} />
        </div>

        <div className="overflow-hidden rounded-lg border border-avorio/[0.12]">
          <SummaryRow label="Veicolo" value={labelOf(VEICOLI, veicolo)} />
          <SummaryRow label="Telo" value={labelOf(TELI, telo)} />
          <SummaryRow label="Misura" value={labelOf(MISURE, misura)} />
          <SummaryRow label="Materiale" value={labelOf(MATERIALI, materiale)} />
          <SummaryRow label="Extra" value={String(extra.length)} last />
        </div>

        <div className="mt-6 rounded-lg border border-oro/30 bg-navy p-5">
          <span className="text-[11px] uppercase tracking-[0.2em] text-avorio/55">Stima indicativa</span>
          <div className="mt-1 font-display text-3xl font-bold text-oro">{stima.formatted}</div>
          <p className="mt-1 text-xs text-avorio/50">Stima non vincolante. Il preventivo definitivo lo prepara il centro.</p>
        </div>

        {centro && (
          <div className="mt-4 rounded-lg border border-avorio/[0.14] bg-navy p-5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-oro">Centro più vicino</span>
            <div className="mt-1 font-display text-lg font-bold uppercase text-avorio">{centro.citta}</div>
            <div className="mt-1 text-sm text-avorio/70">{centro.tel}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 font-display text-2xl font-semibold uppercase tracking-[0.03em] text-avorio">{title}</h3>
      <p className="mb-6 text-sm text-avorio/60">{sub}</p>
      {children}
    </div>
  );
}

type OptionLike = { id: string; label: string; desc?: string };
function OptionGrid({
  options,
  value,
  onChange,
  cols,
  withDesc,
}: {
  options: OptionLike[];
  value: string;
  onChange: (id: string) => void;
  cols: 1 | 2;
  withDesc?: boolean;
}) {
  return (
    <div className={`grid gap-3.5 ${cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt) => {
        const sel = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`relative flex items-center justify-between gap-4 rounded-md border-[1.5px] bg-navy-deep px-5 py-4 text-left transition-colors ${
              sel ? "border-oro" : "border-avorio/[0.14] hover:border-oro/60"
            }`}
          >
            <span>
              <span className="block font-display text-[17px] font-semibold uppercase tracking-[0.02em] text-avorio">
                {opt.label}
              </span>
              {withDesc && opt.desc && <span className="mt-1 block text-[13px] text-avorio/60">{opt.desc}</span>}
              {sel && !withDesc && (
                <span className="mt-2 block text-[10.5px] font-semibold uppercase tracking-[0.18em] text-oro">
                  Selezionato
                </span>
              )}
            </span>
            {sel && withDesc && (
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-oro text-[13px] font-bold text-navy">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-avorio/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-oro"
      />
    </label>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3.5 ${last ? "" : "border-b border-avorio/10"}`}>
      <span className="text-xs uppercase tracking-[0.1em] text-avorio/55">{label}</span>
      <span className="text-right text-sm font-semibold text-avorio">{value}</span>
    </div>
  );
}

function RiepilogoRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-avorio/[0.14]">
      {rows.map(([k, v], i) => (
        <div
          key={k}
          className={`flex items-start justify-between gap-4 px-4 py-3 ${i < rows.length - 1 ? "border-b border-avorio/10" : ""}`}
        >
          <span className="text-xs uppercase tracking-[0.1em] text-avorio/55">{k}</span>
          <span className="text-right text-sm font-medium text-avorio">{v}</span>
        </div>
      ))}
    </div>
  );
}

function Confirmation({
  reference,
  stima,
  centro,
  dati,
  onReset,
}: {
  reference: string;
  stima: string;
  centro: ReturnType<typeof getCentroForRegione>;
  dati: Dati;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-oro/25 bg-navy p-8 text-center md:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-oro text-3xl font-bold text-navy">
        ✓
      </div>
      <h3 className="mt-6 font-display text-3xl font-bold uppercase text-avorio">Richiesta inviata</h3>
      <p className="mt-2 text-avorio/75">
        Grazie {dati.nome || ""}! Ti ricontattiamo a breve con il preventivo su misura.
      </p>
      <p className="mt-1 text-sm text-avorio/50">Riferimento richiesta: <span className="text-oro">{reference}</span></p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-center justify-between rounded-md border border-avorio/12 bg-navy-deep px-5 py-4">
          <span className="text-xs uppercase tracking-[0.12em] text-avorio/55">Stima indicativa</span>
          <span className="font-display text-xl font-bold text-oro">{stima}</span>
        </div>
        {centro && (
          <div className="flex items-center justify-between rounded-md border border-avorio/12 bg-navy-deep px-5 py-4">
            <span className="text-xs uppercase tracking-[0.12em] text-avorio/55">Centro assegnato</span>
            <span className="text-right">
              <span className="block font-display font-bold uppercase text-avorio">{centro.citta}</span>
              <span className="block text-sm text-avorio/70">{centro.tel}</span>
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={onReset}
          className="rounded-md border-[1.5px] border-avorio/40 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio"
        >
          Nuova richiesta
        </button>
        <Link
          href="/"
          className="rounded-md bg-oro px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
