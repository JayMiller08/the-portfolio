// Allowed browser origins for the store's Edge Functions.
// SITE_URL is set per-environment (see docs/PAYSTACK_SETUP.md).

// A browser's Origin header never has a trailing slash, but SITE_URL is easy to
// paste with one. Normalising both sides means a stray slash cannot silently
// break every checkout with a CORS failure.
const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

const allowed = [
  Deno.env.get("SITE_URL") ?? "",
  "http://localhost:8080",
]
  .filter(Boolean)
  .map(stripTrailingSlash);

export function corsHeaders(origin: string | null): Record<string, string> {
  // Echo the origin back only when it is one we recognise, so the functions
  // are not callable from arbitrary sites.
  const normalised = origin ? stripTrailingSlash(origin) : "";
  const allowOrigin = normalised && allowed.includes(normalised)
    ? normalised
    : allowed[0];

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
