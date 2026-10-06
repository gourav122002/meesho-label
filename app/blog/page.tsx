import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog – Meesho & Amazon Seller Guides for Indian E-Commerce",
  description:
    "Free guides for Meesho, Amazon, and Flipkart sellers in India. Learn how to print shipping labels, calculate profit, reduce returns, and grow your e-commerce business.",
  keywords: [
    "meesho seller guide",
    "amazon seller india guide",
    "flipkart seller tips",
    "ecommerce india blog",
    "meesho profit tips",
    "meesho label printing guide",
    "meesho return rate tips",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/blog" },
  openGraph: {
    title: "Blog – Meesho & Amazon Seller Guides for Indian E-Commerce",
    description:
      "Free guides for Meesho, Amazon, and Flipkart sellers. Learn shipping labels, profit calculation, and return reduction strategies.",
    url: "https://www.shiplabeltool.com/blog",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const POSTS = [
  {
    slug: "meesho-seller-tips-2026",
    title: "Meesho Seller Tips 2026 – 10 Ways to Increase Profit",
    desc: "Top 10 proven tips to increase your Meesho seller profit — reduce shipping costs, cut returns, improve catalog rankings.",
    date: "May 18, 2026",
    readTime: "8 min",
    tag: "Tips",
    tagColor: "#7c3aed",
  },
  {
    slug: "meesho-commission-calculator-2026",
    title: "Meesho Commission Calculator 2026 – How to Calculate Real Profit",
    desc: "Meesho charges 0% commission but shipping fees reduce your profit. Learn exactly how to calculate your true net margin.",
    date: "Jan 10, 2026",
    readTime: "6 min",
    tag: "Guide",
    tagColor: "#059669",
  },
  {
    slug: "meesho-vs-amazon-profit-comparison",
    title: "Meesho vs Amazon – Which Platform Gives Better Profit?",
    desc: "Detailed comparison of Meesho vs Amazon profit margins, fee structures, return policies for Indian sellers in 2026.",
    date: "Feb 15, 2026",
    readTime: "8 min",
    tag: "Comparison",
    tagColor: "#d97706",
  },
  {
    slug: "reduce-meesho-return-rate",
    title: "How to Reduce Return Rate on Meesho – Complete Guide",
    desc: "High return rates destroy Meesho profits. Learn proven strategies to cut returns and protect your seller metrics.",
    date: "Mar 20, 2026",
    readTime: "7 min",
    tag: "Strategy",
    tagColor: "#dc2626",
  },
  {
    slug: "flipkart-shipping-label-guide",
    title: "Flipkart Seller Guide – How to Print Shipping Labels",
    desc: "Complete guide to downloading, cropping, and printing Flipkart shipping labels. Print 4 or 8 labels per A4 page.",
    date: "Apr 5, 2026",
    readTime: "5 min",
    tag: "Guide",
    tagColor: "#059669",
  },
  {
    slug: "amazon-easy-ship-vs-fba-india",
    title: "Amazon Easy Ship vs FBA – Which Is Better for Indian Sellers?",
    desc: "Compare Easy Ship and FBA costs, delivery speed, and profit for Indian Amazon sellers. Real numbers for 2026.",
    date: "Jun 10, 2026",
    readTime: "7 min",
    tag: "Comparison",
    tagColor: "#d97706",
  },
  {
    slug: "meesho-label-cropper-a4",
    title: "How to Crop Meesho Labels and Print 4 on A4 – Step-by-Step",
    desc: "Step-by-step guide to cropping Meesho shipping labels from PDFs and printing four labels on one A4 landscape sheet.",
    date: "Sep 1, 2025",
    readTime: "5 min",
    tag: "Guide",
    tagColor: "#059669",
  },
  {
    slug: "how-to-print-meesho-labels-4-on-a4",
    title: "How to Print Meesho Labels 4 on A4 – Full Guide",
    desc: "Everything you need to know about printing 4 Meesho shipping labels on a single A4 sheet. Save paper and print faster.",
    date: "Sep 15, 2025",
    readTime: "5 min",
    tag: "Guide",
    tagColor: "#059669",
  },
  {
    slug: "meesho-label-with-invoice-cropper",
    title: "Meesho Label with Invoice Cropper – Separate Labels from Invoices",
    desc: "How to separate shipping labels from TAX INVOICE in Meesho PDFs. Print labels only and save invoice separately.",
    date: "Oct 1, 2025",
    readTime: "4 min",
    tag: "Guide",
    tagColor: "#059669",
  },
];

export default function BlogPage() {
  return (
    <main className="container" style={{ padding: "48px 0 80px" }}>
      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="lp-section-label" style={{ justifyContent: "center", marginBottom: 12 }}>
          <span>Resources &amp; Guides</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          ShipLabelTool Blog
        </h1>
        <p style={{ fontSize: 17, color: "#64748b", maxWidth: 560, margin: "0 auto" }}>
          Free guides for Meesho, Amazon, and Flipkart sellers — shipping labels, profit calculators,
          return reduction, and seller success strategies.
        </p>
      </div>

      {/* Posts grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none" }}
          >
            <article className="blog-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: post.tagColor + "18",
                    color: post.tagColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {post.tag}
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {post.date} · {post.readTime} read
                </span>
              </div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}
              >
                {post.title}
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6, flex: 1 }}>
                {post.desc}
              </p>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>
                Read article →
              </span>
            </article>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: 56,
          padding: "32px",
          background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
          borderRadius: 20,
          border: "1px solid #bfdbfe",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e40af", margin: "0 0 8px" }}>
          Try Our Free Seller Tools
        </h2>
        <p style={{ color: "#3b82f6", margin: "0 0 20px" }}>
          Label croppers, profit calculators, and payment sheet analyzer — all 100% browser-based and free.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/meesho-label-cropper" style={{ padding: "10px 20px", background: "#F43397", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Meesho Label Cropper
          </Link>
          <Link href="/meesho-profit-calculator" style={{ padding: "10px 20px", background: "#0f172a", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Profit Calculator
          </Link>
          <Link href="/meesho-payment-analyzer" style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Payment Analyzer
          </Link>
        </div>
      </div>
    </main>
  );
}
