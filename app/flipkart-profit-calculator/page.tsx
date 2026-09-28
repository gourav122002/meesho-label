import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import FlipkartProfitClient from "./FlipkartProfitClient";

export const metadata: Metadata = {
  title: "Flipkart Profit Calculator — Commission, Collection & Shipping Fees",
  description:
    "Free Flipkart seller profit calculator India. Calculates commission, collection fee, fixed fee, and shipping charges to show your exact net profit.",
  keywords: [
    "flipkart profit calculator",
    "flipkart seller profit india",
    "flipkart commission calculator",
    "flipkart collection fee calculator",
    "flipkart seller margin",
    "flipkart shipping fee calculator india",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/flipkart-profit-calculator" },
  openGraph: {
    title: "Flipkart Profit Calculator — Commission, Collection & Shipping Fees",
    description: "Calculate exact Flipkart seller profit accounting for commission, collection fee, and shipping charges. Free, browser-based.",
    url: "https://www.shiplabeltool.com/flipkart-profit-calculator",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Flipkart Profit Calculator India" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flipkart Profit Calculator — Commission, Collection & Shipping Fees",
    description: "Calculate exact Flipkart profit with commission, collection & shipping fees. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

const flipkartCalcFaqs = [
  { q: "What is the Flipkart commission rate?", a: "Flipkart's commission (marketplace fee) varies by category, typically 5–25% of the selling price. This calculator uses the correct rate based on your selected category." },
  { q: "What is the Flipkart collection fee?", a: "Flipkart charges a collection fee (payment gateway fee) of around 1.77–2% depending on the payment mode used by the buyer. This is automatically included in the calculation." },
  { q: "What is the fixed fee on Flipkart?", a: "Flipkart charges a fixed fee per order that varies by price range. This covers processing costs and is applied on top of the commission." },
  { q: "How is Flipkart shipping calculated?", a: "Flipkart Assured shipping costs are based on item weight and delivery zone. This calculator uses the current rate card to give you accurate shipping charges." },
];

export default function FlipkartProfitCalculatorPage() {
  return (
    <>
      <SeoJsonLd
        path="/flipkart-profit-calculator"
        title="Flipkart Profit Calculator — Commission, Collection & Shipping Fees"
        description="Free Flipkart seller profit calculator India. Calculates commission, collection fee, fixed fee, and shipping charges to show your exact net profit."
        appName="Flipkart Profit Calculator"
        faqs={flipkartCalcFaqs}
      />
      <FlipkartProfitClient />
    </>
  );
}

