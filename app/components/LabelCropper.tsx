"use client";

import { useRef, useState } from "react";
import {
  createA4LandscapePdf,
  createIndividualLabelPdf,
  downloadBytes,
  inspectMeeshoPdf,
  type LabelRegion,
  type LabelsPerPage,
} from "../../lib/pdf-cropper";

interface LayoutConfig {
  value: LabelsPerPage;
  label: string;
  grid: string;
  badge?: string;
  desc: string;
  cols: number;
  rows: number;
}

const LAYOUT_CONFIGS: LayoutConfig[] = [
  {
    value: 4,
    label: "4 Labels / Page",
    grid: "2 × 2",
    badge: "Recommended",
    desc: "Standard size · Easy to cut",
    cols: 2,
    rows: 2,
  },
  {
    value: 6,
    label: "6 Labels / Page",
    grid: "3 × 2",
    badge: "Most Popular",
    desc: "Vertical · Saves 33% paper",
    cols: 3,
    rows: 2,
  },
  {
    value: 8,
    label: "8 Labels / Page",
    grid: "4 × 2",
    badge: "Max Savings",
    desc: "Vertical · Saves 50% paper",
    cols: 4,
    rows: 2,
  },
];

export default function LabelCropper() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [labels, setLabels] = useState<LabelRegion[]>([]);
  const [working, setWorking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [labelsPerPage, setLabelsPerPage] = useState<LabelsPerPage>(4);
  const [showOrderList, setShowOrderList] = useState(false);

  async function processFile(nextFile: File) {
    setWorking(true);
    setError("");
    setMessage("Analyzing Meesho PDF and cropping shipping labels...");
    setLabels([]);

    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      setWorking(false);
      return;
    }
    if (nextFile.size > 35 * 1024 * 1024) {
      setError("File is too large. Please upload a PDF under 35 MB.");
      setWorking(false);
      return;
    }

    try {
      const found = await inspectMeeshoPdf(nextFile);
      setFile(nextFile);
      setLabels(found);
      setMessage(`Found ${found.length} shipping label${found.length === 1 ? "" : "s"}! Select your layout below and download.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this PDF. Make sure it contains Meesho shipping labels.");
    } finally {
      setWorking(false);
    }
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0];
    if (next) void processFile(next);
  }

  async function exportA4() {
    if (!file || !labels.length) return;
    setWorking(true);
    setError("");
    setMessage(`Generating ${labelsPerPage}-up print PDF...`);
    try {
      const bytes = await createA4LandscapePdf(file, labels, labelsPerPage);
      downloadBytes(bytes, `meesho-labels-a4-${labelsPerPage}-up.pdf`);
      setMessage(`Ready! Downloaded ${labels.length} labels in A4 landscape format.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate PDF.");
    } finally {
      setWorking(false);
    }
  }

  async function exportIndividual() {
    if (!file || !labels.length) return;
    setWorking(true);
    setError("");
    setMessage("Generating single test label...");
    try {
      const first = labels[0];
      const bytes = await createIndividualLabelPdf(file, first);
      downloadBytes(bytes, `${first.orderNo || "sample"}-label.pdf`);
      setMessage("Downloaded 1 sample label for test printing.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create sample label.");
    } finally {
      setWorking(false);
    }
  }

  function reset() {
    setFile(null);
    setLabels([]);
    setMessage("");
    setError("");
    setShowOrderList(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const pageCount = labels.length ? Math.ceil(labels.length / labelsPerPage) : 0;
  const currentConfig = LAYOUT_CONFIGS.find((c) => c.value === labelsPerPage) || LAYOUT_CONFIGS[0];

  return (
    <div className="pro-tool-container" id="tool">
      {/* ── SECTION 1: UPLOAD BOX ── */}
      <div className="pro-card">
        <div className="pro-card-header">
          <div className="step-indicator">1</div>
          <div>
            <h2 className="step-title">Upload Meesho PDF</h2>
            <p className="step-subtitle">Select or drop your multi-order PDF downloaded from Meesho</p>
          </div>
        </div>

        {!file ? (
          <label
            className={`pro-dropzone ${dragging ? "drag-active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const next = e.dataTransfer.files?.[0];
              if (next) void processFile(next);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={onInput}
              disabled={working}
            />
            <div className="dropzone-icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <span className="dropzone-main-text">Choose PDF or Drag &amp; Drop here</span>
            <span className="dropzone-sub-text">Meesho labels with tax invoice &bull; Up to 35 MB</span>
            
            <div className="trust-badges">
              <span className="badge-item">🛡️ 100% Private (Runs in Browser)</span>
              <span className="badge-item">⚡ Instant Processing</span>
              <span className="badge-item">🖨️ Print Ready A4</span>
            </div>
          </label>
        ) : (
          <div className="file-ready-bar">
            <div className="file-info-group">
              <div className="file-pdf-icon">PDF</div>
              <div>
                <strong className="file-title">{file.name}</strong>
                <div className="file-meta-row">
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span className="bullet-sep">&bull;</span>
                  <span className="tag-found-count">{labels.length} Labels Detected</span>
                </div>
              </div>
            </div>
            <button className="btn-secondary-light" onClick={reset} disabled={working}>
              Choose Another PDF
            </button>
          </div>
        )}
      </div>

      {/* ── SECTION 2: LAYOUT SELECTION ── */}
      <div className="pro-card">
        <div className="pro-card-header">
          <div className="step-indicator">2</div>
          <div>
            <h2 className="step-title">Select Labels Per A4 Page</h2>
            <p className="step-subtitle">Pick the best grid layout for your paper and thermal/inkjet printer</p>
          </div>
        </div>

        <div className="layout-grid-select">
          {LAYOUT_CONFIGS.map((cfg) => {
            const isSelected = labelsPerPage === cfg.value;
            return (
              <button
                key={cfg.value}
                type="button"
                className={`layout-box ${isSelected ? "selected" : ""}`}
                onClick={() => setLabelsPerPage(cfg.value)}
                disabled={working}
              >
                {cfg.badge && (
                  <span className={`layout-badge ${cfg.value === 4 ? "badge-rec" : "badge-save"}`}>
                    {cfg.badge}
                  </span>
                )}
                
                {/* Mini Visual Grid Representation */}
                <div className="mini-grid-preview" aria-hidden="true">
                  {Array.from({ length: cfg.value }).map((_, i) => (
                    <span key={i} className="mini-cell" />
                  ))}
                </div>

                <strong className="layout-box-title">{cfg.label}</strong>
                <span className="layout-box-grid">{cfg.grid} Grid</span>
                <span className="layout-box-desc">{cfg.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STATUS / MESSAGES ── */}
      {message && (
        <div className="pro-alert alert-success" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="pro-alert alert-error" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ── SECTION 3: DOWNLOAD & SUMMARY ── */}
      {labels.length > 0 && (
        <div className="pro-card download-section">
          <div className="pro-card-header">
            <div className="step-indicator">3</div>
            <div>
              <h2 className="step-title">Download Print-Ready PDF</h2>
              <p className="step-subtitle">Your PDF will be formatted cleanly in A4 landscape orientation</p>
            </div>
          </div>

          <div className="print-summary-banner">
            <div className="summary-stat">
              <span className="stat-label">Total Shipping Labels</span>
              <strong className="stat-value">{labels.length}</strong>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Layout Chosen</span>
              <strong className="stat-value">{currentConfig.label}</strong>
            </div>
            <div className="summary-stat">
              <span className="stat-label">A4 Sheets Required</span>
              <strong className="stat-value highlight-green">
                {pageCount} Sheet{pageCount === 1 ? "" : "s"}
              </strong>
            </div>
          </div>

          <div className="action-button-group">
            <button
              className="btn-pro-download"
              disabled={working}
              onClick={() => void exportA4()}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>{working ? "Processing PDF..." : `Download A4 PDF (${labels.length} Labels)`}</span>
            </button>
          </div>

          <div className="aux-actions">
            <button
              type="button"
              className="link-button"
              disabled={working}
              onClick={() => void exportIndividual()}
            >
              🖨️ Test 1 label first
            </button>
            <span className="divider">&bull;</span>
            <button
              type="button"
              className="link-button"
              onClick={() => setShowOrderList(!showOrderList)}
            >
              {showOrderList ? "Hide order list ▲" : `View detected orders (${labels.length}) ▼`}
            </button>
            <span className="divider">&bull;</span>
            <button type="button" className="link-button btn-reset-link" onClick={reset}>
              Start over
            </button>
          </div>

          {/* Collapsible Order list */}
          {showOrderList && (
            <div className="orders-table-wrapper">
              <div className="orders-table-header">
                <span>Label #</span>
                <span>Original Page</span>
                <span style={{ textAlign: "right" }}>Order ID</span>
              </div>
              <div className="orders-table-body">
                {labels.map((label, idx) => (
                  <div className="order-row" key={`${label.pageIndex}-${idx}`}>
                    <span className="order-num">#{idx + 1}</span>
                    <span className="order-page">Page {label.pageIndex + 1}</span>
                    <span className="order-id">{label.orderNo || "Ready"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
