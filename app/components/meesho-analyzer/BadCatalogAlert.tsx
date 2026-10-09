'use client';
import type { ProductMetrics } from '../../../lib/meesho-analyzer/types';

function INR(n: number) {
  const abs = Math.abs(n);
  if (abs >= 100000) return (n < 0 ? '-' : '') + '₹' + (abs / 100000).toFixed(1) + 'L';
  if (abs >= 1000) return (n < 0 ? '-' : '') + '₹' + (abs / 1000).toFixed(1) + 'K';
  return (n < 0 ? '-₹' : '₹') + abs.toFixed(0);
}

interface Section {
  key: 'remove' | 'pause' | 'fix' | 'scale';
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: string;
  actionBg: string;
}

const SECTIONS: Section[] = [
  {
    key: 'remove',
    title: '🛑 Stop & Remove Immediately',
    subtitle: 'High customer return rate causing heavy return fees (~₹175 each). Stop selling to eliminate losses.',
    icon: '🛑',
    color: 'var(--danger)',
    action: 'Stop SKU',
    actionBg: 'var(--danger-bg)',
  },
  {
    key: 'pause',
    title: '⏸️ High Courier RTO (Doorstep Rejections)',
    subtitle: 'High RTO rate before customer delivery. Verify buyer COD / pin code serviceability.',
    icon: '⏸️',
    color: 'var(--warning)',
    action: 'Pause SKU',
    actionBg: 'var(--warning-bg)',
  },
  {
    key: 'fix',
    title: '🔧 Fix Catalog & Sizing',
    subtitle: 'Moderate returns. Update product images, size chart, or fabric description to reduce returns.',
    icon: '🔧',
    color: '#0284c7',
    action: 'Improve Catalog',
    actionBg: 'rgba(2,132,199,0.12)',
  },
  {
    key: 'scale',
    title: '🚀 Scale Up Winning Catalogs',
    subtitle: 'High delivery rate (>65%), low returns (<10%), solid profit. Run Meesho Ads and increase stock.',
    icon: '🚀',
    color: 'var(--success)',
    action: 'Scale with Ads',
    actionBg: 'var(--success-bg)',
  },
];

interface Props {
  badCatalog: {
    remove: ProductMetrics[];
    pause: ProductMetrics[];
    fix: ProductMetrics[];
    scale: ProductMetrics[];
  };
}

function ProductCard({
  product,
  color,
  actionText,
  actionBg,
}: {
  product: ProductMetrics;
  color: string;
  actionText: string;
  actionBg: string;
}) {
  return (
    <div
      style={{
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--glass-card-shadow)',
        transition: 'transform 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '800', fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.productName}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            SKU: <strong style={{ color: 'var(--accent-purple)' }}>{product.sku}</strong> {product.catalogId ? `· Cat: ${product.catalogId}` : ''}
          </div>
        </div>
        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '999px', background: actionBg, color, fontSize: '0.7rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
          {actionText}
        </span>
      </div>

      {/* Metrics strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.5rem', background: 'var(--bg-secondary)', padding: '0.45rem', borderRadius: '8px' }}>
        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>ORDERS</div>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{product.totalOrders}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--success)' }}>{product.deliveredOrders} Del</div>
        </div>

        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>CUST RETURN</div>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: product.customerReturnRate > 20 ? 'var(--danger)' : 'var(--warning)' }}>
            {product.customerReturns} ({product.customerReturnRate}%)
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RTO: {product.rtoOrders}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>RETURN FEE</div>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: product.returnShippingDeducted < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            {INR(product.returnShippingDeducted)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>NET PROFIT</div>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: product.netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {INR(product.netProfit)}
          </div>
        </div>
      </div>

      {/* Reason Box */}
      <div style={{
        fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45,
        padding: '0.35rem 0.55rem', borderRadius: '6px', background: 'var(--bg-card-hover)',
        borderLeft: `3px solid ${color}`,
      }}>
        💡 {product.recommendationReason}
      </div>
    </div>
  );
}

export default function BadCatalogAlert({ badCatalog }: Props) {
  const totalBad = badCatalog.remove.length + badCatalog.pause.length + badCatalog.fix.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Summary Banner */}
      <div style={{
        padding: '0.875rem 1.1rem', borderRadius: '12px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        boxShadow: 'var(--glass-card-shadow)',
        display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '2rem' }}>🎯</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            Catalog Optimization &amp; Action Plan
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>
            {badCatalog.remove.length} SKUs to remove · {badCatalog.pause.length} to pause · {badCatalog.fix.length} to fix · {badCatalog.scale.length} winning SKUs
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { count: badCatalog.remove.length, label: 'Remove', color: 'var(--danger)', bg: 'var(--danger-bg)' },
            { count: badCatalog.pause.length, label: 'Pause', color: 'var(--warning)', bg: 'var(--warning-bg)' },
            { count: badCatalog.fix.length, label: 'Fix', color: '#0284c7', bg: 'rgba(2,132,199,0.12)' },
            { count: badCatalog.scale.length, label: 'Scale Up', color: 'var(--success)', bg: 'var(--success-bg)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: '50px', background: s.bg, padding: '0.3rem 0.55rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: s.color }}>{s.count}</div>
              <div style={{ fontSize: '0.65rem', color: s.color, fontWeight: '700' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(sec => {
        const items = badCatalog[sec.key];
        if (items.length === 0) return null;
        return (
          <div key={sec.key} style={{ padding: '1rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--glass-card-shadow)' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <h3 style={{ fontWeight: '800', fontSize: '0.95rem', color: sec.color, margin: '0 0 0.15rem' }}>{sec.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{sec.subtitle}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {items.map(p => (
                <ProductCard key={p.sku} product={p} color={sec.color} actionText={sec.action} actionBg={sec.actionBg} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
