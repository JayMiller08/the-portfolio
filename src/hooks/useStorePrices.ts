import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StorePrice } from "@/lib/store";

/**
 * Loads live pricing for the store, keyed by product slug.
 *
 * Presentation details (image, tag, copy) stay in the page; only price and
 * availability come from the database, so the two can never disagree about
 * what something costs.
 *
 * Products that are missing or inactive simply have no entry, and the card
 * falls back to its existing Gumroad link.
 */
export const useStorePrices = () => {
  return useQuery({
    queryKey: ["store-prices"],
    queryFn: async (): Promise<Record<string, StorePrice>> => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, price_cents, currency, active")
        .eq("active", true);

      if (error) throw error;

      return Object.fromEntries(
        (data ?? []).map((row) => [row.slug, row as StorePrice]),
      );
    },
    staleTime: 5 * 60 * 1000,
    // The store should still render if Supabase is unreachable.
    retry: 1,
  });
};
