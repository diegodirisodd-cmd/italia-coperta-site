# Spec tecnico — Configuratore Italia Coperta (Di Riso Teloni)

Documento da passare a Opus 4.8 come prompt/contesto per l'implementazione da zero.
Stack: Next.js 14 (App Router) + Tailwind + Supabase + Vercel, palette Italia Coperta corrente.

---

## 1. Obiettivo

Configuratore multi-step che raccoglie una richiesta di preventivo/intervento su teloni,
con branching intelligente per non far vedere all'utente campi irrilevanti, e invio finale
che alimenta la pipeline già esistente (Supabase `preventivi` → WhatsApp notify → PDF → email).

Principio guida: **9 step logici, ma il percorso reale per utente è più corto**, perché
step e campi si saltano in base alle scelte precedenti. La progress bar deve riflettere
il percorso dinamico ("Step 3 di 6"), non un conteggio fisso a 9.

---

## 2. Flusso e logica di branching

### STEP 1 — Tipologia mezzo
Card grid (come screenshot di riferimento, ma palette Italia Coperta e foto reali fornite da Diego):
- Bilico centinato
- Motrice telonata
- Rimorchio telonato
- Furgone centinato
- Semirimorchio collo d'oca
- Altro mezzo / mezzo speciale

Se **"Altro mezzo"** → campi extra: specifica tipologia (testo libero), note, upload foto mezzo.
Card "Altro" usa icona generica, non foto (non c'è foto reale per una categoria aperta).

Foto: fornite da Diego, render AI in stile studio, sfondo grigio chiaro omogeneo su tutte —
crop 4:3, object-fit cover, **nessun overlay/gradiente necessario**, lo sfondo è già uniforme
su tutto il set.

Mappatura e convenzione file confermata (cartella `/public/images/mezzi/`):
- `bilico-centinato.jpg` → motrice + semirimorchio completo, per la card selezione (Step 1)
- `bilico-centinato-dettaglio.jpg` → solo semirimorchio, riuso futuro per pagina di dettaglio
- `motrice-telonata.jpg` → camion rigido con cabina, corpo telonato
- `furgone-centinato.jpg` → furgone tipo Iveco Daily con cassone telonato
- `rimorchio-telonato.jpg` → rimorchio con timone/carrello (non semirimorchio)
- `semirimorchio-collo-doca.jpg` → **placeholder in sospeso**, Diego genera/carica foto dedicata
  più avanti (nessuna delle attuali mostra il pianale ribassato caratteristico del collo d'oca).
  Nel frattempo card con icona generica invece di foto rotta/mancante.
- Card "Altro mezzo" → icona generica, mai foto (categoria aperta)

**Stile visivo dello Step 1 — riferimento layout (non colori)**

Diego ha fornito un mockup di riferimento per struttura e gerarchia visiva della schermata
"Seleziona il tuo mezzo". **Il riferimento vale solo per layout/anatomia della card, non per
i colori** (quello è in navy/grigio chiaro, va tradotto sulla palette Italia Coperta).

Layout:
- Titolo H1 centrato in alto ("Seleziona il tuo mezzo"), sottotitolo descrittivo sotto, centrato,
  colore più tenue
- Griglia responsive: 3 card per riga su desktop, le 5 card totali dispongono 3+2 con la seconda
  riga centrata (non allineata a sinistra) — usare CSS grid con `justify-content: center` o un
  flex-wrap centrato, non un grid rigido a 3 colonne che lascerebbe un buco vuoto nella seconda riga
- Ogni card: foto in alto (4:3, angoli superiori arrotondati coerenti col raggio della card),
  titolo mezzo in grassetto/maiuscolo, descrizione breve su due righe, pulsante circolare con
  freccia/chevron centrato sotto come CTA "seleziona"
- Card con sfondo chiaro/bianco per contrasto sulla foto, ombra leggera, stessi valori di
  border-radius e shadow già usati nelle Card Settori esistenti (sito già ha questo pattern
  dalle animazioni di giugno — **riusare lo stesso componente card se possibile**, non crearne
  uno nuovo da zero)

Traduzione palette (riferimento → Italia Coperta):
- Navy del titolo e del cerchio CTA → rosso `#E31919` (o variante coerente con gli altri CTA
  del sito)
- Sfondo pagina grigio chiaro del riferimento → **mantenere invece il gradiente scuro
  `#000000`→`#3533CD` già usato nel resto del sito** per coerenza visiva con le altre pagine;
  le card restano chiare/bianche sopra per contrasto e leggibilità, non l'intera pagina
- Hover/interazione: riusare tilt 3D + cascata fade-slide-up già implementati sulle Card
  Settori, con lo stesso fallback disattivato su touch (card piatta + tap feedback) previsto
  dall'audit mobile
- Touch target 44px sul pulsante circolare e sull'intera area cliccabile della card

### STEP 2 — Tipo di richiesta (a due livelli)
Prima le **macro-categorie** (selezione singola):
1. Telo completo
2. Solo laterali
3. Solo tetto
4. Portellone / chiusura posteriore
5. Riparazione
6. Sostituzione componenti
7. Accessori vari

Poi, **condizionali alla macro scelta**, sotto-opzioni:
- *Telo completo* → Tetto + laterali / Eventuale posteriore incluso?
- *Solo laterali* → Coppia laterali / Solo destro / Solo sinistro
- *Solo tetto* → Tetto scorrevole / Tetto fisso / Tetto copri-scopri
- *Portellone* → Telo posteriore / Chiusura posteriore / Portellone personalizzato
- *Riparazione* → Strappo o foro / Occhielli saltati / Cinghie rotte / Telo consumato /
  Cuciture aperte / Carrucole danneggiate / Rinforzi da rifare / Altro danno
  → **upload foto danno obbligatorio o fortemente consigliato qui**
- *Sostituzione componenti* → Carrucole / Cinghie / Tenditori / Occhielli / Cricchetti /
  Banda riflettente
- *Accessori vari* → campo libero + eventuale checklist rapida

**Feedback visivo dinamico**: accanto alle opzioni testuali dello step, mostrare l'immagine
del mezzo con la parte selezionata evidenziata da un bordo LED blu (render già pronti da Diego,
cartella `/public/images/configuratore/`), così l'utente vede esattamente cosa sta richiedendo. Mappatura:
- `highlight-tetto.jpg` → evidenzia tetto (per "Solo tetto" e sotto-opzioni tetto scorrevole/fisso/copri-scopri)
- `highlight-laterali.jpg` → evidenzia fiancata (per "Solo laterali" e sotto-opzioni destro/sinistro/coppia)
- `highlight-posteriore.jpg` → evidenzia pannello posteriore (per "Portellone/chiusura posteriore")
- Per "Telo completo" → mostrare in sequenza o combinare più zone evidenziate, oppure il mezzo
  intero senza highlight specifico (da valutare in fase di build quale resa visiva rende meglio)
- Per "Riparazione" → nessun highlight LED; qui usare invece l'immagine illustrativa dedicata
  `riparazione-strappo-esempio.jpg` (diagramma strappo + rattoppo con freccia), utile soprattutto
  per la sotto-opzione "Strappo/foro" come riferimento visivo di cosa aspettarsi dall'intervento
- Per "Sostituzione componenti" e "Accessori vari" → nessun highlight dedicato per ora, mezzo
  intero come immagine di supporto

Questo richiede che il componente `StepTipoRichiesta.tsx` tenga uno stato locale della
macro-categoria/sotto-opzione selezionata e swappi l'immagine di supporto di conseguenza
(semplice condizionale, non serve libreria aggiuntiva).

### STEP 3 — Colore telo
**Mostrato solo se** macro-categoria ∈ {Telo completo, Solo laterali, Solo tetto, Portellone,
Accessori vari}. **Saltato** se {Riparazione, Sostituzione componenti} — non serve scegliere
un colore per riparare o sostituire un componente.

Voci colore: Bianco, Grigio chiaro, Grigio scuro, Nero, Blu, Blu navy, Rosso, Verde, Giallo,
Beige/crema, Colore personalizzato, Da definire con consulente.

Poi: Tinta unita / Con logo aziendale / Con grafica pubblicitaria / Da valutare.
Se personalizzazione → upload logo, upload bozza grafica, note colore aziendale,
checkbox "Vuoi una bozza grafica da noi?".

### STEP 4 — Misure / rilievo misure
Prima scelta sempre presente: Sì conosco le misure / No, richiedo rilievo / Non sono sicuro.

Se **Riparazione** è stata la macro-categoria allo step 2, questo step si riduce: non ha
senso chiedere "lunghezza telo" per un occhiello saltato. Si passa direttamente a un mini-form
già coperto dai campi step 2 (tipo danno + foto), quindi **step 4 viene saltato interamente**
per il ramo Riparazione (l'unica eccezione è chiedere conferma location per eventuale
rilievo/intervento in loco, che confluisce comunque nello step 7).

Se conosce le misure, i campi mostrati dipendono dalla macro-categoria:
- Base (sempre, se non riparazione): lunghezza telo, altezza telo, larghezza mezzo,
  altezza da terra, numero centine/piantoni, note tecniche, upload foto con misure
- Se *laterali* nella selezione: lunghezza/altezza laterale destro e sinistro
- Se *tetto*: lunghezza/larghezza tetto, tipo struttura, numero travetti/compassi
- Se *portellone*: larghezza/altezza posteriore, tipo chiusura, presenza barre

Se richiede rilievo → città, provincia, mezzo disponibile in sede?, giorni preferiti,
fascia oraria preferita, note.

### STEP 5 — Extra e optional
Checklist multi-select (checkbox), sempre presente ma con default diversi:
lista completa come da spec originale (carrucole, cinghie, rinforzi, banda riflettente,
tenditori, occhielli, cricchetti, ganci, saldature/cuciture rinforzate, bordatura,
PVC alta grammatura, telo lucido/opaco, stampa digitale, applicazione logo, montaggio,
smontaggio/smaltimento vecchio telo, intervento urgente, installazione sede/cliente) +
campo libero "esigenze particolari".

### STEP 6 — Urgenza e tempistiche
Nessuna urgenza / Entro 30gg / Entro 15gg / Entro 7gg / Urgente / Mezzo fermo / Da concordare.
Campi: data preferita, il mezzo può restare fermo?, per quanti giorni?, note disponibilità.

### STEP 7 — Sede / zona servizio
Angri (SA) / Brescia / Altro punto in Italia / Servizio presso mia sede / Da definire.
Campi: città, provincia, indirizzo (facoltativo), dove si trova il mezzo,
preferenza montaggio (sede Di Riso vs presso cliente).
Servizi: Produzione, Montaggio, Riparazione, Rilievo misure, Assistenza, Spedizione materiale.

### STEP 8 — Dati cliente
Obbligatori: nome e cognome, azienda, telefono, email, città, provincia.
Facoltativi: P.IVA, targa/marca/modello/anno mezzo, note aggiuntive.
Preferenza contatto: WhatsApp / Telefonata / Email.
Upload: foto mezzo, foto telo attuale, foto danno, logo, bozza grafica, libretto/misure tecniche.
Checkbox: privacy (obbligatorio), autorizzo ricontatto, voglio preventivo senza impegno.

### STEP 9 — Riepilogo e invio
Riepilogo completo di tutte le scelte (solo quelle effettivamente compilate, non i campi
saltati dal branching). Pulsanti: Modifica richiesta, Invia richiesta, Invia anche su
WhatsApp, Richiedi chiamata, Torna alla home.
Messaggio finale: "Richiesta inviata correttamente. Ti ricontatteremo al più presto per
definire il preventivo o l'intervento più adatto."

---

## 3. Architettura tecnica

**State management**: Context + `useReducer` unico per tutto il wizard (`ConfiguratoreProvider`),
stato persistito in `localStorage` (siamo in produzione reale su Vercel, non in un artifact
sandbox — qui `localStorage` è pienamente valido) così l'utente non perde la richiesta se
ricarica la pagina o esce e torna.

Struttura cartelle indicativa:
```
/app/configuratore/page.tsx          → entry point, provider + step router
/components/configuratore/
  StepTipologiaMezzo.tsx
  StepTipoRichiesta.tsx
  StepColoreTelo.tsx
  StepMisure.tsx
  StepExtraOptional.tsx
  StepUrgenza.tsx
  StepSedeZona.tsx
  StepDatiCliente.tsx
  StepRiepilogo.tsx
  ProgressBar.tsx
  WizardShell.tsx                    → layout comune, transizioni step (AnimatePresence, LazyMotion)
/lib/configuratore/
  reducer.ts                         → stato + azioni + logica branching (quali step/campi mostrare)
  schema.ts                          → validazione per step (zod consigliato se già in progetto, altrimenti validazione manuale)
  types.ts
```

**Branching logic**: centralizzata in una funzione pura tipo `getVisibleSteps(state)` dentro
`reducer.ts`, non sparsa nei componenti — così la progress bar e la navigazione avanti/indietro
restano coerenti con un'unica fonte di verità.

**Animazioni**: riusare le primitive già esistenti (`Reveal`, `MagneticCta`, transizioni
LazyMotion) per coerenza col resto del sito. Le transizioni tra step del wizard devono restare
leggere: slide/fade semplice con `AnimatePresence`, niente animazioni pesanti che rallentino
la compilazione di un form lungo.

**Mobile**: touch target 44px su tutte le card/checkbox/bottoni (come da audit già fatto sul
resto del sito), niente tilt 3D sulle card mezzo su touch (fallback piatto + tap feedback,
stesso pattern già adottato altrove).

---

## 4. Schema dati (Supabase)

Estendere la tabella `preventivi` esistente invece di crearne una nuova:

```sql
-- Colonne strutturate per filtro/ricerca lato admin
alter table preventivi add column if not exists tipologia_mezzo text;
alter table preventivi add column if not exists urgenza text;
alter table preventivi add column if not exists sede_zona text;
alter table preventivi add column if not exists nome_cognome text;
alter table preventivi add column if not exists azienda text;
alter table preventivi add column if not exists telefono text;
alter table preventivi add column if not exists email text;
alter table preventivi add column if not exists preferenza_contatto text;

-- Tutto il resto (variabile per branching) in JSONB
alter table preventivi add column if not exists dettagli_richiesta jsonb;
alter table preventivi add column if not exists foto_urls text[];
```

`dettagli_richiesta` contiene: tipo_richiesta (macro + sotto-opzioni), colore_telo,
misure (oggetto con i soli campi rilevanti per quel branch), extra_optional (array),
note varie di ogni step. Mantiene lo schema flessibile senza dover fare migration ogni
volta che si aggiunge un'opzione.

**Storage**: bucket Supabase `configuratore-uploads`, path per richiesta:
`{richiesta_id}/mezzo.jpg`, `{richiesta_id}/danno.jpg`, `{richiesta_id}/logo.jpg`, ecc.
RLS: solo insert da anon (form pubblico), nessun accesso in lettura pubblico.

---

## 5. Integrazione con pipeline esistente

Al submit dello step 9:
1. Insert riga in `preventivi` (Supabase)
2. Trigger Edge Function `whatsapp-notify` già esistente (template `nuovo_carico` o nuovo
   template dedicato al configuratore, da valutare — probabilmente serve un template
   WhatsApp diverso essendo un caso d'uso diverso da DodiX)
3. Generazione PDF riepilogo branded (stesso stile navy/red già usato per i preventivi
   manuali via ReportLab — qui va reimplementato lato Next, es. `@react-pdf/renderer` o
   funzione serverless dedicata)
4. Email di conferma al cliente + notifica interna (Resend, già in stack)
5. Redirect a pagina di conferma con riepilogo e CTA "Invia anche su WhatsApp" (deep link
   `wa.me`)

---

## 6. Ordine di implementazione consigliato (tutto su Opus 4.8)

Il configuratore lo implementa interamente Opus 4.8. Vista l'estensione del lavoro (9 step,
branching, schema DB, integrazioni), va spezzato in blocchi sequenziali con verifica
(build/typecheck + check visivo) dopo ogni blocco, **non tutto in un'unica sessione**:

1. Architettura base: `ConfiguratoreProvider` (Context + useReducer), `WizardShell`,
   `ProgressBar`, logica di branching centralizzata in `reducer.ts`
2. Step 1 (Tipologia mezzo) con le foto reali già presenti — verifica visiva prima di proseguire
3. Step 2 (Tipo di richiesta a due livelli + feedback visivo dinamico con le foto highlight)
4. Step 3-4 (Colore telo, Misure/rilievo) con il branching già definito nella sezione 2
5. Step 5-8 (Extra e optional, Urgenza, Sede/zona, Dati cliente) — pattern ripetitivo una volta
   stabilito lo step-tipo, più rapido da implementare
6. Step 9 (Riepilogo e invio) + integrazione Supabase/WhatsApp/PDF/email
7. Migration schema DB (estensione `preventivi`) — da fare prima o insieme allo step 9, visto
   che serve per il submit finale

Fermarsi a fine blocco per verifica prima di passare al successivo, così eventuali errori di
branching si individuano subito invece che dopo aver costruito tutto il flusso.

---

## 7. Prossimi passi operativi

1. Foto già caricate da Diego su GitHub in `/public/images/mezzi/` e
   `/public/images/configuratore/` secondo la naming convention sopra — nessuna azione
   ulteriore richiesta su questo, salvo la foto `semirimorchio-collo-doca.jpg` ancora da
   generare/caricare.
2. Opus 4.8 implementa `reducer.ts` + `WizardShell` + Step 1 come primo blocco, verifica
   branching e build/typecheck prima di proseguire.
3. Migration Supabase per estendere `preventivi`.
4. Step restanti in blocchi sequenziali come da sezione 6.
5. Integrazione WhatsApp/PDF/email finale.
6. Test end-to-end su almeno 3 percorsi diversi (telo completo, riparazione, sostituzione
   componenti) per verificare che il branching salti davvero gli step giusti.
