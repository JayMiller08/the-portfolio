// Starts a Paystack transaction for a single product.
//
// The browser sends only a product slug and an email address. The price comes
// from store_offers() — the same query the storefront displays from — and is
// never accepted from the client, so a tampered request cannot change what
// gets charged, and the charged price always matches the one on screen.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Trailing slashes are stripped so the callback URL cannot come out as
// "https://example.com//checkout/success".
const SITE_URL = (Deno.env.get("SITE_URL") ?? "http://localhost:8080").replace(/\/+$/, "");

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

  // store_offers() only returns active products, and resolves launch vs regular
  // pricing from paid-order counts.
  const { data: offer, error: offerError } = await supabase
    .rpc("store_offers")
    .eq("slug", slug)
    .maybeSingle<{
      product_id: string;
      title: string;
      currency: string;
      price_cents: number | null;
      price_tier: "launch" | "regular";
      launch_price_cents: number | null;
    }>();

  if (offerError) {
    console.error("Offer lookup failed", offerError);
    return jsonResponse({ error: "Could not start checkout" }, 500, origin);
  }
  if (!offer) {
    return jsonResponse({ error: "This product is not available" }, 404, origin);
  }
  // A zero price means none is set — for a launch product, that the launch
  // spots are gone and no regular price has been chosen yet. Never charge it.
  if (!offer.price_cents || offer.price_cents <= 0) {
    const soldOut = offer.launch_price_cents !== null;
    return jsonResponse(
      { error: soldOut ? "The launch spots have sold out." : "This product is not available" },
      409,
      origin,
    );
  }

  const product = {
    id: offer.product_id,
    title: offer.title,
    currency: offer.currency,
    price_cents: offer.price_cents,
    price_tier: offer.price_tier,
  };

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
      metadata: { product_slug: slug, product_title: product.title, price_tier: product.price_tier },
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
    price_tier: product.price_tier,
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
