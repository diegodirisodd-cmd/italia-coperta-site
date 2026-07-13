"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { waLink, WHATSAPP_NUMBER } from "@/lib/site";

const STORAGE_KEY = "italiacoperta.configuratore.v1";

export function ConfermaContent() {
  const params = useSearchParams();
  const reference = params.get("ref") ?? "";

  // The request is submitted — clear any lingering wizard state so a fresh
  // visit to /configuratore starts clean.
  useEffect(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const waMessage = reference
    ? `Ciao, ho inviato la richiesta rif. ${reference} dal configuratore. Vorrei procedere con il preventivo.`
    : "Ciao, ho inviato una richiesta dal configuratore. Vorrei procedere con il preventivo.";

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-primary/25 bg-navy p-8 text-center md:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-navy">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold uppercase text-avorio md:text-4xl">
        Richiesta inviata
      </h1>
      <p className="mx-auto mt-3 max-w-md text-avorio/75">
        Richiesta inviata correttamente. Ti ricontatteremo al più presto per definire il
        preventivo o l&apos;intervento più adatto.
      </p>
      {reference && (
        <p className="mt-2 text-sm text-avorio/50">
          Riferimento richiesta: <span className="text-primary">{reference}</span>
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={waLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-primary px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-navy no-underline transition-colors hover:bg-primary-light"
        >
          Invia anche su WhatsApp
        </a>
        <a
          href={`tel:+${WHATSAPP_NUMBER}`}
          className="rounded-md border-[1.5px] border-avorio/40 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
        >
          Richiedi chiamata
        </a>
        <Link
          href="/configuratore"
          className="rounded-md border-[1.5px] border-avorio/40 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
        >
          Nuova richiesta
        </Link>
        <Link
          href="/"
          className="rounded-md border-[1.5px] border-avorio/40 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
