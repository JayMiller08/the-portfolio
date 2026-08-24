/**
 * Build-time feature flags.
 *
 * `design` gates the /design route. It stays off until there are real case
 * studies to show: an unlinked empty route is recoverable, a portfolio filled
 * with placeholder work is not. Enable by setting VITE_ENABLE_DESIGN=true.
 */
export const FEATURES = {
  design: import.meta.env.VITE_ENABLE_DESIGN === "true",
} as const;
