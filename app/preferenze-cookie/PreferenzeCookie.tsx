"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent, CONSENT_CHANGED_EVENT } from "@/lib/consent";

/**
 * Manage / revoke cookie consent. Necessary cookies are always on; the only
 * optional category is statistics (off until accepted). Saving updates the same
 * consent store the banner uses.
 */
export function PreferenzeCookie() {
  const [analytics, setAnalytics] = useState(false);
  const [saved, setSaved] = useState<null | "accepted" | "rejected">(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setAnalytics(getConsent() === "accepted");
    sync();
    setReady(true);
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  const save = () => {
    const value = analytics ? "accepted" : "rejected";
    setConsent(value);
    setSaved(value);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-4">
        <div className="rounded-lg border border-avorio/[0.14] bg-navy p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                Cookie necessari
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-avorio/65">
                Indispensabili al funzionamento del sito (preferenze, sicurezza, invio dei form). Sempre attivi.
              </p>
            </div>
            <span className="flex-none rounded-full border border-avorio/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-avorio/50">
              Sempre attivi
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-avorio/[0.14] bg-navy p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                Cookie di statistica
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-avorio/65">
                Ci aiuterebbero a capire come viene usato il sito per migliorarlo. Al momento non sono attivi
                strumenti di questo tipo: il tuo consenso li abiliterà solo quando saranno introdotti.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={analytics}
              aria-label="Cookie di statistica"
              onClick={() => setAnalytics((v) => !v)}
              className={[
                "relative mt-1 h-6 w-11 flex-none rounded-full transition-colors",
                analytics ? "bg-primary" : "bg-avorio/20",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-navy-black transition-transform",
                  analytics ? "translate-x-[22px]" : "translate-x-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!ready}
          className="rounded-md bg-primary px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-navy transition-colors hover:bg-primary-light disabled:opacity-60"
        >
          Salva preferenze
        </button>
        <Link
          href="/cookie-policy"
          className="rounded-md border-[1.5px] border-avorio/40 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline transition-colors hover:border-primary/70"
        >
          Cookie Policy
        </Link>
        {saved && (
          <span className="text-sm text-tricolore-verde">
            {saved === "accepted" ? "Preferenze salvate: statistica attiva." : "Preferenze salvate: solo necessari."}
          </span>
        )}
      </div>
    </div>
  );
}
