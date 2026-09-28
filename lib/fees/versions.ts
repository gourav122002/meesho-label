/**
 * Tracks the version/last-updated date for each marketplace's fee rules.
 * Update these dates whenever fee structures are revised.
 */
export const FEE_VERSIONS = {
  meesho: { lastUpdated: "2026-08-01", source: "Meesho Supplier Panel Fee Schedule" },
  amazon: { lastUpdated: "2026-07-01", source: "Amazon Seller Central Fee Schedule India" },
  flipkart: { lastUpdated: "2026-06-01", source: "Flipkart Seller Hub Fee Structure" },
  myntra: { lastUpdated: "2026-05-01", source: "Myntra Partner Portal Commission Rates" },
} as const;

export type MarketplaceFeeVersion = typeof FEE_VERSIONS;
