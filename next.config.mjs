/**
 * Security headers — vedi SECURITY-AUDIT.md, finding S-05 e S-12.
 *
 * CSP **enforced** dal Blocco B (prima era Report-Only), e **senza nonce**.
 * Next 14.2.35 ha un advisory XSS aperto proprio sull'App Router con i nonce
 * CSP (GHSA-ffhc-5mcf-pf4q) e il ramo 14.x non riceverà altre patch (S-01),
 * quindi i nonce qui aumenterebbero il rischio invece di ridurlo. Finché non
 * si sale a Next 15/16 la strada è 'unsafe-inline' per gli stili e per i
 * blocchi JSON-LD inline.
 *
 * Con 'unsafe-inline' attivo questa CSP NON protegge dall'XSS inline: quello
 * che dà è frame-ancestors, object-src, base-uri, form-action e il
 * confinamento delle destinazioni di rete. La protezione XSS vera arriva con
 * l'upgrade a Next 15/16 e i nonce.
 */

const isDev = process.env.NODE_ENV === "development";

/** Host di Cloudflare Turnstile: script del widget, iframe della sfida e
 *  chiamate di verifica/telemetria. Senza questi la CSP enforced romperebbe
 *  l'anti-spam su tutte le form (S-02). */
const TURNSTILE = "https://challenges.cloudflare.com";

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' copre i <script type="application/ld+json"> delle pagine.
  // In dev Next usa eval per l'HMR: in produzione 'unsafe-eval' non c'è.
  `script-src 'self' 'unsafe-inline' ${TURNSTILE}${isDev ? " 'unsafe-eval'" : ""}`,
  // Next inietta gli stili critici inline; next/font fa lo stesso.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co ${TURNSTILE}`,
  // La sfida Turnstile gira in un iframe servito da Cloudflare.
  `frame-src ${TURNSTILE}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Ora che la policy è enforced questa direttiva è finalmente attiva
  // (in Report-Only veniva ignorata dal browser).
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // S-12: non annunciare lo stack a ogni risposta.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
