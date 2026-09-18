import type { Metadata } from "next";

const PUBLISHED = "2025-09-05";
const MODIFIED = "2026-09-18";

export const metadata: Metadata = {
  title: "Meesho Shipping Label with Invoice: How the Cropper Detects and Removes It",
  description:
    "Understand how the Meesho PDF layout combines a shipping label with a TAX INVOICE and how an invoice-aware cropper automatically removes the invoice to produce clean, print-ready labels.",
  alternates: { canonical: "https://www.shiplabeltool.com/blog/meesho-label-with-invoice-cropper" },
  openGraph: {
    title: "Meesho Shipping Label with Invoice: How the Cropper Detects and Removes It",
    description: "Learn how the TAX INVOICE boundary is detected in Meesho PDFs and how to get clean shipping labels without manual cropping.",
    url: "https://www.shiplabeltool.com/blog/meesho-label-with-invoice-cropper",
    type: "article",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Meesho Shipping Label with Invoice: How the Cropper Detects and Removes It",
  description:
    "Understand how the Meesho PDF layout combines a shipping label with a TAX INVOICE and how an invoice-aware cropper detects and removes it.",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  url: "https://www.shiplabeltool.com/blog/meesho-label-with-invoice-cropper",
  author: { "@type": "Organization", name: "ShipLabelTool", url: "https://www.shiplabeltool.com" },
  publisher: {
    "@type": "Organization",
    name: "ShipLabelTool",
    logo: { "@type": "ImageObject", url: "https://www.shiplabeltool.com/favicon.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.shiplabeltool.com/blog/meesho-label-with-invoice-cropper" },
};

export default function Page() {
  return (
    <main className="container article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <span className="eyebrow">Meesho PDF Guide · 4 min read</span>
      <h1>Meesho Shipping Label with Invoice: How the Cropper Detects and Removes It</h1>
      <p className="article-lead">
        Every Meesho bulk order PDF has a specific two-part layout on each page: the top half contains the
        shipping label (with the courier barcode, customer address, and return address), while the bottom half
        contains the TAX INVOICE (with GST details, product name, and pricing). If you are printing labels for
        dispatch, you only need the top section. Here is how the invoice-aware cropper finds and removes the
        invoice automatically.
      </p>

      <h2>Understanding the Meesho PDF Layout</h2>
      <p>
        When Meesho generates a bulk order PDF, each page represents one order. The page is divided into two
        vertical sections:
      </p>
      <ul>
        <li><strong>Shipping Label (top)</strong> — courier barcode, customer name, delivery address, seller address, weight, and product SKU.</li>
        <li><strong>TAX INVOICE (bottom)</strong> — GST invoice number, product name, MRP, selling price, tax breakdown, and GSTIN.</li>
      </ul>
      <p>
        The boundary between these two sections is marked by the text <code>TAX INVOICE</code> which Meesho
        prints as a heading at a fixed position on every page. This text is embedded in the PDF text layer —
        not as an image — which makes it readable by a browser-based PDF parser.
      </p>

      <h2>How the TAX INVOICE Boundary Is Detected</h2>
      <p>
        The <a href="/meesho-label-with-invoice">Meesho Label with Invoice Cropper</a> uses the PDF.js library
        to read the text content of each page. It searches for the string <code>&quot;TAX INVOICE&quot;</code> and
        records its vertical (Y) position on the page. This Y coordinate becomes the lower boundary of the
        crop — everything above it is the shipping label, everything at or below it is the invoice.
      </p>
      <p>
        Because the detection is text-based rather than pixel-based, it works regardless of whether the labels
        are printed at different font sizes or if Meesho changes the visual layout — as long as the text
        &quot;TAX INVOICE&quot; appears in the PDF text layer, the boundary will be found.
      </p>

      <h2>What Happens When TAX INVOICE Is Not Found?</h2>
      <p>
        If the cropper cannot find the <code>TAX INVOICE</code> marker on a page, it does not silently guess
        where to cut. Instead, it reports the problem to the user with the page number, allowing you to
        investigate before printing. This prevents incorrect crops from being sent to the printer.
      </p>
      <p>Common reasons the marker may not be found:</p>
      <ul>
        <li>The PDF was converted to an image (screenshot, camera photo, or image PDF) — this removes the text layer entirely.</li>
        <li>The PDF was re-saved through a printer driver which flattens it to pixels.</li>
        <li>The file is a different document (not a Meesho order PDF).</li>
      </ul>
      <p>
        If you face this issue, always download a fresh copy of the PDF directly from the Meesho Supplier Panel.
      </p>

      <h2>What the Crop Includes and Excludes</h2>
      <p>After detection, the tool extracts only the area above the TAX INVOICE marker. This includes:</p>
      <ul>
        <li>Courier partner name and logo</li>
        <li>Shipping barcode / QR code</li>
        <li>Customer delivery address</li>
        <li>Return address (seller warehouse)</li>
        <li>Order ID and product weight</li>
      </ul>
      <p>The following are excluded (they remain in the TAX INVOICE section which is discarded):</p>
      <ul>
        <li>GST invoice number and tax breakdown</li>
        <li>Product name, MRP, and selling price</li>
        <li>Seller GSTIN and buyer GSTIN</li>
      </ul>

      <h2>Privacy: Your Invoice Data Never Leaves Your Browser</h2>
      <p>
        Even though the tool reads the full PDF (including the TAX INVOICE section with pricing and GST details),
        all of this processing happens in your browser using JavaScript and PDF.js. No page content is ever
        uploaded to a server. The invoice data is discarded from memory as soon as the crop is complete.
      </p>

      <h2>After Cropping: Printing on A4</h2>
      <p>
        Once labels are cropped, you can arrange them 4, 6, or 8 per A4 landscape page. See the full guide on
        <a href="/blog/meesho-label-cropper-a4"> how to print 4 Meesho labels on A4</a> for printer settings
        and troubleshooting tips.
      </p>
    </main>
  );
}

