// supabase/functions/admin_update_contact/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const ADMIN_SECRET = Deno.env.get("ADMIN_PANEL_PW")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false }});
const resend = new Resend(RESEND_API_KEY);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: CORS });
  if (req.method !== "POST") return new Response("Invalid", { status: 405, headers: CORS });

  const adminKey = req.headers.get("x-admin-secret");
  if (adminKey !== ADMIN_SECRET) return new Response("Unauthorized", { status: 403, headers: CORS });

  try {
    const body = await req.json();
    const { action, id, ids = [], ip } = body;

    // normalize ids array when single id was passed
    const idList = Array.isArray(ids) ? ids : (ids ? [ids] : (id ? [id] : []));

    // helper to fetch messages
    async function fetchMessagesByIds(list) {
      const { data, error } = await supabase.from("contacts").select("*").in("id", list);
      if (error) throw error;
      return data || [];
    }

    // single actions
    if (action === "mark_spam") {
      await supabase.from("contacts").update({ is_spam: true }).eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }
    if (action === "unmark_spam") {
      await supabase.from("contacts").update({ is_spam: false }).eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }
    if (action === "mark_read") {
      await supabase.from("contacts").update({ read: true }).eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }
    if (action === "mark_unread" || action === "unmark_read") {
      await supabase.from("contacts").update({ read: false }).eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }
    if (action === "delete") {
      await supabase.from("contacts").delete().eq("id", id);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }
    if (action === "retry_email") {
      // retry sending admin notification for a single message
      const { data: msg } = await supabase.from("contacts").select("*").eq("id", id).maybeSingle();
      if (!msg) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: CORS });

      await resend.emails.send({
        from: "Portfolio Bot <no-reply@onboarding.resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `Retry Contact from ${msg.name}`,
        html: `<pre>${msg.message}</pre>`,
      });
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }

    // block ip by ip address (ip param expected to be ip_hash)
    if (action === "block_ip") {
      if (!ip) return new Response(JSON.stringify({ error: "Missing ip" }), { status: 400, headers: CORS });
      const until = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      await supabase.from("ip_denylist").upsert([{ ip_hash: ip, blocked_until: until, reason: "manual-block" }]);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
    }

    /* =========================
       BULK ACTIONS
       expects: { action: 'bulk_*', ids: [..] }
       supported: bulk_delete, bulk_mark_read, bulk_mark_unread, bulk_mark_spam, bulk_unmark_spam
       ========================= */
    if (action && action.startsWith("bulk_")) {
      if (!idList || idList.length === 0) {
        return new Response(JSON.stringify({ error: "No ids provided" }), { status: 400, headers: CORS });
      }
      if (action === "bulk_delete") {
        await supabase.from("contacts").delete().in("id", idList);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
      }
      if (action === "bulk_mark_read") {
        await supabase.from("contacts").update({ read: true }).in("id", idList);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
      }
      if (action === "bulk_mark_unread") {
        await supabase.from("contacts").update({ read: false }).in("id", idList);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
      }
      if (action === "bulk_mark_spam") {
        await supabase.from("contacts").update({ is_spam: true }).in("id", idList);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
      }
      if (action === "bulk_unmark_spam") {
        await supabase.from("contacts").update({ is_spam: false }).in("id", idList);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
      }
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: CORS });
  } catch (err) {
    console.error("admin_update_contact error:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500, headers: CORS });
  }
});
