import type { ReturnAnalysis as ReturnAnalysisType } from "../../../lib/meesho-analyzer/types";

interface Props {
  analysis: ReturnAnalysisType;
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function ReturnAnalysis({ analysis }: Props) {
  const {
    catalogReturnBreakdown,
    hasReturnSheetData,
    returnReasonSummary,
    variationStats,
    courierRtoStats,
  } = analysis;

  if (catalogReturnBreakdown.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>No returns or RTOs found in this dataset.</p>
      </div>
    );
  }

  return (
    <div className="return-analysis">
      {/* Global stats row */}
      <div className="return-global-stats">
        <div className="kpi-card kpi-orange">
          <span className="kpi-label">Customer Returns</span>
          <strong className="kpi-value">{analysis.customerReturns}</strong>
          <span className="kpi-sub">{analysis.customerReturnRate.toFixed(1)}% return rate</span>
        </div>
        <div className="kpi-card kpi-red">
          <span className="kpi-label">Courier RTO</span>
          <strong className="kpi-value">{analysis.rtoCount}</strong>
          <span className="kpi-sub">{analysis.rtoRate.toFixed(1)}% RTO rate</span>
        </div>
        <div className="kpi-card kpi-red">
          <span className="kpi-label">Return Shipping Penalties</span>
          <strong className="kpi-value">{fmt(analysis.totalReturnShippingLoss)}</strong>
          <span className="kpi-sub">Total deducted by Meesho</span>
        </div>
        <div className="kpi-card kpi-blue">
          <span className="kpi-label">Overall Return Rate</span>
          <strong className="kpi-value">{analysis.totalReturnRate.toFixed(1)}%</strong>
          <span className="kpi-sub">
            {analysis.customerReturns + analysis.rtoCount} of {analysis.totalOrders} total orders
          </span>
        </div>
      </div>

      {/* Real return reasons (when return sheet uploaded) */}
      {hasReturnSheetData && returnReasonSummary.length > 0 && (
        <div className="return-reasons-section">
          <div className="return-section-header">
            <h3 className="return-section-title">📊 Real Buyer Return Reasons</h3>
            <span className="return-sheet-badge">From Meesho Return Sheet CSV</span>
          </div>
          <div className="return-bars">
            {returnReasonSummary.slice(0, 8).map((r, i) => (
              <div key={i} className="return-bar-item">
                <div className="return-bar-header">
                  <span className="return-bar-name">
                    {r.reason} {r.detailedReason ? `— ${r.detailedReason}` : ""}
                  </span>
                  <span className="return-rate-tag rate-high">{r.percentage.toFixed(1)}%</span>
                </div>
                <div className="return-bar-track">
                  <div
                    className="return-bar-fill fill-high"
                    style={{ width: `${Math.min(r.percentage, 100)}%` }}
                  />
                </div>
                <div className="return-bar-meta">
                  <span>{r.count} return orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variation stats */}
      {hasReturnSheetData && variationStats.length > 0 && (
        <div className="return-reasons-section">
          <div className="return-section-header">
            <h3 className="return-section-title">📐 Returns by Size / Variation</h3>
            <span className="section-hint">Identifies which sizes get returned most frequently</span>
          </div>
          <div className="variation-grid">
            {variationStats.slice(0, 12).map((v) => (
              <div key={v.variation} className="variation-item">
                <strong className="variation-name">{v.variation}</strong>
                <span className="variation-count">{v.total} returns</span>
                <span className="variation-split">
                  {v.customerReturns} Customer / {v.rtoCount} RTO
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courier RTO */}
      {hasReturnSheetData && courierRtoStats.length > 0 && (
        <div className="return-reasons-section">
          <div className="return-section-header">
            <h3 className="return-section-title">🚚 Courier Partner RTO Breakdown</h3>
            <span className="section-hint">Delivery performance by logistics partner</span>
          </div>
          <div className="return-bars">
            {courierRtoStats.map((c) => (
              <div key={c.courierPartner} className="return-bar-item">
                <div className="return-bar-header">
                  <span className="return-bar-name">{c.courierPartner}</span>
                  <span className="return-rate-tag rate-med">{c.percentage.toFixed(1)}% RTO</span>
                </div>
                <div className="return-bar-track">
                  <div
                    className="return-bar-fill fill-med"
                    style={{ width: `${Math.min(c.percentage, 100)}%` }}
                  />
                </div>
                <div className="return-bar-meta">
                  <span>{c.rtoCount} failed / returned orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-catalog breakdown */}
      <div className="return-reasons-section">
        <div className="return-section-header">
          <h3 className="return-section-title">📦 Catalog Return & Penalty Breakdown</h3>
          <span className="section-hint">
            {hasReturnSheetData
              ? "Showing real return data matched with payment sheet penalties."
              : "Showing catalog return statistics. Upload your Return Sheet CSV to unlock real buyer feedback."}
          </span>
        </div>
        <div className="return-bars">
          {catalogReturnBreakdown.slice(0, 15).map((cat) => {
            const isHigh = cat.customerReturnRate >= 20 || cat.totalReturnRate >= 30;
            return (
              <div key={cat.catalogId} className="return-bar-item">
                <div className="return-bar-header">
                  <span className="return-bar-name" title={cat.productName}>
                    {cat.productName.length > 55
                      ? `${cat.productName.slice(0, 55)}...`
                      : cat.productName}
                  </span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span
                      className={`return-rate-tag ${
                        cat.severity === "critical"
                          ? "rate-high"
                          : cat.severity === "high"
                          ? "rate-high"
                          : "rate-med"
                      }`}
                    >
                      {cat.totalReturnRate.toFixed(0)}% return rate
                    </span>
                    <span className="sku-tag">#{cat.catalogId}</span>
                  </div>
                </div>
                <div className="return-bar-track">
                  <div
                    className={`return-bar-fill ${isHigh ? "fill-high" : "fill-med"}`}
                    style={{ width: `${Math.min(cat.totalReturnRate, 100)}%` }}
                  />
                </div>
                <div className="return-bar-meta">
                  <span>{cat.customerReturns} Customer Returns</span>
                  <span>·</span>
                  <span>{cat.rtoOrders} Courier RTO</span>
                  <span>·</span>
                  <span>{cat.totalOrders} total orders</span>
                  <span>·</span>
                  <span className="text-loss font-semibold">
                    {fmt(cat.returnPenaltyCost)} return shipping penalty
                  </span>
                </div>
                {cat.inferredReasons.slice(0, 2).map((r, i) => (
                  <div key={i} className="inferred-reason-text">
                    💡 {r}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
