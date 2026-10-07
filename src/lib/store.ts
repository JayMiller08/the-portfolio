import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * The current offer for one active product, from the store_offers() function.
 *
 * `price_cents` is what checkout will charge right now — the launch price while
 * launch spots remain, otherwise the regular price. Zero means nothing can be
 * charged: no price set, or launch sold out with no regular price chosen yet.
 */
export interface StorePrice {
  slug: string;
  currency: string;
  /** How the buyer receives it: a file download or a link to a web app. */
  delivery: "download" | "access";
  price_cents: number;
  price_tier: "launch" | "regular";
  regular_price_cents: number;
  launch_price_cents: number | null;
  launch_quantity: number | null;
  /** Launch-price spots still available, or null if there is no launch tier. */
  launch_remaining: number | null;
}

/** True while this offer is the launch price and spots remain. */
export const isLaunchOffer = (price: StorePrice | undefined): boolean =>
  Boolean(
    price &&
      price.price_tier === "launch" &&
      price.launch_remaining !== null &&
      price.launch_remaining > 0 &&
      price.price_cents > 0,
  );

/** True when a launch tier existed, is used up, and no regular price is set. */
export const isSoldOut = (price: StorePrice | undefined): boolean =>
  Boolean(price && price.launch_price_cents !== null && price.price_cents <= 0);

/**
 * Pulls the server's own error message out of a failed function call.
 *
 * On a non-2xx response supabase-js returns `data: null` and puts the response
 * on `error.context`, so reading `data.error` always fell through to the
 * generic message and specific reasons (e.g. "sold out") never reached the user.
 */
const functionErrorMessage = async (error: unknown, fallback: string): Promise<string> => {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = (await error.context.json()) as { error?: string };
      if (body?.error) return body.error;
    } catch {
      // Not JSON; use the fallback.
    }
  }
  return fallback;
};

/**
 * Formats a minor-unit amount (cents) for display, e.g. 14900 -> "R149.00".
 *
 * The en-ZA locale renders this as "R 149,00", which is technically correct but
 * not how South African storefronts usually price things. So the symbol is taken
 * from the currency and the number is formatted with a decimal point and no
 * separating space.
 */
export const formatPrice = (cents: number, currency: string): string => {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

  const symbol =
    new Intl.NumberFormat("en-ZA", { style: "currency", currency })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency;

  return `${symbol}${amount}`;
};

/**
 * Starts a Paystack checkout for one product.
 *
 * Only the slug and email are sent: the amount is resolved server-side from
 * store_offers(), so the price cannot be altered from the browser.
 *
 * Resolves to the Paystack-hosted checkout URL to redirect to.
 */
export const startCheckout = async (slug: string, email: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("paystack-initialize", {
    body: { slug, email },
  });

  if (error) {
    throw new Error(
      await functionErrorMessage(error, "Could not start checkout. Please try again."),
    );
  }

  const url = (data as { authorization_url?: string } | null)?.authorization_url;
  if (!url) {
    throw new Error("Could not start checkout. Please try again.");
  }
  return url;
};

export interface VerifyResult {
  status: "paid" | "pending";
  title?: string;
  /** Time-limited signed link, for file products. */
  download_url?: string;
  /** Link to the web app, for access products. */
  access_url?: string;
  /** Whether a copy has actually been emailed. */
  emailed?: boolean;
}

/**
 * Confirms a completed payment and retrieves the buyer's download or access link.
 */
export const verifyPayment = async (reference: string): Promise<VerifyResult> => {
  const { data, error } = await supabase.functions.invoke("paystack-verify", {
    body: { reference },
  });

  if (error) {
    throw new Error(await functionErrorMessage(error, "We could not verify this payment."));
  }
  return data as VerifyResult;
};
