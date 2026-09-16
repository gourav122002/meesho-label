import PlatformSelector from "./components/PlatformSelector";
import SeoJsonLd from "./components/SeoJsonLd";

export default function Home() {
  return (
    <>
      <SeoJsonLd
        path="/"
        title="Shipping Label Cropper – Meesho, Flipkart & Amazon A4 Label Tool"
        description="Free online tool to crop Meesho, Flipkart, and Amazon shipping labels. Arrange 4, 6 or 8 labels on one A4 page. 100% private and processed in your browser."
      />
      <main>

        {/* ════════════════════════════════
            HERO SECTION
        ════════════════════════════════ */}
        <section className="lp-hero">
          <div className="container lp-hero-inner">
            <h1 className="lp-hero-h1">
              Shipping Label Cropper<br />
              <span className="lp-hero-h1-accent">for Indian E-Commerce Sellers</span>
            </h1>
            <p className="lp-hero-sub">
              Upload your bulk orders PDF from Meesho, Flipkart, or Amazon.
              The tool automatically crops labels and arranges{" "}
              <strong>4, 6 or 8 labels on a single A4 sheet</strong> — ready for printing in seconds.
            </p>

            {/* Stat Row */}
            <div className="lp-stat-row">
              <div className="lp-stat">
                <strong>100%</strong>
                <span>Browser-based</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <strong>50%</strong>
                <span>Less paper waste</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <strong>30 sec</strong>
                <span>To process 100+ labels</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <strong>Zero</strong>
                <span>Login required</span>
              </div>
            </div>

            {/* Platform selector — inside hero */}
            <div className="lp-hero-platforms">
              <p className="lp-hero-platforms-label">Choose your platform to get started:</p>
              <PlatformSelector />
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════ */}
        <section className="lp-alt-section">
          <div className="container">
            <div className="lp-section-label"><span>Simple 4 Steps</span></div>
            <h2 className="lp-section-title">How It Works</h2>
            <p className="lp-section-sub">Get labels ready to print in under 30 seconds.</p>

            <div className="lp-steps-row">
              {[
                { n: "01", icon: "🖱️", title: "Click Your Platform", desc: "Select Meesho, Flipkart, or Amazon from the buttons above." },
                { n: "02", icon: "📂", title: "Upload Your PDF", desc: "Drop the bulk orders PDF downloaded from your seller panel." },
                { n: "03", icon: "🔢", title: "Choose Label Count", desc: "Pick 4, 6, or 8 labels per A4 page to fit your printer and label size." },
                { n: "04", icon: "📥", title: "Download & Print", desc: "Download the A4 landscape PDF and print at 100% scale." },
              ].map((step) => (
                <div key={step.n} className="lp-step-item">
                  <div className="lp-step-num">{step.n}</div>
                  <div className="lp-step-emoji">{step.icon}</div>
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            FEATURES / ABOUT
        ════════════════════════════════ */}
        <section className="container lp-features-section">
          <div className="lp-section-label"><span>Why Sellers Use This</span></div>
          <h2 className="lp-section-title">Everything You Need for Label Printing</h2>

          <div className="lp-features-grid">
            {[
              { icon: "✂️", title: "Auto Invoice Detection", desc: "Finds the exact boundary between the shipping label and tax invoice — no manual cropping ever." },
              { icon: "📄", title: "4, 6 & 8 Labels/Page", desc: "Standard 4-up (2×2), compact 6-up (3×2), or max-saving 8-up (4×2) layouts on A4 landscape." },
              { icon: "🔒", title: "100% Private", desc: "All PDF processing runs inside your browser. Customer data never touches any server." },
              { icon: "⚡", title: "Batch Processing", desc: "Process an entire day's orders at once — 10, 50, or 200 labels — in just a few seconds." },
              { icon: "🖨️", title: "Printer Ready", desc: "Download a clean A4 landscape PDF. Print at 100% scale on any inkjet, laser, or thermal printer." },
              { icon: "🆓", title: "Always Free", desc: "No subscription, no account, no watermarks. Free to use for any number of orders every day." },
            ].map((f) => (
              <div key={f.title} className="lp-feature-card">
                <span className="lp-feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════
            FAQ
        ════════════════════════════════ */}
        <section className="lp-alt-section">
          <div className="container lp-faq-section">
            <div className="lp-section-label"><span>FAQs</span></div>
            <h2 className="lp-section-title">Common Questions</h2>

            <div className="lp-faq-list">
              {[
                { q: "Which paper size should I use?", a: "Standard A4 (210 × 297 mm). The PDF is pre-formatted in A4 landscape — just print at 100% scale with no margins." },
                { q: "Is my customer order data safe?", a: "Yes. All PDF processing happens locally inside your web browser using JavaScript. No files are sent to any server or stored anywhere." },
                { q: "Does it work for Flipkart and Amazon too?", a: "Yes. Select the platform and upload the PDF. The tool reads the label structure and crops accordingly." },
                { q: "Can I use it on a thermal label printer?", a: "Yes. Use the 'Test 1 label' option to download a single label and test on your thermal printer before doing the full batch." },
                { q: "What if TAX INVOICE is not detected?", a: "Make sure you are uploading the actual Meesho seller PDF, not a screenshot or a re-saved file. The tool reads PDF text to find the invoice boundary." },
              ].map((item) => (
                <details key={item.q} className="lp-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
