import { NextResponse } from "next/server";
import { stimaPrezzo, type ConfiguratoreSelezione } from "@/lib/configuratore";
import { getCentroForRegione } from "@/lib/regioni";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Payload = {
  selezione: ConfiguratoreSelezione;
  regione: string;
  dati: { nome: string; azienda?: string; telefono: string; email: string; note?: string };
};

function isValid(p: Partial<Payload>): p is Payload {
  return Boolean(
    p.selezione?.veicolo &&
      p.selezione?.telo &&
      p.selezione?.misura &&
      p.selezione?.materiale &&
      p.regione &&
      p.dati?.nome?.trim() &&
      p.dati?.telefono?.trim() &&
      p.dati?.email?.trim(),
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

  // Recompute the estimate server-side — never trust the client's number.
  const stima = stimaPrezzo(body.selezione);
  const centro = getCentroForRegione(body.regione);
  const reference = "IC-" + Date.now().toString(36).toUpperCase();

  // Flatten to the preventivi table's columns (the payload nests selezione /
  // dati; the table stores flat columns + stima_min/max/formatted).
  const { error } = await supabaseAdmin()
    .from("preventivi")
    .insert({
      reference,
      veicolo: body.selezione.veicolo,
      telo: body.selezione.telo,
      misura: body.selezione.misura,
      materiale: body.selezione.materiale,
      colore: body.selezione.colore,
      extra: body.selezione.extra,
      regione: body.regione,
      centro_id: centro?.id ?? null,
      centro_citta: centro?.citta ?? null,
      nome: body.dati.nome,
      azienda: body.dati.azienda ?? null,
      telefono: body.dati.telefono,
      email: body.dati.email,
      note: body.dati.note ?? null,
      stima_min: stima.min,
      stima_max: stima.max,
      stima_formatted: stima.formatted,
    });

  if (error) {
    console.error("Errore insert preventivi:", error);
    return NextResponse.json({ error: "Errore nel salvataggio della richiesta" }, { status: 500 });
  }

  // TODO (Fase 6, once the remaining integrations exist):
  //   2. generate the branded navy/gold PDF preventivo
  //   3. notify the assigned centre via WhatsApp Cloud API, and Di Riso via
  //      email (dirisoteloniitalia@dodiitalia.it — see EMAIL in lib/site.ts)

  return NextResponse.json({
    reference,
    stima: stima.formatted,
    centro: centro ? { id: centro.id, citta: centro.citta } : null,
  });
}
