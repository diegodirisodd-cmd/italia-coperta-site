import { NextResponse } from "next/server";

type Payload = {
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
  let body: Partial<Payload>;
  try {
    body = (await req.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ error: "Dati incompleti" }, { status: 422 });
  }

  const reference = "PARTNER-" + Date.now().toString(36).toUpperCase();

  // TODO (Fase 6 backend, once Supabase + notifications exist):
  //   1. supabaseAdmin().from("candidature_partner").insert({ reference, ...body })
  //   2. notify Di Riso (email + WhatsApp) of the new partner application.

  return NextResponse.json({ reference });
}
