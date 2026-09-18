import type { Metadata } from "next";

const PUBLISHED = "2025-09-10";
const MODIFIED = "2026-09-18";

export const metadata: Metadata = {
  title: "How to Print 4 Meesho Labels on A4 – Printer Settings & Tips",
  description:
    "Learn how to arrange four Meesho shipping labels on one A4 landscape sheet. Covers the right printer settings, how to avoid scaling issues, and how to check barcodes before a full print run.",
  alternates: { canonical: "https://www.shiplabeltool.com/blog/how-to-print-meesho-labels-4-on-a4" },
  openGraph: {
    title: "How to Print 4 Meesho Labels on A4 – Printer Settings & Tips",
    description: "Printer settings, layout tips, and troubleshooting for printing four Meesho shipping labels on one A4 sheet.",
    url: "https://www.shiplabeltool.com/blog/how-to-print-meesho-labels-4-on-a4",
    type: "article",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Print 4 Meesho Labels on A4 – Printer Settings & Tips",
  description:
    "Learn how to arrange four Meesho shipping labels on one A4 landscape sheet with the right printer settings and barcode-safe scaling.",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  url: "https://www.shiplabeltool.com/blog/how-to-print-meesho-labels-4-on-a4",
  author: { "@type": "Organization", name: "ShipLabelTool", url: "https://www.shiplabeltool.com" },
  publisher: {
    "@type": "Organization",
    name: "ShipLabelTool",
    logo: { "@type": "ImageObject", url: "https://www.shiplabeltool.com/favicon.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.shiplabeltool.com/blog/how-to-print-meesho-labels-4-on-a4" },
};

export default function Page() {
  return (
    <main className="container article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <span className="eyebrow">Printing Guide · 4 min read</span>
      <h1>How to Print 4 Meesho Labels on A4</h1>
      <p className="article-lead">
        Printing four Meesho shipping labels on one A4 sheet is an effective way to cut paper waste and speed up
        your daily dispatch workflow. But getting the settings right matters — the wrong scale or orientation can
        produce labels with unreadable barcodes or labels that do not fit on your sticker sheet. This guide
        walks you through everything.
      </p>

      <h2>Why Print 4 Labels Per A4 Page?</h2>
      <p>
        A standard Meesho bulk order PDF prints one label per page. Since each label occupies roughly half the
        page (the other half is the TAX INVOICE), printing without cropping wastes significant paper. By
        <a href="/meesho-label-cropper"> cropping the labels</a> first and arranging them in a 2×2 grid on A4
        landscape, you get four labels per sheet — saving 75% of your paper compared to the uncropped approach.
      </p>

      <h2>Recommended Sheet Setup for 4-Up Printing</h2>
      <p>Before printing, confirm your setup:</p>
      <ul>
        <li><strong>Paper:</strong> Standard A4 (210 × 297 mm). Works with plain paper, A4 sticker sheets, or self-adhesive label rolls cut to A4.</li>
        <li><strong>Orientation:</strong> Landscape. The A4 page is rotated 90° so it is wider than tall — this is required for the 2×2 grid to fit correctly.</li>
        <li><strong>Layout:</strong> Four label positions in a 2×2 grid (top-left, top-right, bottom-left, bottom-right).</li>
        <li><strong>Margins:</strong> None or minimum (≤ 5 mm on all sides).</li>
        <li><strong>Scale:</strong> 100% (Actual Size). Never use "Fit to page" for shipping labels.</li>
      </ul>

      <h2>Step-by-Step: Generating the 4-Up PDF</h2>

      <h3>1. Crop the Labels First</h3>
      <p>
        Use the <a href="/meesho-label-cropper">Meesho Label Cropper</a> to upload your bulk order PDF. The tool
        automatically detects each TAX INVOICE boundary and crops only the shipping label portion from each page.
      </p>

      <h3>2. Select the 4-Up Layout</h3>
      <p>
        After uploading, choose <strong>4 labels per page</strong> in the layout selector. The tool arranges the
        cropped labels into a 2×2 grid on A4 landscape pages, preserving each label&apos;s aspect ratio so barcodes
        are not stretched or compressed.
      </p>

      <h3>3. Download the PDF</h3>
      <p>
        Click Download. The output is a standard PDF — one A4 landscape page per four labels. If you have 20
        orders, you will get a 5-page PDF.
      </p>

      <h3>4. Open and Print</h3>
      <p>Open the downloaded PDF in any PDF viewer. Use these print settings:</p>
      <ul>
        <li>Paper size: <strong>A4</strong></li>
        <li>Orientation: <strong>Landscape</strong> (or let the PDF force this automatically)</li>
        <li>Scale / Size: <strong>100% or Actual Size</strong></li>
        <li>Margins: <strong>None</strong> (or Minimum if your printer requires it)</li>
        <li>Duplex: <strong>Off</strong> (single-sided)</li>
      </ul>

      <h2>Checking Barcodes Before a Full Batch</h2>
      <p>
        Always print one test sheet and scan each label before running the full batch. Use the Meesho courier
        app or any standard barcode scanner app on your phone. If a barcode fails to scan:
      </p>
      <ul>
        <li>Check that your printer scale is exactly 100%, not 90% or "fit".</li>
        <li>Ensure the paper is aligned correctly in the tray (landscape, not portrait).</li>
        <li>If barcode edges are fading, increase printer ink density or check cartridge levels.</li>
        <li>On inkjet printers, allow the ink to dry for 30 seconds before scanning.</li>
      </ul>

      <h2>Using Adhesive A4 Sticker Sheets</h2>
      <p>
        If you print on adhesive label sheets (sold as &quot;A4 label sheets 4 up&quot; or similar), make sure the label
        positions on the sheet match the 2×2 grid produced by the tool. Most A4 4-up sticker sheets divide the
        page into equal quadrants with a small gap — which matches the tool&apos;s default layout exactly.
      </p>
      <p>
        Some specialty sheets have different gap sizes. If your labels are slightly misaligned, try reducing the
        gap in the layout settings, or switch to printing on plain A4 paper and applying a sticker sheet
        separately.
      </p>

      <h2>For Thermal Label Printers</h2>
      <p>
        If you use a thermal label printer (such as a Zebra or Xprinter), the 4-up A4 layout is not suitable
        because thermal printers use rolls, not A4 sheets. Instead, use the <strong>Test 1 label</strong> option
        in the tool to download a single-label PDF and configure your thermal printer&apos;s label size to match.
        See the <a href="/meesho-label-cropper">Meesho Label Cropper page</a> for more details on thermal
        printing settings.
      </p>
    </main>
  );
}

