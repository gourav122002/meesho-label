'use client';
import type { SummaryMetrics } from '../../../lib/meesho-analyzer/types';

function INR(n: number) {
  const abs = Math.abs(n);
  if (abs >= 10_00_000) return (n < 0 ? '-' : '') + '₹' + (abs / 10_00_000).toFixed(2) + 'L';
  if (abs >= 1_000) return (n < 0 ? '-' : '') + '₹' + (abs / 1_000).toFixed(1) + 'K';
  return (n < 0 ? '-₹' : '₹') + abs.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  badge?: string;
  badgeColor?: string;
}

function StatCard({ icon, label, value, sub, color = 'var(--accent-purple)', badge, badgeColor }: StatCardProps) {
  return (
    <div
      style={{
        padding: '1.1rem 1rem',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--glass-card-shadow)',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        cursor: 'default',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <div style={{ fontSize: '1.25rem' }}>{icon}</div>
        {badge && (
          <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.45rem', borderRadius: '999px', background: (badgeColor || color) + '18', color: badgeColor || color }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)', fontWeight: '800', color, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
  );
}

interface Props {
  summary: SummaryMetrics;
  warnings?: string[];
}

export default function SummaryCards({ summary, warnings }: Props) {
  const profitColor = summary.netProfit >= 0 ? 'var(--success)' : 'var(--danger)';
  const returnColor = summary.overallReturnRate > 25 ? 'var(--danger)' : summary.overallReturnRate > 15 ? 'var(--warning)' : 'var(--success)';

  const dateStr = summary.dateRange.from && summary.dateRange.to
    ? `${summary.dateRange.from.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — ${summary.dateRange.to.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    : 'All time';

  return (
    <div>
      <div style={{ marginBottom: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>📊 Performance Overview</h2>
        <span style={{ padding: '0.2rem 0.65rem', borderRadius: '999px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '0.72rem', fontWeight: '600' }}>
          📅 {dateStr}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem',
      }}>
        <StatCard
          icon="📦"
          label="Total Orders"
          value={summary.totalOrders.toLocaleString('en-IN')}
          sub={`${summary.deliveredOrders} delivered (${summary.deliveredRate}%)`}
          color="var(--text-primary)"
        />

        <StatCard
          icon="💰"
          label="Gross Sales"
          value={INR(summary.grossSales)}
          sub={`Delivered: ${INR(summary.deliveredGrossSales)}`}
          color="var(--accent-purple)"
        />

        <StatCard
          icon="🏦"
          label="Meesho Bank Payout"
          value={INR(summary.totalSettlementAmount)}
          sub="Final settlement"
          color="#0284c7"
        />

        <StatCard
          icon={summary.netProfit >= 0 ? '📈' : '📉'}
          label="Net Profit"
          value={INR(summary.netProfit)}
          sub={`${summary.netProfitMargin}% Net margin`}
          color={profitColor}
        />

        <StatCard
          icon="🔄"
          label="Customer Returns"
          value={`${summary.customerReturns} (${summary.customerReturnRate}%)`}
          sub={`${INR(summary.totalReturnShippingDeducted)} return fee`}
          color={summary.customerReturnRate > 15 ? 'var(--danger)' : 'var(--warning)'}
          badge={summary.customerReturnRate > 20 ? 'HIGH' : undefined}
          badgeColor="var(--danger)"
        />

        <StatCard
          icon="🚚"
          label="Courier RTO"
          value={`${summary.rtoOrders} (${summary.rtoRate}%)`}
          sub="Undelivered at doorstep"
          color={summary.rtoRate > 20 ? 'var(--warning)' : 'var(--text-secondary)'}
        />

        <StatCard
          icon="📢"
          label="Meesho Ads"
          value={INR(summary.totalAdsCost)}
          sub="Campaign spend"
          color="var(--warning)"
        />

        <StatCard
          icon="🧾"
          label="TCS & TDS Deducted"
          value={INR(Math.abs(summary.totalTCS) + Math.abs(summary.totalTDS))}
          sub="100% Tax credit claimable"
          color="var(--success)"
        />
      </div>

      {/* Critical Alert Banner */}
      {Math.abs(summary.totalReturnShippingDeducted) > 1000 && (
        <div style={{
          marginTop: '0.875rem', padding: '0.75rem 1rem',
          borderRadius: '10px', background: 'var(--danger-bg)',
          border: '1px solid var(--danger)', display: 'flex', gap: '0.75rem', alignItems: 'center',
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
            <strong style={{ color: 'var(--danger)' }}>Heavy Return Shipping Deductions: {INR(summary.totalReturnShippingDeducted)} lost.</strong>
            {' '}Check the <strong>Bad Catalog</strong> tab to pause the SKUs causing these return penalties.
          </div>
        </div>
      )}
    </div>
  );
}
