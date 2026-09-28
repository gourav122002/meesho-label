import type { CalculatorInput } from "./types";

/**
 * Normalizes raw form inputs before feeding into the calculator.
 * Converts strings to numbers, trims whitespace, applies defaults.
 */
export function normalizeInput(raw: Record<string, unknown>): CalculatorInput {
  const num = (v: unknown, def = 0): number => {
    const n = parseFloat(String(v ?? "").replace(/,/g, "").trim());
    return isNaN(n) ? def : Math.max(0, n);
  };

  return {
    sellingPrice: num(raw.sellingPrice),
    productCost: num(raw.productCost),
    weightGrams: num(raw.weightGrams, 250),
    category: String(raw.category ?? "other").trim().toLowerCase(),
    fulfillmentMode:
      raw.fulfillmentMode === "fba" || raw.fulfillmentMode === "self-ship"
        ? raw.fulfillmentMode
        : "easy-ship",
    packagingCost: num(raw.packagingCost, 0),
    otherCosts: num(raw.otherCosts, 0),
  };
}
