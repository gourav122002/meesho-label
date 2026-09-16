import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import ToolPageLayout from "../components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Flipkart Label Cropper – Free A4 Shipping Label PDF Tool",
  description:
    "Crop and arrange Flipkart shipping labels from bulk order PDFs. Print 4, 6 or 8 labels on one A4 page. Completely free, browser-based, no sign-up needed.",
  keywords: ["flipkart label cropper", "flipkart shipping label", "flipkart pdf label print", "flipkart a4 label"],
  alternates: { canonical: "https://www.labelcropper.in/flipkart-label-cropper" },
};

const ICON = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#2874F0" />
    <path d="M13 11H31L29 33H15L13 11Z" fill="#FFE11B" />
    <path d="M18 18H26M18 23H24" stroke="#2874F0" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export default function FlipkartPage() {
  return (
    <>
      <SeoJsonLd
        path="/flipkart-label-cropper"
        title="Flipkart Label Cropper – Free A4 Shipping Label PDF Tool"
        description="Crop and arrange Flipkart shipping labels from bulk order PDFs. Print 4, 6 or 8 labels on one A4 page. Completely free and browser-based."
      />
      <ToolPageLayout
        name="Flipkart"
        tagline="Flipkart Shipping Label Cropper"
        color="#2874F0"
        icon={ICON}
        heading="Flipkart Shipping Label Cropper"
        subtext="Upload your Flipkart order PDF → crop labels → download a print-ready A4 sheet"
        benefits={[
          {
            emoji: "📦",
            title: "Batch Label Processing",
            desc: "Process an entire day's Flipkart shipments at once — 10, 50 or 200 labels in a few seconds.",
          },
          {
            emoji: "📄",
            title: "4, 6 or 8 Labels / Page",
            desc: "Choose 4-up (2×2), 6-up (3×2), or 8-up (4×2) A4 landscape layouts to save paper.",
          },
          {
            emoji: "🖨️",
            title: "Any Printer Compatible",
            desc: "Download a standard PDF. Print at 100% scale, A4 landscape on any inkjet, laser, or thermal printer.",
          },
        ]}
        faqs={[
          {
            q: "Which Flipkart PDF should I upload?",
            a: "Download the bulk shipping label PDF from your Flipkart Seller Hub under Orders → Manage Orders. Upload that PDF here.",
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
            q: "Can I choose how many labels go on each page?",
            a: "Yes. After uploading, use the layout selector to choose 4, 6, or 8 labels per A4 page.",
          },
        ]}
      />
    </>
  );
}
