import type { Product } from "@/components/ProductCard";

/**
 * Redline Portfolio Grader — sold through the store, promoted by the homepage
 * popup. Both read from here so the card and the popup cannot drift apart.
 *
 * Price, launch spots and availability are NOT set here: they come from the
 * products table via store_offers(). While the product is inactive there, the
 * card stays hidden and the popup never appears.
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
};
