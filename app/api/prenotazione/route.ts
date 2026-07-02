import { NextResponse } from "next/server";
import { INTERVENTI, SEDI, FASCE, slotDisponibile } from "@/lib/riparazione";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Payload = {
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
  let body: Partial<Payload>;
  try {
    body = (await req.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ error: "Dati incompleti" }, { status: 422 });
  }

  // Re-check availability server-side so a stale client can't book a full slot.
  if (!slotDisponibile(body.sede, body.giorno, body.fascia)) {
    return NextResponse.json({ error: "Fascia non più disponibile" }, { status: 409 });
  }

  const reference = "RIP-" + Date.now().toString(36).toUpperCase();

  const { error } = await supabaseAdmin()
    .from("prenotazioni")
    .insert({ reference, ...body });

  if (error) {
    console.error("Errore insert prenotazioni:", error);
    return NextResponse.json({ error: "Errore nel salvataggio della prenotazione" }, { status: 500 });
  }

  // TODO (Fase 6, once WhatsApp exists):
  //   - mark the slot taken inside a transaction (real calendar).
  //   - notify the chosen sede via WhatsApp Cloud API.

  return NextResponse.json({ reference });
}
