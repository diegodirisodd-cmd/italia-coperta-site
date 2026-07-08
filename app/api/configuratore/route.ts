import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { canLeaveStep } from "@/lib/configuratore/reducer";
import { buildRiepilogo, collectAllegati } from "@/lib/configuratore/riepilogo";
import { renderRichiestaPdf } from "@/lib/configuratore/pdf";
import { sendConfiguratoreEmails } from "@/lib/configuratore/email";
import type { ConfiguratoreState } from "@/lib/configuratore/types";

export const runtime = "nodejs";

const BUCKET = "configuratore-uploads";
const SIGNED_URL_TTL = 60 * 60 * 24 * 60; // 60 days

type Payload = { state: ConfiguratoreState };

function isValidState(s: ConfiguratoreState | undefined): s is ConfiguratoreState {
  if (!s || !s.reference || !s.tipologiaMezzo || !s.macroCategoria) return false;
  // Re-run the same gate the UI uses for the final data step (required fields +
  // privacy) — never trust the client.
  return canLeaveStep(s, "dati-cliente");
}

export async function POST(req: Request) {
  let body: Partial<Payload>;
  try {
    body = (await req.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const state = body.state;
  if (!isValidState(state)) {
    return NextResponse.json({ error: "Dati incompleti" }, { status: 422 });
  }

  const reference = state.reference;
  const createdAt = new Date().toLocaleString("it-IT", { dateStyle: "medium", timeStyle: "short" });
  const sections = buildRiepilogo(state);
  const allegati = collectAllegati(state);
  const fotoPaths = allegati.map((a) => a.path);
  const admin = supabaseAdmin();

  // Insert the request row. Old configuratore columns (veicolo/telo/…) stay
  // NULL for wizard rows; `nome` (still NOT NULL) mirrors nome_cognome.
  const { error } = await admin.from("preventivi").insert({
    reference,
    nome: state.datiCliente.nomeCognome,
    nome_cognome: state.datiCliente.nomeCognome,
    azienda: state.datiCliente.azienda || null,
    telefono: state.datiCliente.telefono,
    email: state.datiCliente.email,
    tipologia_mezzo: state.tipologiaMezzo,
    urgenza: state.urgenza.livello,
    sede_zona: state.sedeZona.sede,
    preferenza_contatto: state.datiCliente.preferenzaContatto,
    foto_urls: fotoPaths,
    dettagli_richiesta: {
      riepilogo: sections,
      macro_categoria: state.macroCategoria,
      sotto_opzione: state.sottoOpzione,
      richiesta_note: state.richiestaNote,
      mezzo_altro: state.mezzoAltro,
      colore_telo: state.coloreTelo,
      misure: state.misure,
      extra_optional: state.extraOptional,
      extra_note: state.extraNote,
      urgenza: state.urgenza,
      sede_zona: state.sedeZona,
      dati_cliente: state.datiCliente,
    },
  });

  if (error) {
    console.error("Errore insert preventivi (configuratore):", error);
    return NextResponse.json({ error: "Errore nel salvataggio della richiesta" }, { status: 500 });
  }

  // Signed URLs for the notification email (bucket is private).
  let allegatiUrls: { label: string; url: string }[] = [];
  if (fotoPaths.length) {
    const { data: signed } = await admin.storage.from(BUCKET).createSignedUrls(fotoPaths, SIGNED_URL_TTL);
    if (signed) {
      allegatiUrls = allegati.map((a, i) => ({ label: a.label, url: signed[i]?.signedUrl ?? "" })).filter((a) => a.url);
    }
  }

  // Branded PDF + emails (best-effort — a mail/PDF failure must not lose the row).
  try {
    const pdf = await renderRichiestaPdf({ reference, createdAt, sections });
    await sendConfiguratoreEmails({
      reference,
      createdAt,
      sections,
      clienteEmail: state.datiCliente.email,
      clienteNome: state.datiCliente.nomeCognome,
      allegatiUrls,
      pdf,
    });
  } catch (e) {
    console.error("Errore PDF/email configuratore (richiesta comunque salvata):", e);
  }

  return NextResponse.json({ reference });
}
