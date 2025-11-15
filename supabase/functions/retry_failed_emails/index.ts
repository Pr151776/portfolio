// supabase/functions/retry_failed_emails/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const MAX_RETRIES = Number(Deno.env.get("FAILED_EMAIL_MAX_RETRIES") || "5");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const resend = new Resend(RESEND_API_KEY);

const TABLE = "failed_emails";

serve(async () => {
  try {
    console.log("🔄 Checking failed email queue…");

    const { data: jobs, error } = await supabase
      .from(TABLE)
      .select("*")
      .lte("retry_count", MAX_RETRIES)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.error("❌ Fetch error:", error);
      return new Response(JSON.stringify({ error: "fetch_failed" }), {
        status: 500,
      });
    }

    if (!jobs || jobs.length === 0) {
      console.log("👍 No failed jobs.");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    }

    console.log(`📦 Retrying ${jobs.length} failed email(s)…`);

    for (const job of jobs) {
      const { id, to_email, subject, body, retry_count } = job;

      if (retry_count >= MAX_RETRIES) {
        console.log(`⚠️ Job ${id} exceeded max retries. Skip.`);
        continue;
      }

      try {
        const result = await resend.emails.send({
          from: "Portfolio Bot <no-reply@yourdomain.com>",
          to: to_email,
          subject,
          html: body,
        });

        console.log(`✅ Sent retry email → ${to_email}`, result);

        await supabase.from(TABLE).delete().eq("id", id);
      } catch (err) {
        console.error(`❌ Retry failed for job ${id}`, err);

        await supabase
          .from(TABLE)
          .update({
            retry_count: retry_count + 1,
            last_retry: new Date().toISOString(),
          })
          .eq("id", id);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("🔥 Worker crashed:", err);
    return new Response(JSON.stringify({ error: "worker_crashed" }), {
      status: 500,
    });
  }
});
