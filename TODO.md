# TODO — dati reali & integrazioni

Traccia dei dati placeholder e delle integrazioni ancora da completare.

## ✅ Risolti

- **WhatsApp business** — `+39 352 033 1778` (`393520331778` per i link `wa.me`).
  Usato su: pulsanti WhatsApp `/centri` (sedi attive), `/contatti`, footer,
  configuratore e riparazione rapida. → `lib/site.ts` (`WHATSAPP_NUMBER`).
- **Email** — `dirisoteloniitalia@dodiitalia.it`.
  Usata su: CTA email `/contatti`, footer, `mailto:`, e come destinatario nei
  TODO delle API stub (`/api/contatto`, `/api/preventivo`). → `lib/site.ts` (`EMAIL`).

## ⏳ Da recuperare

- **Telefono / WhatsApp** — `+39 352 033 1778` è l'unica linea, usata ovunque
  (`lib/site.ts` → `TEL_DISPLAY` / `WHATSAPP_*`, tutti i centri in `lib/centri.ts`).
- **Lombardia** è un'**area di copertura** (Nord Italia), non una sede fisica con
  indirizzo: nessuna via, esclusa dal `PostalAddress` schema.org (solo Angri ha
  indirizzo completo). Se in futuro apre una sede fisica in Lombardia, aggiungere
  via + reintrodurre l'indirizzo in `lib/seo/schema.ts`.

## 🔌 Integrazioni backend (Fase 6)

- **Supabase** (progetto separato da DodiX): creare progetto + tabelle, poi
  cablare le 4 API stub (`/api/preventivo`, `/api/prenotazione`,
  `/api/candidatura`, `/api/contatto`). Env in `.env.example`.
- **WhatsApp Cloud API**: notifica al centro competente / a Di Riso.
- **PDF preventivo** branded navy/oro sulle richieste da `/preventivo` e dal
  configuratore.
