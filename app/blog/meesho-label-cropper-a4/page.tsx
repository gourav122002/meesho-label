import type { Metadata } from "next";

const PUBLISHED = "2025-09-01";
const MODIFIED = "2026-09-18";

export const metadata: Metadata = {
  title: "How to Crop Meesho Labels and Print 4 on A4 – Step-by-Step Guide",
  description:
    "A complete step-by-step guide to cropping Meesho shipping labels from bulk order PDFs and printing four labels on one A4 landscape sheet. Includes printer settings, tips, and troubleshooting.",
  alternates: { canonical: "https://www.shiplabeltool.com/blog/meesho-label-cropper-a4" },
  openGraph: {
    title: "How to Crop Meesho Labels and Print 4 on A4",
    description: "Step-by-step guide to cropping Meesho shipping labels from PDFs and printing four labels on one A4 sheet.",
    url: "https://www.shiplabeltool.com/blog/meesho-label-cropper-a4",
    type: "article",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Crop Meesho Labels and Print 4 on A4",
  description:
    "A complete step-by-step guide to cropping Meesho shipping labels from bulk order PDFs and printing four labels on one A4 landscape sheet.",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  url: "https://www.shiplabeltool.com/blog/meesho-label-cropper-a4",
  author: { "@type": "Organization", name: "ShipLabelTool", url: "https://www.shiplabeltool.com" },
  publisher: {
    "@type": "Organization",
    name: "ShipLabelTool",
    logo: { "@type": "ImageObject", url: "https://www.shiplabeltool.com/favicon.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.shiplabeltool.com/blog/meesho-label-cropper-a4" },
};

export default function Page() {
  return (
    <main className="container article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <span className="eyebrow">Guide · 5 min read</span>
      <h1>How to Crop Meesho Labels and Print 4 on A4</h1>
      <p className="article-lead">
        When you download a bulk order PDF from the Meesho Supplier Panel, each page contains a shipping label at
        the top and a TAX INVOICE below it. To save paper and reduce printing cost, you can automatically crop
        just the shipping label and arrange four labels on a single A4 landscape page — ready to print in under
        30 seconds.
      </p>

      <h2>Why Print 4 Labels on A4?</h2>
      <p>
        Standard Meesho PDFs are one label per page. Printing them as-is wastes up to 50% of your paper because
        the label occupies only half the page (above the invoice). By cropping and arranging four labels on one
        A4 sheet, you cut your paper usage by 75% compared to printing one label per page.
      </p>
      <ul>
        <li><strong>Less paper</strong> — four labels per sheet instead of one</li>
        <li><strong>Less ink</strong> — no invoice background, only the label content</li>
        <li><strong>Faster dispatch</strong> — print a full day&apos;s orders in minutes</li>
        <li><strong>Works on any printer</strong> — inkjet, laser, or thermal</li>
      </ul>

      <h2>Step-by-Step: Using the Meesho Label Cropper</h2>

      <h3>Step 1 – Download Your Bulk Order PDF from Meesho</h3>
      <p>
        Log in to your <strong>Meesho Supplier Panel</strong>. Go to <em>Orders → Ready to Ship</em>. Select all
        pending orders, then click <strong>Download Labels</strong>. Meesho will generate a PDF where each page
        has a shipping label at the top and a TAX INVOICE below.
      </p>
      <p>
        Important: always use the original PDF downloaded directly from Meesho. Do not print it to PDF, take a
        screenshot, or re-save it — this removes the text layer that the cropper uses to detect the invoice
        boundary.
      </p>

      <h3>Step 2 – Open the Meesho Label Cropper Tool</h3>
      <p>
        Visit <a href="/meesho-label-cropper">shiplabeltool.com/meesho-label-cropper</a>. The tool runs entirely
        in your browser — no account needed, no data is uploaded to any server. Your customer names and addresses
        stay on your device.
      </p>

      <h3>Step 3 – Upload the PDF</h3>
      <p>
        Click <strong>Choose PDF</strong> or drag and drop your Meesho PDF onto the upload area. The tool reads
        every page and automatically detects the <code>TAX INVOICE</code> text marker to find the crop boundary.
      </p>
      <p>
        You will see a count of how many labels were found. If a page is missing the invoice marker, it is
        flagged separately so you can review it before printing.
      </p>

      <h3>Step 4 – Choose Your Layout (4, 6, or 8 Labels per Page)</h3>
      <p>Select how many labels you want per A4 sheet:</p>
      <ul>
        <li><strong>4-up (2×2)</strong> — two columns, two rows. Best for standard A4 sticker sheets.</li>
        <li><strong>6-up (3×2)</strong> — three columns, two rows. Good balance of size and count.</li>
        <li><strong>8-up (4×2)</strong> — four columns, two rows. Maximum paper savings for small labels.</li>
      </ul>

      <h3>Step 5 – Download and Print</h3>
      <p>
        Click <strong>Download PDF</strong>. Open the downloaded file in any PDF reader (Chrome, Adobe Acrobat,
        or the built-in Windows/Mac viewer). Print with these settings:
      </p>
      <ol>
        <li>Paper size: <strong>A4</strong></li>
        <li>Orientation: <strong>Landscape</strong></li>
        <li>Scale: <strong>100% (Actual Size)</strong> — do NOT use Fit to Page</li>
        <li>Margins: <strong>None</strong></li>
      </ol>

      <h2>Printer Settings for Barcodes That Scan Correctly</h2>
      <p>
        Meesho barcodes are typically Code 128 or QR codes embedded in the PDF. Printing at exactly 100% scale
        ensures the barcode dimensions match what the courier scanner expects. If you scale down to "Fit", the
        barcode may still scan, but narrow bars can merge and cause failures — especially on cheaper inkjet
        printers.
      </p>
      <p>
        Always print one test sheet and scan each barcode with your courier app before running the full batch.
      </p>

      <h2>Troubleshooting Common Issues</h2>
      <h3>TAX INVOICE Not Detected</h3>
      <p>
        This usually means you are uploading a file that is not the original Meesho PDF. Screenshots, image PDFs,
        and files re-saved through a print driver all lose the text layer. Download the PDF fresh from the Meesho
        Supplier Panel.
      </p>
      <h3>Labels Look Too Small</h3>
      <p>
        If the label appears very small after printing, check that your printer is not scaling to fit. Set scale
        to 100% in the print dialog.
      </p>
      <h3>Barcode Cut Off at the Edge</h3>
      <p>
        Some printers have a minimum margin they cannot print past. If a barcode is clipped, switch to a printer
        with borderless printing or reduce the label count per page (e.g. from 8-up to 4-up) for larger individual
        labels.
      </p>

      <h2>Why Browser-Based Processing is Better</h2>
      <p>
        Because all processing happens in your browser using JavaScript, your customer data — names, addresses,
        phone numbers — never leaves your device. There is no server upload, no cloud storage, and no privacy
        risk. This also means the tool works offline after the page has loaded, and is completely free with no
        account or subscription.
      </p>
    </main>
  );
}

