// Recensioni clienti — FONTE UNICA.
//
// Recensioni reali, verificate dalla scheda Google Business di Di Riso
// Teloni Italia (5,0★, 7 recensioni). Per aggiungerne di nuove basta
// appendere qui: i componenti grafici non vanno toccati.

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
    text: "Ho sostituito i teli laterali alla motrice, lavoro perfetto complimenti",
    customer: "Gerardo Coppola",
    service: "Sostituzione teli laterali",
    date: "Marzo 2026",
    source: "Google",
  },
  {
    rating: 5,
    text: "Persone serie, ho effettuato 3 montaggi a Brescia e tutto è andato bene",
    customer: "Nicole Alessandro",
    service: "Montaggio",
    date: "Marzo 2026",
    source: "Google",
  },
  {
    rating: 5,
    text: "I migliori nel settore",
    customer: "Tiziano Tagliaferri",
    service: "Fornitura teloni",
    date: "Aprile 2026",
    source: "Google",
  },
  {
    rating: 5,
    text: "Ho fatto una motrice da voi, materiale ottimo e ragazzi con voglia di fare. Vi auguro belle cose",
    customer: "Andrea Chiavazzo",
    service: "Motrice completa",
    date: "Giugno 2026",
    source: "Google",
  },
  {
    rating: 5,
    text: "I migliori nel settore! Professionisti che sanno ascoltare le necessità del cliente!",
    customer: "Walter D'Ambrosio",
    service: "Fornitura teloni",
    date: "Giugno 2026",
    source: "Google",
  },
  {
    rating: 5,
    text: "Persone serie e professionali, ho fatto i laterali al mio Scania, lavoro egregio.",
    customer: "Angela Spitale",
    service: "Laterali Scania",
    date: "Giugno 2026",
    source: "Google",
  },
  {
    rating: 5,
    text: "Lavoro top, il semirimorchio sembrava un frigo per quanto fosse steso bene il telo.",
    customer: "Davide Alessandro",
    service: "Telo semirimorchio",
    date: "Giugno 2026",
    source: "Google",
  },
];

// Link alla scheda Google Business per lasciare una recensione.
export const googleReviewUrl = "https://share.google/ENxpSuGMiY1gxh47Z";

/** Elenco dei servizi presenti fra le recensioni, per il filtro in /recensioni. */
export const serviziRecensioni: string[] = Array.from(new Set(reviews.map((r) => r.service)));

/** Recensione più pertinente a un servizio (match parziale), per la prova
 *  sociale nelle pagine di conversione. Fallback alla prima disponibile. */
export function reviewForService(keyword: string): Review | undefined {
  const k = keyword.toLowerCase();
  return reviews.find((r) => r.service.toLowerCase().includes(k)) ?? reviews[0];
}
