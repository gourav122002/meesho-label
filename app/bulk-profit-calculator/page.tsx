import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import BulkCalculatorClient from "./BulkCalculatorClient";

export const metadata: Metadata = {
  title: "Bulk Profit Calculator — Upload CSV & Calculate 100s of SKUs",
  description:
    "Upload a CSV or Excel file with multiple products and instantly batch-calculate profit for all SKUs. Free bulk profit calculator for Indian marketplace sellers.",
  keywords: [
    "bulk profit calculator india",
    "batch sku profit calculator",
    "csv profit calculator ecommerce",
    "bulk product margin calculator",
    "meesho amazon flipkart bulk calculator",
    "multiple sku profit analysis",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/bulk-profit-calculator" },
  openGraph: {
    title: "Bulk Profit Calculator — Upload CSV & Calculate 100s of SKUs",
    description: "Upload a CSV or Excel with multiple products and batch-calculate profit for all SKUs across Meesho, Amazon & Flipkart. Free, browser-based.",
    url: "https://www.shiplabeltool.com/bulk-profit-calculator",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bulk Profit Calculator for Indian Sellers" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Profit Calculator — Upload CSV & Calculate 100s of SKUs",
    description: "Batch-calculate profit for 100s of SKUs at once. Upload CSV/Excel. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

const bulkCalcFaqs = [
  { q: "What file format does the bulk calculator accept?", a: "You can upload a CSV or Excel (.xlsx) file. Include columns for product name, selling price, cost price, weight, and marketplace. The calculator will auto-detect column headers." },
  { q: "How many SKUs can I calculate at once?", a: "There is no hard limit. The tool processes all rows in your file in the browser, so it works for 10 or 1000 SKUs without any performance issues." },
  { q: "Can I calculate for multiple platforms in one file?", a: "Yes. Add a 'platform' column (Meesho, Amazon, Flipkart) and the calculator will apply the correct fee structure for each SKU." },
  { q: "Can I export the results?", a: "Yes. After calculation, you can download the results as a CSV or Excel file with all the profit figures for each SKU." },
];

export default function BulkProfitCalculatorPage() {
  return (
    <>
      <SeoJsonLd
        path="/bulk-profit-calculator"
        title="Bulk Profit Calculator — Upload CSV & Calculate 100s of SKUs"
        description="Upload a CSV or Excel file with multiple products and instantly batch-calculate profit for all SKUs. Free bulk profit calculator for Indian marketplace sellers."
        appName="Bulk Profit Calculator"
        faqs={bulkCalcFaqs}
      />
      <BulkCalculatorClient />
    </>
  );
}

