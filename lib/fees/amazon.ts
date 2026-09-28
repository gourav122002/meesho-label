import type { CalculatorInput, FeeItem } from "../calculator/types";

/**
 * Amazon India fee structure:
 * - Referral fee (% of selling price, varies by category)
 * - Closing fee (for media categories)
 * - Fulfillment fee (Easy Ship or FBA, based on weight)
 * - GST on fees (18%)
 */

interface CategoryFee {
  referralPct: number;
  closingFee?: number;
}

const AMAZON_CATEGORY_FEES: Record<string, CategoryFee> = {
  "books": { referralPct: 5.36, closingFee: 10 },
  "music-dvd": { referralPct: 5.36, closingFee: 14 },
  "video-games": { referralPct: 5.36, closingFee: 21 },
  "mobile-phones": { referralPct: 4 },
  "consumer-electronics": { referralPct: 10.7 },
  "computers": { referralPct: 10.7 },
  "cameras": { referralPct: 10.7 },
  "tv-appliances": { referralPct: 10.7 },
  "clothing-accessories": { referralPct: 17.12 },
  "shoes-handbags": { referralPct: 17.12 },
  "jewellery": { referralPct: 17.12 },
  "beauty-personal-care": { referralPct: 13.4 },
  "health-care": { referralPct: 10.7 },
  "home-kitchen": { referralPct: 13.4 },
  "furniture": { referralPct: 13.4 },
  "sports-outdoors": { referralPct: 13.4 },
  "toys-games": { referralPct: 13.4 },
  "grocery": { referralPct: 10.7 },
  "automotive": { referralPct: 13.4 },
  "office-supplies": { referralPct: 13.4 },
  "other": { referralPct: 13.4 },
};

/** Easy Ship weight-based fulfillment fee (INR) */
const EASY_SHIP_SLABS = [
  { maxGrams: 500, local: 29, regional: 39, national: 49 },
  { maxGrams: 1000, local: 40, regional: 50, national: 70 },
  { maxGrams: 2000, local: 55, regional: 70, national: 95 },
  { maxGrams: 5000, local: 100, regional: 130, national: 165 },
];

/** FBA weight-based fulfillment fee (INR) */
const FBA_SLABS = [
  { maxGrams: 500, fee: 35 },
  { maxGrams: 1000, fee: 55 },
  { maxGrams: 2000, fee: 80 },
  { maxGrams: 5000, fee: 140 },
];

const GST_RATE = 0.18;

function getEasyShipFee(weightGrams: number): number {
  for (const slab of EASY_SHIP_SLABS) {
    if (weightGrams <= slab.maxGrams) return slab.regional;
  }
  return 200; // >5 kg
}

function getFBAFee(weightGrams: number): number {
  for (const slab of FBA_SLABS) {
    if (weightGrams <= slab.maxGrams) return slab.fee;
  }
  return 220; // >5 kg
}

export function getAmazonFees(input: CalculatorInput): FeeItem[] {
  const categoryKey = input.category?.toLowerCase().replace(/\s+/g, "-") ?? "other";
  const catFee = AMAZON_CATEGORY_FEES[categoryKey] ?? AMAZON_CATEGORY_FEES["other"];

  const referralFee = Math.round(input.sellingPrice * (catFee.referralPct / 100) * 100) / 100;
  const closingFee = catFee.closingFee ?? 0;

  let fulfillmentFee = 0;
  let fulfillmentLabel = "";
  if (input.fulfillmentMode === "fba") {
    fulfillmentFee = getFBAFee(input.weightGrams);
    fulfillmentLabel = "FBA Fulfillment Fee";
  } else if (input.fulfillmentMode === "self-ship") {
    fulfillmentFee = 0;
    fulfillmentLabel = "Self Ship (No Fee)";
  } else {
    fulfillmentFee = getEasyShipFee(input.weightGrams);
    fulfillmentLabel = "Easy Ship Fee";
  }

  const subtotalFees = referralFee + closingFee + fulfillmentFee;
  const gst = Math.round(subtotalFees * GST_RATE * 100) / 100;

  const items: FeeItem[] = [
    { label: `Referral Fee (${catFee.referralPct}%)`, amount: referralFee, rate: `${catFee.referralPct}%` },
  ];

  if (closingFee > 0) {
    items.push({ label: "Closing Fee", amount: closingFee });
  }

  if (fulfillmentFee > 0) {
    items.push({ label: fulfillmentLabel, amount: fulfillmentFee });
  } else if (input.fulfillmentMode === "self-ship") {
    items.push({ label: fulfillmentLabel, amount: 0 });
  }

  items.push({ label: "GST on Fees (18%)", amount: gst, rate: "18%" });

  return items;
}

export const AMAZON_CATEGORIES = Object.keys(AMAZON_CATEGORY_FEES).map((k) =>
  k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
);
