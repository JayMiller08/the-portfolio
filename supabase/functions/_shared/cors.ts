// Allowed browser origins for the store's Edge Functions.
// SITE_URL is set per-environment (see docs/PAYSTACK_SETUP.md).
const allowed = [
  Deno.env.get("SITE_URL") ?? "",
  "http://localhost:8080",
].filter(Boolean);

export function corsHeaders(origin: string | null): Record<string, string> {
  // Echo the origin back only when it is one we recognise, so the functions
  // are not callable from arbitrary sites.
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}
