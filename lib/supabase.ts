import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("URL =", supabaseUrl);
console.log("KEY =", supabaseAnonKey ? "OK" : "UNDEFINED");

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL est undefined");
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY est undefined");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);