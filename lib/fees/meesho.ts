import type { CalculatorInput, FeeItem } from "../calculator/types";

/**
 * Meesho fee structure:
 * - 0% platform commission
 * - Shipping fee based on weight slabs
 * - GST on shipping fee (18%)
 */

const SHIPPING_SLABS = [
  { maxGrams: 250, fee: 27 },
  { maxGrams: 500, fee: 33 },
  { maxGrams: 750, fee: 38 },
  { maxGrams: 1000, fee: 44 },
  { maxGrams: 1500, fee: 55 },
  { maxGrams: 2000, fee: 66 },
  { maxGrams: 3000, fee: 88 },
  { maxGrams: 4000, fee: 110 },
  { maxGrams: 5000, fee: 132 },
];

const EXTRA_PER_500G = 22; // for >5 kg
const GST_RATE = 0.18;

export function getMeeshoShippingFee(weightGrams: number): number {
  for (const slab of SHIPPING_SLABS) {
    if (weightGrams <= slab.maxGrams) return slab.fee;
  }
  // > 5 kg
  const extraKg = Math.ceil((weightGrams - 5000) / 500);
  return 132 + extraKg * EXTRA_PER_500G;
}

export function getMeeshoFees(input: CalculatorInput): FeeItem[] {
  const shipping = getMeeshoShippingFee(input.weightGrams);
  const gstOnShipping = Math.round(shipping * GST_RATE * 100) / 100;

  return [
    { label: "Platform Commission", amount: 0, rate: "0%" },
    { label: "Shipping Fee", amount: shipping },
    { label: "GST on Shipping (18%)", amount: gstOnShipping, rate: "18%" },
  ];
}

/** Meesho product categories */
export const MEESHO_CATEGORIES = [
  "Sarees & Ethnic",
  "Kurtis & Tops",
  "Men's Clothing",
  "Kids Clothing",
  "Footwear",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Jewellery & Accessories",
  "Electronics",
  "Other",
];
