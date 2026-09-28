import type { Metadata } from "next";
import Link from "next/link";
import PlatformSelector from "./components/PlatformSelector";
import SeoJsonLd from "./components/SeoJsonLd";

export const metadata: Metadata = {
  title: "Shipping Label Cropper – Meesho, Flipkart, Myntra & Amazon A4 Label Tool",
  description:
    "Free online tool to crop Meesho, Flipkart, Myntra and Amazon shipping labels from PDF. Arrange 4, 6 or 8 labels on one A4 page. 100% private, browser-based, no login required.",
  alternates: { canonical: "https://www.shiplabeltool.com" },
  openGraph: {
    title: "Shipping Label Cropper – Meesho, Flipkart, Myntra & Amazon A4 Label Tool",
    description:
      "Free online tool to crop Meesho, Flipkart, Myntra and Amazon shipping labels from PDF. Arrange 4, 6 or 8 labels on one A4 page. 100% private, browser-based.",
    url: "https://www.shiplabeltool.com",
    siteName: "ShipLabelTool",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShipLabelTool – Shipping Label Cropper for Indian Sellers",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Label Cropper – Meesho, Flipkart, Myntra & Amazon",
    description:
      "Free online shipping label cropper for Meesho, Flipkart, Myntra & Amazon sellers. 100% private, browser-based.",
    images: ["/og-image.png"],
  },
};

const homeFaqs = [
  {
    q: "Which paper size should I use?",
    a: "Standard A4 (210 × 297 mm). The PDF is pre-formatted in A4 landscape — just print at 100% scale with no margins.",
  },
  {
    q: "Is my customer order data safe?",
    a: "Yes. All PDF processing happens locally inside your web browser using JavaScript. No files are sent to any server or stored anywhere.",
  },
  {
    q: "Does it work for Flipkart, Myntra and Amazon too?",
    a: "Yes. Meesho, Flipkart, and Myntra are fully supported. Amazon support is coming very soon.",
  },
  {
    q: "Can I use it on a thermal label printer?",
    a: "Yes. Use the 'Download Thermal 4×6 Labels' option to download individual labels for your thermal printer.",
  },
  {
    q: "What if TAX INVOICE is not detected?",
    a: "Make sure you are uploading the actual marketplace seller PDF, not a screenshot or a re-saved file. The tool reads PDF text to find the invoice boundary.",
  },
];

export default function Home() {
  return (
    <>
      <SeoJsonLd
        path="/"
        title="Shipping Label Cropper – Meesho, Flipkart, Myntra & Amazon A4 Label Tool"
        description="Free online tool to crop Meesho, Flipkart, Myntra and Amazon shipping labels. Arrange 4, 6 or 8 labels on one A4 page. 100% private and processed in your browser."
        appName="ShipLabelTool"
        faqs={homeFaqs}
      />

      <main>
        {/* ═══════════════════════════
            HERO SECTION
        ═══════════════════════════ */}
        <section className="home-hero">
          <div className="container home-hero-inner">
            {/* Badge */}
            <div className="home-hero-badge">
              <span className="home-hero-badge-dot" />
              Free for Indian E-Commerce Sellers
            </div>

            <h1 className="home-hero-h1">
              Crop & Print Shipping Labels
              <br />
              <span className="home-hero-h1-accent">in Seconds — Not Hours</span>
            </h1>

            <p className="home-hero-sub">
              Upload your bulk order PDF from <strong>Meesho, Flipkart or Myntra</strong>.
              The tool automatically detects labels, crops out the invoice, and arranges{" "}
              <strong>4, 6 or 8 labels per A4 sheet</strong> — ready to print instantly.
            </p>

            {/* Stats row */}
            <div className="home-stats-row">
              {[
                { value: "100%", label: "Browser-based" },
                { value: "50%", label: "Less paper waste" },
                { value: "30 sec", label: "100+ labels" },
                { value: "Zero", label: "Login needed" },
              ].map((s, i) => (
                <div key={i} className="home-stat-item">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════
            PLATFORM PICKER
        ═══════════════════════════ */}
        <section className="home-platforms-section">
          <div className="container">
            <div className="home-section-eyebrow">Choose Your Platform</div>
            <h2 className="home-section-title">Select Your Marketplace to Get Started</h2>
            <p className="home-section-sub">
              Click your platform below, upload your PDF, pick a layout and download — that&apos;s it.
            </p>
            <PlatformSelector />
          </div>
        </section>

        {/* ═══════════════════════════
            HOW IT WORKS
        ═══════════════════════════ */}
        <section className="home-alt-section">
          <div className="container">
            <div className="home-section-eyebrow">Simple 4 Steps</div>
            <h2 className="home-section-title">How It Works</h2>
            <p className="home-section-sub">Get labels ready to print in under 30 seconds.</p>

            <div className="home-steps-row">
              {[
                {
                  n: "01",
                  icon: "🖱️",
                  title: "Click Your Platform",
                  desc: "Select Meesho, Flipkart, or Myntra from the cards above.",
                },
                {
                  n: "02",
                  icon: "📂",
                  title: "Upload Your PDF",
                  desc: "Drop the bulk orders PDF downloaded from your seller panel.",
                },
                {
                  n: "03",
                  icon: "🔢",
                  title: "Choose Label Count",
                  desc: "Pick 4, 6, or 8 labels per A4 page to fit your printing needs.",
                },
                {
                  n: "04",
                  icon: "📥",
                  title: "Download & Print",
                  desc: "Download the A4 landscape PDF and print at 100% scale — done.",
                },
              ].map((step) => (
                <div key={step.n} className="home-step-item">
                  <div className="home-step-num">{step.n}</div>
                  <div className="home-step-emoji">{step.icon}</div>
                  <h3 className="home-step-title">{step.title}</h3>
                  <p className="home-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════
            FEATURES GRID
        ═══════════════════════════ */}
        <section className="container home-features-section">
          <div className="home-section-eyebrow">Why Sellers Use This</div>
          <h2 className="home-section-title">Everything You Need for Label Printing</h2>

          <div className="home-features-grid">
            {[
              {
                icon: "✂️",
                title: "Auto Invoice Detection",
                desc: "Finds the exact boundary between the shipping label and tax invoice — no manual cropping ever.",
                color: "#f43397",
                bg: "#fff0f8",
              },
              {
                icon: "📄",
                title: "4, 6 & 8 Labels/Page",
                desc: "Standard 4-up (2×2), compact 6-up (3×2), or max-saving 8-up (4×2) layouts on A4 landscape.",
                color: "#2563eb",
                bg: "#eff6ff",
              },
              {
                icon: "🔒",
                title: "100% Private",
                desc: "All PDF processing runs inside your browser. Customer data never touches any server.",
                color: "#16a34a",
                bg: "#f0fdf4",
              },
              {
                icon: "⚡",
                title: "Batch Processing",
                desc: "Process an entire day's orders at once — 10, 50, or 200 labels — in just a few seconds.",
                color: "#d97706",
                bg: "#fffbeb",
              },
              {
                icon: "🖨️",
                title: "Printer Ready",
                desc: "Download a clean A4 landscape PDF. Print at 100% scale on any inkjet, laser, or thermal printer.",
                color: "#7c3aed",
                bg: "#f5f3ff",
              },
              {
                icon: "🆓",
                title: "Always Free",
                desc: "No subscription, no account, no watermarks. Free for any number of orders every day.",
                color: "#0891b2",
                bg: "#f0f9ff",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="home-feature-card"
                style={{ "--feat-color": f.color, "--feat-bg": f.bg } as React.CSSProperties}
              >
                <span className="home-feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════
            PLATFORM QUICK LINKS
        ═══════════════════════════ */}
        <section className="home-alt-section">
          <div className="container">
            <div className="home-section-eyebrow">Supported Platforms</div>
            <h2 className="home-section-title">Pick Your Platform & Start Cropping</h2>

            <div className="home-platform-links-row">
              {[
                {
                  href: "/meesho-label-cropper",
                  name: "Meesho",
                  color: "#F43397",
                  bg: "#fff0f8",
                  border: "#f9a8d4",
                  emoji: "🛍️",
                  available: true,
                },
                {
                  href: "/flipkart-label-cropper",
                  name: "Flipkart",
                  color: "#2874F0",
                  bg: "#eff6ff",
                  border: "#93c5fd",
                  emoji: "📦",
                  available: true,
                },
                {
                  href: "/myntra-label-cropper",
                  name: "Myntra",
                  color: "#FF3F6C",
                  bg: "#fff1f4",
                  border: "#fda4af",
                  emoji: "👗",
                  available: true,
                },
                {
                  href: "#",
                  name: "Amazon",
                  color: "#FF9900",
                  bg: "#fffbeb",
                  border: "#fcd34d",
                  emoji: "📬",
                  available: false,
                },
              ].map((p) =>
                p.available ? (
                  <Link
                    key={p.name}
                    href={p.href}
                    className="home-plat-link"
                    style={{ "--plat-color": p.color, "--plat-bg": p.bg, "--plat-border": p.border } as React.CSSProperties}
                  >
                    <span className="home-plat-emoji">{p.emoji}</span>
                    <span className="home-plat-name">{p.name} Label Cropper</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                ) : (
                  <div
                    key={p.name}
                    className="home-plat-link home-plat-link-disabled"
                    style={{ "--plat-color": p.color, "--plat-bg": p.bg, "--plat-border": p.border } as React.CSSProperties}
                  >
                    <span className="home-plat-emoji">{p.emoji}</span>
                    <span className="home-plat-name">{p.name} Label Cropper</span>
                    <span className="home-plat-soon-tag">Coming Soon</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════
            FAQ
        ═══════════════════════════ */}
        <section className="container home-faq-section">
          <div className="home-section-eyebrow">FAQs</div>
          <h2 className="home-section-title">Common Questions</h2>

          <div className="home-faq-list">
            {homeFaqs.map((item) => (
              <details key={item.q} className="home-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
