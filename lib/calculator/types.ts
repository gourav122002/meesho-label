// ──────────────────────────────────────────────────────────────────────────────
// Calculator Types
// ──────────────────────────────────────────────────────────────────────────────

export type Marketplace = "meesho" | "amazon" | "flipkart" | "myntra";

export type FulfillmentMode = "easy-ship" | "fba" | "self-ship";

export interface CalculatorInput {
  /** Selling price charged to the buyer (INR) */
  sellingPrice: number;
  /** Your product cost / COGS (INR) */
  productCost: number;
  /** Shipment weight in grams */
  weightGrams: number;
  /** Marketplace category slug (used for fee lookup) */
  category: string;
  /** Amazon fulfillment mode */
  fulfillmentMode?: FulfillmentMode;
  /** Additional packaging cost (INR) */
  packagingCost?: number;
  /** Miscellaneous other costs (INR) */
  otherCosts?: number;
}

export interface FeeItem {
  label: string;
  amount: number;
  /** Optional percentage string, e.g. "18%" */
  rate?: string;
}

export interface CalculatorResult {
  sellingPrice: number;
  productCost: number;
  totalFees: number;
  netProfit: number;
  /** Net profit margin percentage */
  margin: number;
  /** Return on investment percentage */
  roi: number;
  /** Minimum selling price to break even */
  breakEvenPrice: number;
  feeBreakdown: FeeItem[];
}

export interface ValidationError {
  field: keyof CalculatorInput;
  message: string;
}
