"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DateSeries } from "../../../lib/meesho-analyzer/types";

interface Props {
  data: DateSeries[];
}

function fmtVal(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(0)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}

export default function ProfitChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📈</span>
        <p>No time-series date data available. Make sure your payment sheet includes order dates.</p>
      </div>
    );
  }

  const tickStep = data.length > 25 ? Math.ceil(data.length / 10) : data.length > 12 ? 2 : 1;
  const maxOrders = Math.max(...data.map((x) => x.orders), 1);

  return (
    <div className="charts-container">
      {/* Daily Payout & Profit Trend Area Chart */}
      <div className="chart-wrap">
        <div className="chart-header">
          <h3 className="chart-title">Daily Settlement & Net Profit Trend</h3>
          <span className="chart-subtitle">Tracks your daily cash payouts vs actual net profit</span>
        </div>
        <div className="chart-responsive-box" style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 20, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="settlementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-35}
                textAnchor="end"
                interval={tickStep - 1}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v: number) => fmtVal(v)}
                width={55}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  fmtVal(Number(value)),
                  name === "settlement"
                    ? "Meesho Settlement"
                    : name === "profit"
                    ? "Estimated Net Profit"
                    : name,
                ]}
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
                  value === "settlement"
                    ? "Meesho Settlement Payout"
                    : value === "profit"
                    ? "Estimated Net Profit"
                    : value
                }
              />
              <Area
                type="monotone"
                dataKey="settlement"
                name="settlement"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#settlementGrad)"
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="profit"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#profitGrad)"
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily order volume timeline */}
      <div className="chart-wrap" style={{ marginTop: 24 }}>
        <div className="chart-header">
          <h3 className="chart-title">Daily Order Fulfillment Volume</h3>
          <span className="chart-subtitle">Delivered vs Returned orders per day</span>
        </div>
        <div className="orders-bar-chart-container">
          <div className="orders-bar-chart">
            {data.map((d, i) => {
              const delivPct = d.orders > 0 ? (d.delivered / d.orders) * 100 : 0;
              const retPct = d.orders > 0 ? (d.returns / d.orders) * 100 : 0;
              const barHeight = Math.max(12, Math.round((d.orders / maxOrders) * 100));
              return (
                <div
                  key={i}
                  className="orders-bar-item"
                  title={`${d.label}: ${d.orders} orders (${d.delivered} delivered, ${d.returns} returns)`}
                >
                  <div className="orders-bar-count">{d.orders}</div>
                  <div className="orders-bar-track" style={{ height: `${barHeight}px` }}>
                    <div className="orders-bar-delivered" style={{ height: `${delivPct}%` }} />
                    <div className="orders-bar-returns" style={{ height: `${retPct}%` }} />
                  </div>
                  <div className="orders-bar-label">{d.label.split(" ")[0]}</div>
                </div>
              );
            })}
          </div>
          <div className="chart-legend" style={{ marginTop: 16 }}>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#2563eb" }} /> Delivered Orders
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#ef4444" }} /> Returns & RTOs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
