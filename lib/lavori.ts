// Lavori realizzati — foto reali di lavori Di Riso Teloni.
// Single source of truth per la pagina /lavori e l'anteprima in home.
// Descrizioni volutamente asciutte: solo ciò che si vede nella foto.
// Per aggiungere un lavoro: metti la foto in /public/images/lavori/ e aggiungi
// una voce qui (width/height = dimensioni reali del file).

export type Lavoro = {
  slug: string;
  titolo: string;
  cliente?: string;
  descrizione: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  /** Video breve (mp4 H.264, senza audio, muto in loop). `image` fa da copertina. */
  video?: string;
};

export const LAVORI: Lavoro[] = [
  {
    slug: "telo-tetto-krone",
    titolo: "Telo tetto nuovo",
    descrizione: "Il nuovo telo tetto bianco steso su tutta la lunghezza del semirimorchio, con l'adesivo Di Riso Teloni sull'angolo.",
    image: "/images/lavori/telo-tetto-krone-poster.jpg",
    video: "/videos/telo-tetto-krone.mp4",
    alt: "Video: telo tetto bianco nuovo montato su un semirimorchio blu, con adesivo Di Riso Teloni",
    width: 720,
    height: 1280,
  },
  {
    slug: "sostituzione-teli",
    titolo: "Sostituzione teli laterali",
    descrizione: "Nuovi teli bianchi montati sul semirimorchio; a terra i vecchi teli appena smontati.",
    image: "/images/lavori/sostituzione-teli.jpg",
    alt: "Semirimorchio con nuovi teli laterali bianchi Di Riso Teloni e vecchi teli rossi smontati a terra",
    width: 1200,
    height: 1600,
  },
  {
    slug: "panormus-laterale",
    titolo: "Teli laterali con logo e contatti",
    cliente: "Servizi e Logistica Panormus SRL",
    descrizione: "Teli laterali blu per semirimorchio con logo, ragione sociale, email e sito del cliente.",
    image: "/images/lavori/panormus-laterale.jpg",
    alt: "Semirimorchio con teli laterali blu e grafica Servizi e Logistica Panormus SRL",
    width: 1200,
    height: 900,
  },
  {
    slug: "eca-teli-laterali",
    titolo: "Teli laterali personalizzati",
    cliente: "ECA International Transport S.R.L.",
    descrizione: "Teli laterali blu con la scritta del cliente e tetto bianco, rifiniti sul semirimorchio.",
    image: "/images/lavori/eca-teli-laterali.jpg",
    alt: "Semirimorchio con teli laterali blu ECA International Transport e tetto bianco",
    width: 1072,
    height: 1429,
  },
  {
    slug: "montaggio-telo",
    titolo: "Montaggio sul mezzo",
    descrizione: "Montaggio del telone direttamente sul semirimorchio, sotto tettoia.",
    image: "/images/lavori/montaggio-telo.jpg",
    alt: "Tecnici Di Riso Teloni montano il telone su un semirimorchio da una scala",
    width: 1179,
    height: 1572,
  },
  {
    slug: "telo-nero-lucido",
    titolo: "Telo nero lucido",
    descrizione: "Teli laterali neri a finitura lucida con fascia rifrangente, ultimi controlli prima della consegna.",
    image: "/images/lavori/telo-nero-lucido.jpg",
    alt: "Semirimorchio con teli laterali neri lucidi e fascia rifrangente bianca",
    width: 900,
    height: 1200,
  },
  {
    slug: "panormus-dettaglio",
    titolo: "Grafica a tutta fiancata",
    cliente: "Servizi e Logistica Panormus SRL",
    descrizione: "Lo stesso lavoro visto da vicino: logo e testi stampati sul telo laterale.",
    image: "/images/lavori/panormus-consegna.jpg",
    alt: "Dettaglio del telo laterale blu Servizi e Logistica Panormus con logo e contatti",
    width: 1200,
    height: 1600,
  },
  {
    slug: "sostituzione-dettaglio",
    titolo: "Finiture del telo nuovo",
    descrizione: "Dettaglio del telo bianco appena montato: cinghie con cricchetti, fascia rifrangente e adesivo Di Riso Teloni.",
    image: "/images/lavori/sostituzione-dettaglio.jpg",
    alt: "Dettaglio del telo laterale bianco con cinghie, cricchetti, fascia rifrangente e adesivo Di Riso Teloni",
    width: 1200,
    height: 1600,
  },
];
