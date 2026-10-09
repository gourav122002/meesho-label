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

      {/* Top Hero Banner */}
      <section
        style={{
          padding: '2.5rem 0 1.5rem',
          background: 'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(244,51,151,0.12) 0%, transparent 70%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container-main" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(244,51,151,0.12)', color: '#f43397', fontSize: '0.72rem', fontWeight: '700' }}>
              Meesho Supplier Intelligence
            </span>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.72rem', fontWeight: '700' }}>
              🔒 100% Private &amp; Local
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              fontWeight: '900',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
            }}
          >
            Meesho <span className="gradient-text">Payment Sheet</span> Analyzer
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            Analyze your true P&amp;L, return shipping loss, RTO rates, and get an instant catalog optimization action plan.
          </p>
        </div>
      </section>

      {/* Main Tool Application */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container-main">
          <PaymentAnalyzerClient />
        </div>
      </section>
    </>
  );
}
