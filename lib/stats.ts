// Company figures used by the counters.
// yearsOfExperience is derived from the founding year so it never goes stale
// (1950 → 76 nel 2026). ANNUAL_PVC_SQM is a real confirmed number, kept here so
// it can be updated in one place.

export const FOUNDING_YEAR = 1950;
export const yearsOfExperience = new Date().getFullYear() - FOUNDING_YEAR;

/** m² di PVC lavorati ogni anno (dato reale confermato, aggiornabile qui). */
export const ANNUAL_PVC_SQM = 70000;

/** Italian thousands separator, deterministic (no Intl → niente mismatch SSR/CSR). */
export function itThousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
