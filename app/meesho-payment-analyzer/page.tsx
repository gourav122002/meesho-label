import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import PaymentAnalyzerClient from "./PaymentAnalyzerClient";

export const metadata: Metadata = {
  title: "Meesho Payment Sheet Analyzer — P&L, Returns & Insights",
  description:
    "Upload your Meesho supplier payment Excel sheet and instantly see your true P&L, return rates, bad catalogs, and actionable insights. 100% browser-based, no data uploaded.",
  keywords: [
    "meesho payment sheet analyzer",
    "meesho payment reconciliation",
    "meesho supplier payment excel",
    "meesho return rate analysis",
    "meesho pl calculator",
    "meesho bad catalog finder",
    "meesho seller insights tool",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/meesho-payment-analyzer" },
  openGraph: {
    title: "Meesho Payment Sheet Analyzer — P&L, Returns & Insights",
    description: "Upload your Meesho supplier payment Excel and see your true P&L, return rates, and bad catalogs instantly. Free, browser-based.",
    url: "https://www.shiplabeltool.com/meesho-payment-analyzer",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Meesho Payment Sheet Analyzer" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meesho Payment Sheet Analyzer — P&L, Returns & Insights",
    description: "Analyze your Meesho payment Excel sheet for P&L, returns, and bad catalogs. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

const analyzerFaqs = [
  { q: "Which file do I upload?", a: "Download your Payment Sheet from the Meesho Supplier Panel under Payments → Payment Reports. Upload the Excel (.xlsx) file directly." },
  { q: "Is my payment data safe?", a: "Yes. All analysis happens inside your browser. Your payment data, order details, and seller information are never uploaded to any server." },
  { q: "What insights does it show?", a: "It shows your total orders, net P&L, return rates by product, bad-performing catalogs, and actionable recommendations to improve profitability." },
  { q: "Does it work with old payment sheets?", a: "Yes, it works with Meesho payment sheets from any date as long as the format matches the standard Meesho supplier payment Excel template." },
];

export default function MeeshoPaymentAnalyzerPage() {
  return (
    <>
      <SeoJsonLd
        path="/meesho-payment-analyzer"
        title="Meesho Payment Sheet Analyzer — P&L, Returns & Insights"
        description="Upload your Meesho supplier payment Excel sheet and instantly see your true P&L, return rates, bad catalogs, and actionable insights."
        appName="Meesho Payment Analyzer"
        faqs={analyzerFaqs}
      />
      <PaymentAnalyzerClient />
    </>
  );
}

