"use client";

import { useState } from "react";
import { calculate } from "../../lib/calculator/calculate";
import { MEESHO_CATEGORIES } from "../../lib/fees/meesho";
import type { CalculatorResult } from "../../lib/calculator/types";

function fmt(n: number) {
  return `₹${n.toFixed(2)}`;
}

function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export default function AmazonVsMeeshoClient() {
  const [sellingPrice, setSellingPrice] = useState("");
  const [productCost, setProductCost] = useState("");
  const [weightGrams, setWeightGrams] = useState("250");
  const [category, setCategory] = useState(MEESHO_CATEGORIES[0]);
  const [results, setResults] = useState<{ meesho: CalculatorResult; amazon: CalculatorResult } | null>(null);

  function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    const input = {
      sellingPrice: parseFloat(sellingPrice) || 0,
      productCost: parseFloat(productCost) || 0,
      weightGrams: parseFloat(weightGrams) || 250,
      category,
    };
    setResults({
      meesho: calculate("meesho", input),
      amazon: calculate("amazon", input),
    });
  }

  const winner = results
    ? results.meesho.netProfit >= results.amazon.netProfit
      ? "meesho"
      : "amazon"
    : null;

  return (
    <main className="calc-page">
      <div className="container">
        <div className="calc-page-header">
          <div className="calc-platform-badge compare-badge">⚔️ Compare</div>
          <h1 className="calc-page-title">Amazon vs Meesho Profit Comparison</h1>
          <p className="calc-page-sub">
            Enter your product details once. See the exact profit difference between Amazon and Meesho side-by-side.
          </p>
        </div>

        {/* Input Form */}
        <div className="compare-form-wrap">
          <div className="calc-section-card">
            <form onSubmit={handleCompare} className="compare-form">
              <div className="calc-form-grid">
                <div className="calc-field">
                  <label className="calc-label" htmlFor="cmp-sp">Selling Price (₹)</label>
                  <div className="calc-input-wrap">
                    <span className="calc-prefix">₹</span>
                    <input id="cmp-sp" type="number" className="calc-input" placeholder="e.g. 499"
                      value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                  </div>
                </div>
                <div className="calc-field">
                  <label className="calc-label" htmlFor="cmp-cost">Product Cost (₹)</label>
                  <div className="calc-input-wrap">
                    <span className="calc-prefix">₹</span>
                    <input id="cmp-cost" type="number" className="calc-input" placeholder="e.g. 150"
                      value={productCost} onChange={(e) => setProductCost(e.target.value)} />
                  </div>
                </div>
                <div className="calc-field">
                  <label className="calc-label" htmlFor="cmp-weight">Weight (grams)</label>
                  <div className="calc-input-wrap">
                    <input id="cmp-weight" type="number" className="calc-input" placeholder="250"
                      value={weightGrams} onChange={(e) => setWeightGrams(e.target.value)} />
                    <span className="calc-suffix">g</span>
                  </div>
                </div>
                <div className="calc-field">
                  <label className="calc-label" htmlFor="cmp-cat">Category</label>
                  <select id="cmp-cat" className="calc-select"
                    value={category} onChange={(e) => setCategory(e.target.value)}>
                    {MEESHO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary calc-submit-btn" id="compare-btn">
                Compare Platforms →
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="compare-results">
            {/* Winner Banner */}
            <div className={`compare-winner-banner ${winner === "meesho" ? "winner-meesho" : "winner-amazon"}`}>
              <strong>
                {winner === "meesho" ? "🟣 Meesho" : "🟠 Amazon"} gives you more profit by{" "}
                ₹{Math.abs(results.meesho.netProfit - results.amazon.netProfit).toFixed(2)}
              </strong>
            </div>

            {/* Side-by-side cards */}
            <div className="compare-cards">
              {/* Meesho */}
              <div className={`compare-card ${winner === "meesho" ? "compare-card-winner" : ""}`}>
                <div className="compare-card-header meesho-header">
                  <strong>Meesho</strong>
                  {winner === "meesho" && <span className="winner-tag">WINNER</span>}
                </div>
                <div className="compare-kpis">
                  <div className="compare-kpi">
                    <span>Net Profit</span>
                    <strong className={results.meesho.netProfit >= 0 ? "text-profit" : "text-loss"}>
                      {fmt(results.meesho.netProfit)}
                    </strong>
                  </div>
                  <div className="compare-kpi">
                    <span>Total Fees</span>
                    <strong className="text-loss">{fmt(results.meesho.totalFees)}</strong>
                  </div>
                  <div className="compare-kpi">
                    <span>Margin</span>
                    <strong>{pct(results.meesho.margin)}</strong>
                  </div>
                  <div className="compare-kpi">
                    <span>ROI</span>
                    <strong>{pct(results.meesho.roi)}</strong>
                  </div>
                </div>
                <div className="compare-fee-list">
                  {results.meesho.feeBreakdown.map((f) => (
                    <div key={f.label} className="compare-fee-row">
                      <span>{f.label}</span>
                      <span>{f.amount === 0 ? "FREE" : fmt(f.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amazon */}
              <div className={`compare-card ${winner === "amazon" ? "compare-card-winner" : ""}`}>
                <div className="compare-card-header amazon-header">
                  <strong>Amazon</strong>
                  {winner === "amazon" && <span className="winner-tag">WINNER</span>}
                </div>
                <div className="compare-kpis">
                  <div className="compare-kpi">
                    <span>Net Profit</span>
                    <strong className={results.amazon.netProfit >= 0 ? "text-profit" : "text-loss"}>
                      {fmt(results.amazon.netProfit)}
                    </strong>
                  </div>
                  <div className="compare-kpi">
                    <span>Total Fees</span>
                    <strong className="text-loss">{fmt(results.amazon.totalFees)}</strong>
                  </div>
                  <div className="compare-kpi">
                    <span>Margin</span>
                    <strong>{pct(results.amazon.margin)}</strong>
                  </div>
                  <div className="compare-kpi">
                    <span>ROI</span>
                    <strong>{pct(results.amazon.roi)}</strong>
                  </div>
                </div>
                <div className="compare-fee-list">
                  {results.amazon.feeBreakdown.map((f) => (
                    <div key={f.label} className="compare-fee-row">
                      <span>{f.label}</span>
                      <span>{fmt(f.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="calc-info-section">
          <h2>Meesho vs Amazon — Key Differences</h2>
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <strong>Commission</strong>
              <p>Meesho: 0% | Amazon: 4–17% by category</p>
            </div>
            <div className="calc-info-card">
              <strong>Audience</strong>
              <p>Meesho: Tier-2/3 cities, value buyers | Amazon: All-India, premium buyers</p>
            </div>
            <div className="calc-info-card">
              <strong>Returns</strong>
              <p>Meesho: Typically lower return rates | Amazon: Higher return rates (Prime policy)</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
