import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StorePrice } from "@/lib/store";

/**
 * Loads the current offer for every active product, keyed by slug.
 *
 * Presentation details (image, tag, copy) stay in the page; price, launch-tier
 * state and availability come from store_offers(), the same function checkout
 * charges from, so the price on screen and the price charged cannot disagree.
 *
 * Products that are missing or inactive simply have no entry: their cards fall
 * back to an existing Gumroad link, or are hidden if they have none.
 */
export const useStorePrices = () => {
  return useQuery({
    queryKey: ["store-prices"],
    queryFn: async (): Promise<Record<string, StorePrice>> => {
      const { data, error } = await supabase.rpc("store_offers");

      if (error) throw error;

      return Object.fromEntries(
        ((data ?? []) as StorePrice[]).map((row) => [row.slug, row]),
      );
    },
    staleTime: 60 * 1000,
    // The store should still render if Supabase is unreachable.
    retry: 1,
  });
};
