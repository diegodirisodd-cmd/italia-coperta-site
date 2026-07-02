import { createClient } from "@supabase/supabase-js";

/**
 * Wiring only — points at the Supabase project's env vars but no project
 * exists yet. Create a project SEPARATE from DodiX and populate .env.local
 * (see .env.example) before any of these are used.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Browser / client-component usage — respects RLS.
export const supabase = createClient(url, anonKey);

// Server-only usage (route handlers, server actions) — bypasses RLS via the
// service role key. Never import this from a client component.
export function supabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
