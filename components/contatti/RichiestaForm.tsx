"use client";

import { useState } from "react";
import { SETTORI } from "@/lib/settori";

type Tipo = "contatto" | "preventivo";
type Form = {
  nome: string;
  azienda: string;
  email: string;
  telefono: string;
  settore: string;
  messaggio: string;
};

const EMPTY: Form = { nome: "", azienda: "", email: "", telefono: "", settore: "", messaggio: "" };

export function RichiestaForm({ tipo }: { tipo: Tipo }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.nome.trim() && form.email.trim() && form.telefono.trim() && form.messaggio.trim();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contatto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, ...form }),
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
      <div className="rounded-xl border border-primary/25 bg-navy p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-navy">
          ✓
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold uppercase text-avorio">
          {tipo === "preventivo" ? "Richiesta inviata" : "Messaggio inviato"}
        </h3>
        <p className="mt-2 text-avorio/75">
          {tipo === "preventivo"
            ? "Ti prepariamo un preventivo su misura e ti ricontattiamo a breve."
            : "Grazie! Ti rispondiamo il prima possibile."}
        </p>
        <p className="mt-1 text-sm text-avorio/50">
          Riferimento: <span className="text-primary">{reference}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-primary/[0.28] bg-navy p-6 md:p-8">
      <h3 className="mb-6 font-display text-2xl font-semibold uppercase tracking-[0.03em] text-avorio">
        {tipo === "preventivo" ? "Richiedi un preventivo" : "Scrivici"}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome e cognome *" value={form.nome} onChange={(v) => set("nome", v)} />
        <Field label="Azienda" value={form.azienda} onChange={(v) => set("azienda", v)} />
        <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} />
        <Field label="Telefono *" type="tel" value={form.telefono} onChange={(v) => set("telefono", v)} />
      </div>

      {tipo === "preventivo" && (
        <label className="mt-4 block">
          <FieldLabel>Prodotto / settore</FieldLabel>
          <select
            value={form.settore}
            onChange={(e) => set("settore", e.target.value)}
            className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-primary"
          >
            <option value="">Seleziona…</option>
            {SETTORI.map((s) => (
              <option key={s.slug} value={s.cardTitle}>
                {s.cardTitle}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="mt-4 block">
        <FieldLabel>{tipo === "preventivo" ? "Descrivi cosa ti serve *" : "Messaggio *"}</FieldLabel>
        <textarea
          value={form.messaggio}
          onChange={(e) => set("messaggio", e.target.value)}
          rows={4}
          placeholder={
            tipo === "preventivo"
              ? "Es. telone centinato per bilico 13,6 m, con stampa logo…"
              : "Come possiamo aiutarti?"
          }
          className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio placeholder:text-avorio/30 outline-none focus:border-primary"
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={!valid || submitting}
        className="mt-6 w-full rounded-md bg-primary px-6 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy disabled:cursor-not-allowed disabled:bg-primary/25 disabled:text-avorio/40"
      >
        {submitting ? "Invio in corso…" : tipo === "preventivo" ? "Invia richiesta" : "Invia messaggio"}
      </button>
      <p className="mt-3 text-center text-xs text-avorio/40">
        Ti ricontattiamo noi. Nessun impegno.
      </p>
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
        className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none focus:border-primary"
      />
    </label>
  );
}
