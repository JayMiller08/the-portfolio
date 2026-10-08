import type { Product } from "@/components/ProductCard";

/**
 * Redline Portfolio Grader — sold through the store, promoted by the homepage
 * popup. Both read from here so the card and the popup cannot drift apart.
 *
 * Three phases, decided by what store_offers() returns for this slug:
 *   - no offer (product inactive)  -> pre-launch waitlist, no payment taken
 *   - launch offer                  -> buy at the launch price, spots shown
 *   - offer with no price           -> launch sold out
 *
 * While on sale, price and spots come only from the database. The `waitlist`
 * terms below are used solely for pre-launch wording, so keep them in step with
 * the products row (launch_price_cents / launch_quantity) if either changes.
 *
 * The copy describes the product as its own landing page does. It must stay
 * true to what buyers actually receive.
 */
export const REDLINE_WORKBOOK: Product = {
  id: "redline-portfolio-grader",
  slug: "redline-portfolio-grader",
  title: "Redline Portfolio Grader",
  description:
    "Paste your portfolio URL and read what the recruiter actually saw — graded the way a hiring manager does: first impression, proof, clarity, craft.",
  tag: "Interactive Workbook",
  // Screenshot of the grader's own homepage, captured at 1600x900 so it fills
  // the card's 16:9 frame without cropping. Retake it if the homepage changes.
  image: "/images/redline_grader_preview.png",
  waitlist: {
    launchPriceCents: 29900,
    launchQuantity: 50,
    currency: "ZAR",
  },
};
