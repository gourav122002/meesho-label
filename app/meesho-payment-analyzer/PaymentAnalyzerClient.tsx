"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { AnalysisResult } from "../../lib/meesho-analyzer/types";
import UploadZone from "../components/meesho-analyzer/UploadZone";
import SummaryCards from "../components/meesho-analyzer/SummaryCards";
import ProductTable from "../components/meesho-analyzer/ProductTable";
import BadCatalogAlert from "../components/meesho-analyzer/BadCatalogAlert";
import ReturnAnalysis from "../components/meesho-analyzer/ReturnAnalysis";
import ProfitChart from "../components/meesho-analyzer/ProfitChart";
import CategoryChart from "../components/meesho-analyzer/CategoryChart";
import InsightsPanel from "../components/meesho-analyzer/InsightsPanel";
import ExportPanel from "../components/meesho-analyzer/ExportPanel";
import type { MeeshoOrderRow, MeeshoAdDeduction } from "../../lib/meesho-analyzer/types";
import type { ReturnSheetRow } from "../../lib/meesho-analyzer/returnParser";

type Tab = "summary" | "products" | "badCatalog" | "returns" | "chart" | "catalogs" | "insights" | "export";

const TABS: { id: Tab; label: string; icon: string; badgeKey?: "bad" }[] = [
  { id: "summary",    label: "P&L Summary",   icon: "📊" },
  { id: "products",   label: "SKU Margins",   icon: "🏷️" },
  { id: "badCatalog", label: "Bad Catalogs",  icon: "🚨", badgeKey: "bad" },
  { id: "returns",    label: "Returns & RTO", icon: "📦" },
  { id: "chart",      label: "Payout Trends", icon: "📈" },
  { id: "catalogs",   label: "Catalogs",      icon: "📁" },
  { id: "insights",   label: "Insights",      icon: "💡" },
  { id: "export",     label: "Export CSV",    icon: "📥" },
];

export default function PaymentAnalyzerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawOrders, setRawOrders] = useState<MeeshoOrderRow[] | null>(null);
  const [rawAds, setRawAds] = useState<MeeshoAdDeduction[]>([]);
  const [rawReturns, setRawReturns] = useState<ReturnSheetRow[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [filename, setFilename] = useState("meesho-analysis");
  const [defaultCostPct, setDefaultCostPct] = useState(40);
  const [customSkuCosts, setCustomSkuCosts] = useState<Record<string, number>>({});
  const attachReturnInputRef = useRef<HTMLInputElement>(null);

  const recompute = useCallback(
    async (
      orders: MeeshoOrderRow[],
      ads: MeeshoAdDeduction[],
      warns: string[],
      costs: Record<string, number>,
      costPct: number,
      returnRows: ReturnSheetRow[] = []
    ) => {
      const { analyzeSheet } = await import("../../lib/meesho-analyzer/analyze");
      const res = analyzeSheet(orders, ads, warns, orders.length, 0, {
        customSkuCosts: costs,
        defaultUnitCostPct: costPct,
        packagingCostPerOrder: 0,
        returnRows,
      });
      setAnalysis(res);
    },
    []
  );

  // Sample data event handler
  useEffect(() => {
    const handler = async () => {
      setLoading(true);
      setError(null);
      try {
        const { generateSampleData } = await import("../../lib/meesho-analyzer/parser");
        const { generateSampleReturnRows } = await import("../../lib/meesho-analyzer/returnParser");
        const { orderRows, adsDeductions } = generateSampleData();
        const sampleReturns = generateSampleReturnRows();
        setRawOrders(orderRows);
        setRawAds(adsDeductions);
        setRawReturns(sampleReturns);
        const sampleWarns = [
          "Showing sample demonstration data (Women Kurtis Store). Upload your actual Meesho payment XLSX file for real business calculations.",
        ];
        setWarnings(sampleWarns);
        setFilename("meesho-sample-analysis");
        await recompute(orderRows, adsDeductions, sampleWarns, {}, defaultCostPct, sampleReturns);
        setActiveTab("summary");
      } catch (e) {
        setError("Failed to load sample data: " + String(e));
      } finally {
        setLoading(false);
      }
    };
    window.addEventListener("meesho-load-sample", handler);
    return () => window.removeEventListener("meesho-load-sample", handler);
  }, [recompute, defaultCostPct]);

  const handleFile = useCallback(
    async (paymentFile: File, returnFile?: File) => {
      setLoading(true);
      setError(null);
      try {
        const { parseMeeshoSheet } = await import("../../lib/meesho-analyzer/parser");
        const parseResult = await parseMeeshoSheet(paymentFile);
        if (parseResult.orderRows.length === 0) {
          setError(
            parseResult.warnings.join(" ") ||
              "Could not find order rows in this file. Please ensure this is an official Meesho supplier payment report."
          );
          return;
        }
        let returnRows: ReturnSheetRow[] = [];
        if (returnFile) {
          try {
            const { parseReturnSheetFile } = await import("../../lib/meesho-analyzer/returnParser");
            returnRows = await parseReturnSheetFile(returnFile);
          } catch (e) {
            console.warn("Return sheet warning:", e);
          }
        }
        setRawOrders(parseResult.orderRows);
        setRawAds(parseResult.adsDeductions);
        setRawReturns(returnRows);
        setWarnings(parseResult.warnings);
        setFilename(paymentFile.name.replace(/\.(xlsx|xls|csv)$/i, ""));
        await recompute(
          parseResult.orderRows,
          parseResult.adsDeductions,
          parseResult.warnings,
          customSkuCosts,
          defaultCostPct,
          returnRows
        );
        setActiveTab("summary");
      } catch (e) {
        setError("Error reading file: " + String(e));
      } finally {
        setLoading(false);
      }
    },
    [recompute, customSkuCosts, defaultCostPct]
  );

  const handleAttachReturn = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !rawOrders) return;
    try {
      setLoading(true);
      const { parseReturnSheetFile } = await import("../../lib/meesho-analyzer/returnParser");
      const returnRows = await parseReturnSheetFile(file);
      setRawReturns(returnRows);
      await recompute(rawOrders, rawAds, warnings, customSkuCosts, defaultCostPct, returnRows);
      setActiveTab("returns");
    } catch (err) {
      alert("Failed to parse return sheet: " + String(err));
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleSkuCostChange = (sku: string, cost: number) => {
    const updated = { ...customSkuCosts, [sku]: cost };
    setCustomSkuCosts(updated);
    if (rawOrders) {
      recompute(rawOrders, rawAds, warnings, updated, defaultCostPct, rawReturns);
    }
  };

  const handleDefaultPctChange = (pct: number) => {
    setDefaultCostPct(pct);
    if (rawOrders) {
      recompute(rawOrders, rawAds, warnings, customSkuCosts, pct, rawReturns);
    }
  };

  if (!analysis || loading) {
    return <UploadZone onFile={handleFile} loading={loading} error={error} />;
  }

  const badCount =
    analysis.badCatalog.remove.length +
    analysis.badCatalog.pause.length +
    analysis.badCatalog.fix.length;

  return (
    <div className="analyzer-results-wrap">
      {/* Top File Status Bar */}
      <div className="analyzer-status-bar">
        <div className="analyzer-status-left">
          <span className="analyzer-status-icon">✓</span>
          <div className="analyzer-status-meta">
            <strong>{analysis.summary.totalOrders.toLocaleString("en-IN")} Orders Analyzed</strong>
            <span className="analyzer-status-detail">
              ({analysis.products.length} SKUs · {analysis.catalogBreakdown.length} Catalogs)
            </span>
          </div>
          {analysis.returnAnalysis.hasReturnSheetData && (
            <span className="return-sheet-badge">✓ Real Return CSV Active</span>
          )}
        </div>
        <div className="analyzer-status-right">
          {!analysis.returnAnalysis.hasReturnSheetData && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => attachReturnInputRef.current?.click()}
            >
              + Attach Return CSV
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setAnalysis(null);
              setRawOrders(null);
              setRawReturns([]);
              setError(null);
            }}
          >
            Upload New File
          </button>
        </div>
      </div>

      {/* COGS Benchmark Bar */}
      <div className="analyzer-cogs-bar">
        <div className="cogs-bar-left">
          <span className="cogs-bar-icon">⚙️</span>
          <span className="cogs-bar-label">
            Default Product Cost Estimate (% of Selling Price):
          </span>
        </div>
        <div className="cogs-btn-group">
          {[0, 30, 40, 50, 60].map((pct) => (
            <button
              key={pct}
              type="button"
              className={`cogs-btn${defaultCostPct === pct ? " cogs-btn-active" : ""}`}
              onClick={() => handleDefaultPctChange(pct)}
            >
              {pct === 0 ? "0% (Payout Only)" : `${pct}% Cost`}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Tabs Navigation */}
      <div className="analyzer-tabs" role="tablist" aria-label="Analyzer sections">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.badgeKey === "bad" && badCount > 0;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              className={`analyzer-tab${isActive ? " analyzer-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {showBadge && <span className="tab-badge">{badCount}</span>}
            </button>
          );
        })}
      </div>

      {/* Hidden file input for attaching return report */}
      <input
        ref={attachReturnInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleAttachReturn}
      />

      {/* Active Tab Panel */}
      <div className="analyzer-panel">
        {activeTab === "summary" && (
          <SummaryCards summary={analysis.summary} warnings={analysis.warnings} />
        )}
        {activeTab === "products" && (
          <ProductTable products={analysis.products} onCostChange={handleSkuCostChange} />
        )}
        {activeTab === "badCatalog" && (
          <BadCatalogAlert badCatalog={analysis.badCatalog} />
        )}
        {activeTab === "returns" && (
          <ReturnAnalysis analysis={analysis.returnAnalysis} />
        )}
        {activeTab === "chart" && (
          <ProfitChart data={analysis.profitTimeSeries} />
        )}
        {activeTab === "catalogs" && (
          <CategoryChart catalogs={analysis.catalogBreakdown} />
        )}
        {activeTab === "insights" && (
          <InsightsPanel insights={analysis.insights} />
        )}
        {activeTab === "export" && (
          <ExportPanel analysis={analysis} filename={filename} />
        )}
      </div>
    </div>
  );
}
