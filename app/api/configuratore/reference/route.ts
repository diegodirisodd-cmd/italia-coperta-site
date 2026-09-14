import { NextResponse } from "next/server";
import { newReference } from "@/lib/reference";
import { rateLimitByIp, troppeRichieste } from "@/lib/rateLimit";

export const runtime = "nodejs";
// Mai in cache: ogni wizard deve ricevere un reference diverso.
export const dynamic = "force-dynamic";

/**
 * Emette il reference della richiesta all'avvio del wizard (S-10). Prima lo
 * coniava il client con Date.now() + Math.random(): prevedibile, collidibile e
 * usato come cartella di storage.
 *
 * Non tocca il database e non scrive nulla: il limite è generoso e serve solo
 * a evitare che venga usato come generatore gratuito a ciclo continuo.
 */
export async function GET(req: Request) {
  const rl = await rateLimitByIp(req, { name: "reference", limit: 30, window: "10 m" });
  if (!rl.ok) return troppeRichieste(rl.retryAfter);

  return NextResponse.json(
    { reference: newReference() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
