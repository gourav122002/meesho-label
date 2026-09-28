"use client";

import type { AnalysisResult } from "../../../lib/meesho-analyzer/types";

interface Props {
  analysis: AnalysisResult;
  filename?: string;
}

function toCsv(headers: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

function downloadCsv(content: string, fname: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fname;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPanel({ analysis, filename = "meesho-analysis" }: Props) {
  const { summary, products, profitTimeSeries, badCatalog } = analysis;

  function downloadProductSummary() {
    const headers = [
      "Product Name",
      "SKU",
      "Catalog ID",
      "Category",
      "Total Orders",
      "Delivered Orders",
      "Customer Returns",
      "RTO Orders",
      "Return Rate %",
      "Customer Return %",
      "RTO Rate %",
      "Gross Sales (INR)",
      "Net Settlement (INR)",
      "Unit Cost (INR)",
      "Net Profit (INR)",
      "Profit Margin %",
      "Action",
      "Recommendation Reason",
    ];
    const rows = products.map(
      (p) =>
        [
          p.productName,
          p.sku,
          p.catalogId,
          p.category,
          p.totalOrders,
          p.deliveredOrders,
          p.customerReturns,
          p.rtoOrders,
          p.returnRate.toFixed(1),
          p.customerReturnRate.toFixed(1),
          p.rtoRate.toFixed(1),
          p.grossSales.toFixed(0),
          p.totalSettlement.toFixed(0),
          p.unitCost.toFixed(0),
          p.netProfit.toFixed(0),
          p.profitMargin.toFixed(1),
          p.recommendationAction,
          p.recommendationReason,
        ] as (string | number)[]
    );
    downloadCsv(toCsv(headers, rows), `${filename}-products-summary.csv`);
  }

  function downloadSummaryReport() {
    const lines = [
      "Meesho Payment Sheet Financial Analysis Report",
      "Generated on: " + new Date().toLocaleDateString("en-IN"),
      "",
      "--- SUMMARY METRICS ---",
      "Total Orders," + summary.totalOrders,
      "Delivered Orders," + summary.deliveredOrders,
      "Customer Returns," + summary.customerReturns,
      "Courier RTO Orders," + summary.rtoOrders,
      "Delivered Rate %," + summary.deliveredRate.toFixed(1) + "%",
      "Customer Return Rate %," + summary.customerReturnRate.toFixed(1) + "%",
      "Courier RTO Rate %," + summary.rtoRate.toFixed(1) + "%",
      "Overall Return Rate %," + summary.overallReturnRate.toFixed(1) + "%",
      "",
      "--- FINANCIAL BREAKDOWN ---",
      "Gross Sales (INR)," + summary.grossSales.toFixed(0),
      "Total Settlement (INR)," + summary.totalSettlementAmount.toFixed(0),
      "Return Shipping Penalty (INR)," + Math.abs(summary.totalReturnShippingDeducted).toFixed(0),
      "Total Ads Spend (INR)," + summary.totalAdsCost.toFixed(0),
      "Total Product Cost COGS (INR)," + summary.totalProductCost.toFixed(0),
      "Net Profit (INR)," + summary.netProfit.toFixed(0),
      "Net Profit Margin %," + summary.netProfitMargin.toFixed(1) + "%",
      "Return on Investment (ROI) %," + summary.roi.toFixed(1) + "%",
      "TCS Amount (INR)," + summary.totalTCS.toFixed(0),
      "TDS Amount (INR)," + summary.totalTDS.toFixed(0),
    ];
    downloadCsv(lines.join("\n"), `${filename}-pl-summary.csv`);
  }

  function downloadTimeSeries() {
    const headers = [
      "Date",
      "Total Orders",
      "Delivered",
      "Customer Returns",
      "Courier RTO",
      "Gross Sales (INR)",
      "Settlement (INR)",
      "Estimated Net Profit (INR)",
    ];
    const rows = profitTimeSeries.map(
      (d) =>
        [
          d.label,
          d.orders,
          d.delivered,
          d.returns,
          d.rto,
          d.grossSales.toFixed(0),
          d.settlement.toFixed(0),
          d.profit.toFixed(0),
        ] as (string | number)[]
    );
    downloadCsv(toCsv(headers, rows), `${filename}-daily-timeline.csv`);
  }

  function downloadBadCatalogs() {
    const { remove, pause, fix, scale } = badCatalog;
    const headers = [
      "Action Priority",
      "SKU",
      "Catalog ID",
      "Product Name",
      "Orders",
      "Return Rate %",
      "Settlement (INR)",
      "Net Profit (INR)",
      "Reason",
    ];
    const rows: (string | number)[][] = [
      ...remove.map((p) => [
        "REMOVE (Loss Maker)",
        p.sku,
        p.catalogId,
        p.productName,
        p.totalOrders,
        p.returnRate.toFixed(1),
        p.totalSettlement.toFixed(0),
        p.netProfit.toFixed(0),
        p.recommendationReason,
      ]),
      ...pause.map((p) => [
        "PAUSE (High RTO)",
        p.sku,
        p.catalogId,
        p.productName,
        p.totalOrders,
        p.returnRate.toFixed(1),
        p.totalSettlement.toFixed(0),
        p.netProfit.toFixed(0),
        p.recommendationReason,
      ]),
      ...fix.map((p) => [
        "FIX (Borderline)",
        p.sku,
        p.catalogId,
        p.productName,
        p.totalOrders,
        p.returnRate.toFixed(1),
        p.totalSettlement.toFixed(0),
        p.netProfit.toFixed(0),
        p.recommendationReason,
      ]),
      ...scale.map((p) => [
        "SCALE (Winner)",
        p.sku,
        p.catalogId,
        p.productName,
        p.totalOrders,
        p.returnRate.toFixed(1),
        p.totalSettlement.toFixed(0),
        p.netProfit.toFixed(0),
        p.recommendationReason,
      ]),
    ];
    downloadCsv(toCsv(headers, rows), `${filename}-bad-catalogs-actions.csv`);
  }

  const exports = [
    {
      id: "export-products-btn",
      icon: "📊",
      label: "SKU & Product Master CSV",
      hint: "Every SKU with sales, payouts, return rate, net profit, and action recommendations.",
      fn: downloadProductSummary,
    },
    {
      id: "export-summary-btn",
      icon: "📄",
      label: "P&L Financial Summary CSV",
      hint: "High-level summary metrics, total deductions, tax credits, and margin analysis.",
      fn: downloadSummaryReport,
    },
    {
      id: "export-timeseries-btn",
      icon: "📅",
      label: "Daily Timeline Series CSV",
      hint: "Day-by-day order fulfillment, gross sales, payouts, and net profit trends.",
      fn: downloadTimeSeries,
    },
    {
      id: "export-bad-catalogs-btn",
      icon: "🚨",
      label: "Action Items & Bad Catalogs CSV",
      hint: "Categorized list of SKUs to remove, pause, fix, or scale up with ads.",
      fn: downloadBadCatalogs,
    },
  ];

  return (
    <div className="export-panel">
      <div className="export-header">
        <h3 className="export-title">Export Clean Spreadsheet Data</h3>
        <p className="export-hint">
          Download structured CSV reports ready to open in Microsoft Excel, Google Sheets, or Zoho.
        </p>
      </div>
      <div className="export-buttons-grid">
        {exports.map((exp) => (
          <button
            key={exp.id}
            id={exp.id}
            type="button"
            className="export-card-btn"
            onClick={exp.fn}
          >
            <div className="export-card-top">
              <span className="export-card-icon">{exp.icon}</span>
              <span className="export-badge">CSV</span>
            </div>
            <span className="export-card-label">{exp.label}</span>
            <span className="export-card-hint">{exp.hint}</span>
            <div className="export-download-cta">
              <span>Download File</span>
              <span>↓</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
