"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useConfiguratore } from "../ConfiguratoreProvider";
import { StepHeader } from "../ui";
import { buildRiepilogo } from "@/lib/configuratore/riepilogo";
import { mezzoLabel } from "@/lib/configuratore/mezzi";
import { macroLabel } from "@/lib/configuratore/richiesta";
import { waLink, WHATSAPP_NUMBER } from "@/lib/site";

const STORAGE_KEY = "italiacoperta.configuratore.v1";

/**
 * STEP 9 — Riepilogo e invio (spec §2). Renders only the fields actually filled
 * for the chosen branch (buildRiepilogo), then submits to /api/configuratore
 * and redirects to the confirmation page. "Invia anche su WhatsApp" also opens
 * the wa.me deep link (client-side link — no Business API).
 */
export function StepRiepilogo() {
  const { state, dispatch, visibleSteps } = useConfiguratore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sections = buildRiepilogo(state);

  const waMessage = `Ciao, ho inviato una richiesta dal configuratore (rif. ${state.reference}).
Mezzo: ${mezzoLabel(state.tipologiaMezzo)}
Richiesta: ${macroLabel(state.macroCategoria)}
Vorrei procedere con il preventivo.`;

  async function submit(openWhatsApp: boolean) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/configuratore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      if (!res.ok) throw new Error("Invio non riuscito");
      const json = (await res.json()) as { reference: string };
      if (openWhatsApp) window.open(waLink(waMessage), "_blank", "noopener");
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      router.push(`/configuratore/conferma?ref=${encodeURIComponent(json.reference)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <StepHeader
        title="Riepilogo e invio"
        sub="Controlla la tua richiesta e invia: ti ricontattiamo noi, senza impegno."
      />

      <div className="mt-8 space-y-5">
        {sections.map((sec) => (
          <div key={sec.title} className="overflow-hidden rounded-lg border border-avorio/[0.14]">
            <div className="border-b border-avorio/10 bg-navy-deep px-4 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
              {sec.title}
            </div>
            <div>
              {sec.rows.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-start justify-between gap-4 px-4 py-2.5 ${
                    i < sec.rows.length - 1 ? "border-b border-avorio/[0.08]" : ""
                  }`}
                >
                  <span className="text-xs uppercase tracking-[0.08em] text-avorio/55">{r.label}</span>
                  <span className="max-w-[60%] text-right text-sm text-avorio">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-5 rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary-light">{error}</p>}

      <div className="mt-8 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={submitting}
            className="flex-1 rounded-md bg-primary px-6 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Invio in corso…" : "Invia richiesta"}
          </button>
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={submitting}
            className="flex-1 rounded-md border-[1.5px] border-tricolore-verde/70 px-6 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-avorio transition-colors hover:border-tricolore-verde disabled:cursor-not-allowed disabled:opacity-60"
          >
            Invia anche su WhatsApp
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO_TO_STEP", step: visibleSteps[0] })}
            disabled={submitting}
            className="rounded-md border-[1.5px] border-avorio/40 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio transition-colors hover:border-primary/70 disabled:opacity-60"
          >
            Modifica richiesta
          </button>
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="rounded-md border-[1.5px] border-avorio/40 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
          >
            Richiedi chiamata
          </a>
          <Link
            href="/"
            className="rounded-md border-[1.5px] border-avorio/40 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
