import type { CalculatorResult } from "../../../lib/calculator/types";

interface Props {
  result: CalculatorResult;
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${abs.toFixed(2)}`;
}

function pct(n: number): string {
  return `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(1)}%`;
}

export default function ResultCard({ result }: Props) {
  const isProfit = result.netProfit >= 0;

  return (
    <div className={`result-card ${isProfit ? "result-card-profit" : "result-card-loss"}`}>
      {/* Hero KPI */}
      <div className="result-hero">
        <span className="result-hero-label">Net Profit per Order</span>
        <div className={`result-hero-value ${isProfit ? "text-profit" : "text-loss"}`}>
          {fmt(result.netProfit)}
        </div>
        <span className={`result-hero-badge ${isProfit ? "badge-profit" : "badge-loss"}`}>
          {isProfit ? "✓ Profitable Order" : "⚠️ Loss Making"}
        </span>
      </div>

      {/* 4-stat grid */}
      <div className="result-stats-grid">
        <div className="result-stat">
          <span className="result-stat-label">Selling Price</span>
          <span className="result-stat-value">{fmt(result.sellingPrice)}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Total Marketplace Fees</span>
          <span className="result-stat-value text-loss">{fmt(result.totalFees)}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Net Margin</span>
          <span className={`result-stat-value ${isProfit ? "text-profit" : "text-loss"}`}>
            {pct(result.margin)}
          </span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Return on Investment (ROI)</span>
          <span className={`result-stat-value ${isProfit ? "text-profit" : "text-loss"}`}>
            {pct(result.roi)}
          </span>
        </div>
      </div>

      {/* Break-even indicator */}
      <div className="result-breakeven">
        <span className="breakeven-label">Minimum Break-even Selling Price:</span>
        <strong className="breakeven-value">{fmt(result.breakEvenPrice)}</strong>
      </div>
    </div>
  );
}
