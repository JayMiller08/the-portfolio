// Confirms a payment for the checkout success page and returns a signed
// download link.
//
// This runs when the customer lands back on the site. It re-checks the
// transaction against Paystack rather than trusting anything in the URL, and
// can fulfil an order on its own if the webhook has not arrived yet.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const DOWNLOAD_TTL_SECONDS = 60 * 60 * 24; // 24 hours

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }
  if (!PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return jsonResponse({ error: "Store is not configured" }, 500, origin);
  }

  let payload: { reference?: unknown };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400, origin);
  }

  const reference = typeof payload.reference === "string" ? payload.reference.trim() : "";
  if (!reference) {
    return jsonResponse({ error: "Reference is required" }, 400, origin);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, amount_cents, email_sent_at, products(title, storage_path, access_url)")
    .eq("reference", reference)
    .maybeSingle();

  if (orderError) {
    console.error("Order lookup failed", orderError);
    return jsonResponse({ error: "Could not verify payment" }, 500, origin);
  }
  if (!order) {
    return jsonResponse({ error: "Order not found" }, 404, origin);
  }

  const product = order.products as unknown as {
    title: string;
    storage_path: string | null;
    access_url: string | null;
  } | null;

  // If the webhook has not landed yet, ask Paystack directly so the customer is
  // not left staring at a pending page.
  if (order.status === "pending") {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
    );
    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.status) {
      console.error("Paystack verify failed", res.status, body);
      return jsonResponse({ error: "Could not verify payment" }, 502, origin);
    }

    const txStatus = body.data?.status;
    const paidAmount = body.data?.amount;

    if (txStatus !== "success") {
      return jsonResponse({ status: "pending" }, 200, origin);
    }
    if (paidAmount !== order.amount_cents) {
      console.error(
        `Amount mismatch on ${reference}: expected ${order.amount_cents}, got ${paidAmount}`,
      );
      await supabase.from("orders").update({ status: "mismatch" }).eq("id", order.id);
      return jsonResponse({ error: "Payment amount did not match" }, 409, origin);
    }

    await supabase
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", order.id);
  } else if (order.status !== "paid") {
    // failed or mismatch
    return jsonResponse({ error: "This payment did not complete" }, 409, origin);
  }

  if (!product) {
    return jsonResponse({ error: "Product is unavailable" }, 500, origin);
  }

  // Lets the success page say whether a copy was actually emailed, rather than
  // claiming it was when no email provider is configured.
  const emailed = Boolean(order.email_sent_at);

  // Web-app products are delivered as a link; there is no file to sign.
  if (product.access_url) {
    return jsonResponse(
      { status: "paid", title: product.title, access_url: product.access_url, emailed },
      200,
      origin,
    );
  }

  if (!product.storage_path) {
    console.error(`Order ${reference} has a product with no delivery method`);
    return jsonResponse({ error: "Could not prepare your download" }, 500, origin);
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("product-files")
    .createSignedUrl(product.storage_path, DOWNLOAD_TTL_SECONDS);

  if (signError || !signed) {
    console.error("Could not sign download URL", signError);
    return jsonResponse({ error: "Could not prepare your download" }, 500, origin);
  }

  return jsonResponse(
    { status: "paid", title: product.title, download_url: signed.signedUrl, emailed },
    200,
    origin,
  );
});
