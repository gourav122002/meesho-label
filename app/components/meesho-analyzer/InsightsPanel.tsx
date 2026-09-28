import type { Insight } from "../../../lib/meesho-analyzer/types";

interface Props {
  insights: Insight[];
}

const typeConfig: Record<string, { icon: string; cls: string; label: string }> = {
  remove:     { icon: "🚨", cls: "insight-danger",  label: "Urgent Action" },
  pause:      { icon: "⏸️", cls: "insight-warning", label: "Pause Catalog" },
  fix:        { icon: "🔧", cls: "insight-warning", label: "Fix Listing" },
  scale:      { icon: "🚀", cls: "insight-success", label: "Growth Winner" },
  ads:        { icon: "📢", cls: "insight-info",    label: "Ads Optimization" },
  trend:      { icon: "📈", cls: "insight-info",    label: "Trend" },
  geographic: { icon: "📍", cls: "insight-info",    label: "Location Insight" },
  category:   { icon: "🏷️", cls: "insight-info",    label: "Category Insight" },
  info:       { icon: "💡", cls: "insight-info",    label: "Recommendation" },
};

const priorityBadge: Record<string, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

export default function InsightsPanel({ insights }: Props) {
  if (insights.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">💡</span>
        <p>No actionable insights yet. Upload more order data to get automated recommendations.</p>
      </div>
    );
  }

  const sorted = [...insights].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="insights-panel-container">
      <div className="insights-header">
        <div>
          <h3 className="insights-title">Strategic Action Recommendations</h3>
          <p className="insights-sub">
            Automated intelligence prioritized by profit impact on your Meesho business
          </p>
        </div>
        <span className="insights-count-badge">
          <strong>{sorted.length}</strong> Insights Found
        </span>
      </div>

      <div className="insights-list">
        {sorted.map((ins) => {
          const cfg = typeConfig[ins.type] ?? typeConfig["info"];
          return (
            <div key={ins.id} className={`insight-card ${cfg.cls}`}>
              <div className="insight-card-top">
                <div className="insight-title-group">
                  <span className="insight-icon">{cfg.icon}</span>
                  <div>
                    <div className="insight-badge-row">
                      <span className={`priority-badge ${priorityBadge[ins.priority]}`}>
                        {ins.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="insight-type-label">{cfg.label}</span>
                      {ins.value && <span className="insight-value-tag">{ins.value}</span>}
                    </div>
                    <strong className="insight-title">{ins.title}</strong>
                  </div>
                </div>
              </div>

              <div className="insight-body">
                <p className="insight-detail">{ins.description}</p>
                {ins.affectedSkus && ins.affectedSkus.length > 0 && (
                  <div className="insight-skus">
                    <span className="insight-sku-label">Affected Products:</span>
                    {ins.affectedSkus.slice(0, 5).map((s, i) => (
                      <span key={i} className="sku-tag">
                        {s}
                      </span>
                    ))}
                    {ins.affectedSkus.length > 5 && (
                      <span className="sku-tag">+{ins.affectedSkus.length - 5} more</span>
                    )}
                  </div>
                )}
                {ins.actionLabel && (
                  <div className="insight-action-bar">
                    <span className="insight-action-label">👉 Recommended Next Step:</span>
                    <strong className="insight-action-text">{ins.actionLabel}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
