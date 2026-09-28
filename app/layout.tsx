import type { Metadata } from "next";
import { siteName, siteUrl } from "../lib/site";
import HeaderNav from "./components/HeaderNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ShipLabelTool — Free Label Cropper & Profit Calculator for Indian Sellers", template: `%s | ${siteName}` },
  description: "Free tools for Indian e-commerce sellers: crop Meesho, Flipkart & Amazon shipping labels from PDF, calculate profit margins, and analyze payment sheets. 100% browser-based.",
  keywords: [
    "meesho label cropper", "flipkart label cropper", "amazon label cropper",
    "shipping label crop tool", "meesho label with invoice", "4 labels on A4",
    "meesho profit calculator", "amazon profit calculator india", "flipkart profit calculator",
    "meesho payment analyzer", "amazon vs meesho", "shiplabeltool",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: siteName,
    title: "ShipLabelTool — Free Label Cropper & Profit Calculator for Indian Sellers",
    description: "Free tools for Indian e-commerce sellers: crop Meesho, Flipkart & Amazon shipping labels, calculate profit margins, and analyze Meesho payment sheets. 100% browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ShipLabelTool – Free Tools for Indian E-Commerce Sellers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipLabelTool — Free Label Cropper & Profit Calculator for Indian Sellers",
    description: "Free tools for Indian sellers: label cropper, profit calculators, payment analyzer. 100% browser-based.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
  return (
    <html lang="en">
      <body>
        <HeaderNav />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        {children}
        <footer className="site-footer">
          <div className="container footer-main">
            {/* Brand col */}
            <div className="footer-col">
              <div className="footer-brand">
                <span className="brand-mark" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: 8 }}>✂️</span>
                <strong>Label Cropper</strong>
              </div>
              <p className="footer-brand-desc">
                Free tools for Indian e-commerce sellers — label croppers, profit calculators, and payment sheet analyzer. 100% browser-based.
              </p>
            </div>

            {/* Tools col */}
            <div className="footer-col">
              <div className="footer-col-title">Label Crop Tools</div>
              <nav aria-label="Tools footer navigation">
                <a href="/meesho-label-cropper" className="footer-link">Meesho Label Cropper</a>
                <a href="/meesho-label-with-invoice" className="footer-link">Meesho + Invoice Cropper</a>
                <a href="/flipkart-label-cropper" className="footer-link">Flipkart Label Cropper</a>
                <a href="/amazon-label-cropper" className="footer-link">Amazon Label Cropper</a>
                <a href="/a4-meesho-labels" className="footer-link">A4 Multi-Label Arranger</a>
              </nav>
            </div>

            {/* Profit Calculators col */}
            <div className="footer-col">
              <div className="footer-col-title">Profit Calculators</div>
              <nav aria-label="Profit calculators footer navigation">
                <a href="/meesho-profit-calculator" className="footer-link">Meesho Profit Calculator</a>
                <a href="/amazon-profit-calculator" className="footer-link">Amazon Profit Calculator</a>
                <a href="/flipkart-profit-calculator" className="footer-link">Flipkart Profit Calculator</a>
                <a href="/myntra-profit-calculator" className="footer-link">Myntra Profit Calculator</a>
                <a href="/meesho-payment-analyzer" className="footer-link">Payment Sheet Analyzer</a>
                <a href="/bulk-profit-calculator" className="footer-link">Bulk Calculator</a>
                <a href="/amazon-vs-meesho" className="footer-link">Amazon vs Meesho</a>
              </nav>
            </div>

            {/* Resources col */}
            <div className="footer-col">
              <div className="footer-col-title">Resources</div>
              <nav aria-label="Resources footer navigation">
                <a href="/blog/meesho-label-cropper-a4" className="footer-link">How to Print 4 Labels on A4</a>
                <a href="/blog/meesho-label-with-invoice-cropper" className="footer-link">Meesho Label with Invoice Guide</a>
                <a href="/blog/how-to-print-meesho-labels-4-on-a4" className="footer-link">Meesho Label Printing Tips</a>
              </nav>
            </div>

            {/* Legal col */}
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <nav aria-label="Company footer navigation">
                <a href="/contact" className="footer-link">Contact Us</a>
                <a href="/privacy" className="footer-link">Privacy Policy</a>
                <a href="/terms" className="footer-link">Terms of Service</a>
              </nav>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container footer-bottom-inner">
              <span>© {new Date().getFullYear()} Label Cropper. All rights reserved.</span>
              <span>Made for Indian E-Commerce Sellers 🇮🇳</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
