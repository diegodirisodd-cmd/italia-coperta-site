/**
 * Security headers — vedi SECURITY-AUDIT.md, finding S-05 e S-12.
 *
 * CSP: deliberatamente **Report-Only**, mai enforced, e **senza nonce**.
 * Next 14.2.35 ha un advisory XSS aperto proprio sull'App Router con i nonce
 * CSP (GHSA-ffhc-5mcf-pf4q) e il ramo 14.x non riceverà altre patch (S-01),
 * quindi i nonce qui aumenterebbero il rischio invece di ridurlo. Finché non
 * si sale a Next 15/16 la strada è 'unsafe-inline' per gli stili e per i
 * blocchi JSON-LD inline.
 */

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' copre i <script type="application/ld+json"> delle pagine.
  // In dev Next usa eval per l'HMR: senza 'unsafe-eval' il report locale
  // sarebbe pieno di violazioni che in produzione non esistono.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Next inietta gli stili critici inline; next/font fa lo stesso.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
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
  { key: "Content-Security-Policy-Report-Only", value: csp },
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
