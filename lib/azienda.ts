// Company facts used across the site's stats/counters and copy.

// Founding year — "anni di attività" is always derived from this, never
// hardcoded, so the site never needs a manual update again.
export const FOUNDING_YEAR = 1950;

export function getYearsOfExperience(referenceYear: number = new Date().getFullYear()): number {
  return referenceYear - FOUNDING_YEAR;
}

// Estimate, not a certified figure — update this single value if it changes.
export const ANNUAL_PVC_SQUARE_METERS = 65000;

export const DATI_PRODUTTIVI_AGGIORNATI_AL = "31 dicembre 2025";
