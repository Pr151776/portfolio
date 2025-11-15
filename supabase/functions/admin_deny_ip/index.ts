// supabase/functions/admin_deny_ip/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { status: 200, headers: CORS });

  if (req.method !== "POST")
    return new Response("Invalid", { status: 405, headers: CORS });

  const adminKey = req.headers.get("x-admin-secret");
  if (adminKey !== ADMIN_SECRET)
    return new Response("Unauthorized", { status: 403, headers: CORS });

  try {
    const { ip_hash, block_days = 30 } = await req.json();

    if (!ip_hash)
      return new Response(JSON.stringify({ error: "Missing ip_hash" }), {
        status: 400,
        headers: CORS,
      });

    const until = new Date(Date.now() + block_days * 86400000).toISOString();

    await supabase.from("ip_denylist").upsert([
      {
        ip_hash,
        blocked_until: until,
        reason: "manual-block",
      },
    ]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: CORS,
    });
  } catch (err) {
    console.error("admin_deny_ip error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: CORS,
    });
  }
});
