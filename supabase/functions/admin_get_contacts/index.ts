// supabase/functions/admin_get_contacts/index.ts
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
    const { filterSpam, q, limit = 20, offset = 0 } = await req.json();

    let query = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (filterSpam !== null) query = query.eq("is_spam", filterSpam);

    if (q && q.trim() !== "") {
      const s = `%${q.toLowerCase()}%`;
      query = query.or(
        `name.ilike.${s},email.ilike.${s},message.ilike.${s}`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Response(JSON.stringify({ contacts: data }), {
      status: 200,
      headers: CORS,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: CORS,
    });
  }
});
