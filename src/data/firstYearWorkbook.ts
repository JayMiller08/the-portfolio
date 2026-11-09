/**
 * The First-Year CS Workbook — a free resource unlocked with a WhatsApp number.
 *
 * Offered in two places, both reading from here so they cannot drift apart:
 * the homepage popup and its card on the Resources page.
 *
 * The file is a self-contained interactive HTML page in public/downloads. It is
 * a soft gate: the file is not secret, and anyone with the direct URL can open
 * it, which matches the site's other free downloads. The URL is marked noindex
 * in vercel.json so search engines do not hand it out.
 *
 * The copy is taken from the workbook's own introduction. Keep it true to the
 * file if the workbook changes.
 */
export const FIRST_YEAR_WORKBOOK = {
  slug: "first-year-cs-workbook",
  title: "The First-Year CS Workbook",
  description:
    "A fill-it-in guide to your first year of Computer Science or IT at a South African university. 11 sections and 3 calculators, for BSc, BCom and diploma programmes. Your answers save on your device as you type.",
  tag: "Free Workbook",
  fileUrl: "/downloads/the-first-year-cs-workbook.html",
  fileName: "The First-Year CS Workbook.html",
  image: "/images/first_year_cs_workbook_preview.png",
} as const;
