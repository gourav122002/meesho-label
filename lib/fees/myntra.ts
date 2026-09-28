import type { CalculatorInput, FeeItem } from "../calculator/types";

/**
 * Myntra fee structure (Fashion & Lifestyle):
 * - Commission % by category
 * - Payment gateway fee (~2%)
 * - Shipping fee
 * - GST on commission & PG (18%)
 */

const MYNTRA_CATEGORY_FEES: Record<string, number> = {
  "western-wear": 30,
  "ethnic-wear": 30,
  "men-clothing": 28,
  "activewear": 28,
  "footwear": 30,
  "bags-wallets-belts": 30,
  "jewellery-accessories": 30,
  "beauty-personal-care": 25,
  "home-living": 22,
  "kids-fashion": 28,
  "sports-outdoor": 22,
  "other": 28,
};

const PG_FEE_PCT = 2;
const GST_RATE = 0.18;

/** Myntra uses a flat return shipping policy; we model standard shipping */
function getMyntraShippingFee(weightGrams: number): number {
  if (weightGrams <= 500) return 40;
  if (weightGrams <= 1000) return 60;
  if (weightGrams <= 2000) return 90;
  return 120;
}

export function getMyntraFees(input: CalculatorInput): FeeItem[] {
  const key = input.category?.toLowerCase().replace(/\s+/g, "-") ?? "other";
  const commissionPct = MYNTRA_CATEGORY_FEES[key] ?? MYNTRA_CATEGORY_FEES["other"];

  const commission = Math.round(input.sellingPrice * (commissionPct / 100) * 100) / 100;
  const pgFee = Math.round(input.sellingPrice * (PG_FEE_PCT / 100) * 100) / 100;
  const shippingFee = getMyntraShippingFee(input.weightGrams);
  const gst = Math.round((commission + pgFee) * GST_RATE * 100) / 100;

  return [
    { label: `Commission (${commissionPct}%)`, amount: commission, rate: `${commissionPct}%` },
    { label: "Payment Gateway Fee (2%)", amount: pgFee, rate: "2%" },
    { label: "Shipping Fee", amount: shippingFee },
    { label: "GST on Commission & PG (18%)", amount: gst, rate: "18%" },
  ];
}

export const MYNTRA_CATEGORIES = Object.keys(MYNTRA_CATEGORY_FEES).map((k) =>
  k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
);
