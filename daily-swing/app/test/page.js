import { createSupabaseServerClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export default async function Page() {
  console.log("ENV keys:", Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('NEXT')));
  console.log('NODE_ENV:', process.env.NODE_ENV);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      console.log('.env.local path:', envPath);
      if (fs.existsSync(envPath)) {
        const stat = fs.statSync(envPath);
        console.log('.env.local size:', stat.size);
        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log('.env.local content snippet:', envContent.split('\n').slice(0,3));
      } else {
        console.log('.env.local not found at', envPath);
      }
    } catch (e) {
      console.log('reading .env.local failed', e.message);
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const msg = "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY";
    console.error(msg, { url: process.env.NEXT_PUBLIC_SUPABASE_URL });
    return <pre style={{ padding: 24 }}>{msg}</pre>;
  }

  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("posts").select("*").limit(1);
    console.log("DATA:", data);
    console.log("ERROR:", error);

    return (
      <div style={{ padding: 24 }}>
        <h1>/test 페이지</h1>
        <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
      </div>
    );
  } catch (err) {
    console.error("Supabase query error:", err);
    return <pre style={{ padding: 24 }}>{String(err)}</pre>;
  }
}
