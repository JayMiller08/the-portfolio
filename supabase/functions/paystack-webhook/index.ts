// Paystack webhook receiver — the authoritative record of a completed payment.
//
// This is what actually marks an order paid and emails the download. The
// browser-facing verify function only reads state; it never grants it, because
// a customer who closes the tab must still get what they paid for.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("STORE_FROM_EMAIL");

// How long the emailed download link stays valid.
const EMAIL_LINK_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function hmacSha512Hex(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time comparison so a forged signature cannot be discovered by
// measuring how long the comparison takes.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sendDownloadEmail(
  to: string,
  productTitle: string,
  downloadUrl: string,
): Promise<boolean> {
  if (!RESEND_API_KEY || !FROM_EMAIL) {
    console.warn("Email not configured (RESEND_API_KEY / STORE_FROM_EMAIL missing); skipping send");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: `Your download: ${productTitle}`,
      html: `
        <p>Thanks for your purchase!</p>
        <p><strong>${productTitle}</strong> is ready to download:</p>
        <p><a href="${downloadUrl}">Download your file</a></p>
        <p>This link is valid for 7 days. Reply to this email if you have any trouble.</p>
        <p>— Jay Mthethwa</p>
      `,
    }),
  });

  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return new Response("Not configured", { status: 500 });
  }

  // The signature covers the exact bytes Paystack sent, so the raw body must be
  // read before any JSON parsing.
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const expected = await hmacSha512Hex(PAYSTACK_SECRET_KEY, rawBody);

  if (!timingSafeEqual(signature, expected)) {
    console.warn("Rejected webhook with invalid signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Acknowledge anything that is not a successful charge so Paystack stops retrying.
  if (event.event !== "charge.success") {
    return new Response("Ignored", { status: 200 });
  }

  const data = event.data ?? {};
  const reference = typeof data.reference === "string" ? data.reference : "";
  const paidAmount = typeof data.amount === "number" ? data.amount : -1;

  if (!reference) {
    return new Response("Missing reference", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, email, status, amount_cents, product_id, products(title, storage_path)")
    .eq("reference", reference)
    .maybeSingle();

  if (orderError) {
    console.error("Order lookup failed", orderError);
    return new Response("Lookup failed", { status: 500 });
  }
  if (!order) {
    console.error(`Webhook for unknown reference ${reference}`);
    return new Response("Unknown reference", { status: 404 });
  }

  // Paystack retries webhooks; a second delivery must not re-send the email.
  if (order.status === "paid") {
    return new Response("Already processed", { status: 200 });
  }

  // Confirm they paid what we asked for. A mismatch is flagged rather than
  // fulfilled, so an underpayment never hands over the file automatically.
  if (paidAmount !== order.amount_cents) {
    console.error(
      `Amount mismatch on ${reference}: expected ${order.amount_cents}, got ${paidAmount}`,
    );
    await supabase
      .from("orders")
      .update({ status: "mismatch", paystack_event: event })
      .eq("id", order.id);
    return new Response("Amount mismatch", { status: 200 });
  }

  const product = order.products as unknown as { title: string; storage_path: string } | null;

  await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      paystack_event: event,
    })
    .eq("id", order.id);

  if (product) {
    const { data: signed, error: signError } = await supabase.storage
      .from("product-files")
      .createSignedUrl(product.storage_path, EMAIL_LINK_TTL_SECONDS);

    if (signError || !signed) {
      // The order stays marked paid: the success page can still issue a link,
      // so a failed email does not cost the customer their purchase.
      console.error("Could not sign download URL", signError);
    } else {
      const sent = await sendDownloadEmail(order.email, product.title, signed.signedUrl);
      if (sent) {
        await supabase
          .from("orders")
          .update({ email_sent_at: new Date().toISOString() })
          .eq("id", order.id);
      }
    }
  }

  return new Response("OK", { status: 200 });
});
