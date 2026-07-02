"use client";

import { useState } from "react";
import { REGIONI } from "@/lib/regioni";

type Form = {
  azienda: string;
  referente: string;
  telefono: string;
  email: string;
  zona: string;
  attivita: string;
  messaggio: string;
};

const EMPTY: Form = { azienda: "", referente: "", telefono: "", email: "", zona: "", attivita: "", messaggio: "" };

export function CandidaturaForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.azienda.trim() && form.referente.trim() && form.telefono.trim() && form.email.trim() && form.zona;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/candidatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Invio non riuscito");
      const json = (await res.json()) as { reference: string };
      setReference(json.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-xl border border-oro/25 bg-navy p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-oro text-3xl font-bold text-navy">
          ✓
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold uppercase text-avorio">Candidatura inviata</h3>
        <p className="mt-2 text-avorio/75">
          Grazie! Valutiamo la tua candidatura e ti ricontattiamo per approfondire.
        </p>
        <p className="mt-1 text-sm text-avorio/50">
          Riferimento: <span className="text-oro">{reference}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-oro/[0.28] bg-navy p-6 md:p-8">
      <h3 className="mb-6 font-display text-2xl font-semibold uppercase tracking-[0.03em] text-avorio">
        Candidati come centro
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Azienda *" value={form.azienda} onChange={(v) => set("azienda", v)} />
        <Field label="Referente *" value={form.referente} onChange={(v) => set("referente", v)} />
        <Field label="Telefono *" type="tel" value={form.telefono} onChange={(v) => set("telefono", v)} />
        <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} />
      </div>

      <label className="mt-4 block">
        <FieldLabel>Zona / Regione *</FieldLabel>
        <select
          value={form.zona}
          onChange={(e) => set("zona", e.target.value)}
          className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-oro"
        >
          <option value="">Seleziona la regione…</option>
          {REGIONI.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <FieldLabel>Attività attuale</FieldLabel>
        <input
          value={form.attivita}
          onChange={(e) => set("attivita", e.target.value)}
          placeholder="Es. officina, gommista, carrozzeria, teloneria…"
          className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio placeholder:text-avorio/30 outline-none focus:border-oro"
        />
      </label>

      <label className="mt-4 block">
        <FieldLabel>Messaggio</FieldLabel>
        <textarea
          value={form.messaggio}
          onChange={(e) => set("messaggio", e.target.value)}
          rows={3}
          className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-oro"
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={!valid || submitting}
        className="mt-6 w-full rounded-md bg-oro px-6 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy disabled:cursor-not-allowed disabled:bg-oro/25 disabled:text-avorio/40"
      >
        {submitting ? "Invio in corso…" : "Invia candidatura"}
      </button>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-avorio/60">{children}</span>;
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
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-oro"
      />
    </label>
  );
}
