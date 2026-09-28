"use client";

import { useState, useMemo } from "react";
import type { ProductMetrics } from "../../../lib/meesho-analyzer/types";

interface Props {
  products: ProductMetrics[];
  onCostChange?: (sku: string, cost: number) => void;
  onBulkCostChange?: (updates: Record<string, number>) => void;
}

const REC_CONFIG = {
  remove:  { label: "Remove", cls: "rec-badge-remove", icon: "🚨" },
  pause:   { label: "Pause",  cls: "rec-badge-pause",  icon: "⏸️" },
  fix:     { label: "Fix",    cls: "rec-badge-fix",    icon: "🔧" },
  scale:   { label: "Scale",  cls: "rec-badge-scale",  icon: "🚀" },
  monitor: { label: "Monitor",cls: "rec-badge-monitor",icon: "👀" },
  ok:      { label: "OK",     cls: "rec-badge-ok",     icon: "✓" },
} as const;

type SortKey = "totalOrders" | "returnRate" | "grossSales" | "netProfit" | "unitCost";

function fmtCurrency(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function ProductTable({ products, onCostChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("totalOrders");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [editingCosts, setEditingCosts] = useState<Record<string, string>>({});
  const PAGE_SIZE = 15;

  function toggleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir("desc");
    }
    setPage(0);
  }

  const sorted = useMemo(() => {
    const f = filter.toLowerCase().trim();
    const filtered = products.filter(
      (p) =>
        p.productName.toLowerCase().includes(f) ||
        p.sku.toLowerCase().includes(f) ||
        p.category.toLowerCase().includes(f) ||
        (p.catalogId && p.catalogId.toLowerCase().includes(f))
    );
    return filtered.sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [products, sortKey, sortDir, filter]);

  const pages = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const visible = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function SortIcon({ k }: { k: SortKey }) {
    if (k !== sortKey) return <span className="sort-icon-neutral">⇅</span>;
    return <span className="sort-icon-active">{sortDir === "asc" ? "▲" : "▼"}</span>;
  }

  function handleCostBlur(sku: string) {
    const val = parseFloat(editingCosts[sku] ?? "");
    if (!isNaN(val) && val >= 0) {
      onCostChange?.(sku, val);
    }
    setEditingCosts((prev) => {
      const n = { ...prev };
      delete n[sku];
      return n;
    });
  }

  return (
    <div className="product-table-wrap">
      <div className="product-table-toolbar">
        <div className="product-filter-box">
          <span className="search-icon">🔍</span>
          <input
            className="product-filter-input"
            type="search"
            placeholder="Search by Product Name, SKU, Catalog ID, Category..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
            id="product-filter"
          />
          {filter && (
            <button
              type="button"
              className="filter-clear-btn"
              onClick={() => {
                setFilter("");
                setPage(0);
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="product-table-meta">
          <span className="product-count-badge">
            <strong>{sorted.length}</strong> {sorted.length === 1 ? "SKU" : "SKUs"}
          </span>
        </div>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: 220 }}>Product / SKU</th>
              <th className="th-sortable th-right" onClick={() => toggleSort("totalOrders")}>
                Orders <SortIcon k="totalOrders" />
              </th>
              <th className="th-sortable th-center" onClick={() => toggleSort("returnRate")}>
                Return % <SortIcon k="returnRate" />
              </th>
              <th className="th-sortable th-right" onClick={() => toggleSort("grossSales")}>
                Gross Sales <SortIcon k="grossSales" />
              </th>
              <th className="th-right">Settlement</th>
              <th className="th-sortable th-right" onClick={() => toggleSort("unitCost")}>
                Unit Cost <SortIcon k="unitCost" />
              </th>
              <th className="th-sortable th-right" onClick={() => toggleSort("netProfit")}>
                Net Profit <SortIcon k="netProfit" />
              </th>
              <th className="th-center" style={{ minWidth: 130 }}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "32px 16px", color: "#64748b" }}>
                  No matching SKUs found for &ldquo;{filter}&rdquo;
                </td>
              </tr>
            ) : (
              visible.map((p) => {
                const rec = REC_CONFIG[p.recommendation] ?? REC_CONFIG.ok;
                const isEditing = editingCosts[p.sku] !== undefined;
                return (
                  <tr key={p.sku} className={p.netProfit < 0 ? "row-loss" : ""}>
                    <td className="td-product">
                      <div className="product-name-text" title={p.productName}>
                        {p.productName}
                      </div>
                      <div className="td-mono">
                        <span className="sku-code">{p.sku}</span>
                        {p.catalogId && <span className="sku-tag">Catalog #{p.catalogId}</span>}
                      </div>
                    </td>
                    <td className="td-right">
                      <strong>{p.totalOrders}</strong>
                      <div className="cell-sub">{p.deliveredOrders} delivered</div>
                    </td>
                    <td className="td-center">
                      <span
                        className={`rate-badge ${
                          p.returnRate > 25 ? "rate-bad" : p.returnRate > 10 ? "rate-warn" : "rate-good"
                        }`}
                      >
                        {p.returnRate.toFixed(0)}%
                      </span>
                      <div className="cell-sub">
                        {p.customerReturnRate.toFixed(0)}% CR · {p.rtoRate.toFixed(0)}% RTO
                      </div>
                    </td>
                    <td className="td-right font-medium">{fmtCurrency(p.grossSales)}</td>
                    <td className={`td-right ${p.totalSettlement < 0 ? "text-loss" : "text-profit"}`}>
                      {fmtCurrency(p.totalSettlement)}
                    </td>
                    <td className="td-right">
                      <div className="cost-edit-wrapper">
                        <span className="cost-currency">₹</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          className="cost-edit-input"
                          value={isEditing ? editingCosts[p.sku] : p.unitCost}
                          onFocus={() =>
                            setEditingCosts((prev) => ({ ...prev, [p.sku]: String(p.unitCost) }))
                          }
                          onChange={(e) =>
                            setEditingCosts((prev) => ({ ...prev, [p.sku]: e.target.value }))
                          }
                          onBlur={() => handleCostBlur(p.sku)}
                          title="Click to edit unit product cost (COGS) for this SKU"
                        />
                      </div>
                    </td>
                    <td className={`td-right ${p.netProfit < 0 ? "text-loss" : "text-profit"}`}>
                      <strong>{fmtCurrency(p.netProfit)}</strong>
                      <div className="cell-sub">{p.profitMargin.toFixed(1)}% margin</div>
                    </td>
                    <td className="td-center">
                      <span
                        className={`status-badge ${rec.cls}`}
                        title={p.recommendationReason || p.recommendationAction}
                      >
                        <span className="status-badge-icon">{rec.icon}</span>
                        <span>{rec.label}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="table-pagination">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="pagination-text">
            Page <strong>{page + 1}</strong> of <strong>{pages}</strong>
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
