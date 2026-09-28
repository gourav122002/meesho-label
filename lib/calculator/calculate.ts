import type { CalculatorInput, CalculatorResult, FeeItem } from "./types";
import { getMeeshoFees } from "../fees/meesho";
import { getAmazonFees } from "../fees/amazon";
import { getFlipkartFees } from "../fees/flipkart";
import { getMyntraFees } from "../fees/myntra";
import type { Marketplace } from "./types";

/**
 * Central profit calculation engine.
 * revenue - cost - fees = profit
 */
export function calculate(
  marketplace: Marketplace,
  input: CalculatorInput
): CalculatorResult {
  const { sellingPrice, productCost, packagingCost = 0, otherCosts = 0 } = input;
  const totalCost = productCost + packagingCost + otherCosts;

  // Get fee breakdown from the appropriate marketplace module
  let feeBreakdown: FeeItem[];
  switch (marketplace) {
    case "meesho":
      feeBreakdown = getMeeshoFees(input);
      break;
    case "amazon":
      feeBreakdown = getAmazonFees(input);
      break;
    case "flipkart":
      feeBreakdown = getFlipkartFees(input);
      break;
    case "myntra":
      feeBreakdown = getMyntraFees(input);
      break;
    default:
      feeBreakdown = [];
  }

  const totalFees = feeBreakdown.reduce((sum, f) => sum + f.amount, 0);
  const netProfit = sellingPrice - totalCost - totalFees;
  const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Break-even = cost + fees (fees recalculated at approximate break-even price)
  // Simple approximation: fixed fees + cost
  const fixedFees = feeBreakdown
    .filter((f) => !f.rate)
    .reduce((s, f) => s + f.amount, 0);
  const variableRate = feeBreakdown
    .filter((f) => f.rate && f.rate.endsWith("%"))
    .reduce((s, f) => s + parseFloat(f.rate!.replace("%", "")) / 100, 0);
  const breakEvenPrice =
    variableRate < 1
      ? (totalCost + fixedFees) / (1 - variableRate)
      : totalCost + fixedFees;

  return {
    sellingPrice,
    productCost: totalCost,
    totalFees,
    netProfit,
    margin,
    roi,
    breakEvenPrice,
    feeBreakdown,
  };
}
