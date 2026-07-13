"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent, OPEN_CONSENT_EVENT, type ConsentValue } from "@/lib/consent";

/**
 * Consent banner. No tracking/analytics is loaded anywhere on the site, so the
 * site is compliant by default; this banner records the user's choice and is
 * the gate any future tracker must sit behind (via hasAnalyticsConsent). Shows
 * on first visit until a choice is made, and can be re-opened from the
 * "Preferenze cookie" link (OPEN_CONSENT_EVENT).
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const choose = (v: ConsentValue) => {
    setConsent(v);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Informativa sui cookie"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6"
    >
      <div className="mx-auto max-w-4xl rounded-lg border border-primary/30 bg-navy-black/95 p-5 shadow-2xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm leading-relaxed text-avorio/80">
            <span className="font-display font-semibold uppercase tracking-[0.05em] text-avorio">Cookie</span>{" "}
            Usiamo solo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso potremmo in
            futuro usare cookie di statistica per migliorarlo. Dettagli nella{" "}
            <Link href="/cookie-policy" className="text-primary underline-offset-2 hover:underline">
              Cookie Policy
            </Link>
            .
          </div>
          <div className="flex flex-none flex-wrap items-center gap-2.5">
            <Link
              href="/preferenze-cookie"
              className="rounded-md border-[1.5px] border-avorio/30 px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.05em] text-avorio/80 no-underline transition-colors hover:border-primary/60 hover:text-avorio"
            >
              Preferenze
            </Link>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="rounded-md border-[1.5px] border-avorio/40 px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.05em] text-avorio transition-colors hover:border-primary/70"
            >
              Solo necessari
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-md bg-primary px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.05em] text-navy transition-colors hover:bg-primary-light"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
