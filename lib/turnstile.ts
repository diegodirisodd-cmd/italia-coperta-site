import "server-only";
import { NextResponse } from "next/server";
import { clientIp } from "./rateLimit";

/**
 * Verifica server-side del token Cloudflare Turnstile (SECURITY-AUDIT.md —
 * S-02). Va chiamata PRIMA di qualunque scrittura su Supabase o invio email.
 *
 * Se TURNSTILE_SECRET_KEY non è impostata la verifica viene saltata con un
 * warning, così lo sviluppo locale e le build senza segreti continuano a
 * funzionare. In produzione la chiave DEVE essere presente: senza, questa
 * difesa è inerte.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  action?: string;
};

export type EsitoTurnstile = { ok: true } | { ok: false; motivo: string };

export async function verificaTurnstile(req: Request, token: unknown): Promise<EsitoTurnstile> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY assente: verifica SALTATA.");
    return { ok: true };
  }

  if (typeof token !== "string" || !token.trim()) {
    return { ok: false, motivo: "token assente" };
  }
  // Il token Turnstile è corto; un valore sproporzionato è spazzatura.
  if (token.length > 2048) {
    return { ok: false, motivo: "token malformato" };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: clientIp(req),
  });

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!res.ok) {
      // Cloudflare irraggiungibile o in errore: non si lascia passare, ma si
      // distingue nei log da un token realmente non valido.
      console.error("[turnstile] siteverify ha risposto", res.status);
      return { ok: false, motivo: "verifica non disponibile" };
    }

    const data = (await res.json()) as SiteverifyResponse;
    if (!data.success) {
      console.warn("[turnstile] token rifiutato:", data["error-codes"]?.join(",") ?? "senza codice");
      return { ok: false, motivo: "token non valido" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[turnstile] errore di rete durante siteverify:", e);
    return { ok: false, motivo: "verifica non disponibile" };
  }
}

/** Risposta 403 standard: generica, nessun dettaglio sul motivo del rifiuto. */
export function verificaFallita(): NextResponse {
  return NextResponse.json(
    { error: "Verifica anti-spam non superata. Ricarica la pagina e riprova." },
    { status: 403 },
  );
}
