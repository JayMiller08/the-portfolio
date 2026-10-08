import { supabase } from "@/integrations/supabase/client";

/**
 * Adds an email to a product's pre-launch waitlist.
 *
 * Joining twice is treated as success: the visitor's intent is satisfied and
 * there is nothing useful to tell them about the duplicate.
 */
export const joinWaitlist = async (productSlug: string, email: string): Promise<void> => {
  const { error } = await supabase
    .from("waitlist")
    .insert({ email: email.trim().toLowerCase(), product_slug: productSlug });

  // 23505 = unique violation: already on this list.
  if (error && error.code !== "23505") {
    throw new Error("Could not join the waitlist. Please try again.");
  }
};
