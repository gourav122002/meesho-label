"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CatalogMetrics } from "../../../lib/meesho-analyzer/types";

interface Props {
  catalogs: CatalogMetrics[];
}

function fmtCurrency(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function CategoryChart({ catalogs }: Props) {
  if (!catalogs || catalogs.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📊</span>
        <p>No catalog or category data available in this dataset.</p>
      </div>
    );
  }

  const top10 = [...catalogs].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 10);
  const chartData = top10.map((c) => ({
    name: c.name.length > 20 ? `${c.name.slice(0, 20)}...` : c.name,
    fullName: c.name,
    orders: c.totalOrders,
    delivered: c.deliveredOrders,
    returns: c.customerReturns + c.rtoOrders,
    grossSales: Math.round(c.grossSales),
    netProfit: Math.round(c.netProfit),
    returnRate: c.returnRate,
  }));

  return (
    <div className="catalogs-view-container">
      {/* Chart 1: Orders by Catalog */}
      <div className="chart-wrap">
        <div className="chart-header">
          <h3 className="chart-title">Top Catalogs by Order Volume</h3>
          <span className="chart-subtitle">Delivered vs Returned order split for your top 10 catalogs</span>
        </div>
        <div className="chart-responsive-box" style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-35}
                textAnchor="end"
                interval={0}
                dy={6}
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  value,
                  name === "delivered" ? "Delivered Orders" : "Returns + RTOs",
                ]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? item.fullName : label;
                }}
                contentStyle={{
                  borderRadius: 10,
                  fontSize: 13,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
                formatter={(value) =>
                  value === "delivered" ? "Delivered Orders" : "Returns & RTO Orders"
                }
              />
              <Bar
                dataKey="delivered"
                name="delivered"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                stackId="a"
              />
              <Bar
                dataKey="returns"
                name="returns"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Revenue vs Net Profit by Catalog */}
      <div className="chart-wrap" style={{ marginTop: 24 }}>
        <div className="chart-header">
          <h3 className="chart-title">Gross Revenue vs Net Profit by Catalog</h3>
          <span className="chart-subtitle">See which catalogs generate real bottom-line cash</span>
        </div>
        <div className="chart-responsive-box" style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 16, left: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-35}
                textAnchor="end"
                interval={0}
                dy={6}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v: number) =>
                  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`
                }
                width={55}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  fmtCurrency(Number(value)),
                  name === "grossSales" ? "Gross Sales" : "Estimated Net Profit",
                ]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? item.fullName : label;
                }}
                contentStyle={{
                  borderRadius: 10,
                  fontSize: 13,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
                formatter={(value) =>
                  value === "grossSales" ? "Gross Sales (Revenue)" : "Estimated Net Profit"
                }
              />
              <Bar
                dataKey="grossSales"
                name="grossSales"
                fill="#93c5fd"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="netProfit"
                name="netProfit"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Catalog performance table */}
      <div className="table-scroll" style={{ marginTop: 24 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: 200 }}>Catalog Name</th>
              <th className="th-center">SKUs</th>
              <th className="th-right">Total Orders</th>
              <th className="th-center">Return Rate</th>
              <th className="th-right">Gross Sales</th>
              <th className="th-right">Net Profit</th>
              <th className="th-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {catalogs.map((c) => (
              <tr key={c.catalogId} className={c.netProfit < 0 ? "row-loss" : ""}>
                <td className="td-product">
                  <div className="product-name-text">{c.name}</div>
                  <div className="td-mono">Catalog #{c.catalogId}</div>
                </td>
                <td className="td-center">
                  <span className="sku-tag">{c.skuCount} SKUs</span>
                </td>
                <td className="td-right">
                  <strong>{c.totalOrders}</strong>
                  <div className="cell-sub">{c.deliveredOrders} del</div>
                </td>
                <td className="td-center">
                  <span
                    className={`rate-badge ${
                      c.returnRate > 25 ? "rate-bad" : c.returnRate > 10 ? "rate-warn" : "rate-good"
                    }`}
                  >
                    {c.returnRate.toFixed(0)}%
                  </span>
                </td>
                <td className="td-right font-medium">{fmtCurrency(c.grossSales)}</td>
                <td className={`td-right ${c.netProfit < 0 ? "text-loss" : "text-profit"}`}>
                  <strong>{fmtCurrency(c.netProfit)}</strong>
                </td>
                <td className={`td-right ${c.profitMargin < 0 ? "text-loss" : "text-profit"}`}>
                  <strong>{c.profitMargin.toFixed(1)}%</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
