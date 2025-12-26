import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Fallback: if expected env vars are missing (dev/turbopack), try to load .env.local
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      console.log('Loading .env.local from', envPath);
      content.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
        if (m) {
          const key = m[1];
          let val = m[2] || "";
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
        console.log('After .env.local load, NEXT_PUBLIC_SUPABASE_URL=', process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 40));
      });
    }
  } catch (e) {
    // ignore
  }
}

export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default createSupabaseServerClient;
