// src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;
if (url && anon) {
  client = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
} else {
  // Не падаем – просто лог
  console.warn("[supabase] ENV vars missing. Cloud sync/auth is disabled.");
}

export const supabase = client;
