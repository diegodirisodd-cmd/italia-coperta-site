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

- **Telefono sede Angri** — placeholder `081 000 0000`. → `lib/site.ts` (`TEL_ANGRI`)
  e `lib/centri.ts` (centro `angri`).
- **Telefono sede Brescia** — placeholder `030 000 0000`. → `lib/site.ts` (`TEL_BRESCIA`)
  e `lib/centri.ts` (centro `brescia`).
- **Indirizzo completo Brescia** — non disponibile. Attualmente Brescia compare
  solo come sede/area senza via ed è **volutamente esclusa** dallo schema.org
  `LocalBusiness` (solo Angri ha indirizzo completo). Quando disponibile:
  aggiornare `app/contatti/page.tsx`, `lib/centri.ts` (centro `brescia`) e
  reintrodurre l'indirizzo in `lib/seo/schema.ts` (`localBusinessSchema`).
- **Telefoni centri partner** — placeholder in `lib/centri.ts` per Torino,
  Milano, Padova, Bologna, Roma, Bari (aree "prossima apertura").

## 🔌 Integrazioni backend (Fase 6)

- **Supabase** (progetto separato da DodiX): creare progetto + tabelle, poi
  cablare le 4 API stub (`/api/preventivo`, `/api/prenotazione`,
  `/api/candidatura`, `/api/contatto`). Env in `.env.example`.
- **WhatsApp Cloud API**: notifica al centro competente / a Di Riso.
- **PDF preventivo** branded navy/oro sulle richieste da `/preventivo` e dal
  configuratore.
