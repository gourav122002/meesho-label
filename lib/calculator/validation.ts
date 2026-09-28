import type { CalculatorInput, ValidationError } from "./types";

/**
 * Validates calculator inputs. Returns an array of errors (empty = valid).
 */
export function validate(input: CalculatorInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.sellingPrice || input.sellingPrice <= 0) {
    errors.push({ field: "sellingPrice", message: "Selling price must be greater than 0." });
  }

  if (input.productCost < 0) {
    errors.push({ field: "productCost", message: "Product cost cannot be negative." });
  }

  if (input.productCost >= input.sellingPrice && input.sellingPrice > 0) {
    errors.push({
      field: "productCost",
      message: "Product cost should be less than selling price.",
    });
  }

  if (!input.weightGrams || input.weightGrams <= 0) {
    errors.push({ field: "weightGrams", message: "Weight must be greater than 0 grams." });
  }

  if (input.weightGrams > 20000) {
    errors.push({ field: "weightGrams", message: "Weight cannot exceed 20 kg (20,000 g)." });
  }

  if (!input.category || input.category.trim() === "") {
    errors.push({ field: "category", message: "Please select a product category." });
  }

  return errors;
}
