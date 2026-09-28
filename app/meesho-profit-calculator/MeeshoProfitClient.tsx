"use client";

import { useState } from "react";
import CalculatorForm from "../components/calculators/CalculatorForm";
import FeeBreakdown from "../components/calculators/FeeBreakdown";
import ResultCard from "../components/calculators/ResultCard";
import { calculate } from "../../lib/calculator/calculate";
import { validate } from "../../lib/calculator/validation";
import { MEESHO_CATEGORIES } from "../../lib/fees/meesho";
import { FEE_VERSIONS } from "../../lib/fees/versions";
import type { CalculatorInput, CalculatorResult, ValidationError } from "../../lib/calculator/types";

export default function MeeshoProfitClient() {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  function handleCalculate(input: CalculatorInput) {
    const errs = validate(input);
    setErrors(errs);
    if (errs.length > 0) return;
    const res = calculate("meesho", input);
    setResult(res);
  }

  return (
    <main className="calc-page">
      <div className="container">
        <div className="calc-page-header">
          <div className="calc-platform-badge meesho-badge">Meesho</div>
          <h1 className="calc-page-title">Meesho Profit Calculator</h1>
          <p className="calc-page-sub">
            Calculate your exact profit after Meesho's 0% commission, shipping fees & GST.
            100% browser-based — your data never leaves your device.
          </p>
        </div>

        <div className="calc-layout">
          <div className="calc-form-col">
            <div className="calc-section-card">
              <h2 className="calc-section-title">Enter Product Details</h2>
              <CalculatorForm
                categories={MEESHO_CATEGORIES}
                onCalculate={handleCalculate}
                errors={errors}
              />
            </div>
            <p className="fee-version-note">
              Fee structure last updated: <strong>{FEE_VERSIONS.meesho.lastUpdated}</strong>.
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
                <span className="calc-placeholder-icon">📊</span>
                <p>Fill in the form and click <strong>Calculate Profit</strong> to see your results.</p>
              </div>
            )}
          </div>
        </div>

        <section className="calc-info-section">
          <h2>How Meesho Charges Sellers</h2>
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <strong>🎉 0% Commission</strong>
              <p>Meesho charges zero platform commission — a major advantage for small sellers.</p>
            </div>
            <div className="calc-info-card">
              <strong>🚚 Shipping Fees</strong>
              <p>Shipping fees are weight-based, starting at ₹27 for 0–250g and increasing by slab.</p>
            </div>
            <div className="calc-info-card">
              <strong>📋 GST on Shipping</strong>
              <p>18% GST is levied on the shipping fee. This is the only tax component for Meesho sellers.</p>
            </div>
          </div>
        </section>

        <section className="calc-faq-section">
          <h2>Frequently Asked Questions</h2>
          <details className="calc-faq-item">
            <summary>Does Meesho really charge 0% commission?</summary>
            <p>Yes. Meesho's 0% commission policy means sellers only pay shipping fees + 18% GST on shipping.</p>
          </details>
          <details className="calc-faq-item">
            <summary>What affects my Meesho profit most?</summary>
            <p>Shipping fees are the biggest deduction. Heavier products significantly reduce margins.</p>
          </details>
          <details className="calc-faq-item">
            <summary>How is the break-even price calculated?</summary>
            <p>Break-even = (Product cost + shipping fee) ÷ (1 - variable fee rate). At this price you make exactly ₹0 profit.</p>
          </details>
        </section>
      </div>
    </main>
  );
}
