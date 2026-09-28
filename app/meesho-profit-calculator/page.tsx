import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import MeeshoProfitClient from "./MeeshoProfitClient";

export const metadata: Metadata = {
  title: "Meesho Profit Calculator — Free Tool for Indian Sellers",
  description:
    "Calculate your exact profit on Meesho after 0% commission, shipping fees & GST. Free browser-based tool for Indian e-commerce sellers.",
  keywords: [
    "meesho profit calculator",
    "meesho seller profit",
    "meesho commission calculator",
    "meesho 0 commission profit",
    "meesho net profit after shipping",
    "meesho seller margin calculator india",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/meesho-profit-calculator" },
  openGraph: {
    title: "Meesho Profit Calculator — Free Tool for Indian Sellers",
    description: "Calculate your exact Meesho profit after shipping fees & GST. Free browser-based tool for Indian sellers.",
    url: "https://www.shiplabeltool.com/meesho-profit-calculator",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Meesho Profit Calculator" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meesho Profit Calculator — Free Tool for Indian Sellers",
    description: "Calculate exact Meesho profit after 0% commission, shipping & GST. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

const meeshoCalcFaqs = [
  { q: "Does Meesho really charge 0% commission?", a: "Yes, Meesho currently charges 0% commission on most categories. However, shipping fees are deducted from your payment. This calculator accounts for shipping charges to show your true net profit." },
  { q: "What fees does Meesho deduct?", a: "Meesho deducts shipping charges based on order weight and destination zone. GST on shipping is also applied. There is no seller commission, but these deductions reduce your effective margin." },
  { q: "How do I use this calculator?", a: "Enter your product selling price, cost price, and weight. The calculator instantly shows your gross profit, shipping deduction, and net profit per order." },
  { q: "Is GST included in the calculation?", a: "Yes. The calculator accounts for GST on the shipping fee deducted by Meesho, giving you the most accurate net profit figure." },
];

export default function MeeshoProfitCalculatorPage() {
  return (
    <>
      <SeoJsonLd
        path="/meesho-profit-calculator"
        title="Meesho Profit Calculator — Free Tool for Indian Sellers"
        description="Calculate your exact profit on Meesho after 0% commission, shipping fees & GST. Free browser-based tool for Indian e-commerce sellers."
        appName="Meesho Profit Calculator"
        faqs={meeshoCalcFaqs}
      />
      <MeeshoProfitClient />
    </>
  );
}

