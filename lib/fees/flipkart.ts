import type { CalculatorInput, FeeItem } from "../calculator/types";

/**
 * Flipkart fee structure:
 * - Commission % by category
 * - Collection fee (% of selling price)
 * - Fixed fee (per order, varies by price range)
 * - Shipping fee (weight-based)
 * - GST on all platform fees (18%)
 */

interface FlipkartCategoryFee {
  commissionPct: number;
  collectionPct: number;
}

const FK_CATEGORY_FEES: Record<string, FlipkartCategoryFee> = {
  "mobiles": { commissionPct: 4, collectionPct: 2 },
  "electronics": { commissionPct: 9, collectionPct: 2 },
  "laptops-computers": { commissionPct: 7, collectionPct: 2 },
  "tv-appliances": { commissionPct: 9, collectionPct: 2 },
  "clothing-men": { commissionPct: 15, collectionPct: 2 },
  "clothing-women": { commissionPct: 15, collectionPct: 2 },
  "footwear": { commissionPct: 15, collectionPct: 2 },
  "jewellery": { commissionPct: 15, collectionPct: 2 },
  "beauty-personal-care": { commissionPct: 15, collectionPct: 2 },
  "home-furniture": { commissionPct: 15, collectionPct: 2 },
  "kitchen": { commissionPct: 15, collectionPct: 2 },
  "sports-outdoor": { commissionPct: 15, collectionPct: 2 },
  "toys-baby": { commissionPct: 12, collectionPct: 2 },
  "books": { commissionPct: 5, collectionPct: 2 },
  "grocery": { commissionPct: 7, collectionPct: 1 },
  "other": { commissionPct: 15, collectionPct: 2 },
};

/** Fixed fee per order by selling price range */
function getFixedFee(sellingPrice: number): number {
  if (sellingPrice <= 100) return 7;
  if (sellingPrice <= 250) return 11;
  if (sellingPrice <= 500) return 13;
  if (sellingPrice <= 1000) return 15;
  return 21;
}

/** Flipkart shipping fee (intra-city/regional average) */
const FK_SHIPPING_SLABS = [
  { maxGrams: 500, fee: 32 },
  { maxGrams: 1000, fee: 47 },
  { maxGrams: 2000, fee: 72 },
  { maxGrams: 3000, fee: 97 },
  { maxGrams: 5000, fee: 147 },
];

function getFKShippingFee(weightGrams: number): number {
  for (const slab of FK_SHIPPING_SLABS) {
    if (weightGrams <= slab.maxGrams) return slab.fee;
  }
  const extra = Math.ceil((weightGrams - 5000) / 500);
  return 147 + extra * 25;
}

const GST_RATE = 0.18;

export function getFlipkartFees(input: CalculatorInput): FeeItem[] {
  const key = input.category?.toLowerCase().replace(/\s+/g, "-") ?? "other";
  const cat = FK_CATEGORY_FEES[key] ?? FK_CATEGORY_FEES["other"];

  const commission = Math.round(input.sellingPrice * (cat.commissionPct / 100) * 100) / 100;
  const collectionFee = Math.round(input.sellingPrice * (cat.collectionPct / 100) * 100) / 100;
  const fixedFee = getFixedFee(input.sellingPrice);
  const shippingFee = getFKShippingFee(input.weightGrams);
  const platformFees = commission + collectionFee + fixedFee;
  const gst = Math.round(platformFees * GST_RATE * 100) / 100;

  return [
    { label: `Commission (${cat.commissionPct}%)`, amount: commission, rate: `${cat.commissionPct}%` },
    { label: `Collection Fee (${cat.collectionPct}%)`, amount: collectionFee, rate: `${cat.collectionPct}%` },
    { label: "Fixed Fee", amount: fixedFee },
    { label: "Shipping Fee", amount: shippingFee },
    { label: "GST on Platform Fees (18%)", amount: gst, rate: "18%" },
  ];
}

export const FLIPKART_CATEGORIES = Object.keys(FK_CATEGORY_FEES).map((k) =>
  k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
);
