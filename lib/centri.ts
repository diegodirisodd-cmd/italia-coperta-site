import { TEL_DISPLAY } from "./site";

export type StatoCentro = "attivo" | "prossima-apertura";

export type Centro = {
  id: string;
  citta: string;
  tipo: string;
  /** Only Angri (sede) and the Lombardia coverage area are operational today;
   *  the rest are planned. */
  stato: StatoCentro;
  /** Region/area label, used for the "prossima apertura" pins. */
  area: string;
  indirizzo: string;
  servizi: string;
  tel: string;
  /** Position on the stylized Italy map, in % of the map's bounding box. */
  x: number;
  y: number;
};

// Ported from the "Italia Coperta" mockup. Today the Angri (SA) sede and the
// Lombardia coverage area are operational; the other locations are network
// expansion slots ("prossima apertura", brief §5). All contact numbers point to
// the single company line (TEL_DISPLAY).
export const CENTRI: Centro[] = [
  { id: "torino", citta: "Torino", tipo: "Centro partner", stato: "prossima-apertura", area: "Piemonte", indirizzo: "Piemonte", servizi: "Vendita · Riparazione", tel: TEL_DISPLAY, x: 22, y: 26 },
  { id: "milano", citta: "Milano", tipo: "Centro partner", stato: "prossima-apertura", area: "Lombardia", indirizzo: "Lombardia", servizi: "Vendita · Montaggio", tel: TEL_DISPLAY, x: 33, y: 24 },
  { id: "lombardia", citta: "Lombardia", tipo: "Area di copertura", stato: "attivo", area: "Lombardia", indirizzo: "Copertura Nord Italia", servizi: "Produzione · Vendita · Riparazione rapida", tel: TEL_DISPLAY, x: 28.8, y: 13.8 },
  { id: "padova", citta: "Padova", tipo: "Centro partner", stato: "prossima-apertura", area: "Nord-Est", indirizzo: "Nord-Est", servizi: "Vendita · Riparazione", tel: TEL_DISPLAY, x: 42.4, y: 16.5 },
  { id: "bologna", citta: "Bologna", tipo: "Centro partner", stato: "prossima-apertura", area: "Emilia-Romagna", indirizzo: "Emilia-Romagna", servizi: "Vendita · Montaggio", tel: TEL_DISPLAY, x: 37.8, y: 23.6 },
  { id: "roma", citta: "Roma", tipo: "Centro partner", stato: "prossima-apertura", area: "Lazio", indirizzo: "Lazio", servizi: "Vendita · Riparazione", tel: TEL_DISPLAY, x: 46.8, y: 46.1 },
  { id: "angri", citta: "Angri (SA)", tipo: "Sede principale", stato: "attivo", area: "Campania", indirizzo: "Via dei Goti 183, Angri (SA)", servizi: "Produzione · Vendita · Riparazione · Configuratore", tel: TEL_DISPLAY, x: 63.5, y: 57.8 },
  { id: "bari", citta: "Bari", tipo: "Centro partner", stato: "prossima-apertura", area: "Puglia", indirizzo: "Puglia", servizi: "Vendita · Riparazione rapida", tel: TEL_DISPLAY, x: 82.4, y: 56.9 },
];

export function getCentro(id: string): Centro | undefined {
  return CENTRI.find((c) => c.id === id);
}

export const CENTRI_ATTIVI = CENTRI.filter((c) => c.stato === "attivo");
