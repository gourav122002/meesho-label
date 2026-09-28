"use client";

import { useRef, useState, useCallback } from "react";

interface UploadZoneProps {
  onFile: (paymentFile: File, returnFile?: File) => void;
  loading?: boolean;
  error?: string | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function UploadZone({ onFile, loading, error }: UploadZoneProps) {
  const paymentInputRef = useRef<HTMLInputElement>(null);
  const returnInputRef = useRef<HTMLInputElement>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [returnFile, setReturnFile] = useState<File | null>(null);
  const [draggingPayment, setDraggingPayment] = useState(false);
  const [draggingReturn, setDraggingReturn] = useState(false);

  const handlePaymentFileSelect = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext ?? "")) {
      alert("Payment report must be an Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    setPaymentFile(file);
  }, []);

  const handleReturnFileSelect = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv") {
      alert("Return report must be a .csv file.");
      return;
    }
    setReturnFile(file);
  }, []);

  const handleAnalyze = () => {
    if (!paymentFile) {
      alert("Please select your Meesho Payment Report (.xlsx) first.");
      return;
    }
    onFile(paymentFile, returnFile || undefined);
  };

  const loadSampleData = () => {
    window.dispatchEvent(new CustomEvent("meesho-load-sample"));
  };

  if (loading) {
    return (
      <div className="analyzer-loading-state">
        <div className="analyzer-loading-spinner" />
        <h3>Processing Meesho Sheets...</h3>
        <p>Calculating order settlements, return shipping penalties, courier RTOs and SKU margins.</p>
      </div>
    );
  }

  return (
    <div className="analyzer-upload-outer">
      <div className="analyzer-upload-header">
        <span className="analyzer-hero-badge">⚡ Instant 100% Private Browser Analysis</span>
        <h2>Upload Your Meesho Reports</h2>
        <p>
          Upload your <strong>Payment Sheet (.xlsx)</strong> to calculate true net profit and penalties.
          Optionally add your <strong>Return Sheet (.csv)</strong> to unlock real buyer return reasons and courier performance.
        </p>
      </div>

      <div className="analyzer-upload-grid">
        {/* Payment Sheet Drop Card */}
        <div
          className={`analyzer-drop-card${paymentFile ? " drop-card-ready" : ""}${
            draggingPayment ? " drop-card-dragging" : ""
          }`}
          onClick={() => paymentInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingPayment(true);
          }}
          onDragLeave={() => setDraggingPayment(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDraggingPayment(false);
            const f = e.dataTransfer.files[0];
            if (f) handlePaymentFileSelect(f);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && paymentInputRef.current?.click()}
        >
          <div className="drop-card-badge drop-card-badge-required">
            {paymentFile ? "✓ Payment Sheet Ready" : "Step 1: Payment Report (Required)"}
          </div>
          <div className="drop-card-body">
            <span className="drop-card-icon">{paymentFile ? "📊" : "📥"}</span>
            <div>
              <strong className="drop-card-name">
                {paymentFile ? paymentFile.name : "Select Meesho Payment Report"}
              </strong>
              <p className="drop-card-hint">
                {paymentFile
                  ? `File loaded (${formatBytes(paymentFile.size)}) — Click to replace`
                  : "Meesho Supplier Panel → Payments → Download Excel (.xlsx / .csv)"}
              </p>
            </div>
          </div>
          <div className="drop-card-footer">
            <span className="drop-card-cta">
              {paymentFile ? "🔄 Replace File" : "📁 Choose .xlsx / .csv file"}
            </span>
            {paymentFile && (
              <button
                type="button"
                className="drop-card-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setPaymentFile(null);
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Return Sheet Drop Card */}
        <div
          className={`analyzer-drop-card${returnFile ? " drop-card-ready" : ""}${
            draggingReturn ? " drop-card-dragging" : ""
          } drop-card-optional`}
          onClick={() => returnInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingReturn(true);
          }}
          onDragLeave={() => setDraggingReturn(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDraggingReturn(false);
            const f = e.dataTransfer.files[0];
            if (f) handleReturnFileSelect(f);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && returnInputRef.current?.click()}
        >
          <div className="drop-card-badge drop-card-badge-optional">
            {returnFile ? "✓ Return Sheet Attached" : "Step 2: Return Sheet (Optional)"}
          </div>
          <div className="drop-card-body">
            <span className="drop-card-icon">{returnFile ? "📦" : "📑"}</span>
            <div>
              <strong className="drop-card-name">
                {returnFile ? returnFile.name : "Attach Meesho Return CSV"}
              </strong>
              <p className="drop-card-hint">
                {returnFile
                  ? `Attached (${formatBytes(returnFile.size)}) — Real return reasons unlocked!`
                  : "Meesho Supplier Panel → Returns → Export CSV. Unlocks exact buyer feedback & courier RTO."}
              </p>
            </div>
          </div>
          <div className="drop-card-footer">
            <span className="drop-card-cta">
              {returnFile ? "🔄 Replace File" : "📁 Choose .csv file"}
            </span>
            {returnFile && (
              <button
                type="button"
                className="drop-card-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setReturnFile(null);
                }}
              >
                ✕ Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="analyzer-upload-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleAnalyze}
          disabled={!paymentFile}
          id="analyzer-analyze-btn"
        >
          {returnFile
            ? "⚡ Analyze Payment + Return Sheets"
            : paymentFile
            ? "⚡ Analyze Payment Sheet"
            : "Select Payment Sheet Above"}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={loadSampleData}
          id="analyzer-sample-btn"
        >
          ✨ Try Sample Data (Women Kurtis Store)
        </button>
      </div>

      {error && (
        <div className="analyzer-error-banner">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="analyzer-upload-steps">
        {[
          "1. Upload Payment Sheet (.xlsx)",
          "2. Add Return CSV (Optional)",
          "3. Instant P&L, Bad Catalog & Returns Audit",
        ].map((text, i) => (
          <div key={i} className="analyzer-step-badge">
            <span className="step-num">{i + 1}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <input
        ref={paymentInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handlePaymentFileSelect(f);
          e.target.value = "";
        }}
      />
      <input
        ref={returnInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleReturnFileSelect(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
