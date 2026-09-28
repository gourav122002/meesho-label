"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  title?: string;
  color?: string;
  unit?: string;
}

export default function ProfitChart({
  data,
  title,
  color = "#2563eb",
  unit = "₹",
}: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div className="chart-wrap">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(v: number) => `${unit}${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
          />
          <Tooltip
            formatter={(value) => [`${unit}${Number(value).toFixed(2)}`, "Value"]}
            contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? color : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
