import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import AmazonVsMeeshoClient from "./AmazonVsMeeshoClient";

export const metadata: Metadata = {
  title: "Amazon vs Meesho Profit Comparison — Which Platform Pays More?",
  description:
    "Side-by-side profit comparison for Amazon India vs Meesho. Enter your product details once and see the exact profit difference across both platforms.",
  keywords: [
    "amazon vs meesho profit comparison",
    "amazon vs meesho which is better for sellers",
    "meesho vs amazon seller fees india",
    "amazon meesho profit difference",
    "which marketplace pays more india",
    "amazon meesho margin comparison",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/amazon-vs-meesho" },
  openGraph: {
    title: "Amazon vs Meesho Profit Comparison — Which Platform Pays More?",
    description: "Enter your product details once and instantly compare your exact profit on Amazon vs Meesho side-by-side. Free, browser-based.",
    url: "https://www.shiplabeltool.com/amazon-vs-meesho",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Amazon vs Meesho Profit Comparison" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon vs Meesho — Which Platform Pays More?",
    description: "Compare your exact profit on Amazon vs Meesho side-by-side. Free, browser-based comparison tool.",
    images: ["/og-image.png"],
  },
};

const comparisonFaqs = [
  { q: "Which is more profitable — Amazon or Meesho?", a: "It depends on your product category, price point, and weight. Meesho has 0% commission but deducts shipping. Amazon has category referral fees and closing fees but has higher buyer trust. Use this comparison tool to see the exact difference for your product." },
  { q: "Does Meesho charge any fees at all?", a: "Meesho charges 0% commission but deducts shipping charges based on weight and delivery zone. Shipping costs can significantly reduce your margin on low-priced products." },
  { q: "Which platform is better for low-priced products (under ₹300)?", a: "For very low-priced products, Meesho's shipping deductions may eat into margins significantly. Amazon's fixed closing fee may be more predictable. The comparison tool shows you exact numbers for any price point." },
  { q: "Which platform gets more buyers in India?", a: "Both platforms have large customer bases. Meesho targets Tier 2/3 cities with value-conscious buyers. Amazon has broader urban reach with higher-income buyers willing to pay more. The right platform depends on your product and target customer." },
];

export default function AmazonVsMeeshoPage() {
  return (
    <>
      <SeoJsonLd
        path="/amazon-vs-meesho"
        title="Amazon vs Meesho Profit Comparison — Which Platform Pays More?"
        description="Side-by-side profit comparison for Amazon India vs Meesho. Enter your product details once and see the exact profit difference across both platforms."
        appName="Amazon vs Meesho Comparator"
        faqs={comparisonFaqs}
      />
      <AmazonVsMeeshoClient />
    </>
  );
}

