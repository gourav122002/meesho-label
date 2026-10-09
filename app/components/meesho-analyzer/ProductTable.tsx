'use client';
import { useState, useMemo } from 'react';
import type { ProductMetrics } from '../../../lib/meesho-analyzer/types';

function INR(n: number) {
  const abs = Math.abs(n);
  if (abs >= 100000) return (n < 0 ? '-' : '') + '₹' + (abs / 100000).toFixed(1) + 'L';
  if (abs >= 1000) return (n < 0 ? '-' : '') + '₹' + (abs / 1000).toFixed(1) + 'K';
  return (n < 0 ? '-₹' : '₹') + abs.toFixed(0);
}

type SortKey = keyof ProductMetrics;

interface Props {
  products: ProductMetrics[];
  title?: string;
  showRecommendation?: boolean;
  highlightLoss?: boolean;
  onCostChange?: (sku: string, newCost: number) => void;
  onBulkCostChange?: (costs: Record<string, number>) => void;
}

const REC_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  remove: { bg: 'var(--danger-bg, #fff1f2)', color: 'var(--danger, #dc2626)', icon: '🛑' },
  pause:  { bg: 'var(--warning-bg, #fffbeb)', color: 'var(--warning, #d97706)', icon: '⏸️' },
  fix:    { bg: 'rgba(6,182,212,0.12)', color: '#0284c7', icon: '🔧' },
  scale:  { bg: 'var(--success-bg, #f0fdf4)', color: 'var(--success, #16a34a)', icon: '🚀' },
  monitor:{ bg: 'rgba(124,58,237,0.12)', color: 'var(--accent-purple, #7c3aed)', icon: '👁️' },
  ok:     { bg: 'var(--bg-card, #ffffff)', color: 'var(--text-muted, #64748b)', icon: '✅' },
};

export default function ProductTable({
  products,
  title = 'Products',
  showRecommendation = true,
  highlightLoss = true,
  onCostChange,
  onBulkCostChange,
}: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('totalOrders');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  // Selection state
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  const [batchCostInput, setBatchCostInput] = useState<string>('');

  const filtered = useMemo(() => {
    let data = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.productName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.catalogId.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'desc' ? bv - av : av - bv;
      }
      return sortDir === 'desc'
        ? String(bv).localeCompare(String(av))
        : String(av).localeCompare(String(bv));
    });
    return data;
  }, [products, search, sortKey, sortDir]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Selection helpers
  const allFilteredSelected = filtered.length > 0 && filtered.every(p => selectedSkus.has(p.sku));
  const someFilteredSelected = filtered.some(p => selectedSkus.has(p.sku)) && !allFilteredSelected;

  const toggleSelectRow = (sku: string) => {
    setSelectedSkus(prev => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedSkus(prev => {
        const next = new Set(prev);
        filtered.forEach(p => next.delete(p.sku));
        return next;
      });
    } else {
      setSelectedSkus(prev => {
        const next = new Set(prev);
        filtered.forEach(p => next.add(p.sku));
        return next;
      });
    }
  };

  const selectAllProducts = () => {
    setSelectedSkus(new Set(products.map(p => p.sku)));
  };

  const clearSelection = () => {
    setSelectedSkus(new Set());
  };

  const applyBatchCost = (targetSkus: string[], costVal: number) => {
    if (targetSkus.length === 0) return;
    const updates: Record<string, number> = {};
    targetSkus.forEach(sku => {
      updates[sku] = costVal;
    });

    if (onBulkCostChange) {
      onBulkCostChange(updates);
    } else if (onCostChange) {
      targetSkus.forEach(sku => onCostChange(sku, costVal));
    }
  };

  const handleApplyToSelected = () => {
    const cost = parseFloat(batchCostInput) || 0;
    applyBatchCost(Array.from(selectedSkus), cost);
  };

  const handleApplyToAll = () => {
    const cost = parseFloat(batchCostInput) || 0;
    applyBatchCost(products.map(p => p.sku), cost);
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span style={{ color: sortKey === k ? 'var(--accent-purple, #7c3aed)' : 'var(--text-muted, #64748b)', fontSize: '0.7rem', marginLeft: '3px' }}>
      {sortKey === k ? (sortDir === 'desc' ? '▼' : '▲') : '⇅'}
    </span>
  );

  const thStyle: React.CSSProperties = {
    padding: '0.65rem 0.8rem',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: '0.75rem',
    color: 'var(--text-secondary, #475569)',
    borderBottom: '1px solid var(--border, #e2e8f0)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    background: 'var(--bg-card, #ffffff)',
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.65rem 0.8rem',
    fontSize: '0.8rem',
    borderBottom: '1px solid var(--border, #e2e8f0)',
    color: 'var(--text-primary, #0f172a)',
    whiteSpace: 'nowrap',
  };

  return (
    <div>
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary, #0f172a)', margin: 0 }}>{title}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
            {filtered.length} products · Select checkboxes to set unit cost in bulk
          </span>
        </div>
        <input
          placeholder="🔍 Search SKU, Catalog, Name…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="input-field"
          style={{
            width: '240px',
            padding: '0.45rem 0.75rem',
            fontSize: '0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--border, #e2e8f0)',
            background: 'var(--bg-card, #ffffff)',
            color: 'var(--text-primary, #0f172a)',
            outline: 'none',
          }}
        />
      </div>

      {/* Bulk Unit Cost Action Bar */}
      <div
        style={{
          marginBottom: '0.875rem',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: selectedSkus.size > 0 ? 'rgba(124, 58, 237, 0.06)' : 'var(--bg-card, #ffffff)',
          border: `1px solid ${selectedSkus.size > 0 ? 'var(--accent-purple, #7c3aed)' : 'var(--border, #e2e8f0)'}`,
          boxShadow: 'var(--glass-card-shadow, 0 4px 18px rgba(15, 23, 42, 0.04))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: selectedSkus.size > 0 ? 'var(--accent-purple, #7c3aed)' : 'var(--text-primary, #0f172a)' }}>
            {selectedSkus.size > 0 ? `✓ ${selectedSkus.size} of ${products.length} SKUs Selected` : 'Bulk Cost Setting:'}
          </span>
          {selectedSkus.size > 0 ? (
            <button
              onClick={clearSelection}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #64748b)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0 0.25rem',
              }}
            >
              Clear
            </button>
          ) : (
            <button
              onClick={selectAllProducts}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', borderRadius: '6px' }}
            >
              Select All {products.length} SKUs
            </button>
          )}
        </div>

        {/* Batch Cost input and apply buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #475569)', fontWeight: '600' }}>Cost:</span>
            <input
              type="number"
              min="0"
              placeholder="Unit Cost ₹"
              value={batchCostInput}
              onChange={e => setBatchCostInput(e.target.value)}
              style={{
                width: '100px',
                background: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border, #e2e8f0)',
                borderRadius: '6px',
                padding: '0.3rem 0.5rem',
                color: 'var(--text-primary, #0f172a)',
                fontSize: '0.78rem',
                textAlign: 'right',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleApplyToSelected}
            disabled={selectedSkus.size === 0 || !batchCostInput}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '6px',
              opacity: selectedSkus.size === 0 || !batchCostInput ? 0.5 : 1,
              cursor: selectedSkus.size === 0 || !batchCostInput ? 'not-allowed' : 'pointer',
            }}
          >
            Apply to Selected ({selectedSkus.size})
          </button>

          <button
            onClick={handleApplyToAll}
            disabled={!batchCostInput}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '6px',
              opacity: !batchCostInput ? 0.5 : 1,
              cursor: !batchCostInput ? 'not-allowed' : 'pointer',
            }}
          >
            Set in All ({products.length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg-card, #ffffff)', boxShadow: 'var(--glass-card-shadow, 0 4px 18px rgba(15, 23, 42, 0.04))' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {/* Select All Checkbox */}
                <th style={{ ...thStyle, width: '38px', textAlign: 'center', cursor: 'pointer' }} onClick={toggleSelectAllFiltered}>
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={el => {
                      if (el) el.indeterminate = someFilteredSelected;
                    }}
                    onChange={toggleSelectAllFiltered}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-purple, #7c3aed)', width: '15px', height: '15px' }}
                    title="Select / Deselect all visible SKUs"
                  />
                </th>
                <th style={thStyle} onClick={() => handleSort('sku')}>SKU / Product <SortIcon k="sku" /></th>
                <th style={thStyle} onClick={() => handleSort('totalOrders')}>Orders <SortIcon k="totalOrders" /></th>
                <th style={thStyle} onClick={() => handleSort('grossSales')}>Gross Sales <SortIcon k="grossSales" /></th>
                <th style={thStyle} onClick={() => handleSort('customerReturnRate')}>Cust Return % <SortIcon k="customerReturnRate" /></th>
                <th style={thStyle} onClick={() => handleSort('rtoRate')}>RTO % <SortIcon k="rtoRate" /></th>
                <th style={thStyle} onClick={() => handleSort('returnShippingDeducted')}>Return Fee <SortIcon k="returnShippingDeducted" /></th>
                <th style={thStyle} onClick={() => handleSort('totalSettlement')}>Payout <SortIcon k="totalSettlement" /></th>
                <th style={thStyle} onClick={() => handleSort('unitCost')}>Unit Cost (₹) <SortIcon k="unitCost" /></th>
                <th style={thStyle} onClick={() => handleSort('netProfit')}>Net Profit <SortIcon k="netProfit" /></th>
                <th style={thStyle} onClick={() => handleSort('profitMargin')}>Margin % <SortIcon k="profitMargin" /></th>
                {showRecommendation && <th style={thStyle}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={showRecommendation ? 12 : 11} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted, #64748b)', padding: '2rem' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                paginated.map(p => {
                  const rec = REC_STYLE[p.recommendation] ?? REC_STYLE.ok;
                  const isNegative = p.netProfit < 0;
                  const isSelected = selectedSkus.has(p.sku);

                  return (
                    <tr
                      key={p.sku}
                      style={{
                        background: isSelected
                          ? 'rgba(124,58,237,0.08)'
                          : highlightLoss && isNegative
                          ? 'var(--danger-bg, #fff1f2)'
                          : 'transparent',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = isSelected ? 'rgba(124,58,237,0.12)' : 'rgba(241,245,249,0.7)')}
                      onMouseLeave={e => (e.currentTarget.style.background = isSelected ? 'rgba(124,58,237,0.08)' : highlightLoss && isNegative ? 'var(--danger-bg, #fff1f2)' : 'transparent')}
                    >
                      {/* Row Checkbox */}
                      <td style={{ ...tdStyle, textAlign: 'center', width: '38px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(p.sku)}
                          style={{ cursor: 'pointer', accentColor: 'var(--accent-purple, #7c3aed)', width: '15px', height: '15px' }}
                        />
                      </td>

                      <td style={tdStyle}>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary, #0f172a)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.productName}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted, #64748b)', display: 'flex', gap: '0.4rem', marginTop: '0.1rem' }}>
                          <span>SKU: <strong style={{ color: 'var(--accent-purple, #7c3aed)' }}>{p.sku}</strong></span>
                          {p.catalogId && <span>· Cat: {p.catalogId}</span>}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: '700' }}>{p.totalOrders}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--success, #16a34a)' }}>{p.deliveredOrders} Del</div>
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--accent-purple, #7c3aed)', fontWeight: '700' }}>
                        {INR(p.grossSales)}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: '999px',
                            fontWeight: '700',
                            fontSize: '0.72rem',
                            background: p.customerReturnRate >= 25 ? 'var(--danger-bg, #fff1f2)' : p.customerReturnRate >= 15 ? 'var(--warning-bg, #fffbeb)' : 'var(--success-bg, #f0fdf4)',
                            color: p.customerReturnRate >= 25 ? 'var(--danger, #dc2626)' : p.customerReturnRate >= 15 ? 'var(--warning, #d97706)' : 'var(--success, #16a34a)',
                          }}
                        >
                          {p.customerReturns} ({p.customerReturnRate}%)
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '0.75rem', color: p.rtoRate > 25 ? 'var(--warning, #d97706)' : 'var(--text-secondary, #475569)' }}>
                          {p.rtoOrders} ({p.rtoRate}%)
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: p.returnShippingDeducted < 0 ? 'var(--danger, #dc2626)' : 'var(--text-muted, #64748b)', fontWeight: '600' }}>
                        {INR(p.returnShippingDeducted)}
                      </td>
                      <td style={{ ...tdStyle, color: '#0284c7', fontWeight: '700' }}>
                        {INR(p.totalSettlement)}
                      </td>

                      {/* Unit Cost input with quick 'Set to all selected' helper */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <input
                            type="number"
                            value={p.unitCost || ''}
                            placeholder="Cost ₹"
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              if (onCostChange) onCostChange(p.sku, val);
                            }}
                            style={{
                              width: '70px',
                              background: 'var(--bg-card, #ffffff)',
                              border: '1px solid var(--border, #e2e8f0)',
                              borderRadius: '6px',
                              padding: '0.2rem 0.4rem',
                              color: 'var(--text-primary, #0f172a)',
                              fontSize: '0.75rem',
                              textAlign: 'right',
                              outline: 'none',
                            }}
                          />
                          {p.unitCost > 0 && selectedSkus.size > 1 && isSelected && (
                            <button
                              title={`Set ₹${p.unitCost} to all ${selectedSkus.size} selected SKUs`}
                              onClick={() => applyBatchCost(Array.from(selectedSkus), p.unitCost)}
                              style={{
                                background: 'var(--accent-purple, #7c3aed)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.2rem 0.35rem',
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              ⇊ Set All
                            </button>
                          )}
                        </div>
                      </td>

                      <td style={{ ...tdStyle, fontWeight: '800', color: p.netProfit >= 0 ? 'var(--success, #16a34a)' : 'var(--danger, #dc2626)' }}>
                        {INR(p.netProfit)}
                      </td>
                      <td style={{ ...tdStyle, color: p.profitMargin >= 15 ? 'var(--success, #16a34a)' : p.profitMargin >= 0 ? 'var(--warning, #d97706)' : 'var(--danger, #dc2626)', fontWeight: '700' }}>
                        {p.profitMargin}%
                      </td>
                      {showRecommendation && (
                        <td style={tdStyle}>
                          <span
                            title={p.recommendationReason}
                            style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              fontSize: '0.68rem',
                              fontWeight: '700',
                              background: rec.bg,
                              color: rec.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            {rec.icon} {p.recommendation.toUpperCase()}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.75rem' }}>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} products
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', opacity: page === 0 ? 0.5 : 1, borderRadius: '6px' }}
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', opacity: page === totalPages - 1 ? 0.5 : 1, borderRadius: '6px' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
