import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import ToolPageLayout from "../components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Myntra Label Cropper – Free A4 Shipping Label PDF Tool",
  description:
    "Crop and arrange Myntra shipping labels from bulk order PDFs. Print 4, 6 or 8 labels on one A4 page. Completely free, browser-based, no sign-up needed.",
  keywords: [
    "myntra label cropper",
    "myntra shipping label",
    "myntra pdf label print",
    "myntra a4 label",
    "myntra bulk order label",
    "myntra seller label tool",
    "print myntra labels on a4",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/myntra-label-cropper" },
  openGraph: {
    title: "Myntra Label Cropper – Free A4 Shipping Label PDF Tool",
    description: "Crop and arrange Myntra shipping labels from bulk order PDFs. Print 4, 6 or 8 labels on one A4 page. Free and browser-based.",
    url: "https://www.shiplabeltool.com/myntra-label-cropper",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Myntra Label Cropper Tool" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myntra Label Cropper – Free A4 Shipping Label PDF Tool",
    description: "Crop and arrange Myntra shipping labels from bulk order PDFs. 100% private, browser-based.",
    images: ["/og-image.png"],
  },
};

const ICON = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#FF3F6C" />
    <path d="M11 28 L16 14 L22 23 L28 14 L33 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MyntraPage() {
  return (
    <>
      <SeoJsonLd
        path="/myntra-label-cropper"
        title="Myntra Label Cropper – Free A4 Shipping Label PDF Tool"
        description="Crop and arrange Myntra shipping labels from bulk order PDFs. Print 4, 6 or 8 labels on one A4 page. Completely free and browser-based."
        appName="Myntra Label Cropper"
        faqs={[
          { q: "Which Myntra PDF should I upload?", a: "Download the bulk shipping label PDF from your Myntra Partner Portal under Orders → Manage Orders. Upload that PDF directly here." },
          { q: "What print settings should I use?", a: "Select A4 paper, landscape orientation, no margins, and 100% scale in your printer settings." },
          { q: "Is my customer data safe?", a: "Yes. All PDF processing happens locally in your web browser. No data is uploaded to any server." },
          { q: "Can I print on a thermal label printer?", a: "Yes. Use the 'Download Thermal 4×6 Labels' button to download individual label pages for thermal printers." },
        ]}
      />
      <ToolPageLayout
        name="Myntra"
        tagline="Myntra Shipping Label Cropper"
        color="#FF3F6C"
        icon={ICON}
        heading="Myntra Shipping Label Cropper"
        subtext="Upload your Myntra order PDF → crop labels automatically → download a print-ready A4 sheet"
        benefits={[
          {
            emoji: "👗",
            title: "Fashion Seller Ready",
            desc: "Designed for Myntra fashion sellers — process your entire day's shipments at once with zero manual effort.",
          },
          {
            emoji: "📄",
            title: "4, 6 or 8 Labels / Page",
            desc: "Choose 4-up (2×2), 6-up (3×2), or 8-up (4×2) A4 landscape layouts to save paper.",
          },
          {
            emoji: "🔒",
            title: "Private & Offline",
            desc: "All processing happens inside your browser. Customer names and addresses are never sent to any server.",
          },
        ]}
        faqs={[
          {
            q: "Which Myntra PDF should I upload?",
            a: "Download the bulk shipping label PDF from your Myntra Partner Portal under Orders → Manage Orders. Upload that PDF directly here.",
          },
          {
            q: "What print settings should I use?",
            a: "Select A4 paper, landscape orientation, no margins, and 100% scale in your printer settings.",
          },
          {
            q: "Is my customer data safe?",
            a: "Yes. All PDF processing happens locally in your web browser. No data is uploaded to any server.",
          },
          {
            q: "Can I print on a thermal label printer?",
            a: "Yes. Use the 'Download Thermal 4×6 Labels' button to download individual label pages for thermal printers.",
          },
        ]}
      />
    </>
  );
}
