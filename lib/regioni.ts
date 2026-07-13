import { CENTRI, type Centro } from "./centri";

// Each Italian region maps to the geographically nearest Italia Coperta centre.
// This drives the configurator's automatic centre assignment (brief §5,
// "assegnazione automatica del centro più vicino in base a regione/area").
export const REGIONE_TO_CENTRO: Record<string, string> = {
  "Valle d'Aosta": "torino",
  Piemonte: "torino",
  Liguria: "torino",
  Lombardia: "lombardia",
  "Trentino-Alto Adige": "padova",
  Veneto: "padova",
  "Friuli-Venezia Giulia": "padova",
  "Emilia-Romagna": "bologna",
  Toscana: "bologna",
  Umbria: "roma",
  Marche: "roma",
  Lazio: "roma",
  Abruzzo: "roma",
  Molise: "angri",
  Campania: "angri",
  Puglia: "bari",
  Basilicata: "bari",
  Calabria: "angri",
  Sicilia: "angri",
  Sardegna: "roma",
};

export const REGIONI: string[] = Object.keys(REGIONE_TO_CENTRO);

export function getCentroForRegione(regione: string): Centro | undefined {
  const id = REGIONE_TO_CENTRO[regione];
  if (!id) return undefined;
  return CENTRI.find((c) => c.id === id);
}
