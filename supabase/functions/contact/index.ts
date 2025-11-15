// supabase/functions/contact/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

/* -------------------------------------
   ENV
------------------------------------- */
const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL")!;
const RECAPTCHA_SECRET = Deno.env.get("RECAPTCHA_SECRET") || "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

const AUTO_BLOCK_ON_SPAM = Deno.env.get("AUTO_BLOCK_ON_SPAM") === "true";
const AUTO_BLOCK_DAYS = Number(Deno.env.get("AUTO_BLOCK_DAYS") || 30);
const ADMIN_BLOCK_THRESHOLD = Number(Deno.env.get("ADMIN_BLOCK_THRESHOLD") || 0.85);

const RATE_LIMIT_MAX = Number(Deno.env.get("RATE_LIMIT_MAX") || 5);
const RATE_LIMIT_WINDOW = Number(Deno.env.get("RATE_LIMIT_WINDOW") || 60);

const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const TWILIO_FROM = "whatsapp:+14155238886";
const ADMIN_WHATSAPP = Deno.env.get("ADMIN_WHATSAPP") || "";

/* -------------------------------------
   TABLES
------------------------------------- */
const CONTACTS_TABLE = "contacts";
const IDEMPOTENCY_TABLE = "contact_idempotency";
const IP_DENYLIST_TABLE = "ip_denylist";
const RATELIMIT_LOGS_TABLE = "rate_limit_logs";

/* -------------------------------------
   INIT
------------------------------------- */
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const resend = new Resend(RESEND_API_KEY);

/* -------------------------------------
   HELPERS
------------------------------------- */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sha256(str: string) {
  const data = new TextEncoder().encode(str);
  const hash = crypto.subtle.digestSync("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyRecaptcha(token: string, ip: string) {
  if (!RECAPTCHA_SECRET) return true;
  const form = new URLSearchParams();
  form.append("secret", RECAPTCHA_SECRET);
  form.append("response", token);
  form.append("remoteip", ip);

  const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: form,
  });

  const json = await resp.json();
  return json.success && (json.score ?? 0) >= 0.5;
}

async function sendWhatsApp(text: string) {
  if (!TWILIO_SID || !TWILIO_TOKEN || !ADMIN_WHATSAPP) return;

  const body = new URLSearchParams({
    Body: text,
    From: TWILIO_FROM,
    To: ADMIN_WHATSAPP,
  });

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );
}

/* -------------------------------------
   AI SPAM CHECK — GEMINI
------------------------------------- */
async function classifyAI(name: string, email: string, message: string) {
  const prompt = `
Return JSON only:
{
  "category": "spam|job|project|personal|sales|abusive|other",
  "score": 0-1,
  "reason": "text"
}

Classify message:
Name: ${name}
Email: ${email}
Message: ${message}
`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await resp.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    return JSON.parse(raw);
  } catch {
    return { category: "other", score: 0, reason: "json-error" };
  }
}

/* -------------------------------------
   MAIN
------------------------------------- */
serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { status: 200, headers: CORS_HEADERS });

  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });

  try {
    const body = await req.json();
    const { name, email, message, website, captchaToken, idempotencyKey, source } = body;

    // HONEYPOT CHECK
    if (website && website.trim() !== "") {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    if (!name || !email || !message)
      return new Response(JSON.stringify({ error: "All fields required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });

    if (!validateEmail(email))
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: CORS_HEADERS,
      });

    const ip = req.headers.get("x-forwarded-for") || "";
    const ipHash = sha256(ip);
    const ua = req.headers.get("user-agent") || "";

    /* reCAPTCHA */
    if (!(await verifyRecaptcha(captchaToken, ip)))
      return new Response(JSON.stringify({ error: "Captcha failed" }), {
        status: 403,
        headers: CORS_HEADERS,
      });

    /* IP BLOCK CHECK */
    const { data: bad } = await supabase
      .from(IP_DENYLIST_TABLE)
      .select("blocked_until")
      .eq("ip_hash", ipHash)
      .maybeSingle();

    if (bad && new Date(bad.blocked_until) > new Date())
      return new Response(JSON.stringify({ error: "IP blocked" }), {
        status: 403,
        headers: CORS_HEADERS,
      });

    /* RATE LIMIT CHECK */
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW * 1000).toISOString();
    const { count } = await supabase
      .from(CONTACTS_TABLE)
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ipHash)
      .gte("created_at", since);

    if (count && count >= RATE_LIMIT_MAX) {
      // log attempt
      await supabase.from(RATELIMIT_LOGS_TABLE).insert([{ ip_hash: ipHash }]);

      const { count: failCount } = await supabase
        .from(RATELIMIT_LOGS_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash);

      if (failCount >= 3) {
        await supabase.from(IP_DENYLIST_TABLE).upsert([
          {
            ip_hash: ipHash,
            blocked_until: new Date(Date.now() + 86400000).toISOString(),
            reason: "auto-ban-rate-limit",
          },
        ]);
      }

      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: CORS_HEADERS,
      });
    }

    /* Idempotency */
    if (idempotencyKey) {
      const { data: exists } = await supabase
        .from(IDEMPOTENCY_TABLE)
        .select("key")
        .eq("key", idempotencyKey)
        .maybeSingle();

      if (exists)
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: CORS_HEADERS,
        });
    }

    /* AI Classification */
    const ai = await classifyAI(name, email, message);
    const isSpam =
      ai.score >= ADMIN_BLOCK_THRESHOLD || ai.category === "spam";

    /* SAVE */
    await supabase.from(CONTACTS_TABLE).insert([
      {
        name,
        email,
        message,
        ip_address: ipHash,
        user_agent: ua,
        source: source || "portfolio",
        is_spam: isSpam,
        ai_label: ai.category,
        ai_score: ai.score,
        ai_reason: ai.reason,
      },
    ]);

    if (idempotencyKey)
      await supabase.from(IDEMPOTENCY_TABLE).insert([{ key: idempotencyKey }]);

    /* If spam */
    if (isSpam) {
      await sendWhatsApp(`🚨 SPAM BLOCKED\n${name}\n${email}`);

      await resend.emails.send({
        from: "Prakash Bot <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `Spam Blocked: ${email}`,
        html: `<pre>${message}</pre>`,
      });

      return new Response(JSON.stringify({ success: true, spam: true }), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    /* SEND EMAIL + WHATSAPP */
    await resend.emails.send({
      from: "Prakash Bot <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `New Contact from ${name}`,
      html: `<pre>${message}</pre>`,
    });

    await sendWhatsApp(`📩 NEW CONTACT\n${name}\n${email}\n${message}`);

    await resend.emails.send({
      from: "Prakash Bot <onboarding@resend.dev>",
      to: email,
      subject: "Message Received ✔",
      html: `<p>Hi ${name}, thanks for contacting me!</p>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    console.error("ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});
