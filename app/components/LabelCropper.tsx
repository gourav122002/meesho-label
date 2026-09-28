"use client";

import { useRef, useState } from "react";
import {
  createA4Pdf,
  createIndividualLabelPdf,
  downloadBytes,
  inspectMeeshoPdf,
  type LabelRegion,
  type LabelsPerPage,
} from "../../lib/pdf-cropper";

interface LayoutConfig {
  value: LabelsPerPage;
  label: string;
  gridPortrait: string;
  gridLandscape: string;
  badge?: string;
  descPortrait: string;
  descLandscape: string;
}

const LAYOUT_CONFIGS: LayoutConfig[] = [
  {
    value: 4,
    label: "4 Labels / Page",
    gridPortrait: "2 × 2",
    gridLandscape: "2 × 2",
    badge: "Recommended",
    descPortrait: "Standard size • Easy to cut with scissors",
    descLandscape: "Standard size • Easy to cut with scissors",
  },
  {
    value: 6,
    label: "6 Labels / Page",
    gridPortrait: "2 × 3",
    gridLandscape: "3 × 2",
    badge: "Most Popular",
    descPortrait: "Portrait 2×3 grid • Saves 33% paper",
    descLandscape: "Landscape 3×2 grid • Saves 33% paper",
  },
  {
    value: 8,
    label: "8 Labels / Page",
    gridPortrait: "2 × 4",
    gridLandscape: "4 × 2",
    badge: "Max Savings",
    descPortrait: "Portrait 2×4 grid • Saves 50% paper",
    descLandscape: "Landscape 4×2 grid • Saves 50% paper",
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

  const orientation = "portrait" as const;
  const [selectedLayout, setSelectedLayout] = useState<LabelsPerPage>(4);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  async function handleFileSelect(selected: File) {
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }
    setError("");
    setMessage("");
    setFile(selected);
    setWorking(true);

    try {
      const detected = await inspectMeeshoPdf(selected);

      if (detected.length === 0) {
        setError(
          "Could not detect shipping labels in this PDF. Please check if it is a valid marketplace shipping label file."
        );
        setLabels([]);
      } else {
        setLabels(detected);
        // setMessage(`Successfully detected ${detected.length} shipping label${detected.length === 1 ? "" : "s"}.`);
      }
    } catch (e) {
      setError("Error processing PDF: " + String(e));
      setLabels([]);
    } finally {
      setWorking(false);
    }
  }

  async function downloadA4() {
    if (!file || labels.length === 0) return;
    setDownloadingFormat("a4");
    // Derive orientation at call time to avoid stale closure.
    // 6-up always uses landscape A4 (3×2 grid); 4-up and 8-up use portrait A4.
    const pageOrientation = selectedLayout === 6 ? "portrait" : "portrait";
    try {
      const result = await createA4Pdf(file, labels, selectedLayout, pageOrientation);
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBytes(result, `${baseName}-A4-${orientation}-${selectedLayout}up.pdf`);
    } catch (e) {
      alert("Error generating A4 PDF: " + String(e));
    } finally {
      setDownloadingFormat(null);
    }
  }

  async function downloadIndividual() {
    if (!file || labels.length === 0) return;
    setDownloadingFormat("individual");
    try {
      for (let i = 0; i < labels.length; i++) {
        const result = await createIndividualLabelPdf(file, labels[i]);
        const baseName = file.name.replace(/\.pdf$/i, "");
        const labelNum = String(i + 1).padStart(2, "0");
        downloadBytes(result, `${baseName}-label-${labelNum}.pdf`);
      }
    } catch (e) {
      alert("Error generating Thermal PDF: " + String(e));
    } finally {
      setDownloadingFormat(null);
    }
  }

  return (
    <div className="label-cropper-card">
      {/* Upload area */}
      <div
        className={`drop-area ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFileSelect(f);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
          }}
        />

        <div className="drop-icon">
          {working ? (
            <div className="spinner" />
          ) : file ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </div>

        <div className="drop-title">
          {file ? file.name : "Select or Drop Marketplace Shipping Labels PDF"}
        </div>
        <div className="drop-subtitle">
          {working
            ? "Analyzing and detecting label crop bounds..."
            : file
              ? `${(file.size / 1024).toFixed(0)} KB • Click to choose a different PDF`
              : "Supports Meesho, Flipkart, and Amazon shipping label PDFs"}
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginTop: 16 }}>⚠️ {error}</div>}
      {message && <div className="alert alert-success" style={{ marginTop: 16 }}>✓ {message}</div>}

      {labels.length > 0 && (
        <div className="crop-controls-section" style={{ marginTop: 24 }}>

          {/* Layout chooser */}
          <div className="section-subtitle">Choose A4 Print Layout:</div>
          <div className="layout-options-grid">
            {LAYOUT_CONFIGS.map((cfg) => {
              const isSelected = selectedLayout === cfg.value;
              const gridLabel = orientation === "portrait" ? cfg.gridPortrait : cfg.gridLandscape;
              const descLabel = orientation === "portrait" ? cfg.descPortrait : cfg.descLandscape;
              return (
                <div
                  key={cfg.value}
                  className={`layout-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedLayout(cfg.value)}
                >
                  {cfg.badge && <span className="layout-badge">{cfg.badge}</span>}
                  <div className="layout-card-title">{cfg.label}</div>
                  <div className="layout-card-grid">{gridLabel} Grid</div>
                  <div className="layout-card-desc">{descLabel}</div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="download-actions-grid" style={{ marginTop: 20 }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={downloadA4}
              disabled={downloadingFormat !== null}
            >
              {downloadingFormat === "a4" ? "Download Shipping Label PDF..." : `📥 Download Shipping Label PDF `}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={downloadIndividual}
              disabled={downloadingFormat !== null}
            >
              {downloadingFormat === "individual" ? "Generating..." : "🏷️ Download Thermal 4×6 Labels"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
