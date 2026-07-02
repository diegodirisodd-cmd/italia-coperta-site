import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Payload = {
  tipo: "contatto" | "preventivo";
  nome: string;
  azienda?: string;
  email: string;
  telefono: string;
  settore?: string;
  messaggio: string;
};

function isValid(p: Partial<Payload>): p is Payload {
  return Boolean(
    (p.tipo === "contatto" || p.tipo === "preventivo") &&
      p.nome?.trim() &&
      p.email?.trim() &&
      p.telefono?.trim() &&
      p.messaggio?.trim(),
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

  const prefix = body.tipo === "preventivo" ? "PREV" : "CON";
  const reference = `${prefix}-` + Date.now().toString(36).toUpperCase();

  const { error } = await supabaseAdmin()
    .from("richieste")
    .insert({ reference, ...body });

  if (error) {
    console.error("Errore insert richieste:", error);
    return NextResponse.json({ error: "Errore nell'invio della richiesta" }, { status: 500 });
  }

  // TODO (Fase 6 backend, once the remaining integrations exist):
  //   2. notify Di Riso via email (dirisoteloniitalia@dodiitalia.it — see
  //      EMAIL in lib/site.ts) + WhatsApp Cloud API
  //   3. for tipo === "preventivo": generate the branded navy/gold PDF and
  //      attach it to the reply.

  return NextResponse.json({ reference });
}
