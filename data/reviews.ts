// Recensioni clienti — FONTE UNICA.
//
// ⚠️ TUTTI I CAMPI SONO PLACEHOLDER finché non arrivano recensioni reali.
// Sostituire rating / text / customer / date (ed eventuale source / image) con i
// dati veri prima di considerarle pubblicate. NON inventare recensioni, nomi,
// aziende, date o valutazioni: finché sono placeholder devono restare
// riconoscibili come tali. Per aggiungerne di nuove basta appendere qui: i
// componenti grafici non vanno toccati.

export interface Review {
  rating: number;
  text: string;
  customer: string;
  service: string;
  date: string;
  source?: "Google";
  image?: string;
}

export const reviews: Review[] = [
  {
    rating: 5,
    text: "[PLACEHOLDER - testo reale da inserire]",
    customer: "[PLACEHOLDER - nome/azienda]",
    service: "Completo laterali e tetto",
    date: "[PLACEHOLDER]",
    source: "Google",
  },
  {
    rating: 5,
    text: "[PLACEHOLDER - testo reale da inserire]",
    customer: "[PLACEHOLDER - nome/azienda]",
    service: "Riparazione rapida",
    date: "[PLACEHOLDER]",
    source: "Google",
  },
  {
    rating: 5,
    text: "[PLACEHOLDER - testo reale da inserire]",
    customer: "[PLACEHOLDER - nome/azienda]",
    service: "Personalizzazione grafica",
    date: "[PLACEHOLDER]",
  },
  {
    rating: 5,
    text: "[PLACEHOLDER - testo reale da inserire]",
    customer: "[PLACEHOLDER - nome/azienda]",
    service: "Sostituzione telo tetto",
    date: "[PLACEHOLDER]",
    source: "Google",
  },
  {
    rating: 5,
    text: "[PLACEHOLDER - testo reale da inserire]",
    customer: "[PLACEHOLDER - nome/azienda]",
    service: "Montaggio",
    date: "[PLACEHOLDER]",
  },
  {
    rating: 5,
    text: "[PLACEHOLDER - testo reale da inserire]",
    customer: "[PLACEHOLDER - nome/azienda]",
    service: "Telo su misura",
    date: "[PLACEHOLDER]",
    source: "Google",
  },
];

// Link alla scheda Google Business — inserire l'URL reale.
export const googleReviewUrl = "PLACEHOLDER_INSERIRE_LINK_REALE_GOOGLE_BUSINESS";

/** Elenco dei servizi presenti fra le recensioni, per il filtro in /recensioni. */
export const serviziRecensioni: string[] = Array.from(new Set(reviews.map((r) => r.service)));

/** Recensione più pertinente a un servizio (match parziale), per la prova
 *  sociale nelle pagine di conversione. Fallback alla prima disponibile. */
export function reviewForService(keyword: string): Review | undefined {
  const k = keyword.toLowerCase();
  return reviews.find((r) => r.service.toLowerCase().includes(k)) ?? reviews[0];
}
