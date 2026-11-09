import { supabase } from "@/integrations/supabase/client";

export type LeadSource = "homepage_popup" | "resources";

export type PhoneResult = { ok: true; e164: string } | { ok: false; error: string };

const SA_HINT = "Enter a South African mobile number, e.g. 071 234 5678, or include your country code.";

/**
 * Normalises what a visitor types into E.164 (e.g. +27712345678), the format
 * WhatsApp and every bulk-messaging tool expects.
 *
 * Accepts the usual South African forms — "071 234 5678", "71 234 5678",
 * "27 71 234 5678", "+27 71 234 5678", "0027 71 234 5678" — and any other
 * country's number written with its "+" code. South African numbers must be
 * mobiles (6x, 7x, 8x), since landlines cannot be reached on WhatsApp.
 */
export const normalizePhone = (input: string): PhoneResult => {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Please enter your WhatsApp number." };

  // Keep digits only, but remember whether an international "+" was typed.
  let hasPlus = trimmed.startsWith("+");
  let digits = trimmed.replace(/\D/g, "");

  // "00" is the international dialling prefix written without a "+".
  if (!hasPlus && digits.startsWith("00")) {
    hasPlus = true;
    digits = digits.slice(2);
  }

  let e164: string;
  if (hasPlus) {
    e164 = `+${digits}`;
  } else if (digits.length === 10 && digits.startsWith("0")) {
    e164 = `+27${digits.slice(1)}`;
  } else if (digits.length === 11 && digits.startsWith("27")) {
    e164 = `+${digits}`;
  } else if (digits.length === 9) {
    e164 = `+27${digits}`;
  } else {
    return { ok: false, error: SA_HINT };
  }

  if (e164.startsWith("+27")) {
    // +27 then 9 digits, starting 6, 7 or 8 for a mobile.
    if (!/^\+27[6-8][0-9]{8}$/.test(e164)) return { ok: false, error: SA_HINT };
    return { ok: true, e164 };
  }

  // E.164 allows 8-15 digits after the "+", never starting with 0.
  if (!/^\+[1-9][0-9]{7,14}$/.test(e164)) {
    return { ok: false, error: "That number doesn't look right. Check the country code and digits." };
  }
  return { ok: true, e164 };
};

/**
 * Stores a WhatsApp number against a resource, with the time consent was given.
 *
 * Leaving the same number twice for the same resource counts as success: the
 * visitor's intent is met and the duplicate tells them nothing useful.
 */
export const saveWhatsAppLead = async (lead: {
  phone: string;
  resourceSlug: string;
  source: LeadSource;
}): Promise<void> => {
  const { error } = await supabase.from("whatsapp_leads").insert({
    phone: lead.phone,
    resource_slug: lead.resourceSlug,
    source: lead.source,
    consented_at: new Date().toISOString(),
  });

  // 23505 = unique violation: this number already has this resource.
  if (error && error.code !== "23505") {
    throw new Error("We couldn't save your number. Please try again.");
  }
};

// Remembers on this device that a resource was unlocked, so a visitor who has
// already left their number is not asked again. Storage can throw in private
// windows; failing just means they see the form once more.
const unlockKey = (slug: string) => `resource-unlocked:${slug}`;

export const isResourceUnlocked = (slug: string): boolean => {
  try {
    return localStorage.getItem(unlockKey(slug)) === "1";
  } catch {
    return false;
  }
};

export const rememberResourceUnlocked = (slug: string) => {
  try {
    localStorage.setItem(unlockKey(slug), "1");
  } catch {
    // ignore
  }
};
