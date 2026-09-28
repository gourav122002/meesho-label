"use client";

import { useState } from "react";
import CalculatorForm from "../components/calculators/CalculatorForm";
import FeeBreakdown from "../components/calculators/FeeBreakdown";
import ResultCard from "../components/calculators/ResultCard";
import { calculate } from "../../lib/calculator/calculate";
import { validate } from "../../lib/calculator/validation";
import { MYNTRA_CATEGORIES } from "../../lib/fees/myntra";
import { FEE_VERSIONS } from "../../lib/fees/versions";
import type { CalculatorInput, CalculatorResult, ValidationError } from "../../lib/calculator/types";

export default function MyntraProfitClient() {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  function handleCalculate(input: CalculatorInput) {
    const errs = validate(input);
    setErrors(errs);
    if (errs.length > 0) return;
    setResult(calculate("myntra", input));
  }

  return (
    <main className="calc-page">
      <div className="container">
        <div className="calc-page-header">
          <div className="calc-platform-badge myntra-badge">Myntra</div>
          <h1 className="calc-page-title">Myntra Profit Calculator</h1>
          <p className="calc-page-sub">
            Calculate your seller margin on Myntra after category commission, payment gateway fee, and shipping charges.
          </p>
        </div>

        <div className="calc-layout">
          <div className="calc-form-col">
            <div className="calc-section-card">
              <h2 className="calc-section-title">Enter Product Details</h2>
              <CalculatorForm
                categories={MYNTRA_CATEGORIES}
                onCalculate={handleCalculate}
                errors={errors}
              />
            </div>
            <p className="fee-version-note">
              Fee structure last updated: <strong>{FEE_VERSIONS.myntra.lastUpdated}</strong>.
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
                <span className="calc-placeholder-icon">👗</span>
                <p>Fill in the form to calculate your Myntra fashion seller margins.</p>
              </div>
            )}
          </div>
        </div>

        <section className="calc-info-section">
          <h2>Myntra Fee Structure for Fashion Sellers</h2>
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <strong>👗 High Commission</strong>
              <p>Myntra charges 22–30% commission on most fashion categories — significantly higher than Meesho.</p>
            </div>
            <div className="calc-info-card">
              <strong>💳 Payment Gateway</strong>
              <p>A 2% payment gateway fee is levied on the selling price for all orders.</p>
            </div>
            <div className="calc-info-card">
              <strong>🔄 High Returns</strong>
              <p>Fashion category typically has 25–40% return rates. Factor this in when setting prices.</p>
            </div>
          </div>
        </section>

        <section className="calc-faq-section">
          <h2>Myntra Seller FAQs</h2>
          <details className="calc-faq-item">
            <summary>Why is Myntra commission so high?</summary>
            <p>Myntra positions itself as a premium fashion platform. The higher commission funds better marketing, photography, and customer experience.</p>
          </details>
          <details className="calc-faq-item">
            <summary>Can I negotiate commission rates on Myntra?</summary>
            <p>Large-volume sellers may negotiate rates directly with Myntra's category team. Small sellers are on standard commission slabs.</p>
          </details>
        </section>
      </div>
    </main>
  );
}
