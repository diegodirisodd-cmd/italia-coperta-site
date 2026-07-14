export type Settore = {
  slug: string;
  /** Keyword-secco H1 for the landing. */
  h1: string;
  /** Short card title used on the /settori index grid. */
  cardTitle: string;
  /** One-line summary for the index grid + hero subtitle. */
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  /** Body copy — 300-500 words, one string per paragraph. */
  body: string[];
  /** Highlight bullets shown alongside the copy. */
  highlights: string[];
  /** Caption for the main photo placeholder (shown until a real photo exists). */
  photoCaption: string;
  /** Real photo path under /public once available; falls back to the placeholder. */
  image?: string;
  /** Alt text for the real photo. */
  imageAlt?: string;
  /** Where the final CTA points and its label. */
  cta: { href: "/preventivo" | "/configuratore"; label: string };
};

// All 6 sectors are real Di Riso lines of business (brief Fase 2). Copy is
// original Italian, no lorem ipsum. teloni-pubblicitari bridges to Dodi Branding.
export const SETTORI: Settore[] = [
  {
    slug: "teloni-automezzi",
    h1: "Teloni per automezzi: motrici, rimorchi e centinati",
    cardTitle: "Teloni per automezzi",
    tagline: "Teloni su misura per bilici, motrici, rimorchi e furgoni centinati.",
    metaTitle: "Teloni per automezzi su misura — motrici, rimorchi, centinati",
    metaDescription:
      "Teloni per camion su misura dal 1950: motrici, rimorchi, bilici e furgoni centinati. Produzione propria, montaggio e riparazione ad Angri (SA) e in Lombardia.",
    photoCaption: "Foto reale: telone centinato montato su semirimorchio — da inserire",
    image: "/images/settori/teloni-automezzi.jpg",
    imageAlt: "Teloni per automezzi Di Riso Teloni — cinghie e fibbie di tensionamento su telone",
    body: [
      "Il telone di un automezzo lavora ogni giorno: sole, pioggia, vento a 100 all'ora, carico e scarico continui. Per questo dal 1950 costruiamo teloni per camion pensati per durare, non per essere sostituiti dopo una stagione. Ogni telo nasce su misura del tuo mezzo — motrice, rimorchio, bilico o furgone centinato — con il PVC spalmato che scegliamo in base al tipo di trasporto e alle sollecitazioni reali della tua tratta.",
      "Realizziamo teloni per centinati alla francese e a soffietto, cappotte ad archi, teli tetto scorrevoli, sponde laterali e teli fissi ad alta tenuta. Curiamo i dettagli che fanno la differenza sul lavoro: occhielli rinforzati in acciaio inox che non saltano, cinghie e tenditori robusti, bande rifrangenti a norma, angoli e cuciture ad alta frequenza dove il telo lavora di più. Se serve, integriamo tasche portadocumenti e rinforzi antivento.",
      "La differenza rispetto a chi rivende teli di terzi è che qui il telo lo produciamo noi: controlliamo materiale, misure e finiture, e se un domani serve una riparazione o una modifica sappiamo esattamente com'è fatto. Il montaggio lo facciamo direttamente nella nostra sede di Angri (SA) e nell'area di copertura in Lombardia, oppure attraverso i Centri Autorizzati Italia Coperta distribuiti sul territorio, così il tuo mezzo resta fermo il meno possibile.",
      "Ogni telone è coperto da garanzia sui materiali PVC e da assistenza su tutto il territorio nazionale: se hai un problema in viaggio, il centro più vicino può intervenire. Per gli strappi e i fori improvvisi mettiamo a disposizione anche il servizio di riparazione rapida, con prenotazione online.",
      "Non sai da dove partire? Con il configuratore costruisci la richiesta passo passo — mezzo, tipo di telo, misura ed extra — e ricevi un preventivo su misura senza impegno.",
    ],
    highlights: [
      "Centinati alla francese, a soffietto, cappotte ad archi",
      "Occhielli inox, cinghie robuste, bande rifrangenti a norma",
      "Prodotto, montato e riparato da noi",
      "Garanzia materiali PVC + assistenza su tutto il territorio",
    ],
    cta: { href: "/configuratore", label: "Configura il tuo telone" },
  },
  {
    slug: "tensostrutture-industriali",
    h1: "Tensostrutture industriali su misura",
    cardTitle: "Tensostrutture industriali",
    tagline: "Coperture e capannoni in telo per stoccaggio, produzione e logistica.",
    metaTitle: "Tensostrutture industriali su misura in PVC — dal 1950",
    metaDescription:
      "Tensostrutture industriali su misura: capannoni in telo, coperture per stoccaggio e logistica in PVC ad alta resistenza. Progettazione e installazione, dal 1950.",
    photoCaption: "Foto reale: tensostruttura industriale / capannone in telo — da inserire",
    image: "/images/settori/tensostrutture-industriali.jpg",
    imageAlt:
      "Tensostruttura industriale in PVC Di Riso Teloni — capannone in telo per stoccaggio e logistica",
    body: [
      "Quando serve spazio coperto in fretta — per stoccare merce, proteggere una linea di produzione o creare un'area di carico riparata — la tensostruttura in PVC è la risposta più rapida ed economica rispetto a un capannone tradizionale. Dal 1950 lavoriamo il telo su grandi superfici e portiamo la stessa cura artigianale del telone da camion alla copertura industriale su misura.",
      "Progettiamo e realizziamo tensostrutture per magazzini, depositi, aree logistiche, coperture di piazzali e passaggi tra edifici. La struttura viene dimensionata sulle tue esigenze di luce, altezza e carico, e il telo di copertura è in PVC spalmato ad alta resistenza, ignifugo dove richiesto, con finiture pensate per durare anni sotto sole e intemperie.",
      "Ogni progetto parte da un sopralluogo e dalle misure reali del sito: non esistono due tensostrutture identiche. Curiamo teli di copertura e di chiusura laterale, portoni e teli avvolgibili, finestrature, sistemi di ancoraggio e tensionamento. L'obiettivo è darti una copertura stabile, pulita nelle linee e semplice da gestire nel tempo.",
      "Il vantaggio di rivolgersi a noi è avere un unico interlocutore che produce il telo, lo installa e lo assiste: se un telo si danneggia o va sostituito dopo anni, sappiamo com'è fatto e interveniamo con i nostri centri sul territorio. Sui materiali PVC offriamo garanzia, e l'assistenza è attiva in tutta Italia.",
      "Raccontaci cosa devi coprire e con quali vincoli di spazio: ti prepariamo un preventivo su misura con soluzione tecnica e tempi di realizzazione.",
    ],
    highlights: [
      "Capannoni in telo, coperture piazzali, aree logistiche",
      "PVC spalmato ad alta resistenza, ignifugo su richiesta",
      "Progetto dimensionato su sopralluogo e misure reali",
      "Un unico interlocutore: produzione, installazione, assistenza",
    ],
    cta: { href: "/preventivo", label: "Richiedi un preventivo" },
  },
  {
    slug: "coperture-pvc",
    h1: "Coperture in PVC su misura",
    cardTitle: "Coperture in PVC",
    tagline: "Teli tecnici per proteggere merci, cantieri e stoccaggio all'aperto.",
    metaTitle: "Coperture in PVC su misura — teli tecnici di protezione",
    metaDescription:
      "Coperture in PVC su misura: teli tecnici per protezione merci, cantieri, macchinari e stoccaggio all'aperto. Materiali ad alta tenuta, dal 1950.",
    photoCaption: "Foto reale: telo tecnico in PVC su bancali / cantiere — da inserire",
    image: "/images/settori/coperture-pvc.jpg",
    imageAlt:
      "Copertura tecnica in PVC su misura Di Riso Teloni — telo di protezione per merci e stoccaggio all'aperto",
    body: [
      "Non tutto quello che va coperto sta sotto un tetto. Bancali di merce, macchinari fermi in cantiere, materiali stoccati in piazzale, cataste che devono restare asciutte per mesi: per tutto questo realizziamo coperture in PVC su misura, teli tecnici tagliati e confezionati sulle dimensioni esatte di ciò che devi proteggere.",
      "Dal 1950 lavoriamo il PVC spalmato in tutte le grammature: dai teli leggeri e maneggevoli per coperture temporanee, ai teli pesanti ad altissima tenuta per protezioni permanenti esposte a sole e vento. Confezioniamo teli piani, teli sagomati, cappucci e coperture avvolgenti, completi di occhielli, cinghie, elastici perimetrali e sistemi di fissaggio adatti al punto in cui il telo dovrà lavorare.",
      "Rispetto a un telo standard comprato a metraggio, la copertura su misura fa la differenza dove conta: aderisce bene, non impacca l'acqua, non sbatte al vento e non lascia scoperti gli angoli. Scegliamo insieme colore, grammatura e finiture in base alla durata che ti serve e all'ambiente in cui il telo verrà usato.",
      "Realizziamo coperture per aziende agricole, edilizia, industria e logistica, in pezzi singoli o in forniture ripetute per chi ha la stessa esigenza tutto l'anno. Sui materiali PVC diamo garanzia e, in caso di strappi o usura, i nostri centri sul territorio riparano il telo invece di farti ricomprare tutto.",
      "Descrivici cosa devi coprire e le misure: ti prepariamo un preventivo su misura, anche per forniture ricorrenti.",
    ],
    highlights: [
      "Teli piani, sagomati, cappucci e coperture avvolgenti",
      "Tutte le grammature di PVC spalmato, colore a scelta",
      "Occhielli, cinghie ed elastici adatti al fissaggio reale",
      "Pezzo singolo o fornitura ricorrente, con garanzia materiali",
    ],
    cta: { href: "/preventivo", label: "Richiedi un preventivo" },
  },
  {
    slug: "teloni-pubblicitari",
    h1: "Teloni pubblicitari per mezzi (Dodi Branding)",
    cardTitle: "Teloni pubblicitari",
    tagline: "Il tuo camion diventa un cartellone: stampa digitale su telo, con Dodi Branding.",
    metaTitle: "Teloni pubblicitari per camion — stampa digitale | Dodi Branding",
    metaDescription:
      "Teloni pubblicitari per camion e mezzi: stampa digitale su PVC ad alta definizione. Trasforma la flotta in pubblicità dinamica con Dodi Branding, dal 1950.",
    photoCaption: "Foto reale: telone camion con grafica pubblicitaria stampata — da inserire",
    image: "/images/settori/teloni-pubblicitari-climaconvenienza.jpg",
    imageAlt:
      "Telone pubblicitario per camion Di Riso Teloni — stampa digitale su PVC, pubblicità dinamica Dodi Branding",
    body: [
      "Un camion percorre decine di migliaia di chilometri all'anno, attraversa città, autostrade e centri logistici, e viene visto da migliaia di persone ogni giorno. Il suo telone è la superficie pubblicitaria più grande e più mobile che la tua azienda possiede. Con la stampa digitale su telo lo trasformiamo in un cartellone che viaggia.",
      "Uniamo la nostra esperienza nel telo dal 1950 alla stampa pubblicitaria ad alta definizione: realizziamo teloni per centinati, teli tetto e sponde con la tua grafica, loghi, immagini e messaggi stampati direttamente sul PVC, con inchiostri resistenti ai raggi UV e al lavaggio. Il risultato è un telo che fa il suo lavoro tecnico — coprire e proteggere il carico — e allo stesso tempo comunica il tuo marchio su strada.",
      "Questa linea è il ponte naturale verso <strong>Dodi Branding</strong>, il progetto dedicato alla pubblicità dinamica sui teloni dei camion: dalla singola motrice brandizzata fino alla gestione grafica di intere flotte, con un'immagine coordinata su tutti i mezzi. Se hai più veicoli, possiamo studiare una veste grafica unica e replicarla in modo coerente su tutta la flotta.",
      "Lavoriamo sul tuo file grafico o affianchiamo chi ti segue la comunicazione, curando risoluzione, colori e posizionamento perché la resa a mezzo in movimento sia leggibile e d'impatto. Il telo resta comunque un telo Di Riso: stessa qualità del PVC, stessi occhielli e cinghie, stessa possibilità di riparazione e assistenza sul territorio.",
      "Vuoi vedere il tuo mezzo brandizzato? Partiamo da un preventivo su misura: dimmi quanti mezzi e che tipo di telo, e ti proponiamo la soluzione stampa più adatta.",
    ],
    highlights: [
      "Stampa digitale HD su PVC, inchiostri resistenti a UV e lavaggio",
      "Centinati, teli tetto e sponde brandizzabili",
      "Ponte verso Dodi Branding — pubblicità dinamica su flotte",
      "Immagine coordinata replicabile su tutti i mezzi",
    ],
    cta: { href: "/preventivo", label: "Richiedi un preventivo" },
  },
  {
    slug: "gazebo-pergole",
    h1: "Gazebo e pergole in telo",
    cardTitle: "Gazebo e pergole",
    tagline: "Coperture in telo per esterni, eventi e attività commerciali.",
    metaTitle: "Gazebo e pergole in telo su misura — coperture per esterni",
    metaDescription:
      "Gazebo e pergole in telo su misura: coperture per dehors, eventi, cortili e attività commerciali. Teli in PVC resistenti e su misura, dal 1950.",
    photoCaption: "Foto reale: pergola / gazebo con copertura in telo su misura — da inserire",
    image: "/images/settori/gazebo-pergole.jpg",
    imageAlt:
      "Gazebo con copertura in telo su misura Di Riso Teloni — pergola in PVC per esterni ed eventi",
    body: [
      "Uno spazio esterno ben coperto si vive di più e si lavora meglio. Che sia il dehors di un bar, il cortile di casa, un'area espositiva o lo spazio di un evento, realizziamo gazebo e pergole in telo su misura, con la stessa qualità di PVC che mettiamo nei teloni da lavoro.",
      "Confezioniamo teli di copertura per pergole e strutture esistenti, teli avvolgibili e a caduta per le chiusure laterali, tende e frangivento. Il telo viene tagliato sulle misure reali della struttura, con occhielli, cinghie e sistemi di tensionamento che lo tengono in tensione e ordinato nel tempo, senza le pieghe e gli avvallamenti in cui ristagna l'acqua.",
      "Puoi scegliere il colore e la grammatura in base all'uso: teli più leggeri per una copertura stagionale, PVC pesante e ad alta tenuta per una soluzione che resta su tutto l'anno ed è esposta a sole, pioggia e vento. Per le attività commerciali possiamo anche personalizzare il telo con logo o grafica, sfruttando la nostra linea di stampa.",
      "Non produciamo strutture in serie da montare a incastro: lavoriamo sul tuo spazio e sulle tue misure, così la copertura calza bene e dura. E come per ogni nostro telo, i materiali PVC sono coperti da garanzia e l'assistenza è disponibile sul territorio, con possibilità di riparare il telo invece di sostituirlo.",
      "Raccontaci lo spazio da coprire e le dimensioni: ti prepariamo un preventivo su misura per la copertura giusta.",
    ],
    highlights: [
      "Teli di copertura, chiusure laterali, tende e frangivento",
      "Colore e grammatura in base all'uso stagionale o annuale",
      "Personalizzazione con logo per le attività commerciali",
      "Su misura reale dello spazio, con garanzia materiali",
    ],
    cta: { href: "/preventivo", label: "Richiedi un preventivo" },
  },
  {
    slug: "coperture-civili",
    h1: "Coperture civili: piscine e terrazzi",
    cardTitle: "Coperture civili",
    tagline: "Teli su misura per piscine, terrazzi e spazi privati.",
    metaTitle: "Coperture civili in telo — piscine e terrazzi su misura",
    metaDescription:
      "Coperture civili su misura: teli per piscine, terrazzi e spazi privati in PVC resistente. Protezione e durata con la qualità Di Riso, dal 1950.",
    photoCaption: "Foto reale: copertura in telo per piscina / terrazzo — da inserire",
    image: "/images/settori/coperture-civili.jpg",
    imageAlt:
      "Copertura civile in telo su misura Di Riso Teloni — telo di protezione per piscina o terrazzo in PVC",
    body: [
      "La qualità del telo che usiamo per il lavoro pesante la portiamo anche a casa tua. Realizziamo coperture civili su misura per piscine, terrazzi e spazi privati: teli tecnici che proteggono, durano e mantengono un aspetto pulito e ordinato anno dopo anno.",
      "Per le piscine confezioniamo teli di copertura invernale ed estiva su misura della vasca, che tengono fuori foglie e sporco, riducono l'evaporazione e proteggono l'acqua nei mesi di fermo. Il telo è in PVC resistente, con occhielli, cinghie ed elastici perimetrali dimensionati per restare in tensione anche con vento e carico d'acqua piovana, evitando ristagni e avvallamenti.",
      "Per terrazzi, logge e spazi esterni realizziamo teli ombreggianti, frangivento e coperture a protezione di arredi e strutture. Scegliamo insieme colore e grammatura perché la copertura si inserisca bene nel contesto e regga l'esposizione al sole e alle intemperie.",
      "Ogni copertura nasce sulle misure reali dello spazio: non sono teli standard adattati alla meglio, ma soluzioni tagliate e confezionate su misura. È lo stesso approccio artigianale che applichiamo dal 1950 ai teloni da camion, riportato alla dimensione domestica.",
      "Come per tutti i nostri prodotti, i materiali PVC sono coperti da garanzia e l'assistenza è disponibile sul territorio. Dimmi cosa devi coprire e le misure: ti preparo un preventivo su misura.",
    ],
    highlights: [
      "Teli copertura piscine, invernali ed estivi, su misura",
      "Teli ombreggianti e frangivento per terrazzi e logge",
      "PVC resistente con perimetro tensionato, niente ristagni",
      "Confezione su misura reale, con garanzia materiali",
    ],
    cta: { href: "/preventivo", label: "Richiedi un preventivo" },
  },
];

export function getSettore(slug: string): Settore | undefined {
  return SETTORI.find((s) => s.slug === slug);
}
