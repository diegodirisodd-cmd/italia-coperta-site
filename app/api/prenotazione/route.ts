import { NextResponse } from "next/server";
import { INTERVENTI, SEDI, FASCE, slotDisponibile } from "@/lib/riparazione";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { LIMITE_FORM, rateLimitByIp, troppeRichieste } from "@/lib/rateLimit";
import { verificaFallita, verificaTurnstile } from "@/lib/turnstile";

type Payload = {
  turnstileToken?: string;
  intervento: string;
  sede: string;
  giorno: string;
  fascia: string;
  nome: string;
  telefono: string;
};

function isValid(p: Partial<Payload>): p is Payload {
  return Boolean(
    p.intervento && INTERVENTI.some((i) => i.id === p.intervento) &&
      p.sede && SEDI.some((s) => s.id === p.sede) &&
      p.fascia && FASCE.some((f) => f.id === p.fascia) &&
      p.giorno &&
      p.nome?.trim() &&
      p.telefono?.trim(),
  );
}

export async function POST(req: Request) {
  // Rate limit per IP, prima di leggere il corpo (S-02).
  const rl = await rateLimitByIp(req, { name: "prenotazione", ...LIMITE_FORM });
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

  // Re-check availability server-side so a stale client can't book a full slot.
  if (!slotDisponibile(body.sede, body.giorno, body.fascia)) {
    return NextResponse.json({ error: "Fascia non più disponibile" }, { status: 409 });
  }

  const reference = "RIP-" + Date.now().toString(36).toUpperCase();

  // `turnstileToken` è un campo di trasporto, non un dato della richiesta:
  // va tolto prima dell'insert (nessuna colonna corrispondente).
  const { turnstileToken: _scartato, ...datiRichiesta } = body;

  const { error } = await supabaseAdmin()
    .from("prenotazioni")
    .insert({ reference, ...datiRichiesta });

  if (error) {
    console.error("Errore insert prenotazioni:", error);
    return NextResponse.json({ error: "Errore nel salvataggio della prenotazione" }, { status: 500 });
  }

  // TODO (Fase 6, once WhatsApp exists):
  //   - mark the slot taken inside a transaction (real calendar).
  //   - notify the chosen sede via WhatsApp Cloud API.

  return NextResponse.json({ reference });
}
