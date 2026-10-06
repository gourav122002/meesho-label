/**
 * flipkart-pdf-cropper.ts
 *
 * Detects and crops Flipkart shipping labels from a bulk order PDF.
 *
 * Flipkart label anatomy (top → bottom on each PDF page):
 *   ┌─────────────────────────────────┐  ← label top
 *   │  STD / E-Kart Logistics header  │
 *   │  Order ID / COD / AWB barcode   │
 *   │  Flipkart logo                  │
 *   │  Customer address               │
 *   │  HBD / CPD dates                │
 *   │  Sold By + GSTIN line           │
 *   ├─────────────────────────────────┤  ← CROP HERE (above SKU table)
 *   │  SKU ID | Description | QTY     │  ← discarded
 *   │  bottom barcode / B3 box        │
 *   └─────────────────────────────────┘
 *
 * Strategy: Scan text items for known boundary phrases and take the
 * highest (minimum viewport Y) matching position as the crop line.
 */

export type FlipkartLabelRegion = {
  pageIndex: number;
  pageWidth: number;
  pageHeight: number;
  /** Height (from page top) of the label portion to keep, in PDF points */
  cropHeight: number;
  /** AWB / order number extracted from the label, if found */
  orderNo?: string;
};

type PDFJSModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

let pdfjsPromise: Promise<PDFJSModule> | null = null;

async function getPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return mod;
    });
  }
  return pdfjsPromise;
}

function norm(s: string) {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Text patterns that mark the START of the discarded bottom section.
 * We crop just ABOVE the first match.
 */
const BOTTOM_ANCHORS = [
  "sku id",
  "sku id | description",
  "not for resale",
  "use transparent packaging",
  "fmpc",
];

/**
 * Extract AWB / order number from text items.
 */
function extractFlipkartOrderNo(items: Array<{ str: string }>) {
  const text = items.map((i) => i.str).join(" ");
  const awb = text.match(/AWB\s+No\.?\s*[:\-]?\s*([A-Z0-9]{8,})/i);
  if (awb) return awb[1];
  const od = text.match(/OD\d{10,}/);
  if (od) return od[0];
  return undefined;
}

/**
 * Inspect a Flipkart bulk label PDF and return one FlipkartLabelRegion per page.
 */
export async function inspectFlipkartPdf(file: File): Promise<FlipkartLabelRegion[]> {
  const pdfjs = await getPdfJs();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const task = pdfjs.getDocument({ data: bytes });
  const doc = await task.promise;
  const labels: FlipkartLabelRegion[] = [];

  try {
    for (let pageIndex = 0; pageIndex < doc.numPages; pageIndex++) {
      const page = await doc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();

      const rawItems = content.items as Array<{ str?: string; transform?: number[]; height?: number }>;
      const items = rawItems.filter(
        (item): item is { str: string; transform: number[]; height: number } =>
          typeof item.str === "string" && Array.isArray(item.transform)
      );

      let cropViewportY: number | null = null;

      for (const item of items) {
        const t = norm(item.str);
        const isAnchor = BOTTOM_ANCHORS.some(
          (a) => t === a || t.startsWith(a)
        );
        if (!isAnchor) continue;

        const point = viewport.convertToViewportPoint(
          item.transform[4],
          item.transform[5]
        );
        const topY = Math.max(0, point[1] - Math.max(item.height || 0, 8));

        if (cropViewportY === null || topY < cropViewportY) {
          cropViewportY = topY;
        }
      }

      // Fallback: concatenate all text and search
      if (cropViewportY === null) {
        const fullText = norm(items.map((i) => i.str).join(" "));
        const hasAnchor = BOTTOM_ANCHORS.some((a) => fullText.includes(a));
        if (hasAnchor) {
          cropViewportY = viewport.height * 0.70;
        }
      }

      if (cropViewportY !== null && cropViewportY > 20 && cropViewportY < viewport.height * 0.95) {
        labels.push({
          pageIndex,
          pageWidth: viewport.width,
          pageHeight: viewport.height,
          cropHeight: cropViewportY,
          orderNo: extractFlipkartOrderNo(items),
        });
      }
    }
  } finally {
    await task.destroy();
  }

  if (!labels.length) {
    throw new Error(
      "No Flipkart shipping labels detected. Please upload a valid Flipkart bulk order PDF from Seller Hub."
    );
  }

  return labels;
}

// ─── Layout & PDF generation ────────────────────────────────────────────────

export type LabelsPerPage = 4 | 6 | 8;
export type PageOrientation = "portrait" | "landscape";

interface LayoutConfig {
  cols: number;
  rows: number;
  vertical: boolean;
}

const LAYOUT_MAP_PORTRAIT: Record<LabelsPerPage, LayoutConfig> = {
  4: { cols: 2, rows: 2, vertical: false },
  6: { cols: 2, rows: 3, vertical: false },
  8: { cols: 2, rows: 4, vertical: false },
};

const LAYOUT_MAP_LANDSCAPE: Record<LabelsPerPage, LayoutConfig> = {
  4: { cols: 2, rows: 2, vertical: true },
  6: { cols: 3, rows: 2, vertical: true },
  8: { cols: 4, rows: 2, vertical: true },
};

export async function createFlipkartA4Pdf(
  file: File,
  labels: FlipkartLabelRegion[],
  labelsPerPage: LabelsPerPage = 4,
  orientation: PageOrientation = "portrait"
) {
  const { PDFDocument, degrees } = await import("pdf-lib");
  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const output = await PDFDocument.create();

  const isPortrait = orientation === "portrait";
  const PAGE_W = isPortrait ? 595.28 : 841.89;
  const PAGE_H = isPortrait ? 841.89 : 595.28;

  const layoutMap = isPortrait ? LAYOUT_MAP_PORTRAIT : LAYOUT_MAP_LANDSCAPE;
  const { cols: COLS, rows: ROWS, vertical } = layoutMap[labelsPerPage];

  const MARGIN = 12;
  const GAP = 8;
  const cellW = (PAGE_W - MARGIN * 2 - GAP * (COLS - 1)) / COLS;
  const cellH = (PAGE_H - MARGIN * 2 - GAP * (ROWS - 1)) / ROWS;

  for (let start = 0; start < labels.length; start += labelsPerPage) {
    const page = output.addPage([PAGE_W, PAGE_H]);
    const batch = labels.slice(start, start + labelsPerPage);

    for (let slot = 0; slot < batch.length; slot++) {
      const label = batch[slot];
      const sourcePage = sourceDoc.getPages()[label.pageIndex];
      const pageSize = sourcePage.getSize();

      const top = pageSize.height;
      const bottom = Math.max(0, top - label.cropHeight);

      const embedded = await output.embedPage(sourcePage, {
        left: 0,
        right: pageSize.width,
        bottom,
        top,
      });

      const row = Math.floor(slot / COLS);
      const col = slot % COLS;
      const cellX = MARGIN + col * (cellW + GAP);
      const cellY = MARGIN + (ROWS - 1 - row) * (cellH + GAP);

      if (vertical) {
        const scale = Math.min(cellW / embedded.height, cellH / embedded.width);
        const rw = embedded.height * scale;
        const rh = embedded.width * scale;
        const px = cellX + (cellW - rw) / 2;
        const py = cellY + (cellH - rh) / 2;
        page.drawPage(embedded, {
          x: px + rw,
          y: py,
          width: rh,
          height: rw,
          rotate: degrees(90),
        });
      } else {
        const scale = Math.min(cellW / embedded.width, cellH / embedded.height);
        const width = embedded.width * scale;
        const height = embedded.height * scale;
        const x = cellX + (cellW - width) / 2;
        const y = cellY + (cellH - height) / 2;
        page.drawPage(embedded, { x, y, width, height });
      }
    }
  }

  return output.save({ useObjectStreams: true });
}

export async function createFlipkartIndividualPdf(
  file: File,
  label: FlipkartLabelRegion
) {
  const { PDFDocument } = await import("pdf-lib");
  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const output = await PDFDocument.create();

  const sourcePage = sourceDoc.getPages()[label.pageIndex];
  const pageSize = sourcePage.getSize();
  const top = pageSize.height;
  const bottom = Math.max(0, top - label.cropHeight);

  const embedded = await output.embedPage(sourcePage, {
    left: 0,
    right: pageSize.width,
    bottom,
    top,
  });

  // 4x6 thermal label: 288 x 432 pt
  const THERMAL_W = 288;
  const THERMAL_H = 432;
  const page = output.addPage([THERMAL_W, THERMAL_H]);
  const scale = Math.min(THERMAL_W / embedded.width, THERMAL_H / embedded.height);
  const w = embedded.width * scale;
  const h = embedded.height * scale;
  page.drawPage(embedded, {
    x: (THERMAL_W - w) / 2,
    y: (THERMAL_H - h) / 2,
    width: w,
    height: h,
  });

  return output.save({ useObjectStreams: true });
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
