# Security Audit — Italia Coperta (`italia-coperta-site`)

| | |
|---|---|
| **Repository** | `diegodirisodd-cmd/italia-coperta-site` |
| **Branch analizzato** | `claude/italia-coperta-configuratore-23hjw2` |
| **Commit HEAD** | `b57eeab` — *fix(seo): redirect 301 non-www→www + canonical su tutte le pagine* |
| **Data audit** | 14 settembre 2026 |
| **Scope** | Analisi statica del codice, dipendenze, configurazione e storia git. Nessun test dinamico/penetration test sull'ambiente di produzione. |
| **Modifiche al codice** | **Nessuna.** Questo file è l'unico artefatto prodotto. |

---

## 0. Stato remediation — Blocco A (14 settembre 2026)

Interventi applicati sul branch `claude/italia-coperta-configuratore-23hjw2`. **Le route API non sono state toccate: restano al Blocco B.**

| Finding | Stato | Cosa è cambiato |
|---|---|---|
| **S-05** | ✅ Chiuso | `next.config.mjs`: `headers()` su `/:path*` con HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control` e **CSP in Report-Only** (mai enforced, **senza nonce** — vedi §0.1) |
| **S-12** | ✅ Chiuso | `poweredByHeader: false` — `X-Powered-By` non esce più su nessuna risposta |
| **S-04** | ✅ Chiuso | `email.ts`: escape di **ogni** interpolazione HTML (`sec.title`, `r.label`, `r.value`, `a.label`, `title`, `intro`); `'` aggiunto a `escapeHtml`; `a.url` passato da `encodeURI()` + allowlist sull'origin Supabase; `reference` normalizzato una volta sola, così è sicuro anche nell'oggetto della mail e nel nome del PDF. `riepilogo.ts`: le chiavi client non riconosciute vengono **scartate**, non più usate come etichetta |
| **S-07** | ✅ Chiuso | `lib/supabase.ts` eliminato; `import "server-only"` su `supabaseAdmin.ts`, `configuratore/email.ts`, `configuratore/pdf.tsx` |
| **S-13** | ✅ Chiuso | `jsonLdScriptProps()` esegue `.replace(/</g, "\\u003c")` |
| **S-15** | ✅ Chiuso | `ConfiguratoreProvider`: stato salvato in un envelope `{savedAt, state}` con **TTL 48 h**; i campi PII di `datiCliente` e `sedeZona.indirizzo` non vengono **mai** scritti su `localStorage`. Le bozze nel vecchio formato (senza `savedAt`) vengono eliminate alla prima visita, ripulendo i PII già presenti sui browser |
| **S-19** | ✅ Chiuso | `npm uninstall playwright`; rimossi `lib/supabase.ts` e `scripts/verify-branching.ts`. `lucide-react` resta (scelta di prodotto, non di sicurezza) |
| **S-16** | 🟡 Parziale | `npm audit fix`: `nanoid` 3.3.17 → **3.3.19** (chiuso). `postcss` resta a 8.4.31 perché **pinnato da `next`**: si chiude solo con S-01 |
| **S-09** | 🟡 Parziale | `email.ts` ora scarta gli allegati la cui URL non appartiene all'origin Supabase configurato. Il filtro dei path per prefisso `reference` è lato route → **Blocco B** |
| **S-10** | 🟡 Parziale | Il `reference` viene sanificato prima dell'uso in email/PDF. La **generazione server-side** resta → **Blocco B** |

Verifiche eseguite: `tsc --noEmit` pulito, `next lint` senza warning, `next build` riuscita, header confermati con `curl -I` su pagine statiche, SSG, asset `_next` e route API, e 35 asserzioni automatiche superate (18 su escaping/allowlist, 8 sullo scarto delle chiavi ostili, 17 su TTL/PII in un browser reale). Percorso completo del configuratore (9 step su 9) senza errori in console.

### 0.1 CSP Report-Only — violazioni rilevate

La CSP è volutamente **Report-Only**: non blocca nulla, quindi il sito funziona esattamente come prima.

Misurazione reale con Chromium 141 headless su `/`, `/configuratore`, `/recensioni`, `/centri`:

**Zero violazioni.** Nessuna risorsa bloccata, nessun `Refused to…`.

È coerente con il codice: nessuno script di terze parti, font self-hosted da `next/font`, immagini tutte locali, e le uniche `fetch` sono verso `/api/*` (coperte da `connect-src 'self'`).

L'unico messaggio emesso dal browser è informativo:

```
The Content Security Policy directive 'upgrade-insecure-requests' is ignored
when delivered in a report-only policy.
```

Cioè: quella direttiva **non fa nulla** finché la policy resta Report-Only. Non è un errore, ma va saputo — è uno dei motivi per passare a enforced.

**Raccomandazione:** la policy può passare a `Content-Security-Policy` enforced quando si vuole, cambiando una sola chiave. Due avvertenze prima di farlo:

1. `script-src` include `'unsafe-inline'` **per scelta**, non per pigrizia: serve ai blocchi JSON-LD e la via dei nonce è preclusa da `GHSA-ffhc-5mcf-pf4q` su Next 14.2.35 (S-01). Con `'unsafe-inline'` attivo la CSP **non protegge dall'XSS inline**: resta utile per `frame-ancestors`, `object-src`, `base-uri`, `form-action` e il confinamento delle destinazioni di rete. La protezione XSS vera arriva con l'upgrade a Next 15/16 e i nonce.
2. Conviene tenerla in Report-Only finché non si aggiunge un `report-uri`/`report-to` che raccolga le violazioni dal traffico reale: quattro pagine in headless non coprono tutti i browser né tutti i percorsi utente.

> **Nota sul livello di rischio complessivo.** Il sito non ha autenticazione, non gestisce pagamenti e non espone un'area riservata: la superficie d'attacco è costituita da **6 route API pubbliche e non autenticate** che scrivono su Supabase con la chiave `service_role` (bypass totale di RLS) e inviano email via Resend. I problemi più gravi non sono XSS classici ma **abuso delle risorse** (spam su DB/storage/email a spese del titolare) e **una dipendenza framework fuori supporto di sicurezza**.

---

## 1. Versioni e dipendenze

### 1.1 Versioni esatte

| Pacchetto | `package.json` (range) | `package-lock.json` (risolto) | Note |
|---|---|---|---|
| `next` | `14.2.35` (pin esatto) | **`14.2.35`** | ⚠️ Ultima release esistente del ramo 14.x — vedi §1.3 |
| `react` | `^18.3.1` | **`18.3.1`** | OK |
| `react-dom` | `^18.3.1` | **`18.3.1`** | OK |
| `@supabase/supabase-js` | `^2.45.4` | **`2.110.0`** | Il lock è molto più avanti del range dichiarato (caret) |
| `resend` | `^6.17.1` | **`6.17.1`** | OK |
| `@react-pdf/renderer` | `^4.5.1` | `4.5.1` | |
| `framer-motion` | `^12.42.2` | `12.42.2` | |
| `lockfileVersion` | | `3` | npm 7+ |

File: `package.json:10-32`, `package-lock.json`.

### 1.2 Output completo di `npm audit --production`

Eseguito con `npm audit --production` (npm 10.9.7 avvisa che il flag è deprecato in favore di `--omit=dev`; l'audit legge il lockfile, `node_modules` non è presente in questo workspace).

```
npm warn config production Use `--omit=dev` instead.
# npm audit report

nanoid  <=3.3.17
Severity: high
nanoid: non-secure generators can loop indefinitely with negative size - https://github.com/advisories/GHSA-28wg-ghj8-5hjv
nanoid: custom generators can loop indefinitely when size is zero - https://github.com/advisories/GHSA-2v37-7h3g-55p8
fix available via `npm audit fix`
node_modules/nanoid

next  9.3.4-canary.0 - 16.3.0-preview.10
Severity: critical
Next.js self-hosted applications vulnerable to DoS via Image Optimizer remotePatterns configuration - https://github.com/advisories/GHSA-9g9p-9gw9-jx7f
Next.js HTTP request deserialization can lead to DoS when using insecure React Server Components - https://github.com/advisories/GHSA-h25m-26qc-wcjf
Next.js: HTTP request smuggling in rewrites - https://github.com/advisories/GHSA-ggv3-7p47-pfv8
Next.js: Unbounded next/image disk cache growth can exhaust storage - https://github.com/advisories/GHSA-3x4c-7xq6-9pq8
Next.js has a Denial of Service with Server Components - https://github.com/advisories/GHSA-q4gf-8mx6-v5v3
Next.js Vulnerable to Denial of Service with Server Components - https://github.com/advisories/GHSA-8h8q-6873-q5fj
Next.js's Middleware / Proxy redirects can be cache-poisoned - https://github.com/advisories/GHSA-3g8h-86w9-wvmq
Next.js vulnerable to cross-site scripting in App Router applications using CSP nonces - https://github.com/advisories/GHSA-ffhc-5mcf-pf4q
Next.js vulnerable to cache poisoning via collisions in React Server Component cache-busting - https://github.com/advisories/GHSA-vfv6-92ff-j949
Next.js has cross-site scripting in beforeInteractive scripts with untrusted input - https://github.com/advisories/GHSA-gx5p-jg67-6x7h
Next.js has a Denial of Service in the Image Optimization API - https://github.com/advisories/GHSA-h64f-5h5j-jqjh
Next.js vulnerable to server-side request forgery in applications using WebSocket upgrades - https://github.com/advisories/GHSA-c4j6-fc7j-m34r
Next.js vulnerable to cache poisoning in React Server Component responses - https://github.com/advisories/GHSA-wfc6-r584-vfw7
Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n - https://github.com/advisories/GHSA-36qx-fr4f-26g5
Next.js: Denial of Service in App Router using Server Actions - https://github.com/advisories/GHSA-m99w-x7hq-7vfj
Next.js: Server-Side Request Forgery in Server Actions on custom servers - https://github.com/advisories/GHSA-89xv-2m56-2m9x
Next.js: Cache confusion of response bodies for requests with bodies - https://github.com/advisories/GHSA-68g3-v927-f742
Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences - https://github.com/advisories/GHSA-4633-3j49-mh5q
Next.js: Unbounded Server Action payload in Edge runtime - https://github.com/advisories/GHSA-4c39-4ccg-62r3
Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname - https://github.com/advisories/GHSA-p9j2-gv94-2wf4
Next.js: Unauthenticated disclosure of internal Server Function endpoints - https://github.com/advisories/GHSA-955p-x3mx-jcvp
Next.js: Unauthenticated Remote Code Execution on windows-hosted servers - https://github.com/advisories/GHSA-p293-qw3h-jr36
Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used - https://github.com/advisories/GHSA-2xp9-vwfh-vxw4
Depends on vulnerable versions of postcss
fix available via `npm audit fix --force`
Will install next@16.3.5, which is a breaking change
node_modules/next

postcss  <=8.5.22
Severity: high
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments - https://github.com/advisories/GHSA-6g55-p6wh-862q
PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset - https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure - https://github.com/advisories/GHSA-r28c-9q8g-f849
fix available via `npm audit fix --force`
Will install next@16.3.5, which is a breaking change
node_modules/next/node_modules/postcss

3 vulnerabilities (2 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

Riepilogo macchina (`npm audit --omit=dev --json`):

```
nanoid  | severity: high     | range: <=3.3.17                      | fixAvailable: true
next    | severity: critical | range: 9.3.4-canary.0 - 16.3.0-preview.10 | fixAvailable: next@16.3.5 (semver MAJOR)
postcss | severity: high     | range: <=8.5.22                      | fixAvailable: next@16.3.5 (semver MAJOR)
totali: {"info":0,"low":0,"moderate":0,"high":2,"critical":1,"total":3}
```

### 1.3 Il punto critico: Next 14 è a fine vita per le patch di sicurezza

`npm view next dist-tags` conferma che **`next-14` → `14.2.35`**: la versione installata *è già* l'ultima del ramo. Il range vulnerabile copre l'intero 14.x e npm propone come unica correzione `next@16.3.5` (major).

Conseguenza concreta: **non esiste una patch 14.x** per gli advisory elencati. Restare su 14.2.35 significa restare esposti in modo permanente a tutti i CVE futuri del framework.

Mitigazioni già in essere nel progetto (riducono l'impatto pratico di diversi advisory, **non** la raccomandazione di aggiornare):

- **Non self-hosted**: il deploy è su Vercel (`vercel.json`), quindi l'Image Optimizer e i rewrite sono gestiti dall'infrastruttura Vercel, che applica mitigazioni lato piattaforma. Gli advisory marcati "self-hosted" hanno impatto ridotto.
- **Nessun uso di `next/image` con sorgenti remote**: nessun `remotePatterns` configurato e nessun `<Image src="https://…">` nel codice (verificato) → l'Image Optimization API non tratta input remoti non fidati (rilevante per `GHSA-2xp9-vwfh-vxw4`, RCE via AVIF).
- **Nessun middleware** (`middleware.ts` assente) → gli advisory "Middleware bypass / cache poisoning" non si applicano.
- **Nessun Server Action** e **nessun Pages Router / i18n** → esclusi i relativi advisory.
- Host Linux → escluso `GHSA-p293-qw3h-jr36` (RCE su Windows).
- `postcss` e `nanoid` sono usati **in fase di build** (toolchain CSS), non a runtime su input utente: impatto reale basso su questo progetto.

### 1.4 Dipendenze non più usate da alcun import

Verifica: conteggio import reali su `app/`, `components/`, `lib/`, `data/`, `scripts/`.

| Pacchetto | Import trovati | Verdetto |
|---|---|---|
| `playwright` (devDep) | **0** — presente solo in `package.json:28` | ❌ **Non usata.** ✅ Rimossa nel Blocco A. |
| `react-dom` | 0 import diretti | ✅ Necessaria (peer di React/Next, usata dal runtime) |
| `tailwindcss`, `postcss`, `autoprefixer` | 0 import diretti | ✅ Usate via `tailwind.config.ts` / `postcss.config.mjs` |
| `eslint`, `eslint-config-next`, `typescript`, `@types/*` | 0 import diretti | ✅ Usate via `.eslintrc.json` / `tsconfig.json` |
| `lucide-react` | 1 (`components/Header.tsx:5`, solo `ChevronRight`) | ⚠️ Usata, ma per **una singola icona**: un'intera dipendenza per un path SVG. Valutare l'inline. |
| `@react-pdf/renderer` | 1 (`lib/configuratore/pdf.tsx:4`) | ✅ Usata |
| `resend` | 1 (`lib/configuratore/email.ts:6`) | ✅ Usata |
| `@supabase/supabase-js` | 2 (`lib/supabaseAdmin.ts:1`, `lib/supabase.ts:1`) | ✅ Usata — ma `lib/supabase.ts` è **codice morto**, vedi §2.4 |
| `framer-motion` | 15 | ✅ Usata |

**Codice morto (non dipendenze, ma da segnalare):**
- `lib/supabase.ts` — **nessun file lo importa** (verificato su tutto l'albero). Contiene un duplicato di `supabaseAdmin()`. Vedi finding **S-07**. ✅ **Eliminato nel Blocco A.**
- `scripts/verify-branching.ts` — script temporaneo, auto-dichiarato «Delete once the wizard UI is verified end-to-end». ✅ **Eliminato nel Blocco A.**

---

## 2. Segreti e variabili d'ambiente

### 2.1 Inventario completo delle variabili d'ambiente usate nel codice

| Variabile | Esposizione | File:riga | Uso |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 🌐 **Pubblica** (bundle client) | `app/layout.tsx:24`, `app/robots.ts:3`, `app/sitemap.ts:4`, `lib/seo/schema.ts:6` | Base URL per metadata/canonical/sitemap. Nessun dato sensibile. ✅ Corretto che sia pubblica. |
| `NEXT_PUBLIC_SUPABASE_URL` | 🌐 **Pubblica** | `lib/supabase.ts:9`, `lib/supabaseAdmin.ts:14` | Endpoint del progetto Supabase. Pubblica per definizione. ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🌐 **Pubblica** | `lib/supabase.ts:10` | ⚠️ Dichiarata in `.env.example` ma **usata solo in codice morto**. Vedi §2.4. |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 **Server-only** | `lib/supabaseAdmin.ts:15`, `lib/supabase.ts:18` | Bypassa RLS. Vedi §2.5. |
| `RESEND_API_KEY` | 🔒 **Server-only** | `lib/configuratore/email.ts:67` | ✅ Letta dentro `sendConfiguratoreEmails()`, modulo importato solo da `app/api/configuratore/route.ts` (runtime `nodejs`). |
| `RESEND_FROM` | 🔒 **Server-only** | `lib/configuratore/email.ts:12` | Mittente. Non sensibile ma correttamente server-side. |
| `WHATSAPP_PHONE_NUMBER_ID` | 🔒 dichiarata in `.env.example:12` | — | **Mai letta nel codice** (integrazione WhatsApp ancora TODO). |
| `WHATSAPP_ACCESS_TOKEN` | 🔒 dichiarata in `.env.example:13` | — | **Mai letta nel codice**. Se già popolata in Vercel, è un segreto attivo e inutilizzato: da rimuovere finché non serve. |

✅ **Nessuna variabile server-only è prefissata `NEXT_PUBLIC_`.** La separazione è corretta.

### 2.2 Chiavi/segreti hardcodati nel codice

**Nessun segreto hardcodato.** Scansione dell'intero working tree (esclusi `node_modules`/`.git`) per pattern `eyJ…` (JWT Supabase), `re_…` (Resend), `sk_live_…`/`sk_test_…`, `sbp_…`: **zero risultati**.

Valori non-segreti presenti in chiaro, tutti legittimi (dati aziendali pubblici):
- `lib/configuratore/email.ts:12` — fallback mittente `"Italia Coperta <noreply@dodiitalia.it>"`
- `lib/site.ts` — email e telefono aziendali pubblici; `TODO.md:7` riporta il numero WhatsApp `+39 352 033 1778`
- `vercel.json` — dominio `dirisoteloni1950.com`

### 2.3 Storia git — i segreti sono mai finiti in un commit?

Comando richiesto, eseguito su **tutti i branch** (`git log -p --all`):

```
$ git log -p --all | grep -inE "service_role|sk_live|re_[A-Za-z0-9]|SUPABASE_SERVICE"
```

**15 occorrenze, tutte falsi positivi.** Nessun valore di chiave.

| Occorrenza | Natura |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` (×6, incl. `.env.example:+SUPABASE_SERVICE_ROLE_KEY=`) | Solo **nomi di variabile** e commenti. Nel `.env.example` il valore è **vuoto**. |
| `MISURE_LATERALI`, `MISURE_PORTELLONE` (×9) | Falso positivo del pattern `re_[A-Za-z0-9]` che matcha `RE_LATERALI` / `RE_PORTELLONE` (grep case-insensitive). |

Verifiche aggiuntive (più stringenti del richiesto):

```
$ git log -p --all | grep -oE "eyJ[A-Za-z0-9_-]{20,}|re_[a-zA-Z0-9]{20,}|sk_(live|test)_[A-Za-z0-9]{10,}|[a-z0-9]{20}\.supabase\.co|sbp_[a-f0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{20,}"
→ nessun risultato

$ git log --all --diff-filter=A --name-only --pretty=format: | grep -iE "^\.env|env\.local|\.pem$|\.key$|credentials"
→ .env.example   (l'unico file env mai committato, con valori vuoti)
```

✅ **Conclusione: nessun segreto è mai stato committato in questo repository.** `.gitignore` copre correttamente `.env`, `.env.local`, `.env.*.local`.

> ⚠️ Questo vale per la storia *di questo repo*. Non dice nulla su chiavi eventualmente incollate in chat, screenshot o nella dashboard Vercel. Il file `chats/chat1.md` è committato ed è stato scansionato: non contiene segreti.

### 2.4 `NEXT_PUBLIC_SUPABASE_ANON_KEY`: dichiarata ma inerte

`lib/supabase.ts:13` crea un client browser con la anon key, **ma nessun file importa questo modulo**. Il sito non fa mai query Supabase lato client: tutte passano dalle route API con `service_role`.

Implicazione pratica: **le policy RLS del progetto Supabase non sono mai esercitate**. Se le tabelle fossero senza RLS, la anon key (pubblica per design, e destinata a finire nel bundle non appena qualcuno importasse quel modulo) permetterebbe la lettura diretta di `preventivi`, `richieste`, `prenotazioni` e `candidature_partner` — cioè di tutti i dati personali dei clienti. **Va verificato nella dashboard Supabase che RLS sia ON con policy deny-by-default su tutte e quattro le tabelle**, indipendentemente dal codice.

### 2.5 Dove viene usata la `service_role` key

✅ **Confermato: esclusivamente server-side.** `supabaseAdmin()` da `lib/supabaseAdmin.ts` è importata solo da route handler:

| File | Riga |
|---|---|
| `app/api/candidatura/route.ts` | 2, 38 |
| `app/api/configuratore/route.ts` | 2, 41 |
| `app/api/configuratore/upload/route.ts` | 2, 47 |
| `app/api/contatto/route.ts` | 2, 39 |
| `app/api/prenotazione/route.ts` | 3, 44 |
| `app/api/preventivo/route.ts` | 4, 44 |

Nessun componente `"use client"` la importa. La chiave è letta **a runtime** dentro la funzione (`lib/supabaseAdmin.ts:15`), non a livello di modulo: nessuna inlinizzazione a build time.

⚠️ **Ma c'è una seconda copia**: `lib/supabase.ts` esporta *sia* `supabase` (client anon, creato a livello di modulo, riga 13) *sia* `supabaseAdmin()` che legge `SUPABASE_SERVICE_ROLE_KEY` (riga 18). Nessuno dei due moduli ha il guard `import "server-only"`. Oggi il file è morto, quindi l'impatto è nullo; ma se domani un componente client importasse `supabase` da lì, l'intero modulo entrerebbe nel grafo client. Next **non** inlinerebbe il valore della chiave (solo le `NEXT_PUBLIC_` vengono sostituite), quindi la chiave non trapelerebbe, ma il bundle conterrebbe codice che tenta di costruire un client admin — un piede già oltre la linea. Vedi finding **S-07**.

---

## 3. API Routes

### 3.1 Elenco completo (`app/api/`)

Tutte le route sono `POST`, **pubbliche e non autenticate**, e scrivono su Supabase con `service_role`.

| # | Route | File | Tabella / Storage |
|---|---|---|---|
| 1 | `POST /api/candidatura` | `app/api/candidatura/route.ts` | `candidature_partner` |
| 2 | `POST /api/configuratore` | `app/api/configuratore/route.ts` | `preventivi` + Storage (signed URL) + Resend ×2 |
| 3 | `POST /api/configuratore/upload` | `app/api/configuratore/upload/route.ts` | Storage bucket `configuratore-uploads` |
| 4 | `POST /api/contatto` | `app/api/contatto/route.ts` | `richieste` |
| 5 | `POST /api/prenotazione` | `app/api/prenotazione/route.ts` | `prenotazioni` |
| 6 | `POST /api/preventivo` | `app/api/preventivo/route.ts` | `preventivi` |

### 3.2 Matrice validazione / rate limiting / limite body

| Route | Validazione input | Tipo | Rate limiting | Limite dimensione body | Auth / CSRF |
|---|---|---|---|---|---|
| `/api/candidatura` | `isValid()` — 5 campi non-vuoti (`route.ts:14-22`) | Manuale, solo *presenza* | ❌ **Assente** | ❌ Nessuno esplicito | ❌ Nessuna |
| `/api/configuratore` | `isValidState()` (`route.ts:16-21`) → riusa `canLeaveStep(state,"dati-cliente")` | Manuale, solo *presenza* + consenso privacy | ❌ **Assente** | ❌ Nessuno esplicito | ❌ Nessuna |
| `/api/configuratore/upload` | Presenza `reference`/`slot`/`file`, size, MIME (`route.ts:34-42`) | Parziale — vedi §3.3 | ❌ **Assente** | ⚠️ `MAX_BYTES = 10 MB` ma **verificato dopo** il parsing completo (`route.ts:37`) | ❌ Nessuna |
| `/api/contatto` | `isValid()` — `tipo` in enum + 4 campi non-vuoti (`route.ts:14-22`) | Manuale; **unica route con un controllo di enum** | ❌ **Assente** | ❌ Nessuno esplicito | ❌ Nessuna |
| `/api/prenotazione` | `isValid()` — `intervento`/`sede`/`fascia` verificati contro liste note (`route.ts:16-22`) | **La migliore**: allowlist su 3 campi… ma `giorno` accetta **qualsiasi stringa** | ❌ **Assente** | ❌ Nessuno esplicito | ❌ Nessuna |
| `/api/preventivo` | `isValid()` — presenza campi annidati (`route.ts:12-23`) | Manuale, solo *presenza*. ✅ Il prezzo è **ricalcolato server-side** (`route.ts:38`) | ❌ **Assente** | ❌ Nessuno esplicito | ❌ Nessuna |

**Osservazioni trasversali:**

1. **Nessuna libreria di validazione schema** (zod/valibot assenti da `package.json`). Tutto è `Boolean(x?.trim())`: si verifica che il campo *esista*, mai che sia *plausibile*.
2. **Nessun controllo di formato email** in nessuna delle 6 route. `email: "<script>"` passa.
3. **Nessun limite di lunghezza**, né server né client: `grep -c maxLength` su `app/` + `components/` → **0**. Un campo `note` da 5 MB viene accettato e scritto su Postgres.
4. **Nessun rate limiting**: assenti middleware, Upstash/Redis, `@vercel/kv`, o qualunque contatore. Le route sono pubbliche e illimitate.
5. **Nessun limite di body esplicito**: nell'App Router non esiste il `bodyParser.sizeLimit` del Pages Router. Ci si affida solo al cap di piattaforma Vercel (~4.5 MB per richiesta serverless), che non è un controllo applicativo.
6. **Campi passati a spread**: `insert({ reference, ...body })` in `candidatura/route.ts:40`, `contatto/route.ts:41`, `prenotazione/route.ts:46`. Chiavi extra nel JSON del client finiscono direttamente nell'`insert`. PostgREST rifiuta le colonne inesistenti (l'insert fallisce con 500), quindi non è mass-assignment sfruttabile per scrivere colonne arbitrarie, ma è un pattern fragile: basta aggiungere domani una colonna `stato`/`letto`/`prezzo_finale` perché diventi scrivibile dal client.
7. ✅ **Buone pratiche già presenti**: errori generici verso il client (mai il messaggio Supabase grezzo); prezzo ricalcolato server-side; disponibilità slot ri-verificata server-side; `isValidState()` che riesegue il gate della UI con commento esplicito «never trust the client».

### 3.3 Route di upload — analisi di dettaglio

`app/api/configuratore/upload/route.ts`

| Controllo | Stato | Riga | Dettaglio |
|---|---|---|---|
| Autenticazione | ❌ Assente | — | Chiunque su Internet può caricare |
| Dimensione file | ⚠️ Parziale | 37-39 | `file.size > 10MB → 413`. Ma `await req.formData()` (riga 24) ha **già bufferizzato l'intero corpo in memoria** prima del controllo |
| Tipo MIME | ⚠️ **Bypassabile** | 40-42 | `if (file.type && !ALLOWED.includes(file.type))` — **il controllo salta quando `file.type` è vuoto**. Un `Content-Type` assente nella part multipart aggira l'allowlist, e a riga 51 diventa `"application/octet-stream"` |
| MIME dichiarato vs reale | ❌ Assente | — | Nessun controllo dei *magic bytes*. `file.type` è fornito dal client, non ispezionato |
| Estensione | ❌ **Nessun controllo** | 44 | Il nome file viene solo sanificato, mai validato: `.html`, `.svg`, `.exe` passano |
| Nome file | ⚠️ Parziale | 12-14 | `sanitize()` sostituisce tutto ciò che non è `[a-zA-Z0-9._-]` e tronca a 80 char. **Il punto `.` è consentito**, quindi le sequenze `..` sopravvivono: `sanitize("..") === ".."` |
| Path traversal | ⚠️ Residuale | 44 | `reference` e `slot` sono interamente controllati dal client. `/` viene neutralizzato, ma `reference = ".."` produce la chiave `../slot-file.jpg`. Resta confinato al bucket, ma può uscire dalla cartella della richiesta |
| Sovrascrittura | ⚠️ | 51 | `upsert: true` + path deterministico e client-controllato ⇒ chi conosce/indovina un `reference` può **sovrascrivere l'allegato di un altro cliente** |
| Origine (CORS/CSRF) | ❌ Assente | — | `multipart/form-data` è un content-type *CORS-simple*: un sito terzo può far eseguire questa POST al browser di un visitatore **senza preflight** |
| Bucket privato | ✅ | 19-20 | Bucket privato, accesso staff via signed URL. Riduce molto l'impatto dei file ostili (niente hosting di phishing pubblico, niente XSS da `.html`/`.svg` serviti dal dominio) |

**Scenario di abuso realistico:** script che invia 500 POST da 9,9 MB con `reference` casuali → ~5 GB nel bucket Supabase, nessun rate limit, nessuna traccia dell'identità, costi di storage a carico del titolare. Nessuna delle 6 route ha difese contro questo.

**Nota sul `reference`:** è generato **dal client** (`components/configuratore/ConfiguratoreProvider.tsx:26-33`) con `Date.now()` + `Math.random()` (4 caratteri), e il server **non lo valida né lo rigenera mai** — né in upload né in `/api/configuratore`. Non è un identificatore di sicurezza (non protegge nulla di direttamente leggibile), ma è anche l'unica cosa che separa le cartelle di clienti diversi in un bucket condiviso.

### 3.4 Dati utente in email HTML senza escaping

**Sì — esiste un'iniezione HTML nell'email interna.** `lib/configuratore/email.ts`

La funzione `escapeHtml()` (riga 39-41) esiste ed è applicata **solo ai valori**:

```ts
// riga 22-25
(r) => `<tr>
  <td style="…">${r.label}</td>              ← ❌ NON ESCAPED
  <td style="…">${escapeHtml(r.value)}</td>  ← ✅ escaped
</tr>`
```

Il presupposto implicito è che le *label* siano costanti del codice. **Non lo sono.** Due percorsi le rendono controllabili dal client:

1. **`lib/configuratore/riepilogo.ts:110`**
   ```ts
   const label = key === "note" ? "Note" : CAMPO_LABELS[key] ?? key;
   ```
   `key` proviene da `Object.entries(state.misure.campi)`, e `campi` è tipizzato `Record<string, string>` (`lib/configuratore/types.ts:84`) — cioè un oggetto JSON arbitrario inviato dal client a `/api/configuratore`. Una chiave sconosciuta **cade nel fallback `?? key`** e finisce non-escaped nell'HTML.

2. **`lib/configuratore/riepilogo.ts:52`**
   ```ts
   if (path) out.push({ label: slotLabels[slot] ?? slot, path });
   ```
   Stesso fallback su `state.datiCliente.allegati` (`Record<string, string>`, `types.ts:148`). Questa label finisce anche in `email.ts:78`, dentro un `<a>`:
   ```ts
   `<li><a href="${a.url}">${a.label}</a></li>`   ← ❌ href e label non escaped
   ```

**Proof of concept** (nessuna autenticazione richiesta) — POST a `/api/configuratore` con:

```json
{ "state": { "misure": { "modalita": "conosco",
    "campi": { "<img src=x onerror=alert(1)>": "valore" } }, "…": "…" } }
```

La stringa arriva non-escaped nell'email HTML inviata a `EMAIL` (`lib/site.ts`), cioè nella **casella interna di Di Riso**.

**Impatto reale:** i client email moderni (Gmail, Outlook) rimuovono `<script>` e gran parte dei gestori di evento, quindi **non è un XSS affidabile**. È invece un vettore affidabile di:
- **falsificazione del contenuto** dell'email interna (markup arbitrario: finti messaggi, finti pulsanti, link di phishing verso l'operatore che legge la richiesta);
- **defacement/occultamento** di dati reali della richiesta;
- **iniezione di link tracker** (`<img src="https://attaccante/…">`) che segnala l'apertura dell'email interna.

Altri punti non-escaped nello stesso file:

| Riga | Espressione | Sorgente | Rischio |
|---|---|---|---|
| `email.ts:18` | `${sec.title}` | Costanti di `buildRiepilogo()` | ✅ Nessuno (statiche) |
| `email.ts:51-52` | `${title}` / `${intro}` in `wrapHtml` | Vedi sotto | ⚠️ Veicolo dei due successivi |
| `email.ts:88` | `` `Nuova richiesta configuratore — ${args.reference}` `` | `reference` **client-controllato**, mai validato | ⚠️ Iniezione HTML nel titolo dell'email interna |
| `email.ts:113` | `` `…(rif. ${args.reference})…` `` | idem, nell'email **al cliente** | ⚠️ `clienteNome` è correttamente escaped, `reference` no |
| `email.ts:78` | `href="${a.url}"` | Signed URL generato dal server | ✅ Basso (non client-controllato) |

Inoltre `escapeHtml()` (riga 40) **non gestisce l'apostrofo `'`**. Oggi è innocuo perché tutti gli attributi usano virgolette doppie, ma è una lacuna da chiudere.

✅ **Il PDF è sicuro**: `lib/configuratore/pdf.tsx` usa `@react-pdf/renderer`, che non interpreta HTML — i valori sono nodi `<Text>`.

✅ **Le email in testo semplice** (`sectionsToText`, riga 33-37) non hanno problemi di escaping per natura.

---

## 4. Header e configurazione

### 4.1 `next.config.mjs` — vuoto *(stato al momento dell'audit)*

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

**Nessun `headers()`, nessuna opzione di sicurezza.**

### 4.2 `vercel.json` — solo un redirect

```json
{ "redirects": [ { "source": "/:path*",
  "has": [{ "type": "host", "value": "dirisoteloni1950.com" }],
  "destination": "https://www.dirisoteloni1950.com/:path*",
  "statusCode": 301 } ] }
```

Nessuna chiave `headers`.

### 4.3 Security header impostati oggi

**Nessuno** al momento dell'audit.

> ⚠️ **Aggiornato dal Blocco A** — vedi §0. Tutti gli header elencati qui sotto sono ora impostati, più una CSP in Report-Only.

Riepilogo dello stato **pre-remediation**:

| Header | Stato | Conseguenza |
|---|---|---|
| `Content-Security-Policy` | ❌ Assente | Nessuna difesa in profondità contro XSS/injection |
| `Strict-Transport-Security` (HSTS) | ❌ Assente a livello applicativo | Vercel serve HTTPS e reindirizza, ma senza HSTS il primo accesso resta downgradabile |
| `X-Frame-Options` / `frame-ancestors` | ❌ Assente | Il sito è **inquadrabile in iframe** → clickjacking sul configuratore e sulle form di contatto |
| `X-Content-Type-Options: nosniff` | ❌ Assente | MIME sniffing |
| `Referrer-Policy` | ❌ Assente | URL completi inviati a destinazioni esterne (link WhatsApp, Google) |
| `Permissions-Policy` | ❌ Assente | Nessuna restrizione su camera/microfono/geolocalizzazione |

### 4.4 `middleware.ts`

**Non esiste.** Verificato: nessun `middleware.ts` in root, `src/`, o `app/`.

Conseguenza duplice: (a) nessun punto centrale dove aggiungere header, rate limiting o controllo d'origine — che è anche il motivo per cui oggi non ce ne sono; (b) ✅ gli advisory Next su "Middleware bypass" e "Middleware redirect cache poisoning" non si applicano.

### 4.5 `poweredByHeader`, source map, `images.remotePatterns`

| Opzione | Valore effettivo | Valutazione |
|---|---|---|
| `poweredByHeader` | ~~**`true`**~~ → **`false`** (S-12 chiuso) | ⚠️ Ogni risposta espone `X-Powered-By: Next.js`. Information disclosure minore: conferma lo stack a uno scanner automatico. Fix di una riga. |
| `productionBrowserSourceMaps` | **`false`** (default) | ✅ **Nessuna source map client in produzione.** Corretto. Da non attivare. |
| `images.remotePatterns` | **Non configurato** | ✅ Default deny: nessun host remoto autorizzato. Coerente con il codice — verificato che **tutte** le immagini sono locali (`public/images/…`), nessun `<Image src="https://…">`. Chiude di fatto gli advisory sull'Image Optimizer. |

---

## 5. Client

### 5.1 Cosa viene passato al client che non dovrebbe

✅ **Nessuna perdita di dati.** Le risposte delle route sono minimali e non restituiscono mai righe Supabase:

| Route | Risposta |
|---|---|
| `/api/candidatura` | `{ reference }` |
| `/api/configuratore` | `{ reference }` |
| `/api/configuratore/upload` | `{ path, name }` |
| `/api/contatto` | `{ reference }` |
| `/api/prenotazione` | `{ reference }` |
| `/api/preventivo` | `{ reference, stima, centro: { id, citta } }` — solo dati pubblici del centro |

- ✅ Nessun oggetto Supabase intero, nessun `id` di riga, nessuna email di terzi.
- ✅ Gli errori Supabase sono loggati server-side e **non** rimandati al client (es. `app/api/preventivo/route.ts:68-69`).
- ✅ Nessun tracker/script di terze parti (né GTM, né gtag, né Meta Pixel, né Clarity). `lib/consent.ts` è il gate pronto per quando serviranno.
- ✅ Tutti gli `target="_blank"` hanno `rel` (9 occorrenze verificate).
- ✅ I dati bundle-ati lato client (`lib/centri.ts`, `data/reviews.ts`, `lib/site.ts`) sono **informazioni aziendali pubbliche** — indirizzi delle sedi, telefono aziendale unico, recensioni Google pubbliche. Nessun dato personale di clienti.

⚠️ **Unico rilievo — PII in `localStorage`:** `components/configuratore/ConfiguratoreProvider.tsx:75-81` persiste l'**intero stato del wizard** — nome, email, telefono, azienda, P.IVA, città, indirizzo, targa del mezzo, consenso privacy — sotto la chiave `italiacoperta.configuratore.v1`, ad ogni cambiamento. La pulizia avviene solo su `/configuratore/conferma` (`ConfermaContent.tsx:16-22`) o su reset esplicito. ✅ **Risolto nel Blocco A** (TTL 48 h + PII mai persistite — §0). Al momento dell'audit, un utente che abbandonava il wizard **lasciava i propri dati personali nel browser a tempo indeterminato** — rilevante su postazioni condivise e sotto il principio GDPR di minimizzazione della conservazione.

### 5.2 `dangerouslySetInnerHTML`

12 occorrenze, tutte su contenuto statico del repository:

| File:riga | Contenuto | Rischio |
|---|---|---|
| `app/page.tsx:26,30`, `app/azienda/page.tsx:58`, `app/centri/page.tsx:22,26`, `app/configuratore/page.tsx:21`, `app/contatti/page.tsx:36`, `app/riparazione-rapida/page.tsx:29,39`, `app/settori/[slug]/page.tsx:36` | JSON-LD via `jsonLdScriptProps()` | 🟢 Bassa — vedi sotto |
| `app/settori/[slug]/page.tsx:104` | `__html: paragraph` da `settore.body` | 🟢 Bassa — contenuto statico in `lib/settori.ts` (solo `<strong>`, es. riga 126). Diventa **alto** se quei testi passassero a un CMS |

**Dettaglio JSON-LD** (`lib/seo/schema.ts:92-94`):

```ts
export function jsonLdScriptProps(schema: unknown) {
  return { __html: JSON.stringify(schema) };
}
```

`JSON.stringify` **non effettuava l'escape di `<`**: un `</script>` nei dati avrebbe chiuso il tag. ✅ **Risolto nel Blocco A.** Tutti gli input sono comunque costanti del repo (`schema.ts`, `lib/settori.ts`, `FAQ_RIPARAZIONE`), quindi **non sfruttabile**. Va comunque irrobustito prima di alimentare lo schema con dati dinamici.

---

## 6. Tabella riepilogativa dei finding

| ID | Sev. | Descrizione | File:riga | Fix proposto | Stato |
|---|---|---|---|---|---|
| **S-01** | 🔴 **CRITICA** | **Next.js 14.2.35 è l'ultima release del ramo 14.x: nessuna patch di sicurezza disponibile né futura.** 23 advisory aperti (1 critico), `fixAvailable` = `next@16.3.5` (major). Le mitigazioni contestuali (deploy su Vercel, nessun middleware, nessun Server Action, nessuna immagine remota, host Linux) riducono l'impatto *odierno*, ma il ramo resterà permanentemente non patchato. | `package.json:16`, `package-lock.json` | Pianificare l'upgrade a **Next 15.5.x** (`backport` tag: `15.5.25`, migrazione moderata dall'App Router 14) o **16.3.5**. Nel frattempo: `npm audit` in CI con soglia, e Dependabot/Renovate attivi sul repo. | 🔵 Aperto — Blocco B |
| **S-02** | 🟠 **ALTA** | **Nessun rate limiting su 6 endpoint pubblici non autenticati** che scrivono su Supabase con `service_role` e inviano email via Resend. Un singolo script può gonfiare il DB, saturare lo storage e consumare la quota Resend. Peggiore: `/api/configuratore` invia **un'email di conferma all'indirizzo fornito dal client**, senza verifica → il sito è utilizzabile come **relay per email-bombing** di terzi, con la reputazione del dominio `dodiitalia.it` a rischio. | tutte le route in `app/api/`; `lib/configuratore/email.ts:109-125` | Introdurre `middleware.ts` con rate limit per IP (es. `@upstash/ratelimit` + `@vercel/kv`, 5 richieste/10 min per endpoint). Aggiungere un CAPTCHA invisibile (Turnstile/hCaptcha) sulle form pubbliche. Valutare di inviare la conferma cliente solo dopo una verifica dell'indirizzo, o di limitarla per destinatario. | 🔵 Aperto — Blocco B |
| **S-03** | 🟠 **ALTA** | **Upload non autenticato con controlli aggirabili.** (a) Il check MIME salta quando `file.type` è vuoto: `if (file.type && …)`. (b) Nessun controllo di estensione né dei magic bytes. (c) `upsert: true` con path interamente client-controllato ⇒ sovrascrittura dell'allegato altrui. (d) `sanitize()` consente `.` quindi `..` sopravvive. (e) `multipart/form-data` è CORS-simple ⇒ POST cross-origin senza preflight. Mitigato dal bucket privato. | `app/api/configuratore/upload/route.ts:12-14, 34-52` | Rendere il MIME obbligatorio (`if (!ALLOWED.includes(file.type))`); validare anche l'estensione contro un'allowlist; verificare i magic bytes (`file-type`); **generare il path server-side** (`crypto.randomUUID()`) ignorando il nome client; `upsert: false`; in `sanitize()` bloccare `..` (`.replace(/\.{2,}/g, ".")`); controllare l'header `Origin`. | 🔵 Aperto — Blocco B |
| **S-04** | 🟠 **ALTA** | **HTML injection nell'email interna**: le *label* del riepilogo non sono escaped e sono controllabili dal client tramite i fallback `CAMPO_LABELS[key] ?? key` e `slotLabels[slot] ?? slot` su oggetti `Record<string,string>` inviati dal client. Anche `reference` (client-generato, mai validato) finisce non-escaped nel titolo di entrambe le email. Non è un XSS affidabile nei client email moderni, ma consente falsificazione del contenuto, link di phishing verso l'operatore e tracking pixel. | `lib/configuratore/email.ts:23, 78, 88, 113`; `lib/configuratore/riepilogo.ts:52, 110` | Applicare `escapeHtml()` a **ogni** interpolazione (`r.label`, `sec.title`, `a.label`, `args.reference`, `title`, `intro`) e usare `encodeURI()`/allowlist su `a.url`. Aggiungere `'` → `&#39;` in `escapeHtml`. In alternativa, scartare le chiavi sconosciute invece di usarle come label. | ✅ **Chiuso** |
| **S-05** | 🟠 **ALTA** | **Nessun security header.** `next.config.mjs` è vuoto, `vercel.json` contiene solo un redirect, non esiste `middleware.ts`. Mancano CSP, HSTS, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Il sito è inquadrabile in iframe (clickjacking sul configuratore). | `next.config.mjs:2`, `vercel.json` | Aggiungere `async headers()` in `next.config.mjs` con almeno: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, e una CSP (partire in `Report-Only`: attenzione a `'unsafe-inline'` richiesto dallo stile inline di Next e dai blocchi JSON-LD). | ✅ **Chiuso** |
| **S-06** | 🟡 **MEDIA** | **Nessun limite di dimensione né di lunghezza sugli input.** Zero `maxLength` in tutto il frontend; nessuna route valida la lunghezza dei campi; nessun cap applicativo sul body (solo il limite di piattaforma Vercel). Un campo `note` da megabyte viene scritto su Postgres e poi incorporato in email e PDF. Nell'upload, `req.formData()` bufferizza l'intero file **prima** del controllo dei 10 MB. | tutte le route in `app/api/`; `app/api/configuratore/upload/route.ts:24,37` | Adottare **zod** e validare con schema tipizzati: lunghezze massime per campo (es. nome 120, note 2000), formato email, formato `reference` (`/^IC-[A-Z0-9]{1,12}-[A-Z0-9]{4}$/`), formato data ISO. Rifiutare in anticipo su `Content-Length`. | 🔵 Aperto — Blocco B |
| **S-07** | 🟡 **MEDIA** | **`lib/supabase.ts` è codice morto che mescola client anon e `service_role` nello stesso modulo**, senza guard `server-only`. Duplica `supabaseAdmin()` già presente in `lib/supabaseAdmin.ts`. Se un componente client importasse `supabase` da qui, il modulo entrerebbe nel grafo client (il *valore* della chiave non trapelerebbe — Next inlinea solo le `NEXT_PUBLIC_` — ma è un rischio evitabile e una duplicazione confondente). | `lib/supabase.ts:13, 17-22` | **Eliminare `lib/supabase.ts`** (nessuno lo importa). Aggiungere `import "server-only"` in cima a `lib/supabaseAdmin.ts`, `lib/configuratore/email.ts` e `lib/configuratore/pdf.tsx`. | ✅ **Chiuso** |
| **S-08** | 🟡 **MEDIA** | **RLS Supabase mai esercitata.** Tutte le scritture passano da `service_role`, che bypassa RLS; la anon key è usata solo in codice morto. Se le tabelle `preventivi`, `richieste`, `prenotazioni`, `candidature_partner` non avessero RLS attiva, la anon key (pubblica per design) consentirebbe la lettura diretta di tutti i dati personali dei clienti. | `lib/supabase.ts:9-13`; `.env.example:4` | Verificare **nella dashboard Supabase** che RLS sia `ENABLE` su tutte e quattro le tabelle e sul bucket `configuratore-uploads`, con policy deny-by-default per i ruoli `anon`/`authenticated`. Se la anon key non serve, rimuoverla da `.env.example` e da Vercel. | 🔵 Aperto — verifica dashboard |
| **S-09** | 🟡 **MEDIA** | **Path degli allegati controllati dal client in fase di submit.** `collectAllegati()` estrae i path dallo stato inviato dal client e `/api/configuratore` li passa a `createSignedUrls()` e li salva in `foto_urls`, **senza verificare che appartengano al `reference` della richiesta**. Un client malevolo può far generare signed URL per path arbitrari del bucket e avvelenare `foto_urls`. Impatto contenuto: le URL firmate finiscono solo nell'email interna e non sono restituite nella risposta HTTP. | `app/api/configuratore/route.ts:39-40, 81`; `lib/configuratore/riepilogo.ts:38-55` | Filtrare i path accettando solo quelli con prefisso `${sanitize(state.reference)}/`, scartando gli altri prima della firma e dell'insert. | 🟡 Mitigato in parte |
| **S-10** | 🟡 **MEDIA** | **`reference` generato dal client** con `Date.now()` + `Math.random()` (4 caratteri) e **mai validato né rigenerato lato server**, pur essendo la chiave della cartella di storage e il riferimento della richiesta. Prevedibile e collidibile. | `components/configuratore/ConfiguratoreProvider.tsx:26-33`; `app/api/configuratore/route.ts:36`; `app/api/configuratore/upload/route.ts:30` | Generare il `reference` **server-side** con `crypto.randomUUID()` (o `crypto.randomBytes`) e restituirlo al client all'apertura del wizard; in ogni caso validarne il formato con una regex prima di ogni uso. | 🟡 Mitigato in parte |
| **S-11** | 🟡 **MEDIA** | **`/api/prenotazione`: `giorno` non validato e disponibilità fittizia.** `giorno` accetta qualsiasi stringa (date passate, testo arbitrario). `slotDisponibile()` è un hash deterministico della chiave, non uno stato reale: non esiste locking, due utenti possono prenotare lo stesso slot (limite noto, `route.ts:53-55`). | `app/api/prenotazione/route.ts:19,38`; `lib/riparazione.ts:78-83` | Validare `giorno` come data ISO entro una finestra futura ragionevole. Per la disponibilità reale: tabella `slot` con vincolo `UNIQUE(sede, giorno, fascia)` e insert transazionale. | 🔵 Aperto — Blocco B |
| **S-12** | 🟢 **BASSA** | **`poweredByHeader` non disabilitato**: ogni risposta espone `X-Powered-By: Next.js`. | `next.config.mjs:2` | `const nextConfig = { poweredByHeader: false };` | ✅ **Chiuso** |
| **S-13** | 🟢 **BASSA** | **JSON-LD senza escape di `<`**: `JSON.stringify` non neutralizza `</script>`. Non sfruttabile oggi (tutti i dati sono costanti del repo), ma fragile in vista di contenuti dinamici. | `lib/seo/schema.ts:92-94` | `JSON.stringify(schema).replace(/</g, "\\u003c")` | ✅ **Chiuso** |
| **S-14** | 🟢 **BASSA** | **`dangerouslySetInnerHTML` su `settore.body`.** Contenuto oggi statico (`lib/settori.ts`, solo `<strong>`). Diventerebbe **alto** se quei testi passassero a un CMS o a input redazionale. | `app/settori/[slug]/page.tsx:104` | Sostituire con un renderer markdown sanificato, o sanificare con `isomorphic-dompurify` se la sorgente diventa dinamica. | 🔵 Aperto — contenuto statico |
| **S-15** | 🟢 **BASSA** | **PII persistite indefinitamente in `localStorage`**: nome, email, telefono, P.IVA, indirizzo, targa. Ripulite solo a wizard completato o reset esplicito; chi abbandona lascia i dati nel browser. Rilevante su postazioni condivise e per la minimizzazione GDPR. | `components/configuratore/ConfiguratoreProvider.tsx:75-81`; `app/configuratore/conferma/ConfermaContent.tsx:16-22` | Aggiungere un TTL allo stato salvato (es. 24-48 h, scartandolo alla reidratazione) ed escludere dal salvataggio i campi del passo "Dati cliente" (o salvarli solo per la sessione corrente). | ✅ **Chiuso** |
| **S-16** | 🟢 **BASSA** | **`nanoid` e `postcss` vulnerabili** (2 advisory high ciascuno). Entrambi sono dipendenze transitive della **toolchain di build**, non esposte a input non fidati a runtime: impatto pratico su questo progetto molto basso. | `package-lock.json` (via `next`) | `npm audit fix` risolve `nanoid`. `postcss` risale a `next` e si chiude con l'upgrade di **S-01**. | 🟡 Mitigato in parte |
| **S-17** | 🟢 **BASSA** | **Oggetti errore Supabase completi nei log**: `console.error("…", error)` in tutte e 6 le route può scrivere nei log Vercel dettagli di schema, vincoli e frammenti di payload. | `candidatura:43`, `configuratore:74,100`, `upload:55`, `contatto:44`, `prenotazione:49`, `preventivo:68` | Loggare solo `error.code` e `error.message`; evitare che il payload utente finisca nei log. | 🔵 Aperto — Blocco B |
| **S-18** | 🟢 **BASSA** | **Spread del body del client nell'`insert`**: `insert({ reference, ...body })`. Non sfruttabile oggi (PostgREST rifiuta le colonne inesistenti), ma diventa mass-assignment nel momento in cui si aggiunge una colonna di stato/prezzo alla tabella. | `candidatura:40`, `contatto:41`, `prenotazione:46` | Mappare esplicitamente i campi, come già fatto correttamente in `app/api/preventivo/route.ts:46-65`. | 🔵 Aperto — Blocco B |
| **S-19** | ⚪ **INFO** | **Dipendenza inutilizzata**: `playwright` (devDep) non ha alcun import né alcun test nel repo. Inoltre `lib/supabase.ts` e `scripts/verify-branching.ts` sono codice morto (quest'ultimo auto-dichiarato temporaneo). `lucide-react` è installata per una sola icona. | `package.json:28`; `lib/supabase.ts`; `scripts/verify-branching.ts:7` | `npm uninstall playwright`; eliminare i due file morti; valutare l'inline dell'unica icona per rimuovere `lucide-react`. | ✅ **Chiuso** |
### Distribuzione

| Severità | Numero |
|---|---|
| 🔴 Critica | 1 |
| 🟠 Alta | 4 |
| 🟡 Media | 6 |
| 🟢 Bassa | 7 |
| ⚪ Info | 1 |
| **Totale** | **19** |

---

## 7. Priorità di intervento suggerita

1. **Subito, basso sforzo e alto rendimento** — S-05 (security header in `next.config.mjs`) + S-12 (`poweredByHeader: false`): una sola modifica di configurazione.
2. **Subito** — S-04 (escape di tutte le interpolazioni in `email.ts`): poche righe, chiude l'unica injection realmente raggiungibile.
3. **Breve termine** — S-02 (rate limiting + CAPTCHA) e S-03 (irrobustire l'upload): sono ciò che oggi protegge davvero il budget Supabase/Resend e la reputazione del dominio mittente.
4. **Breve termine** — S-08: verificare RLS nella dashboard Supabase. È un controllo di 5 minuti che copre lo scenario peggiore (esposizione dei dati personali dei clienti).
5. **Medio termine** — S-06 (zod su tutte le route) e S-07/S-09/S-10 (pulizia del modulo Supabase, path e reference server-side).
6. **Pianificare** — S-01: upgrade di Next a 15.5.x o 16.x, con test di regressione sul configuratore.

---

## 8. Cosa è già fatto bene

Da non perdere nei prossimi refactor:

- ✅ Nessun segreto committato, mai, su nessun branch; `.gitignore` corretto.
- ✅ Separazione `NEXT_PUBLIC_` / server-only rispettata senza eccezioni.
- ✅ `service_role` usata **solo** in route handler server-side, letta a runtime e mai a livello di modulo.
- ✅ Bucket di storage **privato**, con accesso via signed URL a scadenza — riduce drasticamente l'impatto di S-03.
- ✅ Il prezzo del preventivo è **ricalcolato server-side** (`preventivo/route.ts:38`), la disponibilità slot **ri-verificata** (`prenotazione/route.ts:38`), il gate del wizard **rieseguito** lato server (`configuratore/route.ts:20`), con commenti espliciti «never trust the client».
- ✅ Errori generici verso il client, dettagli solo nei log.
- ✅ Nessun tracker di terze parti; cookie banner con gate di consenso già pronto.
- ✅ Nessuna source map client in produzione; nessun host immagine remoto autorizzato.
- ✅ Escaping già corretto sui **valori** del riepilogo e sul nome cliente nell'email di conferma: l'infrastruttura di difesa esiste, va solo estesa alle label.
