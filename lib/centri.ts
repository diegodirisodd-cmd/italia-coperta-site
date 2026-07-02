export type StatoCentro = "attivo" | "prossima-apertura";

export type Centro = {
  id: string;
  citta: string;
  tipo: string;
  /** Only Angri and Brescia are operational today; the rest are planned. */
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

// Ported from the "Italia Coperta" mockup. Today Angri (SA) and Brescia are
// the real operational sites; the other locations are network expansion slots
// ("prossima apertura", brief §5). Phone numbers beyond the two sedi are
// placeholders pending real data.
export const CENTRI: Centro[] = [
  { id: "torino", citta: "Torino", tipo: "Centro partner", stato: "prossima-apertura", area: "Piemonte", indirizzo: "Piemonte", servizi: "Vendita · Riparazione", tel: "011 000 0000", x: 22, y: 26 },
  { id: "milano", citta: "Milano", tipo: "Centro partner", stato: "prossima-apertura", area: "Lombardia", indirizzo: "Lombardia", servizi: "Vendita · Montaggio", tel: "02 000 0000", x: 33, y: 24 },
  { id: "brescia", citta: "Brescia", tipo: "Sede Nord", stato: "attivo", area: "Lombardia", indirizzo: "Brescia", servizi: "Produzione · Vendita · Riparazione rapida", tel: "030 000 0000", x: 40, y: 23 },
  { id: "padova", citta: "Padova", tipo: "Centro partner", stato: "prossima-apertura", area: "Nord-Est", indirizzo: "Nord-Est", servizi: "Vendita · Riparazione", tel: "049 000 0000", x: 49, y: 26 },
  { id: "bologna", citta: "Bologna", tipo: "Centro partner", stato: "prossima-apertura", area: "Emilia-Romagna", indirizzo: "Emilia-Romagna", servizi: "Vendita · Montaggio", tel: "051 000 0000", x: 46, y: 34 },
  { id: "roma", citta: "Roma", tipo: "Centro partner", stato: "prossima-apertura", area: "Lazio", indirizzo: "Lazio", servizi: "Vendita · Riparazione", tel: "06 000 0000", x: 47, y: 52 },
  { id: "angri", citta: "Angri (SA)", tipo: "Sede principale", stato: "attivo", area: "Campania", indirizzo: "Via dei Goti 183, Angri (SA)", servizi: "Produzione · Vendita · Riparazione · Configuratore", tel: "081 000 0000", x: 57, y: 63 },
  { id: "bari", citta: "Bari", tipo: "Centro partner", stato: "prossima-apertura", area: "Puglia", indirizzo: "Puglia", servizi: "Vendita · Riparazione rapida", tel: "080 000 0000", x: 74, y: 61 },
];

export function getCentro(id: string): Centro | undefined {
  return CENTRI.find((c) => c.id === id);
}

export const CENTRI_ATTIVI = CENTRI.filter((c) => c.stato === "attivo");
