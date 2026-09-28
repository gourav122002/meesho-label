"use client";

import { useState } from "react";
import type { CalculatorInput } from "../../../lib/calculator/types";
import type { ValidationError } from "../../../lib/calculator/types";

interface Props {
  categories: string[];
  showFulfillment?: boolean;
  onCalculate: (input: CalculatorInput) => void;
  errors?: ValidationError[];
  isLoading?: boolean;
}

export default function CalculatorForm({
  categories,
  showFulfillment = false,
  onCalculate,
  errors = [],
  isLoading = false,
}: Props) {
  const [form, setForm] = useState({
    sellingPrice: "",
    productCost: "",
    weightGrams: "250",
    category: categories[0] ?? "",
    fulfillmentMode: "easy-ship",
    packagingCost: "",
    otherCosts: "",
  });

  const getError = (field: string) =>
    errors.find((e) => e.field === field)?.message;

  const handle = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onCalculate({
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      productCost: parseFloat(form.productCost) || 0,
      weightGrams: parseFloat(form.weightGrams) || 0,
      category: form.category,
      fulfillmentMode: form.fulfillmentMode as CalculatorInput["fulfillmentMode"],
      packagingCost: parseFloat(form.packagingCost) || 0,
      otherCosts: parseFloat(form.otherCosts) || 0,
    });
  }

  return (
    <form onSubmit={submit} className="calc-form" noValidate>
      <div className="calc-form-grid">
        {/* Selling Price */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="cf-selling-price">
            Selling Price (₹)
          </label>
          <div className="calc-input-wrap">
            <span className="calc-prefix">₹</span>
            <input
              id="cf-selling-price"
              type="number"
              min="0"
              step="0.01"
              className={`calc-input ${getError("sellingPrice") ? "calc-input-error" : ""}`}
              placeholder="e.g. 499"
              value={form.sellingPrice}
              onChange={handle("sellingPrice")}
            />
          </div>
          {getError("sellingPrice") && (
            <span className="calc-error-msg">{getError("sellingPrice")}</span>
          )}
        </div>

        {/* Product Cost */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="cf-product-cost">
            Product Cost / COGS (₹)
          </label>
          <div className="calc-input-wrap">
            <span className="calc-prefix">₹</span>
            <input
              id="cf-product-cost"
              type="number"
              min="0"
              step="0.01"
              className={`calc-input ${getError("productCost") ? "calc-input-error" : ""}`}
              placeholder="e.g. 150"
              value={form.productCost}
              onChange={handle("productCost")}
            />
          </div>
          {getError("productCost") && (
            <span className="calc-error-msg">{getError("productCost")}</span>
          )}
        </div>

        {/* Weight */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="cf-weight">
            Shipment Weight (grams)
          </label>
          <div className="calc-input-wrap">
            <input
              id="cf-weight"
              type="number"
              min="1"
              step="1"
              className={`calc-input ${getError("weightGrams") ? "calc-input-error" : ""}`}
              placeholder="e.g. 250"
              value={form.weightGrams}
              onChange={handle("weightGrams")}
            />
            <span className="calc-suffix">g</span>
          </div>
          {getError("weightGrams") && (
            <span className="calc-error-msg">{getError("weightGrams")}</span>
          )}
        </div>

        {/* Category */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="cf-category">
            Category
          </label>
          <select
            id="cf-category"
            className="calc-select"
            value={form.category}
            onChange={handle("category")}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Fulfillment Mode (Amazon only) */}
        {showFulfillment && (
          <div className="calc-field calc-field-full">
            <label className="calc-label">Fulfillment Mode</label>
            <div className="calc-radio-group">
              {(["easy-ship", "fba", "self-ship"] as const).map((mode) => (
                <label key={mode} className={`calc-radio-btn ${form.fulfillmentMode === mode ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="fulfillmentMode"
                    value={mode}
                    checked={form.fulfillmentMode === mode}
                    onChange={handle("fulfillmentMode")}
                  />
                  {mode === "easy-ship" ? "Easy Ship" : mode === "fba" ? "FBA" : "Self Ship"}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Optional: Packaging Cost */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="cf-packaging">
            Packaging Cost (₹) <span className="calc-optional">optional</span>
          </label>
          <div className="calc-input-wrap">
            <span className="calc-prefix">₹</span>
            <input
              id="cf-packaging"
              type="number"
              min="0"
              step="0.01"
              className="calc-input"
              placeholder="e.g. 10"
              value={form.packagingCost}
              onChange={handle("packagingCost")}
            />
          </div>
        </div>

        {/* Optional: Other Costs */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="cf-other">
            Other Costs (₹) <span className="calc-optional">optional</span>
          </label>
          <div className="calc-input-wrap">
            <span className="calc-prefix">₹</span>
            <input
              id="cf-other"
              type="number"
              min="0"
              step="0.01"
              className="calc-input"
              placeholder="e.g. 5"
              value={form.otherCosts}
              onChange={handle("otherCosts")}
            />
          </div>
        </div>
      </div>

      <button
        id="calc-submit-btn"
        type="submit"
        className="btn btn-primary calc-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? "Calculating…" : "Calculate Profit →"}
      </button>
    </form>
  );
}
