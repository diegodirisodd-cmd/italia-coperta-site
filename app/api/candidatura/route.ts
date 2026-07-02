import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  const { error } = await supabaseAdmin()
    .from("candidature_partner")
    .insert({ reference, ...body });

  if (error) {
    console.error("Errore insert candidature_partner:", error);
    return NextResponse.json({ error: "Errore nell'invio della candidatura" }, { status: 500 });
  }

  // TODO (Fase 6 backend, once notifications exist):
  //   - notify Di Riso (email + WhatsApp) of the new partner application.

  return NextResponse.json({ reference });
}
