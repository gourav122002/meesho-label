"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { calculate } from "../../lib/calculator/calculate";
import type { Marketplace } from "../../lib/calculator/types";

interface BulkRow {
  productName: string;
  sku: string;
  marketplace: Marketplace;
  sellingPrice: number;
  productCost: number;
  weightGrams: number;
  category: string;
}

interface BulkResult extends BulkRow {
  totalFees: number;
  netProfit: number;
  margin: number;
  roi: number;
}

export default function BulkCalculatorClient() {
  const [results, setResults] = useState<BulkResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [marketplace, setMarketplace] = useState<Marketplace>("meesho");
  const fileRef = useRef<HTMLInputElement>(null);

  function parseNum(v: unknown): number {
    const n = parseFloat(String(v ?? "").replace(/[₹,]/g, ""));
    return isNaN(n) ? 0 : n;
  }

  async function handleFile(file: File) {
    setIsProcessing(true);
    setError(null);
    try {
      let rows: Record<string, unknown>[] = [];

      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const parsed = Papa.parse<Record<string, unknown>>(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
        });
        rows = parsed.data;
      } else {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
        rows = rows.map((r) =>
          Object.fromEntries(
            Object.entries(r).map(([k, v]) => [k.trim().toLowerCase().replace(/\s+/g, "_"), v])
          )
        );
      }

      if (rows.length === 0) throw new Error("No data rows found in the file.");

      const bulkResults: BulkResult[] = rows.map((row) => {
        const mkt = (String(row.marketplace ?? marketplace)).toLowerCase() as Marketplace;
        const input = {
          sellingPrice: parseNum(row.selling_price ?? row.sp ?? row.price),
          productCost: parseNum(row.product_cost ?? row.cost ?? row.cogs),
          weightGrams: parseNum(row.weight_grams ?? row.weight ?? 250),
          category: String(row.category ?? "other"),
          packagingCost: parseNum(row.packaging_cost ?? 0),
          otherCosts: parseNum(row.other_costs ?? 0),
        };
        const res = calculate(mkt || marketplace, input);
        return {
          productName: String(row.product_name ?? row.name ?? "—"),
          sku: String(row.sku ?? "—"),
          marketplace: mkt || marketplace,
          ...input,
          totalFees: res.totalFees,
          netProfit: res.netProfit,
          margin: res.margin,
          roi: res.roi,
        };
      });

      setResults(bulkResults);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setIsProcessing(false);
    }
  }

  function downloadResults() {
    const headers = ["Product Name", "SKU", "Marketplace", "Selling Price", "Product Cost", "Weight (g)", "Category", "Total Fees", "Net Profit", "Margin %", "ROI %"];
    const rows = results.map((r) => [
      r.productName, r.sku, r.marketplace,
      r.sellingPrice, r.productCost, r.weightGrams, r.category,
      r.totalFees.toFixed(2), r.netProfit.toFixed(2),
      r.margin.toFixed(1), r.roi.toFixed(1),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bulk-profit-results.csv";
    a.click();
  }

  return (
    <main className="calc-page">
      <div className="container">
        <div className="calc-page-header">
          <div className="calc-platform-badge blue-badge">Bulk</div>
          <h1 className="calc-page-title">Bulk Profit Calculator</h1>
          <p className="calc-page-sub">
            Upload a CSV or Excel file with multiple SKUs. Get profit, margin, and ROI calculated for every product instantly.
          </p>
        </div>

        <div className="bulk-upload-section">
          <div className="calc-section-card">
            <div className="bulk-controls">
              <div className="calc-field">
                <label className="calc-label" htmlFor="bulk-marketplace">Default Marketplace</label>
                <select
                  id="bulk-marketplace"
                  className="calc-select"
                  value={marketplace}
                  onChange={(e) => setMarketplace(e.target.value as Marketplace)}
                >
                  <option value="meesho">Meesho</option>
                  <option value="amazon">Amazon</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="myntra">Myntra</option>
                </select>
              </div>
              <div className="calc-field">
                <label className="calc-label">Upload File</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  id="bulk-file-input"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => fileRef.current?.click()}
                  disabled={isProcessing}
                  id="bulk-upload-btn"
                >
                  {isProcessing ? "Processing…" : "📂 Upload CSV or Excel"}
                </button>
              </div>
            </div>

            {error && <div className="analyzer-status error">❌ {error}</div>}

            <div className="bulk-template-hint">
              <strong>Required columns:</strong>{" "}
              <code>product_name, selling_price, product_cost, weight_grams, category</code>.
              Optional: <code>sku, marketplace, packaging_cost, other_costs</code>.
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bulk-results">
            <div className="bulk-results-header">
              <strong>{results.length} products processed</strong>
              <button className="btn btn-secondary" onClick={downloadResults} id="bulk-download-btn">
                📥 Download Results CSV
              </button>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Platform</th>
                    <th>Sell Price</th>
                    <th>Cost</th>
                    <th>Fees</th>
                    <th>Net Profit</th>
                    <th>Margin</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className={r.netProfit < 0 ? "row-loss" : ""}>
                      <td className="td-product">{r.productName}</td>
                      <td className="td-mono">{r.sku}</td>
                      <td style={{ textTransform: "capitalize" }}>{r.marketplace}</td>
                      <td>₹{r.sellingPrice.toFixed(0)}</td>
                      <td>₹{r.productCost.toFixed(0)}</td>
                      <td className="text-loss">₹{r.totalFees.toFixed(0)}</td>
                      <td className={r.netProfit >= 0 ? "text-profit" : "text-loss"}>
                        ₹{r.netProfit.toFixed(0)}
                      </td>
                      <td>{r.margin.toFixed(1)}%</td>
                      <td>{r.roi.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <section className="calc-info-section">
          <h2>Bulk Calculator Format Guide</h2>
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <strong>📋 CSV Template</strong>
              <p>Create a CSV with headers: <code>product_name, selling_price, product_cost, weight_grams, category, marketplace</code></p>
            </div>
            <div className="calc-info-card">
              <strong>📊 Excel Support</strong>
              <p>Both .xlsx and .xls formats are supported. Use the same column headers as the CSV format.</p>
            </div>
            <div className="calc-info-card">
              <strong>🔒 100% Private</strong>
              <p>All processing runs in your browser. No product data is sent to any server.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
