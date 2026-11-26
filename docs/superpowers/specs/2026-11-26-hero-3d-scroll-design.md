# Hero 3D a scorrimento — dirisoteloni1950.com

Data: 26/11/2026 · Stato: bozza da approvare · Solo Di Riso Teloni (Dodi Branding è fuori, si farà dopo)

## Intento e perché

Diego vuole che chi entra sul sito **percepisca subito quanto è premium**: la sensazione deve essere "questi sono di un altro livello", come davanti al sito di un marchio di fascia alta. Lo strumento scelto è un'animazione 3D "veramente bella e futuristica" in home.

Il 3D non deve spiegare un servizio né essere un configuratore: deve **alzare la percezione del marchio** nei primi secondi. Il resto della home (contenuti, CTA, SEO) resta com'è.

## Obiettivi

- In home, una sequenza 3D cinematografica che avanza e torna indietro con lo scroll (in stile pagine prodotto Apple).
- Qualità visiva da render: luci, riflessi, materiali realistici. Niente look "videogioco".
- Fluida su desktop e su telefono.
- Il sito resta veloce: Lighthouse mobile della home non sotto il valore attuale (da misurare prima di iniziare), CLS 0, LCP non peggiore di oggi.

## Non obiettivi

- 3D interattivo in tempo reale (girare il camion col mouse). Scartato a favore della sequenza pre-renderizzata.
- Dodi Branding: fuori da questo lavoro.
- Rifare le altre sezioni della home o le altre pagine.

## Anti-obiettivi (fallimento anche se "funziona")

- Il sito diventa lento o scatta durante lo scroll, soprattutto su telefono.
- La pagina resta vuota o nera mentre la sequenza si carica.
- Sembra un template, un effetto da plugin o un render amatoriale (plastica, luce piatta, aliasing).
- Si perde il messaggio commerciale: il titolo, "Richiedi preventivo" e "Configura il tuo telone" devono restare visibili e cliccabili subito.
- Chi ha "riduci movimento" attivo si trova un'animazione forzata.

## Vincoli

- Sito: Next.js 14.2.35, App Router, Tailwind, framer-motion già presente (LazyMotion). Branch di partenza `main` (allineato alla produzione), Vercel pubblica da main.
- **Niente `middleware.ts`** e CSP senza nonce (decisione di sicurezza esistente). La CSP permette `img-src 'self' data: blob:` e `connect-src 'self'` più Supabase/Turnstile: i fotogrammi vanno serviti dallo stesso dominio (`/public` o stessa origine), nessun CDN esterno senza aggiornare la CSP.
- Palette attuale del sito: sfondo gradiente #000000→#3533CD, rosso #E31919, rosso tricolore #D82427, verde #25904A, bianco. L'oro è stato eliminato e non va reintrodotto.
- Modelli 3D disponibili (fatti da Diego): `rilievo-teloni/public/models/trattore.glb` e `semirimorchio.glb` (compressi meshopt + quantizzazione, circa 400 KB l'uno). Servono solo per il rendering, non vengono caricati dal sito.
- Nessun dato inventato nei testi (regola del progetto).
- Accessibilità: `prefers-reduced-motion` va rispettato.

## Approcci considerati

1. **3D in tempo reale nel browser** (three.js / react-three-fiber), guidato dallo scroll e dal mouse. Interattivo e d'effetto, ma pesante (motore 3D + modelli + texture), rischioso per Lighthouse e per i telefoni deboli, con qualità di luce inferiore a un render.
2. **Sequenza di fotogrammi pre-renderizzati guidata dallo scroll** (scelta). Si renderizza offline una sequenza con un motore da cinema e la pagina la disegna su `<canvas>` in base allo scroll. Resa massima e carico leggero sul dispositivo. Non è interattiva e pesa in download, quindi i fotogrammi vanno ottimizzati e caricati a fasi.
3. **3D leggero decorativo** (shader di telo che ondeggia, particelle). Veloce ed elegante ma da solo non dà l'effetto "altro livello".

**Scelto: 2**, da Diego, per entrambi i siti; ora si fa solo Di Riso Teloni.

## Il racconto della sequenza (storyboard)

Titolo di lavoro: **"Il telo che copre l'Italia"**, coerente col claim già in hero ("Il telo che copre l'Italia — e ti copre in tutta Italia").

Su sfondo scuro nel gradiente del sito (nero → blu #3533CD), illuminazione da studio con un riflesso radente:

1. **Apertura (0–15%)**: la sagoma dell'Italia, fatta di tessuto PVC rosso con la trama visibile, fluttua in primo piano con una luce che la attraversa. Sul primo fotogramma compaiono già titolo e CTA attuali.
2. **Il telo prende forma (15–40%)**: la sagoma si distende e diventa il telo laterale che cala sul semirimorchio agganciato al trattore (i modelli di Diego); il tetto bianco è già al suo posto.
3. **Tensione (40–60%)**: il telo si tende sulla struttura, compaiono la fascia rifrangente e il marchio Di Riso Teloni sul fianco, la camera ruota attorno al bilico.
4. **Dettagli (60–85%)**: passaggi ravvicinati su cricchetto inox, cinghie, fascia rifrangente, con la trama del PVC in macro.
5. **Chiusura (85–100%)**: camera larga a tre quarti sul bilico finito. Appaiono "Configura il tuo telone" e "Richiedi preventivo".

Sopra la sequenza scorrono 3–4 testi brevi, uno per fase, presi da affermazioni già presenti sul sito: dal 1950, terza generazione, PVC lavorato, rilievo misure gratuito in tutta Italia.

## Come funziona sulla pagina (decisioni)

- **Posizione** *(deciso da Diego)*: la sequenza sostituisce la foto dell'hero attuale e diventa una sezione "agganciata" (sticky) di circa 3 schermate di scroll. Dopo l'ultimo fotogramma la pagina prosegue con StatsBand e il resto, invariati.

### Aspetto del bilico finito *(deciso da Diego)*

- Teli laterali **rossi** (come il telone della foto hero), **tetto bianco** come nel modello.
- Cabina del trattore **bianca**.
- Marchio Di Riso Teloni **grande al centro del fianco**, come sulla foto vera del camion; fascia rifrangente lungo i teli.
- **Primo fotogramma come immagine vera** (`<img>`/`<picture>` con priority), così l'LCP è un'immagine leggera come oggi e la pagina non è mai vuota. Il canvas subentra quando i primi fotogrammi sono pronti.
- **Titolo H1 e CTA restano HTML nel DOM** fin dal primo istante (SEO e cliccabilità), sovrapposti alla scena.
- **Due serie di fotogrammi**: desktop (orizzontale, circa 1920 px di larghezza) e mobile (verticale 3:4 o 9:16, circa 1080 px), con art direction come l'hero attuale (breakpoint md = 768 px). Ogni dispositivo scarica una sola serie.
- **Caricamento a fasi**: prima un fotogramma ogni 8, poi si riempiono i buchi; il resto si scarica solo dopo che la pagina è interattiva e solo quando l'utente inizia a scorrere o la sezione è visibile. Lo scroll mostra sempre il fotogramma più vicino già caricato.
- **Rete lenta / risparmio dati** (`navigator.connection.saveData` o 2G): niente sequenza, resta l'immagine fissa con i testi.
- **Riduci movimento**: niente scrub; si mostrano 3 fotogrammi chiave come immagini statiche con i testi.
- Disegno su `<canvas>` con `requestAnimationFrame`; lo scroll si legge in modo passivo. Nessuna libreria nuova obbligatoria (framer-motion `useScroll` già disponibile, oppure IntersectionObserver + scroll nativo).

### Testi e pulsanti durante lo scroll *[mia decisione]*

- 0–10%: H1, "Italia Coperta", paragrafo e i due CTA come oggi, sopra il primo fotogramma.
- Dal 10% in poi titolo e paragrafo sfumano; i due CTA restano in una barra compatta fissa in basso nella sezione (sempre cliccabili).
- Le 3–4 frasi di fase compaiono una alla volta nella fascia sinistra (desktop) o in alto (mobile): quelle zone del fotogramma vanno lasciate libere dal camion nelle inquadrature.
- 85–100%: i CTA tornano grandi al centro sull'inquadratura finale.

## Produzione dei fotogrammi

- **Chi e dove** *[mia decisione]*: renderizza Claude nell'ambiente di lavoro (CPU), con Blender. Cycles con pochi campioni + denoise; se i tempi non reggono, Eevee per le fasi larghe e Cycles solo per i macro. Texture e HDRI gratuite CC0 (Poly Haven, ambientCG), nessun costo.
- **Modelli** *[mia decisione]*: i file di Diego non si toccano. Si lavora su una copia per il render: si possono sostituire i teli laterali col tessuto simulato e aggiungere dettaglio (cricchetto, cinghia, trama) solo dove la camera arriva in macro. Se il dettaglio non regge, le inquadrature macro diventano più larghe con profondità di campo.

- Rendering offline con un motore fisico (Blender/Cycles o equivalente) a partire da `trattore.glb` e `semirimorchio.glb`, decompressi per l'import.
- Telo: animazione di tessuto (simulazione cloth o forme interpolate) dalla sagoma Italia al telo sul bilico; materiale PVC rosso con trama normal map, fascia rifrangente, marchio dal logo SVG ufficiale (`public/images/logo-diriso-teloni.svg`).
- Circa 120–180 fotogrammi per serie, esportati in WebP/AVIF. Budget indicativo: serie mobile ≤ 3 MB, serie desktop ≤ 6 MB totali, ogni fotogramma ≤ 50 KB (mobile) / ≤ 80 KB (desktop). Da limare dopo il primo test.
- I file vanno in `public/sequenze/hero/{desktop,mobile}/` con nomi a indice (`0001.webp`…). Lo script di rendering e i sorgenti di scena restano fuori dal bundle del sito (in una cartella `tools/` o in un repo a parte).

## Verifica

- Lighthouse mobile e desktop della home prima e dopo, con gli stessi parametri: nessun peggioramento oltre il margine di rumore e CLS 0.
- Test di scroll su telefono reale (Diego) e su desktop: niente scatti, niente fotogrammi neri.
- Prova con "riduci movimento", con risparmio dati e con rete lenta simulata.
- Controllo visivo dei render chiave mandato a Diego **prima** di produrre la sequenza completa.

### Approvazioni *[mia decisione]*

1. Fotogrammi chiave (5, uno per fase) mandati in chat: Diego approva o corregge.
2. Sequenza completa su un branch dedicato con anteprima Vercel: Diego la prova su telefono e desktop.
3. Merge su `main` (quindi produzione) solo con l'OK esplicito di Diego.

## Cosa resta a chi costruisce

- Durata esatta di ogni fase, inquadrature e numero di fotogrammi.
- Testi delle 3–4 frasi (da contenuti già sul sito).
- Scelta tra framer-motion `useScroll` e scroll nativo per il disegno sul canvas.
- Formato finale (WebP o AVIF) in base ai pesi misurati.
- Come rendere la trasformazione "sagoma Italia → telo" (cloth sim o shape keys).
