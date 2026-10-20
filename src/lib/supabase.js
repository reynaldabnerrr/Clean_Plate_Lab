import { createClient } from "@supabase/supabase-js";

const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : typeof process !== "undefined" && process.env
      ? process.env
      : {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else if (env.NODE_ENV !== "test") {
  console.warn(
    "Supabase env vars missing — supabase client is null. " +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export { supabase };
