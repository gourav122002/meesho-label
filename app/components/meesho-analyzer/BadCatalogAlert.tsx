import type { AnalysisResult } from "../../../lib/meesho-analyzer/types";

interface Props {
  badCatalog: AnalysisResult["badCatalog"];
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

const SECTIONS = [
  {
    key: "remove" as const,
    title: "Remove Immediately",
    icon: "🚨",
    borderColor: "#ef4444",
    bg: "#fff1f2",
    badgeBg: "#fee2e2",
    badgeColor: "#dc2626",
    desc: "These SKUs have high return rates (>25%) and are actively losing you money in shipping penalties. Stop selling them immediately.",
  },
  {
    key: "pause" as const,
    title: "Pause & Investigate",
    icon: "⏸️",
    borderColor: "#f59e0b",
    bg: "#fffbeb",
    badgeBg: "#fef3c7",
    badgeColor: "#d97706",
    desc: "High courier RTO rate (>35%) — orders failing at customer doorstep. Check pincodes, buyer fake rate, and pause COD.",
  },
  {
    key: "fix" as const,
    title: "Fix Listing / Sizing",
    icon: "🔧",
    borderColor: "#eab308",
    bg: "#fefce8",
    badgeBg: "#fef9c3",
    badgeColor: "#a16207",
    desc: "Borderline return rates (15%–25%). Improve size chart accuracy, upload real fabric photos, and fix product descriptions.",
  },
  {
    key: "scale" as const,
    title: "Scale with Ads & Stock",
    icon: "🚀",
    borderColor: "#10b981",
    bg: "#f0fdf4",
    badgeBg: "#dcfce7",
    badgeColor: "#15803d",
    desc: "Top profitable winners with low returns (<10%) and steady deliveries. Run Meesho Ads and increase warehouse stock.",
  },
];

export default function BadCatalogAlert({ badCatalog }: Props) {
  const totalAlerts =
    badCatalog.remove.length + badCatalog.pause.length + badCatalog.fix.length;

  if (totalAlerts === 0 && badCatalog.scale.length === 0) {
    return (
      <div className="alert alert-success">
        <span className="alert-icon">✓</span>
        <div>
          <strong>All catalogs are performing well!</strong>
          <p>No critical loss-making or high-return products detected in this payment sheet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bad-catalog-sections">
      {SECTIONS.map((sec) => {
        const items = badCatalog[sec.key];
        if (items.length === 0) return null;
        return (
          <div
            key={sec.key}
            className="bad-catalog-section"
            style={{ borderLeft: `4px solid ${sec.borderColor}`, background: sec.bg }}
          >
            <div className="bad-catalog-section-header">
              <span className="bad-section-icon">{sec.icon}</span>
              <strong className="bad-section-title">{sec.title}</strong>
              <span
                className="bad-count-badge"
                style={{ background: sec.badgeBg, color: sec.badgeColor }}
              >
                {items.length} {items.length === 1 ? "Product" : "Products"}
              </span>
            </div>
            <p className="section-hint" style={{ marginBottom: 16 }}>
              {sec.desc}
            </p>
            <div className="bad-catalog-list">
              {items.map((p) => (
                <div key={p.sku} className="bad-catalog-item">
                  <div className="bad-catalog-name">
                    <div>
                      <strong className="bad-item-title">{p.productName}</strong>
                      <div className="bad-item-meta">
                        {p.sku && <span className="sku-tag">SKU: {p.sku}</span>}
                        {p.catalogId && <span className="sku-tag">Catalog #{p.catalogId}</span>}
                      </div>
                      <div className="bad-item-reason">
                        {p.recommendationReason}
                      </div>
                    </div>
                  </div>
                  <div className="bad-catalog-stats">
                    <div className="bad-stat">
                      <span className="bad-stat-label">Total Orders</span>
                      <strong className="bad-stat-val">{p.totalOrders}</strong>
                    </div>
                    <div className="bad-stat">
                      <span className="bad-stat-label">Return Rate</span>
                      <strong
                        className={`bad-stat-val ${
                          p.returnRate > 25 ? "text-loss" : p.returnRate > 15 ? "text-warn" : "text-profit"
                        }`}
                      >
                        {p.returnRate.toFixed(0)}%
                      </strong>
                    </div>
                    <div className="bad-stat">
                      <span className="bad-stat-label">Net Profit</span>
                      <strong
                        className={`bad-stat-val ${p.netProfit < 0 ? "text-loss" : "text-profit"}`}
                      >
                        {fmt(p.netProfit)}
                      </strong>
                    </div>
                    <div className="bad-stat">
                      <span className="bad-stat-label">Action</span>
                      <strong className="bad-stat-action">{p.recommendationAction}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
