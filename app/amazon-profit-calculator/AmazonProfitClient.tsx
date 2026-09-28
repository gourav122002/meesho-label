"use client";

import { useState } from "react";
import CalculatorForm from "../components/calculators/CalculatorForm";
import FeeBreakdown from "../components/calculators/FeeBreakdown";
import ResultCard from "../components/calculators/ResultCard";
import { calculate } from "../../lib/calculator/calculate";
import { validate } from "../../lib/calculator/validation";
import { AMAZON_CATEGORIES } from "../../lib/fees/amazon";
import { FEE_VERSIONS } from "../../lib/fees/versions";
import type { CalculatorInput, CalculatorResult, ValidationError } from "../../lib/calculator/types";

export default function AmazonProfitClient() {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  function handleCalculate(input: CalculatorInput) {
    const errs = validate(input);
    setErrors(errs);
    if (errs.length > 0) return;
    const res = calculate("amazon", input);
    setResult(res);
  }

  return (
    <main className="calc-page">
      <div className="container">
        <div className="calc-page-header">
          <div className="calc-platform-badge amazon-badge">Amazon</div>
          <h1 className="calc-page-title">Amazon India Profit Calculator</h1>
          <p className="calc-page-sub">
            Calculate your net profit after Amazon's referral fee, closing fee, and Easy Ship / FBA fulfillment charges.
          </p>
        </div>

        <div className="calc-layout">
          <div className="calc-form-col">
            <div className="calc-section-card">
              <h2 className="calc-section-title">Enter Product Details</h2>
              <CalculatorForm
                categories={AMAZON_CATEGORIES}
                showFulfillment={true}
                onCalculate={handleCalculate}
                errors={errors}
              />
            </div>
            <p className="fee-version-note">
              Fee structure last updated: <strong>{FEE_VERSIONS.amazon.lastUpdated}</strong>.
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
                <span className="calc-placeholder-icon">📦</span>
                <p>Fill in the form and click <strong>Calculate Profit</strong> to see your Amazon margins.</p>
              </div>
            )}
          </div>
        </div>

        <section className="calc-info-section">
          <h2>Amazon India Fee Structure</h2>
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <strong>📦 Referral Fee</strong>
              <p>Ranges from 4% (mobiles) to 17% (fashion). Charged on the total selling price.</p>
            </div>
            <div className="calc-info-card">
              <strong>📖 Closing Fee</strong>
              <p>Applies only to Books, Music, DVD & Video Games — a fixed per-item fee of ₹10–21.</p>
            </div>
            <div className="calc-info-card">
              <strong>🚚 Fulfillment</strong>
              <p>Easy Ship starts at ₹29 (regional, 0–500g). FBA adds storage + pick-pack-ship fees.</p>
            </div>
          </div>
        </section>

        <section className="calc-faq-section">
          <h2>Amazon Seller FAQs</h2>
          <details className="calc-faq-item">
            <summary>Should I choose Easy Ship or FBA?</summary>
            <p>FBA is better for fast-moving products and Prime eligibility. Easy Ship is simpler and cheaper for slow-moving items.</p>
          </details>
          <details className="calc-faq-item">
            <summary>Does GST apply on Amazon fees?</summary>
            <p>Yes — 18% GST is applied on the subtotal of referral + closing + fulfillment fees before being deducted from your payout.</p>
          </details>
        </section>
      </div>
    </main>
  );
}
