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

  const btn =
    "rounded px-3 py-2 font-display text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-colors md:px-4 md:text-[12px]";

  // Compact bar: one short line + three small buttons. The old card covered
  // about a third of the screen on mobile, right over the hero CTAs.
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Informativa sui cookie"
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-2.5 rounded-md border border-primary/30 bg-navy-black/95 px-4 py-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-[12.5px] leading-snug text-avorio/80 md:text-[13px]">
          Usiamo solo cookie tecnici.{" "}
          <Link href="/cookie-policy" className="text-primary underline underline-offset-2">
            Cookie Policy
          </Link>
        </p>
        <div className="flex flex-none items-center gap-2">
          <Link
            href="/preferenze-cookie"
            className={`${btn} text-avorio/70 underline-offset-2 hover:text-avorio hover:underline`}
          >
            Preferenze
          </Link>
          <button
            type="button"
            onClick={() => choose("rejected")}
            className={`${btn} border-[1.5px] border-avorio/40 text-avorio hover:border-primary/70`}
          >
            Solo necessari
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className={`${btn} bg-primary text-white hover:bg-primary-dark`}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
