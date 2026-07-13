// Cookie-consent state, shared by the banner and the preferences page.
// The site currently loads NO tracking/analytics; this is the gate that keeps
// it that way until the user opts in, and the mechanism to add trackers behind
// consent later (see hasAnalyticsConsent).

export type ConsentValue = "accepted" | "rejected";

const KEY = "italiacoperta.cookie-consent.v1";

/** Fired on window whenever consent changes (banner ↔ preferences page sync). */
export const CONSENT_CHANGED_EVENT = "ic:consent-changed";
/** Fired to (re)open the consent UI, e.g. from a "gestisci cookie" link. */
export const OPEN_CONSENT_EVENT = "ic:open-consent";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(KEY, value);
    // Mirror to a cookie (1 year) so the choice is also available server-side if
    // ever needed. SameSite=Lax, no tracking data — just the decision.
    document.cookie = `${KEY}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  } catch {
    // storage blocked — nothing else to do
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }));
}

/** True only when the user has actively accepted analytics/optional cookies. */
export function hasAnalyticsConsent(): boolean {
  return getConsent() === "accepted";
}

export function openConsentPreferences(): void {
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}
