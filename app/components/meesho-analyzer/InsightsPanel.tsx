'use client';
import type { Insight, InsightType } from '../../../lib/meesho-analyzer/types';

interface Props {
  insights: Insight[];
}

interface TypeTheme {
  icon: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeBg: string;
}

const TYPE_THEMES: Record<InsightType, TypeTheme> = {
  remove: {
    icon: '🚨',
    label: 'Urgent Action',
    color: 'var(--danger, #dc2626)',
    bg: 'var(--danger-bg, #fff1f2)',
    border: 'rgba(220, 38, 38, 0.35)',
    badgeBg: 'rgba(220, 38, 38, 0.12)',
  },
  pause: {
    icon: '⏸️',
    label: 'Pause Catalog',
    color: 'var(--warning, #d97706)',
    bg: 'var(--warning-bg, #fffbeb)',
    border: 'rgba(217, 119, 6, 0.35)',
    badgeBg: 'rgba(217, 119, 6, 0.12)',
  },
  fix: {
    icon: '🔧',
    label: 'Fix Listing',
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.06)',
    border: 'rgba(2, 132, 199, 0.35)',
    badgeBg: 'rgba(2, 132, 199, 0.12)',
  },
  scale: {
    icon: '🚀',
    label: 'Growth Winner',
    color: 'var(--success, #16a34a)',
    bg: 'var(--success-bg, #f0fdf4)',
    border: 'rgba(22, 163, 74, 0.35)',
    badgeBg: 'rgba(22, 163, 74, 0.12)',
  },
  ads: {
    icon: '📢',
    label: 'Ads Optimization',
    color: 'var(--accent-purple, #7c3aed)',
    bg: 'rgba(124, 58, 237, 0.06)',
    border: 'rgba(124, 58, 237, 0.35)',
    badgeBg: 'rgba(124, 58, 237, 0.12)',
  },
  trend: {
    icon: '📈',
    label: 'Payout Trend',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.06)',
    border: 'rgba(37, 99, 235, 0.35)',
    badgeBg: 'rgba(37, 99, 235, 0.12)',
  },
  geographic: {
    icon: '📍',
    label: 'Location Insight',
    color: '#0891b2',
    bg: 'rgba(8, 145, 178, 0.06)',
    border: 'rgba(8, 145, 178, 0.35)',
    badgeBg: 'rgba(8, 145, 178, 0.12)',
  },
  category: {
    icon: '🏷️',
    label: 'Category Insight',
    color: '#db2777',
    bg: 'rgba(219, 39, 119, 0.06)',
    border: 'rgba(219, 39, 119, 0.35)',
    badgeBg: 'rgba(219, 39, 119, 0.12)',
  },
  info: {
    icon: '💡',
    label: 'Recommendation',
    color: '#4f46e5',
    bg: 'rgba(79, 70, 229, 0.06)',
    border: 'rgba(79, 70, 229, 0.35)',
    badgeBg: 'rgba(79, 70, 229, 0.12)',
  },
};

const PRIORITY_THEME: Record<'high' | 'medium' | 'low', { color: string; bg: string; border: string }> = {
  high: {
    color: 'var(--danger, #dc2626)',
    bg: 'rgba(220, 38, 38, 0.12)',
    border: 'rgba(220, 38, 38, 0.3)',
  },
  medium: {
    color: 'var(--warning, #d97706)',
    bg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.3)',
  },
  low: {
    color: 'var(--success, #16a34a)',
    bg: 'rgba(22, 163, 74, 0.12)',
    border: 'rgba(22, 163, 74, 0.3)',
  },
};

export default function InsightsPanel({ insights }: Props) {
  if (insights.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '14px',
          border: '1px solid var(--border, #e2e8f0)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💡</div>
        <strong style={{ fontSize: '1rem', color: 'var(--text-primary, #0f172a)' }}>
          No actionable insights yet
        </strong>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', marginTop: '0.25rem' }}>
          Upload your Meesho payment report to get automated strategic recommendations.
        </p>
      </div>
    );
  }

  const sorted = [...insights].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '14px',
          border: '1px solid var(--border, #e2e8f0)',
          boxShadow: 'var(--glass-card-shadow, 0 4px 18px rgba(15, 23, 42, 0.04))',
        }}
      >
        <div>
          <h3
            style={{
              fontWeight: '800',
              fontSize: '1.05rem',
              color: 'var(--text-primary, #0f172a)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            💡 Strategic Action Recommendations
          </h3>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>
            Automated intelligence prioritized by profit impact on your Meesho business
          </p>
        </div>
        <span
          style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            background: 'var(--bg-secondary, #f8fafc)',
            border: '1px solid var(--border, #e2e8f0)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary, #475569)',
            fontWeight: '600',
          }}
        >
          <strong style={{ color: 'var(--accent-purple, #7c3aed)' }}>{sorted.length}</strong> Recommendations
        </span>
      </div>

      {/* Insights List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {sorted.map(ins => {
          const theme = TYPE_THEMES[ins.type] ?? TYPE_THEMES.info;
          const pri = PRIORITY_THEME[ins.priority] ?? PRIORITY_THEME.medium;

          return (
            <div
              key={ins.id}
              style={{
                borderRadius: '14px',
                background: theme.bg,
                border: `1.5px solid ${theme.border}`,
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.07)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.03)';
              }}
            >
              {/* Card Top */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <span
                  style={{
                    fontSize: '1.4rem',
                    lineHeight: 1,
                    padding: '0.45rem',
                    borderRadius: '10px',
                    background: 'var(--bg-card, #ffffff)',
                    border: `1px solid ${theme.border}`,
                    flexShrink: 0,
                  }}
                >
                  {theme.icon}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    {/* Priority Badge */}
                    <span
                      style={{
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: pri.color,
                        background: pri.bg,
                        border: `1px solid ${pri.border}`,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {ins.priority} Priority
                    </span>

                    {/* Type Label */}
                    <span
                      style={{
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        color: theme.color,
                        background: theme.badgeBg,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      {theme.label}
                    </span>

                    {/* Value Tag */}
                    {ins.value && (
                      <span
                        style={{
                          padding: '0.15rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          color: theme.color,
                          background: 'var(--bg-card, #ffffff)',
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        {ins.value}
                      </span>
                    )}
                  </div>

                  <strong
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--text-primary, #0f172a)',
                      lineHeight: 1.3,
                      display: 'block',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {ins.title}
                  </strong>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary, #334155)',
                  lineHeight: 1.55,
                  margin: 0,
                  paddingLeft: '2.8rem',
                }}
              >
                {ins.description}
              </p>

              {/* Affected SKUs */}
              {ins.affectedSkus && ins.affectedSkus.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    flexWrap: 'wrap',
                    paddingLeft: '2.8rem',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', fontWeight: '700' }}>
                    Affected SKUs:
                  </span>
                  {ins.affectedSkus.slice(0, 5).map((sku, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        background: 'var(--bg-card, #ffffff)',
                        border: '1px solid var(--border, #e2e8f0)',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: 'var(--accent-purple, #7c3aed)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {sku}
                    </span>
                  ))}
                  {ins.affectedSkus.length > 5 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>
                      +{ins.affectedSkus.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Bar */}
              {ins.actionLabel && (
                <div
                  style={{
                    marginTop: '0.2rem',
                    marginLeft: '2.8rem',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-card, #ffffff)',
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: theme.color }}>
                    👉 Recommended Next Step:
                  </span>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary, #0f172a)' }}>
                    {ins.actionLabel}
                  </strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
