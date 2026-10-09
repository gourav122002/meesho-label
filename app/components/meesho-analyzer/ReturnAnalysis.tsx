'use client';
import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import type {
  ReturnAnalysis as ReturnAnalysisType,
  CatalogReturnEntry,
  RealReturnReasonStat,
  SkuVariationStat,
  CourierRtoStat,
} from '../../../lib/meesho-analyzer/types';

function INR(n: number) {
  const abs = Math.abs(n);
  if (abs >= 100000) return (n < 0 ? '-' : '') + '₹' + (abs / 100000).toFixed(1) + 'L';
  if (abs >= 1000) return (n < 0 ? '-' : '') + '₹' + (abs / 1000).toFixed(1) + 'K';
  return (n < 0 ? '-₹' : '₹') + abs.toFixed(0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-chart-tooltip" style={{ fontSize: '0.8rem', background: 'var(--bg-card, #ffffff)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-primary, #0f172a)' }}>{payload[0].name}</div>
      <div style={{ color: payload[0].payload.color, fontWeight: '700' }}>
        {payload[0].value} orders ({payload[0].payload.percentage}%)
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-chart-tooltip" style={{ fontSize: '0.8rem', background: 'var(--bg-card, #ffffff)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-primary, #0f172a)' }}>SKU: {label}</div>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' ? `${p.value}%` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const SEVERITY = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', badge: '🚨 CRITICAL' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', badge: '⚠️ HIGH' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', badge: '🟡 MEDIUM' },
  low:      { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', badge: '✅ LOW' },
};

const REASON_COLORS: Record<string, string> = {
  'Have size / fit related issues': '#f97316',
  'Received wrong product (different color / size / product)': '#ef4444',
  'Received defective product (stains / damaged / torn)': '#8b5cf6',
  'Have other quality related issues': '#f59e0b',
  "Don't need the product anymore": '#6b7280',
};

function RealReasonChart({ reasons }: { reasons: RealReturnReasonStat[] }) {
  if (reasons.length === 0) return null;
  const short = (r: string) => {
    if (r.includes('size / fit')) return 'Size/Fit';
    if (r.includes('wrong product')) return 'Wrong Product';
    if (r.includes('defective')) return 'Defective';
    if (r.includes('quality')) return 'Quality';
    if (r.includes("Don't need")) return 'Not Needed';
    return r.slice(0, 14) + '…';
  };
  const data = reasons.slice(0, 6).map(r => ({
    name: short(r.reason),
    value: r.count,
    pct: r.percentage,
    color: REASON_COLORS[r.reason] || '#6b7280',
    fullReason: r.reason,
    detail: r.detailedReason,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {data.map(d => (
        <div key={d.name + d.detail}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{d.fullReason}</span>
            <span style={{ color: d.color, fontWeight: '800' }}>{d.pct}%</span>
          </div>
          {d.detail && (
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              └ {d.detail}
            </div>
          )}
          <div style={{ height: '6px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function VariationBadges({ stats }: { stats: SkuVariationStat[] }) {
  if (stats.length === 0) return null;
  const max = Math.max(...stats.map(s => s.total));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
      {stats.slice(0, 8).map(s => {
        const intensity = max > 0 ? s.total / max : 0;
        const bg = intensity > 0.7 ? 'rgba(239,68,68,0.15)' : intensity > 0.4 ? 'rgba(245,158,11,0.12)' : 'var(--bg-secondary)';
        const col = intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : 'var(--text-secondary)';
        return (
          <div key={s.variation} style={{
            padding: '0.2rem 0.6rem', borderRadius: '6px', background: bg,
            fontSize: '0.72rem', fontWeight: '700', color: col, textAlign: 'center',
          }}>
            <div>{s.variation}</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{s.total} returns</div>
          </div>
        );
      })}
    </div>
  );
}

function CourierBadges({ stats }: { stats: CourierRtoStat[] }) {
  if (stats.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
      {stats.map(s => (
        <div key={s.courierPartner} style={{
          padding: '0.25rem 0.65rem', borderRadius: '6px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          fontSize: '0.72rem', color: 'var(--text-secondary)',
        }}>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{s.courierPartner}</span>
          {' '}&nbsp;<span style={{ color: '#ef4444', fontWeight: '700' }}>{s.rtoCount} RTO</span>
          {' '}({s.percentage}%)
        </div>
      ))}
    </div>
  );
}

function CatalogCard({ entry, hasReturnSheetData }: { entry: CatalogReturnEntry; hasReturnSheetData: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY[entry.severity];

  return (
    <div style={{
      borderRadius: '12px', border: `1px solid ${sev.border}`,
      background: sev.bg, overflow: 'hidden', transition: 'box-shadow 0.2s',
    }}>
      {/* Card header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.62rem', fontWeight: '800', padding: '0.15rem 0.5rem',
              borderRadius: '4px', background: sev.color, color: '#fff', letterSpacing: '0.05em',
            }}>{sev.badge}</span>
            {entry.hasRealReasons && (
              <span style={{ fontSize: '0.62rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                📊 REAL DATA
              </span>
            )}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {entry.catalogId}
            </span>
          </div>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {entry.productName}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span style={{ color: '#ef4444', fontWeight: '700' }}>CR: {entry.customerReturnRate}%</span>
            <span style={{ color: '#f59e0b', fontWeight: '700' }}>RTO: {entry.rtoRate}%</span>
            <span style={{ color: 'var(--text-muted)' }}>{entry.totalOrders} orders</span>
            {entry.returnPenaltyCost > 0 && (
              <span style={{ color: '#ef4444', fontWeight: '600' }}>
                Penalty: {INR(entry.returnPenaltyCost)}
              </span>
            )}
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flexShrink: 0, marginTop: '0.15rem' }}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 1rem 1rem', borderTop: `1px solid ${sev.border}` }}>
          <div style={{ paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Real return reasons (from CSV) */}
            {entry.hasRealReasons && entry.realReasons.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  📊 Real Buyer Return Reasons (from Return Sheet)
                </div>
                <RealReasonChart reasons={entry.realReasons} />
              </div>
            )}

            {/* Which sizes return most */}
            {entry.hasRealReasons && entry.variationStats.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  📌 Which Size Returns Most
                </div>
                <VariationBadges stats={entry.variationStats} />
              </div>
            )}

            {/* Courier RTO breakdown */}
            {entry.hasRealReasons && entry.courierStats.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  🚚 Courier RTO Breakdown
                </div>
                <CourierBadges stats={entry.courierStats} />
              </div>
            )}

            {/* Inferred reasons (always shown) */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                {entry.hasRealReasons ? '💡 Additional Analysis' : '🔍 Inferred Return Reasons'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {entry.inferredReasons.map((r, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{r}</div>
                ))}
              </div>
            </div>

            {/* Improvement tips */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: sev.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                🛠️ How to Improve This Catalog
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {entry.improvementTips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <span style={{ color: sev.color, flexShrink: 0 }}>→</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReturnAnalysis({ analysis }: { analysis: ReturnAnalysisType }) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const {
    totalOrders, deliveredCount, customerReturns, rtoCount,
    customerReturnRate, rtoRate, totalReturnRate,
    totalReturnShippingLoss, topCustomerReturnSkus,
    catalogReturnBreakdown, hasReturnSheetData,
    returnReasonSummary, variationStats, courierRtoStats,
  } = analysis;

  const pieData = [
    { name: 'Delivered', value: deliveredCount, percentage: totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0, color: '#10b981' },
    { name: 'Customer Return', value: customerReturns, percentage: customerReturnRate, color: '#ef4444' },
    { name: 'Courier RTO', value: rtoCount, percentage: rtoRate, color: '#f59e0b' },
  ];

  const filteredCatalogs = (catalogReturnBreakdown || []).filter(e =>
    severityFilter === 'all' || e.severity === severityFilter
  );

  const severityCounts = {
    critical: (catalogReturnBreakdown || []).filter(e => e.severity === 'critical').length,
    high:     (catalogReturnBreakdown || []).filter(e => e.severity === 'high').length,
    medium:   (catalogReturnBreakdown || []).filter(e => e.severity === 'medium').length,
    low:      (catalogReturnBreakdown || []).filter(e => e.severity === 'low').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Return Sheet Loaded Badge */}
      {hasReturnSheetData && (
        <div style={{
          padding: '0.6rem 1rem', borderRadius: '10px',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem',
        }}>
          <span style={{ fontSize: '1.1rem' }}>📊</span>
          <div>
            <span style={{ color: '#10b981', fontWeight: '800' }}>Return Sheet Loaded!</span>
            {' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              Showing real buyer-reported return reasons from {returnReasonSummary.reduce((s, r) => s + r.count, 0)} customer returns.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
        {[
          { icon: '🔄', label: 'Total Return Rate', value: `${totalReturnRate}%`, sub: `${customerReturns + rtoCount} of ${totalOrders} orders`, color: totalReturnRate > 25 ? 'var(--danger)' : 'var(--warning)' },
          { icon: '🚨', label: 'Return Penalty Lost', value: INR(totalReturnShippingLoss), sub: `${customerReturns} returns × ~₹175 fee`, color: 'var(--danger)' },
          { icon: '🚚', label: 'Courier RTO Rate', value: `${rtoRate}%`, sub: `${rtoCount} rejected at doorstep`, color: 'var(--warning)' },
          { icon: '✅', label: 'Delivered Rate', value: `${totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0}%`, sub: `${deliveredCount} successful`, color: 'var(--success)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.875rem 1rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: s.color, marginTop: '0.15rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Global Real Return Reason Summary (when return sheet loaded) */}
      {hasReturnSheetData && returnReasonSummary.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Reason breakdown */}
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)' }}>
            <h3 style={{ fontWeight: '700', fontSize: '0.875rem', margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>
              📊 All Return Reasons (Real Data)
            </h3>
            <RealReasonChart reasons={returnReasonSummary} />
          </div>

          {/* Size variation */}
          {variationStats.length > 0 && (
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)' }}>
              <h3 style={{ fontWeight: '700', fontSize: '0.875rem', margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>
                📌 Returns by Size/Variation
              </h3>
              <VariationBadges stats={variationStats} />
              {courierRtoStats.length > 0 && (
                <>
                  <h3 style={{ fontWeight: '700', fontSize: '0.875rem', margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>
                    🚚 Courier RTO Breakdown
                  </h3>
                  <CourierBadges stats={courierRtoStats} />
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '0.875rem', margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>Order Fulfillment Split</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={2}>
                {pieData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '0.875rem', margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>Top Return Rate SKUs</h3>
          {topCustomerReturnSkus.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No customer returns found.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCustomerReturnSkus.slice(0, 6)} layout="vertical" margin={{ left: 5, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="sku" width={80} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="customerReturnRate" name="Customer Return %" fill="#ef4444" radius={[0, 4, 4, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Return Reasons by Catalog */}
      {catalogReturnBreakdown && catalogReturnBreakdown.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
              {hasReturnSheetData ? '📊 Return Reasons by Catalog (Real Data)' : '🔍 Return Analysis by Catalog'}
            </h3>
            {!hasReturnSheetData && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                Upload Return Sheet CSV for real reasons
              </span>
            )}
          </div>

          {/* Severity filter pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => {
              const count = sev === 'all' ? catalogReturnBreakdown.length : severityCounts[sev];
              const cfg = sev === 'all' ? { color: 'var(--text-primary)', border: 'var(--border)', bg: 'var(--bg-card)' } : { color: SEVERITY[sev].color, border: SEVERITY[sev].border, bg: SEVERITY[sev].bg };
              const isActive = severityFilter === sev;
              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  style={{
                    padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    cursor: 'pointer', border: `1px solid ${isActive ? cfg.color : 'var(--border)'}`,
                    background: isActive ? cfg.bg : 'transparent',
                    color: isActive ? cfg.color : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)} ({count})
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filteredCatalogs.map(entry => (
              <CatalogCard key={entry.catalogId} entry={entry} hasReturnSheetData={hasReturnSheetData} />
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      <div style={{ padding: '0.875rem 1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--text-primary)' }}>Customer Returns vs. Courier RTO:</strong><br />
        • <strong style={{ color: '#ef4444' }}>Customer Returns:</strong> Buyer accepted then returned. Meesho charges <strong style={{ color: '#ef4444' }}>₹150–₹175 reverse shipping penalty</strong> per item.<br />
        • <strong style={{ color: '#f59e0b' }}>Courier RTO:</strong> Doorstep rejection/unreachable. No reverse fee charged by Meesho.
        {!hasReturnSheetData && (
          <><br /><br />💡 <strong>Tip:</strong> Upload your <strong>Return Sheet CSV</strong> (Meesho Panel → Returns → Export) alongside the payment sheet to see real buyer-reported return reasons, size breakdown, and courier analysis per catalog.</>
        )}
      </div>
    </div>
  );
}
