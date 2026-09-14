// Server-only: sends the configuratore notification (to Di Riso) and the
// optional confirmation (to the customer) via Resend, with the branded PDF
// attached. Best-effort: any failure is logged and swallowed so a mail problem
// never blocks a saved request.

import "server-only";
import { Resend } from "resend";
import { EMAIL } from "@/lib/site";
import type { RiepilogoSection } from "./riepilogo";

// Sender must use a domain verified in Resend. dodiitalia.it is verified;
// dirisoteloni1950.com is not.
const FROM = process.env.RESEND_FROM || "Italia Coperta <noreply@dodiitalia.it>";

function sectionsToHtml(sections: RiepilogoSection[]): string {
  return sections
    .map(
      (sec) => `
      <h3 style="margin:20px 0 6px;font:600 13px/1.3 Arial,sans-serif;color:#E31919;text-transform:uppercase;letter-spacing:.06em">${escapeHtml(sec.title)}</h3>
      <table style="width:100%;border-collapse:collapse;font:13px/1.4 Arial,sans-serif;color:#151A24">
        ${sec.rows
          .map(
            (r) => `<tr>
              <td style="padding:5px 10px 5px 0;color:#5B6472;width:42%;vertical-align:top;border-bottom:1px solid #E3E6EC">${escapeHtml(r.label)}</td>
              <td style="padding:5px 0;border-bottom:1px solid #E3E6EC">${escapeHtml(r.value)}</td>
            </tr>`,
          )
          .join("")}
      </table>`,
    )
    .join("");
}

function sectionsToText(sections: RiepilogoSection[]): string {
  return sections
    .map((sec) => `\n${sec.title.toUpperCase()}\n${sec.rows.map((r) => `  ${r.label}: ${r.value}`).join("\n")}`)
    .join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c,
  );
}

/**
 * Gli allegati sono signed URL generate dal route handler sul bucket privato,
 * ma i path di partenza arrivano dallo stato inviato dal client (S-09), quindi
 * l'URL finale non è fidata per costruzione: accettiamo solo l'origin esatto
 * del progetto Supabase configurato. Se NEXT_PUBLIC_SUPABASE_URL manca, si
 * ripiega su un qualunque host https *.supabase.co. Tutto il resto è scartato.
 */
function isAllegatoUrlSicura(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;

  const configured = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (configured) {
    try {
      return u.origin === new URL(configured).origin;
    } catch {
      // URL di progetto malformata: cade nel controllo generico qui sotto.
    }
  }
  return u.hostname === "supabase.co" || u.hostname.endsWith(".supabase.co");
}

/** `title` e `intro` sono TESTO: vengono escapati qui, quindi i chiamanti
 *  devono passarli grezzi. `body` è invece HTML già composto e non va toccato. */
function wrapHtml(title: string, intro: string, body: string): string {
  return `<div style="max-width:640px;margin:0 auto;background:#ffffff">
    <div style="background:#0E1633;padding:22px 28px">
      <div style="font:700 17px/1 Arial,sans-serif;color:#fff;letter-spacing:1px">DI RISO TELONI</div>
      <div style="font:8px/1 Arial,sans-serif;color:#B9C0CE;margin-top:4px;letter-spacing:1px">ITALIA COPERTA · DAL 1950</div>
    </div>
    <div style="height:4px;background:#E31919"></div>
    <div style="padding:24px 28px">
      <h2 style="margin:0 0 8px;font:700 18px/1.2 Arial,sans-serif;color:#151A24">${escapeHtml(title)}</h2>
      <p style="margin:0 0 8px;font:14px/1.5 Arial,sans-serif;color:#5B6472">${escapeHtml(intro)}</p>
      ${body}
    </div>
  </div>`;
}

export async function sendConfiguratoreEmails(args: {
  reference: string;
  createdAt: string;
  sections: RiepilogoSection[];
  clienteEmail: string;
  clienteNome: string;
  allegatiUrls: { label: string; url: string }[];
  pdf: Buffer;
  /** false quando il limite per destinatario è stato superato (S-02): la
   *  notifica interna parte lo stesso, la conferma al cliente no. */
  inviaConferma?: boolean;
}): Promise<{ notified: boolean; confirmed: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY assente: email non inviate (richiesta comunque salvata).");
    return { notified: false, confirmed: false, error: "RESEND_API_KEY mancante" };
  }

  const resend = new Resend(apiKey);

  // Il reference è generato dal client e non è mai validato a monte (S-10):
  // normalizzalo qui, così è sicuro in TUTTI i contesti — HTML, oggetto della
  // mail (dove l'escape HTML si vedrebbe) e nome del file allegato.
  const reference = args.reference.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40) || "SENZA-RIF";

  const attachments = [{ filename: `richiesta-${reference}.pdf`, content: args.pdf }];

  const allegatiSicuri = args.allegatiUrls.filter((a) => isAllegatoUrlSicura(a.url));
  const allegatiScartati = args.allegatiUrls.length - allegatiSicuri.length;
  if (allegatiScartati > 0) {
    console.warn(`Allegati scartati (URL non riconducibile a Supabase): ${allegatiScartati}`);
  }

  const allegatiHtml = allegatiSicuri.length
    ? `<h3 style="margin:20px 0 6px;font:600 13px/1.3 Arial,sans-serif;color:#E31919;text-transform:uppercase">Allegati</h3>
       <ul style="font:13px/1.6 Arial,sans-serif;color:#151A24;padding-left:18px">
       ${allegatiSicuri
         .map(
           (a) =>
             `<li><a href="${escapeHtml(encodeURI(a.url))}">${escapeHtml(a.label)}</a></li>`,
         )
         .join("")}</ul>`
    : "";

  let notified = false;
  let confirmed = false;
  let error: string | undefined;

  // 1) Internal notification to Di Riso.
  try {
    const html = wrapHtml(
      `Nuova richiesta configuratore — ${reference}`,
      `Ricevuta il ${args.createdAt}. Riepilogo completo in allegato (PDF).`,
      sectionsToHtml(args.sections) + allegatiHtml,
    );
    const res = await resend.emails.send({
      from: FROM,
      to: EMAIL,
      replyTo: args.clienteEmail || undefined,
      subject: `Nuova richiesta configuratore — ${reference}`,
      html,
      text: `Nuova richiesta configuratore ${reference} (${args.createdAt})\n${sectionsToText(args.sections)}`,
      attachments,
    });
    if (res.error) throw new Error(res.error.message);
    notified = true;
  } catch (e) {
    error = e instanceof Error ? e.message : "invio notifica non riuscito";
    console.error("Errore email notifica configuratore:", e);
  }

  // 2) Confirmation to the customer (if they left an email, and only if the
  //    per-recipient limit hasn't been hit — anti email-bombing, S-02).
  if (args.clienteEmail && args.inviaConferma !== false) {
    try {
      const html = wrapHtml(
        "Richiesta ricevuta",
        // Grezzo: wrapHtml() fa l'escape di title e intro.
        `Grazie ${args.clienteNome || ""}! Abbiamo ricevuto la tua richiesta (rif. ${reference}) e ti ricontatteremo al più presto con il preventivo o l'intervento più adatto. In allegato trovi il riepilogo.`,
        sectionsToHtml(args.sections),
      );
      const res = await resend.emails.send({
        from: FROM,
        to: args.clienteEmail,
        subject: `La tua richiesta a Di Riso Teloni — ${reference}`,
        html,
        text: `Grazie! Abbiamo ricevuto la tua richiesta ${reference}.\n${sectionsToText(args.sections)}`,
        attachments,
      });
      if (res.error) throw new Error(res.error.message);
      confirmed = true;
    } catch (e) {
      console.error("Errore email conferma cliente:", e);
    }
  }

  return { notified, confirmed, error };
}
