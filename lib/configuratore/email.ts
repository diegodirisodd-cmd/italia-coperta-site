// Server-only: sends the configuratore notification (to Di Riso) and the
// optional confirmation (to the customer) via Resend, with the branded PDF
// attached. Best-effort: any failure is logged and swallowed so a mail problem
// never blocks a saved request.

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
      <h3 style="margin:20px 0 6px;font:600 13px/1.3 Arial,sans-serif;color:#E31919;text-transform:uppercase;letter-spacing:.06em">${sec.title}</h3>
      <table style="width:100%;border-collapse:collapse;font:13px/1.4 Arial,sans-serif;color:#151A24">
        ${sec.rows
          .map(
            (r) => `<tr>
              <td style="padding:5px 10px 5px 0;color:#5B6472;width:42%;vertical-align:top;border-bottom:1px solid #E3E6EC">${r.label}</td>
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
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] || c);
}

function wrapHtml(title: string, intro: string, body: string): string {
  return `<div style="max-width:640px;margin:0 auto;background:#ffffff">
    <div style="background:#0E1633;padding:22px 28px">
      <div style="font:700 17px/1 Arial,sans-serif;color:#fff;letter-spacing:1px">DI RISO TELONI</div>
      <div style="font:8px/1 Arial,sans-serif;color:#B9C0CE;margin-top:4px;letter-spacing:1px">ITALIA COPERTA · DAL 1950</div>
    </div>
    <div style="height:4px;background:#E31919"></div>
    <div style="padding:24px 28px">
      <h2 style="margin:0 0 8px;font:700 18px/1.2 Arial,sans-serif;color:#151A24">${title}</h2>
      <p style="margin:0 0 8px;font:14px/1.5 Arial,sans-serif;color:#5B6472">${intro}</p>
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
}): Promise<{ notified: boolean; confirmed: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY assente: email non inviate (richiesta comunque salvata).");
    return { notified: false, confirmed: false, error: "RESEND_API_KEY mancante" };
  }

  const resend = new Resend(apiKey);
  const attachments = [{ filename: `richiesta-${args.reference}.pdf`, content: args.pdf }];
  const allegatiHtml = args.allegatiUrls.length
    ? `<h3 style="margin:20px 0 6px;font:600 13px/1.3 Arial,sans-serif;color:#E31919;text-transform:uppercase">Allegati</h3>
       <ul style="font:13px/1.6 Arial,sans-serif;color:#151A24;padding-left:18px">
       ${args.allegatiUrls.map((a) => `<li><a href="${a.url}">${a.label}</a></li>`).join("")}</ul>`
    : "";

  let notified = false;
  let confirmed = false;
  let error: string | undefined;

  // 1) Internal notification to Di Riso.
  try {
    const html = wrapHtml(
      `Nuova richiesta configuratore — ${args.reference}`,
      `Ricevuta il ${args.createdAt}. Riepilogo completo in allegato (PDF).`,
      sectionsToHtml(args.sections) + allegatiHtml,
    );
    const res = await resend.emails.send({
      from: FROM,
      to: EMAIL,
      replyTo: args.clienteEmail || undefined,
      subject: `Nuova richiesta configuratore — ${args.reference}`,
      html,
      text: `Nuova richiesta configuratore ${args.reference} (${args.createdAt})\n${sectionsToText(args.sections)}`,
      attachments,
    });
    if (res.error) throw new Error(res.error.message);
    notified = true;
  } catch (e) {
    error = e instanceof Error ? e.message : "invio notifica non riuscito";
    console.error("Errore email notifica configuratore:", e);
  }

  // 2) Confirmation to the customer (if they left an email).
  if (args.clienteEmail) {
    try {
      const html = wrapHtml(
        "Richiesta ricevuta",
        `Grazie ${escapeHtml(args.clienteNome || "")}! Abbiamo ricevuto la tua richiesta (rif. ${args.reference}) e ti ricontatteremo al più presto con il preventivo o l'intervento più adatto. In allegato trovi il riepilogo.`,
        sectionsToHtml(args.sections),
      );
      const res = await resend.emails.send({
        from: FROM,
        to: args.clienteEmail,
        subject: `La tua richiesta a Di Riso Teloni — ${args.reference}`,
        html,
        text: `Grazie! Abbiamo ricevuto la tua richiesta ${args.reference}.\n${sectionsToText(args.sections)}`,
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
