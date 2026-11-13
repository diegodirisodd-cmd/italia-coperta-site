import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { LIMITE_FORM, rateLimitByIp, troppeRichieste } from "@/lib/rateLimit";
import { verificaFallita, verificaTurnstile } from "@/lib/turnstile";

type Payload = {
  turnstileToken?: string;
  azienda: string;
  referente: string;
  telefono: string;
  email: string;
  zona: string;
  attivita?: string;
  messaggio?: string;
};

function isValid(p: Partial<Payload>): p is Payload {
  return Boolean(
    p.azienda?.trim() &&
      p.referente?.trim() &&
      p.telefono?.trim() &&
      p.email?.trim() &&
      p.zona?.trim(),
  );
}

export async function POST(req: Request) {
  // Rate limit per IP, prima di leggere il corpo (S-02).
  const rl = await rateLimitByIp(req, { name: "candidatura", ...LIMITE_FORM });
  if (!rl.ok) return troppeRichieste(rl.retryAfter);

  let body: Partial<Payload>;
  try {
    body = (await req.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  // Turnstile, prima di qualunque scrittura (S-02).
  const turnstile = await verificaTurnstile(req, body.turnstileToken);
  if (!turnstile.ok) return verificaFallita();

  if (!isValid(body)) {
    return NextResponse.json({ error: "Dati incompleti" }, { status: 422 });
  }

  const reference = "PARTNER-" + Date.now().toString(36).toUpperCase();

  // `turnstileToken` è un campo di trasporto, non un dato della richiesta:
  // va tolto prima dell'insert (nessuna colonna corrispondente).
  const { turnstileToken: _scartato, ...datiRichiesta } = body;

  const { error } = await supabaseAdmin()
    .from("candidature_partner")
    .insert({ reference, ...datiRichiesta });

  if (error) {
    console.error("Errore insert candidature_partner:", error);
    return NextResponse.json({ error: "Errore nell'invio della candidatura" }, { status: 500 });
  }

  // TODO (Fase 6 backend, once notifications exist):
  //   - notify Di Riso (email + WhatsApp) of the new partner application.

  return NextResponse.json({ reference });
}
