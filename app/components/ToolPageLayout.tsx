import Link from "next/link";
import LabelCropper from "./LabelCropper";

interface ToolPageLayoutProps {
  /** Platform display name */
  name: string;
  /** Short tagline shown in the dark hero */
  tagline: string;
  /** Platform brand color (e.g. "#f43397") */
  color: string;
  /** SVG icon element */
  icon: React.ReactNode;
  /** Page h1 */
  heading: string;
  /** h1 sub-text */
  subtext: string;
  /** 3 benefit cards */
  benefits: { emoji: string; title: string; desc: string }[];
  /** FAQ items */
  faqs: { q: string; a: string }[];
  /** Optional custom cropper component; defaults to <LabelCropper /> */
  cropper?: React.ReactNode;
}

export default function ToolPageLayout({
  name,
  color,
  icon,
  heading,
  subtext,
  benefits,
  faqs,
  cropper,
}: ToolPageLayoutProps) {
  return (
    <main>
      {/* Dark hero header */}
      <section className="tp-hero">
        <div className="container tp-hero-inner">
          <Link href="/" className="tp-back-link">
            ← All Platform Tools
          </Link>
          <div className="tp-platform-row">
            {icon}
            <div className="tp-platform-text">
              <h1 style={{ color }}>{heading}</h1>
              <p>{subtext}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The actual tool */}
      <section className="tp-tool-area container">
        {cropper ?? <LabelCropper />}
      </section>

      {/* SEO benefit cards */}
      <section className="tp-seo-section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="lp-section-label">
            <span>Why Use This Tool</span>
          </div>
          <h2 className="lp-section-title" style={{ marginBottom: 4 }}>
            {name} Label Printing — Made Fast & Simple
          </h2>
          <p className="lp-section-sub">
            No software installation or account required. Runs 100% locally and securely in your browser.
          </p>
          <div className="tp-seo-grid">
            {benefits.map((b) => (
              <div key={b.title} className="tp-seo-card">
                <div style={{ fontSize: 28, marginBottom: 10 }}>{b.emoji}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: "56px 0", maxWidth: 760 }}>
        <div className="lp-section-label" style={{ justifyContent: "flex-start" }}>
          <span>FAQs</span>
        </div>
        <h2 className="lp-section-title" style={{ textAlign: "left" }}>
          Frequently Asked Questions
        </h2>
        <div className="tp-faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="tp-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
