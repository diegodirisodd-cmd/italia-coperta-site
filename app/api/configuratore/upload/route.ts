import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isValidReference } from "@/lib/reference";
import { LIMITE_UPLOAD, rateLimitByIp, troppeRichieste } from "@/lib/rateLimit";

export const runtime = "nodejs";

const BUCKET = "configuratore-uploads";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — matches the bucket limit

/**
 * Tipi accettati. Ogni MIME è legato alle SUE estensioni: il nome file deve
 * concordare col MIME dichiarato, e i magic bytes devono concordare con
 * entrambi (S-03).
 *
 * HEIC è stato tolto rispetto alla versione precedente: `file-type` non lo
 * riconosce in modo affidabile e un tipo che non si può verificare non può
 * stare in una allowlist. Gli iPhone caricano JPEG per impostazione
 * predefinita, quindi l'impatto pratico è nullo.
 */
const ALLOWED: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

/** Origin ammesse: multipart/form-data è CORS-simple, quindi senza questo
 *  controllo un sito terzo potrebbe far caricare file dal browser di un
 *  visitatore senza nemmeno una preflight (S-03). */
const ORIGIN_PROD = "https://www.dirisoteloni1950.com";
const ORIGIN_APEX = "https://dirisoteloni1950.com";

function originAmmessa(origin: string | null): boolean {
  // Richiesta same-origin da un browser: Origin può mancare del tutto.
  if (!origin) return true;
  if (origin === ORIGIN_PROD || origin === ORIGIN_APEX) return true;
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:") {
      // In sviluppo il sito gira su http://localhost.
      return process.env.NODE_ENV !== "production" && u.hostname === "localhost";
    }
    return u.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

/** Mantiene lo slot sicuro dentro un path di storage. */
function sanitize(part: string): string {
  return part
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/\.{2,}/g, ".") // niente sequenze ".." (S-03)
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estensione(nome: string): string {
  const i = nome.lastIndexOf(".");
  return i === -1 ? "" : nome.slice(i).toLowerCase();
}

/**
 * Carica un singolo allegato del configuratore. Il client carica ogni file
 * appena viene scelto e conserva nello stato del wizard solo il path
 * restituito. Il bucket è privato; lo staff accede via signed URL generate al
 * momento dell'invio.
 */
export async function POST(req: Request) {
  // 1) Origin — prima di tutto: è il controllo più economico.
  if (!originAmmessa(req.headers.get("origin"))) {
    return NextResponse.json({ error: "Origine non consentita" }, { status: 403 });
  }

  // 2) Rate limit, prima di leggere il corpo.
  const rl = await rateLimitByIp(req, { name: "upload", ...LIMITE_UPLOAD });
  if (!rl.ok) return troppeRichieste(rl.retryAfter);

  // 3) Content-Length: rifiuta subito, senza bufferizzare 10 MB di multipart.
  const dichiarata = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(dichiarata) && dichiarata > MAX_BYTES + 8 * 1024) {
    return NextResponse.json({ error: "File troppo grande (max 10 MB)" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const reference = String(form.get("reference") ?? "");
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");

  if (!slot || !(file instanceof File)) {
    return NextResponse.json({ error: "Dati upload incompleti" }, { status: 422 });
  }
  // Il reference ora lo emette il server (/api/configuratore/reference): se
  // non ha il formato atteso non è nostro (S-10).
  if (!isValidReference(reference)) {
    return NextResponse.json({ error: "Riferimento richiesta non valido" }, { status: 422 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File troppo grande (max 10 MB)" }, { status: 413 });
  }

  // 4) MIME obbligatorio (prima un type vuoto saltava del tutto il controllo).
  const mime = file.type;
  const estensioniAmmesse = ALLOWED[mime];
  if (!estensioniAmmesse) {
    return NextResponse.json({ error: "Formato file non supportato" }, { status: 415 });
  }

  // 5) L'estensione deve concordare col MIME dichiarato.
  const ext = estensione(file.name || "");
  if (!estensioniAmmesse.includes(ext)) {
    return NextResponse.json({ error: "Estensione non coerente con il tipo di file" }, { status: 415 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // 6) Magic bytes: il contenuto reale deve combaciare col MIME dichiarato.
  //    Blocca il .jpg che in realtà è PHP, HTML o uno script.
  const rilevato = await fileTypeFromBuffer(bytes);
  if (!rilevato || rilevato.mime !== mime) {
    return NextResponse.json(
      { error: "Il contenuto del file non corrisponde al formato dichiarato" },
      { status: 415 },
    );
  }

  // 7) Path generato SERVER-SIDE: il nome scelto dal client non entra mai nel
  //    path (S-03). Niente collisioni, niente sovrascritture, niente traversal.
  const path = `${reference}/${sanitize(slot)}-${crypto.randomUUID()}${ext}`;

  const { error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .upload(path, bytes, {
      contentType: mime,
      upsert: false, // mai sovrascrivere un allegato esistente
    });

  if (error) {
    console.error("Errore upload configuratore:", error.message);
    return NextResponse.json({ error: "Upload non riuscito" }, { status: 500 });
  }

  // Il nome originale torna al client solo come metadato da mostrare.
  return NextResponse.json({ path, name: file.name });
}
