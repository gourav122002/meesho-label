import type { SummaryMetrics } from "../../../lib/meesho-analyzer/types";

interface Props {
  summary: SummaryMetrics;
  warnings?: string[];
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

interface KPI {
  label: string;
  value: string;
  sub?: string;
  color?: "green" | "red" | "blue" | "orange" | "purple";
  badge?: string;
}

export default function SummaryCards({ summary, warnings }: Props) {
  const dateFrom = summary.dateRange.from
    ? summary.dateRange.from.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;
  const dateTo = summary.dateRange.to
    ? summary.dateRange.to.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const kpis: KPI[] = [
    // Row 1: Core Financials
    {
      label: "Total Orders",
      value: summary.totalOrders.toLocaleString("en-IN"),
      sub: `${summary.deliveredOrders.toLocaleString("en-IN")} delivered (${pct(summary.deliveredRate)})`,
      color: "blue",
    },
    {
      label: "Gross Sales",
      value: fmt(summary.grossSales),
      sub: "Listing price × quantity",
      color: "blue",
    },
    {
      label: "Net Settlement",
      value: fmt(summary.totalSettlementAmount),
      sub: "Total Meesho credited payout",
      color: summary.totalSettlementAmount >= 0 ? "green" : "red",
    },
    {
      label: "Net Profit",
      value: fmt(summary.netProfit),
      sub: `Profit Margin: ${pct(summary.netProfitMargin)}`,
      color: summary.netProfit >= 0 ? "green" : "red",
    },

    // Row 2: Returns & Losses
    {
      label: "Return Shipping Loss",
      value: fmt(Math.abs(summary.totalReturnShippingDeducted)),
      sub: `${summary.customerReturns} customer return penalties`,
      color: "red",
    },
    {
      label: "Overall Return Rate",
      value: pct(summary.overallReturnRate),
      sub: `${summary.customerReturns} returns + ${summary.rtoOrders} RTO`,
      color: summary.overallReturnRate > 20 ? "red" : "orange",
    },
    {
      label: "Customer Returns",
      value: summary.customerReturns.toLocaleString("en-IN"),
      sub: `${pct(summary.customerReturnRate)} return rate`,
      color: summary.customerReturnRate > 20 ? "red" : "orange",
    },
    {
      label: "Courier RTO",
      value: summary.rtoOrders.toLocaleString("en-IN"),
      sub: `${pct(summary.rtoRate)} RTO rate (doorstep failure)`,
      color: summary.rtoRate > 20 ? "red" : "blue",
    },

    // Row 3: Unit Economics & Efficiency
    {
      label: "Ads Spend",
      value: fmt(summary.totalAdsCost),
      sub: summary.totalAdsCost > 0 ? `${pct((summary.totalAdsCost / Math.max(summary.grossSales, 1)) * 100)} ACOS` : "No ads deducted",
      color: "orange",
    },
    {
      label: "TCS + TDS (Tax Credit)",
      value: fmt(Math.abs(summary.totalTCS) + Math.abs(summary.totalTDS)),
      sub: "Claimable in GST / ITR filing",
      color: "purple",
    },
    {
      label: "ROI",
      value: pct(summary.roi),
      sub: "Net profit ÷ total invested cost",
      color: summary.roi > 0 ? "green" : "red",
    },
    {
      label: "Avg Order Value",
      value: fmt(summary.avgOrderValue),
      sub: dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : "Per order average",
      color: "blue",
    },
  ];

  const colorMap: Record<string, string> = {
    green: "kpi-green",
    red: "kpi-red",
    blue: "kpi-blue",
    orange: "kpi-orange",
    purple: "kpi-purple",
  };

  return (
    <div className="summary-cards-container">
      {warnings && warnings.length > 0 && (
        <div className="alert alert-warning mb-16">
          <span className="alert-icon">⚠️</span>
          <div className="alert-text">{warnings.join(" ")}</div>
        </div>
      )}

      <div className="kpi-grid kpi-grid-lg">
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${colorMap[k.color ?? "blue"]}`}>
            <span className="kpi-label">{k.label}</span>
            <strong className="kpi-value">{k.value}</strong>
            {k.sub && <span className="kpi-sub">{k.sub}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
