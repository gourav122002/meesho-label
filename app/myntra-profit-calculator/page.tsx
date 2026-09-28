import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import MyntraProfitClient from "./MyntraProfitClient";

export const metadata: Metadata = {
  title: "Myntra Profit Calculator — Fashion & Lifestyle Seller Margins",
  description:
    "Calculate your net profit as a Myntra seller. Accounts for category commission, payment gateway fee, and shipping. Free browser-based tool.",
  keywords: [
    "myntra profit calculator",
    "myntra seller profit india",
    "myntra commission calculator",
    "myntra seller margin",
    "myntra fashion seller fees",
    "myntra payment gateway fee",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/myntra-profit-calculator" },
  openGraph: {
    title: "Myntra Profit Calculator — Fashion & Lifestyle Seller Margins",
    description: "Calculate your exact Myntra seller profit after category commission, payment gateway fee & shipping. Free, browser-based.",
    url: "https://www.shiplabeltool.com/myntra-profit-calculator",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Myntra Profit Calculator India" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myntra Profit Calculator — Fashion & Lifestyle Seller Margins",
    description: "Calculate exact Myntra seller profit with category commission & fees. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

const myntraCalcFaqs = [
  { q: "What commission does Myntra charge?", a: "Myntra's commission varies by product category and typically ranges from 10% to 30% for fashion and lifestyle items. This calculator includes the correct rate for each category." },
  { q: "Does Myntra charge a payment gateway fee?", a: "Yes. Myntra deducts a payment gateway fee, typically around 2%, from each order. This is included in the profit calculation." },
  { q: "How does Myntra shipping work for sellers?", a: "Myntra uses its own fulfillment network. Sellers ship to Myntra warehouses and Myntra handles last-mile delivery. Shipping costs vary based on your agreement with Myntra." },
  { q: "Is there a return deduction on Myntra?", a: "Yes, returns can affect your profitability. Myntra has a return commission structure. This calculator shows your profit per successful delivery." },
];

export default function MyntraProfitCalculatorPage() {
  return (
    <>
      <SeoJsonLd
        path="/myntra-profit-calculator"
        title="Myntra Profit Calculator — Fashion & Lifestyle Seller Margins"
        description="Calculate your net profit as a Myntra seller. Accounts for category commission, payment gateway fee, and shipping. Free browser-based tool."
        appName="Myntra Profit Calculator"
        faqs={myntraCalcFaqs}
      />
      <MyntraProfitClient />
    </>
  );
}

