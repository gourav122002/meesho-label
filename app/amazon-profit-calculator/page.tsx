import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import AmazonProfitClient from "./AmazonProfitClient";

export const metadata: Metadata = {
  title: "Amazon Profit Calculator India — Referral Fee, FBA & Easy Ship",
  description:
    "Free Amazon seller profit calculator for India. Calculates referral fee by category, closing fee, Easy Ship vs FBA costs, and your exact net profit.",
  keywords: [
    "amazon profit calculator india",
    "amazon seller profit",
    "amazon referral fee calculator",
    "amazon easy ship cost calculator",
    "amazon fba calculator india",
    "amazon seller margin india",
    "amazon closing fee calculator",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/amazon-profit-calculator" },
  openGraph: {
    title: "Amazon Profit Calculator India — Referral Fee, FBA & Easy Ship",
    description: "Calculate your Amazon seller profit accounting for referral fees, closing fees, and Easy Ship/FBA costs. Free, browser-based.",
    url: "https://www.shiplabeltool.com/amazon-profit-calculator",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Amazon Profit Calculator India" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Profit Calculator India — Referral Fee, FBA & Easy Ship",
    description: "Calculate exact Amazon seller profit with referral fee, closing fee & shipping costs. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

const amazonCalcFaqs = [
  { q: "What is Amazon's referral fee?", a: "Amazon charges a referral fee that varies by category, typically between 2% and 15% of the selling price. This calculator includes the correct rate for each product category." },
  { q: "What is the closing fee on Amazon?", a: "Amazon charges a fixed closing fee per order, which varies by price range. For items below ₹250, it is ₹5; for items ₹250–500, it is ₹9; and for items above ₹500, it is ₹13." },
  { q: "How is Easy Ship cost calculated?", a: "Easy Ship charges are based on package weight and delivery zone (local, regional, national). The calculator uses the current Amazon Easy Ship rate card for accurate results." },
  { q: "FBA vs Easy Ship — which is cheaper?", a: "FBA includes storage and fulfillment fees but often wins on larger volumes. Easy Ship is cheaper for low volumes. Use the comparison feature in this calculator to see which is better for your specific product." },
];

export default function AmazonProfitCalculatorPage() {
  return (
    <>
      <SeoJsonLd
        path="/amazon-profit-calculator"
        title="Amazon Profit Calculator India — Referral Fee, FBA & Easy Ship"
        description="Free Amazon seller profit calculator for India. Calculates referral fee by category, closing fee, Easy Ship vs FBA costs, and your exact net profit."
        appName="Amazon Profit Calculator"
        faqs={amazonCalcFaqs}
      />
      <AmazonProfitClient />
    </>
  );
}

