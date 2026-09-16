import type { Metadata } from "next";
import { siteName, siteUrl } from "../lib/site";
import HeaderNav from "./components/HeaderNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Shipping Label Cropper – Meesho, Flipkart & Amazon A4 Label Tool", template: `%s | ${siteName}` },
  description: "Free online tool to crop Meesho, Flipkart, and Amazon shipping labels from PDF. Arrange 4, 6 or 8 labels on one A4 page. 100% private, browser-based.",
  keywords: ["meesho label cropper", "flipkart label cropper", "amazon label cropper", "shipping label crop tool", "meesho label with invoice", "4 labels on A4"],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
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
                Free shipping label cropper for Meesho, Flipkart &amp; Amazon sellers. 100% browser-based, no login needed.
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
