"use client";

import { useState } from "react";
import CalculatorForm from "../components/calculators/CalculatorForm";
import FeeBreakdown from "../components/calculators/FeeBreakdown";
import ResultCard from "../components/calculators/ResultCard";
import { calculate } from "../../lib/calculator/calculate";
import { validate } from "../../lib/calculator/validation";
import { FLIPKART_CATEGORIES } from "../../lib/fees/flipkart";
import { FEE_VERSIONS } from "../../lib/fees/versions";
import type { CalculatorInput, CalculatorResult, ValidationError } from "../../lib/calculator/types";

export default function FlipkartProfitClient() {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  function handleCalculate(input: CalculatorInput) {
    const errs = validate(input);
    setErrors(errs);
    if (errs.length > 0) return;
    setResult(calculate("flipkart", input));
  }

  return (
    <main className="calc-page">
      <div className="container">
        <div className="calc-page-header">
          <div className="calc-platform-badge flipkart-badge">Flipkart</div>
          <h1 className="calc-page-title">Flipkart Profit Calculator</h1>
          <p className="calc-page-sub">
            Instantly calculate your net profit after Flipkart's commission, collection fee, fixed fee, and shipping charges.
          </p>
        </div>

        <div className="calc-layout">
          <div className="calc-form-col">
            <div className="calc-section-card">
              <h2 className="calc-section-title">Enter Product Details</h2>
              <CalculatorForm
                categories={FLIPKART_CATEGORIES}
                onCalculate={handleCalculate}
                errors={errors}
              />
            </div>
            <p className="fee-version-note">
              Fee structure last updated: <strong>{FEE_VERSIONS.flipkart.lastUpdated}</strong>.
            </p>
          </div>

          <div className="calc-result-col">
            {result ? (
              <>
                <ResultCard result={result} />
                <FeeBreakdown fees={result.feeBreakdown} totalFees={result.totalFees} />
              </>
            ) : (
              <div className="calc-placeholder">
                <span className="calc-placeholder-icon">🛒</span>
                <p>Fill in the form to calculate your Flipkart profit margins.</p>
              </div>
            )}
          </div>
        </div>

        <section className="calc-info-section">
          <h2>Flipkart Fee Structure Explained</h2>
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <strong>📊 Commission</strong>
              <p>Ranges from 4% (Mobiles) to 15% (Fashion, Home, Beauty). Based on product category.</p>
            </div>
            <div className="calc-info-card">
              <strong>💳 Collection Fee</strong>
              <p>A 2% fee on the selling price for payment collection and processing.</p>
            </div>
            <div className="calc-info-card">
              <strong>📌 Fixed Fee</strong>
              <p>A per-order fixed fee of ₹7–21 based on the selling price bracket.</p>
            </div>
          </div>
        </section>

        <section className="calc-faq-section">
          <h2>Flipkart Seller FAQs</h2>
          <details className="calc-faq-item">
            <summary>What is Flipkart's collection fee?</summary>
            <p>The collection fee is 2% of selling price and covers payment processing. It's deducted alongside the commission.</p>
          </details>
          <details className="calc-faq-item">
            <summary>Does Flipkart charge GST on fees?</summary>
            <p>Yes — 18% GST applies on commission, collection fee, and fixed fee. The shipping fee is separate.</p>
          </details>
        </section>
      </div>
    </main>
  );
}
