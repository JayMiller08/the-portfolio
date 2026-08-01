// Starts a Paystack transaction for a single product.
//
// The browser sends only a product slug and an email address. The price is
// looked up server-side from the products table and never accepted from the
// client, so a tampered request cannot change what gets charged.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:8080";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let payload: { slug?: unknown; email?: unknown };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400, origin);
  }

  const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!slug) {
    return jsonResponse({ error: "Product is required" }, 400, origin);
  }
  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ error: "A valid email address is required" }, 400, origin);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, price_cents, currency, active")
    .eq("slug", slug)
    .maybeSingle();

  if (productError) {
    console.error("Product lookup failed", productError);
    return jsonResponse({ error: "Could not start checkout" }, 500, origin);
  }
  if (!product || !product.active) {
    return jsonResponse({ error: "This product is not available" }, 404, origin);
  }
  // Guards against selling a product whose real price was never configured.
  if (product.price_cents <= 0) {
    console.error(`Product ${slug} is active but has no price set`);
    return jsonResponse({ error: "This product is not available" }, 409, origin);
  }

  const reference = `${slug}-${crypto.randomUUID()}`;

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: product.price_cents,
      currency: product.currency,
      reference,
      callback_url: `${SITE_URL}/checkout/success`,
      metadata: { product_slug: slug, product_title: product.title },
    }),
  });

  const paystackBody = await paystackRes.json().catch(() => null);

  if (!paystackRes.ok || !paystackBody?.status) {
    console.error("Paystack initialize failed", paystackRes.status, paystackBody);
    return jsonResponse({ error: "Could not start checkout" }, 502, origin);
  }

  // Record the intended charge before redirecting, so the webhook can compare
  // what Paystack reports against what we actually asked for.
  const { error: orderError } = await supabase.from("orders").insert({
    reference,
    email,
    product_id: product.id,
    amount_cents: product.price_cents,
    currency: product.currency,
    status: "pending",
  });

  if (orderError) {
    console.error("Could not record order", orderError);
    return jsonResponse({ error: "Could not start checkout" }, 500, origin);
  }

  return jsonResponse(
    { authorization_url: paystackBody.data.authorization_url, reference },
    200,
    origin,
  );
});
