import "server-only";
import { NextResponse } from "next/server";
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting condiviso dalle route pubbliche (SECURITY-AUDIT.md — S-02).
 *
 * Vive nei route handler e NON in un middleware: l'assenza di `middleware.ts`
 * è ciò che oggi tiene questo sito fuori dagli advisory "middleware bypass" e
 * "middleware redirect cache poisoning" di Next 14.2.35, che non riceveranno
 * mai una patch (§4.4 del report). Il prezzo è una chiamata esplicita in cima
 * a ogni route; il vantaggio è non riaprire quella superficie.
 *
 * FAIL-OPEN per scelta: se Upstash non è configurato o non risponde, la
 * richiesta passa e viene loggato un warning. Un Redis giù non deve impedire
 * a un cliente di chiedere un preventivo.
 */

type Esito = { ok: true } | { ok: false; retryAfter: number };

let redisCache: Redis | null | undefined;
const limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redisCache !== undefined) return redisCache;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn(
      "[rateLimit] UPSTASH_REDIS_REST_URL/TOKEN assenti: rate limiting DISATTIVO (fail-open).",
    );
    redisCache = null;
    return null;
  }

  redisCache = new Redis({ url, token });
  return redisCache;
}

function getLimiter(name: string, limit: number, window: Duration): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const key = `${name}:${limit}:${window}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `ic:rl:${name}`,
      analytics: false,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

/**
 * IP del chiamante. Su Vercel `x-forwarded-for` è riscritto dal proxy e il
 * PRIMO valore è quello reale: a monte non c'è nulla che l'utente controlli.
 * Fuori da Vercel questo header è falsificabile, quindi il rate limiting va
 * considerato affidabile solo dietro il proxy di produzione.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "ip-sconosciuto";
}

/** Applica un limite a un identificatore qualunque (IP, email, …). */
export async function rateLimit(opts: {
  name: string;
  identifier: string;
  limit: number;
  window: Duration;
}): Promise<Esito> {
  const limiter = getLimiter(opts.name, opts.limit, opts.window);
  if (!limiter) return { ok: true }; // fail-open: Upstash non configurato

  try {
    const res = await limiter.limit(opts.identifier);
    if (res.success) return { ok: true };
    return { ok: false, retryAfter: Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)) };
  } catch (e) {
    // fail-open: un Redis irraggiungibile non deve bloccare le richieste.
    console.warn("[rateLimit] errore Upstash, richiesta consentita:", e);
    return { ok: true };
  }
}

/** Limite per IP, il caso normale per un endpoint pubblico. */
export function rateLimitByIp(
  req: Request,
  opts: { name: string; limit: number; window: Duration },
): Promise<Esito> {
  return rateLimit({ ...opts, identifier: clientIp(req) });
}

/** Risposta 429 standard: messaggio generico, nessun dettaglio sul limite. */
export function troppeRichieste(retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: "Troppe richieste. Riprova tra qualche minuto." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

/** Preset: 5 richieste / 10 minuti per IP, sliding window (form pubbliche). */
export const LIMITE_FORM = { limit: 5, window: "10 m" as Duration };
/** Preset: 20 upload / 10 minuti per IP. */
export const LIMITE_UPLOAD = { limit: 20, window: "10 m" as Duration };
/** Preset: 2 email di conferma / 24 h per destinatario (anti email-bombing). */
export const LIMITE_CONFERMA = { limit: 2, window: "24 h" as Duration };
