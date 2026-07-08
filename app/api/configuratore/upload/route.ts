import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const BUCKET = "configuratore-uploads";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — matches the bucket limit
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

/** Keep the reference / slot safe for a storage path, and preserve a readable
 *  file name. */
function sanitize(part: string): string {
  return part.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/**
 * Uploads a single configuratore attachment. The client uploads each file as
 * soon as it is picked (small per-file requests, well under the serverless body
 * limit), then keeps only the returned storage path in the wizard state. The
 * bucket is private; staff access is via signed URLs generated at submit time.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const reference = String(form.get("reference") ?? "");
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");

  if (!reference || !slot || !(file instanceof File)) {
    return NextResponse.json({ error: "Dati upload incompleti" }, { status: 422 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File troppo grande (max 10 MB)" }, { status: 413 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Formato file non supportato" }, { status: 415 });
  }

  const path = `${sanitize(reference)}/${sanitize(slot)}-${sanitize(file.name || "file")}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (error) {
    console.error("Errore upload configuratore:", error);
    return NextResponse.json({ error: "Upload non riuscito" }, { status: 500 });
  }

  return NextResponse.json({ path, name: file.name });
}
