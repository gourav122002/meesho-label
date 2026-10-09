'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  AnalysisResult,
  MeeshoOrderRow,
  MeeshoAdDeduction,
} from '../../lib/meesho-analyzer/types';
import type { ReturnSheetRow } from '../../lib/meesho-analyzer/returnParser';
import UploadZone from '../components/meesho-analyzer/UploadZone';
import SummaryCards from '../components/meesho-analyzer/SummaryCards';
import ProductTable from '../components/meesho-analyzer/ProductTable';
import BadCatalogAlert from '../components/meesho-analyzer/BadCatalogAlert';
import ReturnAnalysis from '../components/meesho-analyzer/ReturnAnalysis';
import ProfitChart from '../components/meesho-analyzer/ProfitChart';
import CategoryChart from '../components/meesho-analyzer/CategoryChart';
import InsightsPanel from '../components/meesho-analyzer/InsightsPanel';
import ExportPanel from '../components/meesho-analyzer/ExportPanel';

type Tab = 'summary' | 'products' | 'badCatalog' | 'returns' | 'chart' | 'catalogs' | 'insights' | 'export';

const TABS: { id: Tab; label: string; icon: string; badgeKey?: 'bad' | 'returns' }[] = [
  { id: 'summary', label: 'Summary', icon: '📊' },
  { id: 'products', label: 'SKU Margins', icon: '📦' },
  { id: 'badCatalog', label: 'Bad Catalog', icon: '🎯', badgeKey: 'bad' },
  { id: 'returns', label: 'Returns vs RTO', icon: '🔄', badgeKey: 'returns' },
  { id: 'chart', label: 'Payout Chart', icon: '📈' },
  { id: 'catalogs', label: 'Catalogs', icon: '🏷️' },
  { id: 'insights', label: 'Insights', icon: '💡' },
  { id: 'export', label: 'Export', icon: '🕹️' },
];

export default function PaymentAnalyzerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawOrders, setRawOrders] = useState<MeeshoOrderRow[] | null>(null);
  const [rawAds, setRawAds] = useState<MeeshoAdDeduction[]>([]);
  const [rawReturns, setRawReturns] = useState<ReturnSheetRow[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [filename, setFilename] = useState('meesho-analysis');

  const attachReturnInputRef = useRef<HTMLInputElement>(null);

  // Interactive COGS settings
  const [defaultCostPct, setDefaultCostPct] = useState<number>(40);
  const [customSkuCosts, setCustomSkuCosts] = useState<Record<string, number>>({});
  const [packagingCost, setPackagingCost] = useState<number>(0);

  const recompute = useCallback(
    async (
      orders: MeeshoOrderRow[],
      ads: MeeshoAdDeduction[],
      warns: string[],
      costs: Record<string, number>,
      costPct: number,
      packCost: number,
      returnRows: ReturnSheetRow[] = []
    ) => {
      const { analyzeSheet } = await import('../../lib/meesho-analyzer/analyze');
      const res = analyzeSheet(orders, ads, warns, orders.length, 0, {
        customSkuCosts: costs,
        defaultUnitCostPct: costPct,
        packagingCostPerOrder: packCost,
        returnRows,
      });
      setAnalysis(res);
    },
    []
  );

  // Handle sample data
  useEffect(() => {
    const handler = async () => {
      setLoading(true);
      setError(null);
      try {
        const { generateSampleData } = await import('../../lib/meesho-analyzer/parser');
        const { generateSampleReturnRows } = await import('../../lib/meesho-analyzer/returnParser');
        const { orderRows, adsDeductions } = generateSampleData();
        const sampleReturns = generateSampleReturnRows();

        setRawOrders(orderRows);
        setRawAds(adsDeductions);
        setRawReturns(sampleReturns);

        const sampleWarns = ['ℹ️ Showing realistic sample data. Upload your Meesho payment XLSX & Return CSV for your real figures.'];
        setWarnings(sampleWarns);
        setFilename('meesho-sample-analysis');

        await recompute(orderRows, adsDeductions, sampleWarns, {}, defaultCostPct, packagingCost, sampleReturns);
        setActiveTab('summary');
      } catch (e) {
        setError('Failed to load sample data: ' + String(e));
      } finally {
        setLoading(false);
      }
    };
    window.addEventListener('meesho-load-sample', handler);
    return () => window.removeEventListener('meesho-load-sample', handler);
  }, [recompute, defaultCostPct, packagingCost]);

  const handleFile = useCallback(
    async (paymentFile: File, returnFile?: File) => {
      setLoading(true);
      setError(null);
      try {
        const { parseMeeshoSheet } = await import('../../lib/meesho-analyzer/parser');
        const parseResult = await parseMeeshoSheet(paymentFile);

        if (parseResult.orderRows.length === 0) {
          setError(
            parseResult.warnings.join(' ') ||
              'Could not find order rows in this file. Please make sure this is a Meesho supplier payment report (XLSX/CSV).'
          );
          return;
        }

        // Parse return sheet if provided
        let returnRows: ReturnSheetRow[] = [];
        if (returnFile) {
          try {
            const { parseReturnSheetFile } = await import('../../lib/meesho-analyzer/returnParser');
            returnRows = await parseReturnSheetFile(returnFile);
          } catch (e) {
            console.warn('Return sheet parse warning:', e);
          }
        }

        setRawOrders(parseResult.orderRows);
        setRawAds(parseResult.adsDeductions);
        setRawReturns(returnRows);
        setWarnings(parseResult.warnings);
        setFilename(paymentFile.name.replace(/\.(xlsx|xls|csv)$/i, ''));

        await recompute(
          parseResult.orderRows,
          parseResult.adsDeductions,
          parseResult.warnings,
          customSkuCosts,
          defaultCostPct,
          packagingCost,
          returnRows
        );

        setActiveTab('summary');
      } catch (e) {
        setError('Error reading file: ' + String(e));
      } finally {
        setLoading(false);
      }
    },
    [recompute, customSkuCosts, defaultCostPct, packagingCost]
  );

  const handleAttachReturnFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !rawOrders) return;
    try {
      setLoading(true);
      const { parseReturnSheetFile } = await import('../../lib/meesho-analyzer/returnParser');
      const returnRows = await parseReturnSheetFile(file);
      setRawReturns(returnRows);
      await recompute(
        rawOrders,
        rawAds,
        warnings,
        customSkuCosts,
        defaultCostPct,
        packagingCost,
        returnRows
      );
      setActiveTab('returns');
    } catch (err) {
      alert('Failed to parse return sheet: ' + String(err));
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleSkuCostChange = (sku: string, cost: number) => {
    const updated = { ...customSkuCosts, [sku]: cost };
    setCustomSkuCosts(updated);
    if (rawOrders) {
      recompute(rawOrders, rawAds, warnings, updated, defaultCostPct, packagingCost, rawReturns);
    }
  };

  const handleBulkCostChange = (updates: Record<string, number>) => {
    const updated = { ...customSkuCosts, ...updates };
    setCustomSkuCosts(updated);
    if (rawOrders) {
      recompute(rawOrders, rawAds, warnings, updated, defaultCostPct, packagingCost, rawReturns);
    }
  };

  const handleDefaultPctChange = (pct: number) => {
    setDefaultCostPct(pct);
    if (rawOrders) {
      recompute(rawOrders, rawAds, warnings, customSkuCosts, pct, packagingCost, rawReturns);
    }
  };

  if (!analysis || loading) {
    return (
      <div className="analyzer-page-container">
        <UploadZone onFile={handleFile} loading={loading} error={error} />
      </div>
    );
  }

  const badCount = analysis.badCatalog.remove.length + analysis.badCatalog.pause.length + analysis.badCatalog.fix.length;

  return (
    <div className="analyzer-page-container">
      <div className="analyzer-results-wrap">
        {/* File status & action bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--glass-card-shadow)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {analysis.summary.totalOrders} Orders Analyzed
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              ({analysis.products.length} SKUs · {analysis.catalogBreakdown.length} Catalogs)
            </span>
            {analysis.returnAnalysis.hasReturnSheetData ? (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(16,185,129,0.12)',
                color: 'var(--success)',
                border: '1px solid rgba(16,185,129,0.25)',
              }}>
                ✓ Real Return Reasons Active
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {!analysis.returnAnalysis.hasReturnSheetData && (
              <button
                onClick={() => attachReturnInputRef.current?.click()}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--warning)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
                title="Upload your Meesho Return Sheet CSV to unlock real buyer return reasons"
              >
                📦 + Add Return Sheet CSV
              </button>
            )}

            <button
              onClick={() => {
                setAnalysis(null);
                setRawOrders(null);
                setRawReturns([]);
                setError(null);
              }}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              ↑ Upload Another File
            </button>
          </div>
        </div>

        {/* Interactive COGS & Profit Setting Bar */}
        <div
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--glass-card-shadow)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>⚙️</span>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Default Product Cost (% of Selling Price):
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {[0, 30, 40, 50, 60].map(pct => (
              <button
                key={pct}
                onClick={() => handleDefaultPctChange(pct)}
                style={{
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  border: '1px solid ' + (defaultCostPct === pct ? 'var(--accent-purple)' : 'var(--border)'),
                  background: defaultCostPct === pct ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: defaultCostPct === pct ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: defaultCostPct === pct ? '800' : '600',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {pct === 0 ? '0% (Payout Only)' : `${pct}% Cost`}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const showBadBadge = tab.badgeKey === 'bad' && badCount > 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {showBadBadge && (
                  <span
                    style={{
                      background: 'var(--danger)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '6px',
                      height: '6px',
                      display: 'inline-block',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Hidden file input for attaching return CSV later */}
        <input
          ref={attachReturnInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleAttachReturnFile}
        />

        {/* Tab Panels */}
        {activeTab === 'summary' && (
          <SummaryCards summary={analysis.summary} warnings={analysis.warnings} />
        )}

        {activeTab === 'products' && (
          <ProductTable
            products={analysis.products}
            onCostChange={handleSkuCostChange}
            onBulkCostChange={handleBulkCostChange}
          />
        )}

        {activeTab === 'badCatalog' && <BadCatalogAlert badCatalog={analysis.badCatalog} />}

        {activeTab === 'returns' && <ReturnAnalysis analysis={analysis.returnAnalysis} />}

        {activeTab === 'chart' && (
          <ProfitChart data={analysis.profitTimeSeries} />
        )}

        {activeTab === 'catalogs' && <CategoryChart catalogs={analysis.catalogBreakdown} />}

        {activeTab === 'insights' && <InsightsPanel insights={analysis.insights} />}

        {activeTab === 'export' && (
          <ExportPanel
            analysis={analysis}
            filename={filename}
          />
        )}
      </div>
    </div>
  );
}
