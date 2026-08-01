import { supabase } from "@/integrations/supabase/client";

/** Pricing for a product, as held in the database. */
export interface StorePrice {
  slug: string;
  price_cents: number;
  currency: string;
  active: boolean;
}

/**
 * Formats a minor-unit amount (cents) for display, e.g. 14900 -> "R149.00".
 */
export const formatPrice = (cents: number, currency: string): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(cents / 100);
};

/**
 * Starts a Paystack checkout for one product.
 *
 * Only the slug and email are sent: the amount is resolved server-side from the
 * products table, so the price cannot be altered from the browser.
 *
 * Resolves to the Paystack-hosted checkout URL to redirect to.
 */
export const startCheckout = async (slug: string, email: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("paystack-initialize", {
    body: { slug, email },
  });

  if (error) {
    throw new Error(
      (data as { error?: string } | null)?.error ?? "Could not start checkout. Please try again.",
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
  download_url?: string;
}

/**
 * Confirms a completed payment and retrieves a time-limited download link.
 */
export const verifyPayment = async (reference: string): Promise<VerifyResult> => {
  const { data, error } = await supabase.functions.invoke("paystack-verify", {
    body: { reference },
  });

  if (error) {
    throw new Error(
      (data as { error?: string } | null)?.error ?? "We could not verify this payment.",
    );
  }
  return data as VerifyResult;
};
