export type LabelRegion = {
  pageIndex: number;
  pageWidth: number;
  pageHeight: number;
  cropHeight: number;
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

function normalizeToken(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function extractOrderNo(items: Array<{ str: string }>) {
  const text = items.map((item) => item.str).join(" ");
  const match = text.match(/(?:purchase\s+order\s+no\.?|order\s+no\.?)\s*[:#]?\s*([A-Z0-9_\-]+)/i);
  return match?.[1];
}

export async function inspectMeeshoPdf(file: File): Promise<LabelRegion[]> {
  const pdfjs = await getPdfJs();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const task = pdfjs.getDocument({ data: bytes });
  const doc = await task.promise;
  const labels: LabelRegion[] = [];

  try {
    for (let pageIndex = 0; pageIndex < doc.numPages; pageIndex += 1) {
      const page = await doc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const items = content.items.filter((item): item is typeof item & { str: string; transform: number[]; height: number } =>
        "str" in item && "transform" in item,
      );

      let taxTopViewport: number | null = null;
      for (const item of items) {
        const text = normalizeToken(item.str);
        if (text === "tax invoice" || text.startsWith("tax invoice ") || text === "tax") {
          const point = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
          const top = Math.max(0, point[1] - Math.max(item.height || 0, 8));
          if (taxTopViewport === null || top < taxTopViewport) taxTopViewport = top;
        }
      }

      if (taxTopViewport === null) {
        const combined = normalizeToken(items.map((item) => item.str).join(" "));
        if (combined.includes("tax invoice")) {
          for (const item of items) {
            if (normalizeToken(item.str).startsWith("tax")) {
              const point = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
              taxTopViewport = Math.max(0, point[1] - Math.max(item.height || 0, 8));
              break;
            }
          }
        }
      }

      if (taxTopViewport !== null && taxTopViewport > 20 && taxTopViewport < viewport.height) {
        const cropHeight = taxTopViewport;
        labels.push({
          pageIndex,
          pageWidth: viewport.width,
          pageHeight: viewport.height,
          cropHeight,
          orderNo: extractOrderNo(items),
        });
      }
    }
  } finally {
    await task.destroy();
  }

  if (!labels.length) {
    throw new Error("No TAX INVOICE section was detected. Please use a Meesho PDF where the shipping label appears above the tax invoice.");
  }

  return labels;
}

export type LabelsPerPage = 4 | 6 | 8;

const LAYOUT_MAP: Record<LabelsPerPage, { cols: number; rows: number; vertical: boolean }> = {
  4: { cols: 2, rows: 2, vertical: false }, // 2×2 landscape cells — labels horizontal
  6: { cols: 3, rows: 2, vertical: true  }, // 3×2 portrait  cells — labels rotated vertical
  8: { cols: 4, rows: 2, vertical: true  }, // 4×2 portrait  cells — labels rotated vertical
};

export async function createA4LandscapePdf(file: File, labels: LabelRegion[], labelsPerPage: LabelsPerPage = 4) {
  const { PDFDocument, degrees } = await import("pdf-lib");
  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const output = await PDFDocument.create();

  const { cols: COLS, rows: ROWS, vertical } = LAYOUT_MAP[labelsPerPage];
  // Always A4 landscape (841.89 × 595.28 pt)
  const PAGE_W = 841.8898;
  const PAGE_H = 595.2756;
  const MARGIN = 12;
  const GAP = 8;
  const cellW = (PAGE_W - MARGIN * 2 - GAP * (COLS - 1)) / COLS;
  const cellH = (PAGE_H - MARGIN * 2 - GAP * (ROWS - 1)) / ROWS;

  for (let start = 0; start < labels.length; start += labelsPerPage) {
    const page = output.addPage([PAGE_W, PAGE_H]);
    const batch = labels.slice(start, start + labelsPerPage);

    for (let slot = 0; slot < batch.length; slot += 1) {
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
        // Rotate 90° CCW so label renders in portrait/vertical orientation.
        // After CCW rotation the embedded's original width becomes the rendered height
        // and original height becomes the rendered width.
        // Scale to best-fit cell treating rotated dimensions:
        const scale = Math.min(cellW / embedded.height, cellH / embedded.width);
        const rw = embedded.height * scale; // rendered horizontal extent in the cell
        const rh = embedded.width  * scale; // rendered vertical   extent in the cell

        // Center within cell
        const px = cellX + (cellW - rw) / 2;
        const py = cellY + (cellH - rh) / 2;

        // pdf-lib CCW 90° anchor math:
        //   drawing at (x,y) with w×h, rotated 90° CCW spans x‑h→x horizontally, y→y+w vertically.
        //   So to place rendered box at (px, py) with extent (rw, rh):
        //     x = px + rw,  y = py,  width = rh,  height = rw
        page.drawPage(embedded, {
          x: px + rw,
          y: py,
          width: rh,
          height: rw,
          rotate: degrees(90),
        });
      } else {
        const scale = Math.min(cellW / embedded.width, cellH / embedded.height);
        const width  = embedded.width  * scale;
        const height = embedded.height * scale;
        const x = cellX + (cellW - width)  / 2;
        const y = cellY + (cellH - height) / 2;
        page.drawPage(embedded, { x, y, width, height });
      }
    }
  }

  return output.save({ useObjectStreams: true });
}

export async function createIndividualLabelPdf(file: File, label: LabelRegion) {
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
  const page = output.addPage([embedded.width, embedded.height]);
  page.drawPage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
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
