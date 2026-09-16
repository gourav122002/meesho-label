import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import ToolPageLayout from "../components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Meesho Label Cropper – Free Online PDF Shipping Label Tool",
  description:
    "Automatically crop Meesho shipping labels from bulk order PDFs. Arrange 4, 6 or 8 labels on one A4 sheet. 100% private, browser-based, no login required.",
  keywords: ["meesho label cropper", "meesho pdf label", "meesho shipping label", "meesho a4 label print"],
  alternates: { canonical: "https://www.labelcropper.in/meesho-label-cropper" },
};

const ICON = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#F43397" />
    <path d="M12 32V18L18.5 26L22 21L25.5 26L32 18V32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MeeshoPage() {
  return (
    <>
      <SeoJsonLd
        path="/meesho-label-cropper"
        title="Meesho Label Cropper – Free Online PDF Shipping Label Tool"
        description="Automatically crop Meesho shipping labels from bulk order PDFs. Arrange 4, 6 or 8 labels on one A4 sheet. 100% private and browser-based."
      />
      <ToolPageLayout
        name="Meesho"
        tagline="Meesho Shipping Label Cropper"
        color="#f43397"
        icon={ICON}
        heading="Meesho Shipping Label Cropper"
        subtext="Upload your Meesho bulk order PDF → crop labels automatically → download print-ready A4 sheet"
        benefits={[
          {
            emoji: "✂️",
            title: "Auto Invoice Detection",
            desc: "Finds the TAX INVOICE boundary in every page and crops only the shipping label above it — no manual cutting.",
          },
          {
            emoji: "📄",
            title: "4, 6 or 8 Labels / Page",
            desc: "Choose how many labels fit on one A4 sheet. 4-up (2×2), 6-up (3×2), or 8-up (4×2) layouts.",
          },
          {
            emoji: "🔒",
            title: "Private & Offline",
            desc: "All processing happens inside your browser. Customer names and addresses are never sent to any server.",
          },
        ]}
        faqs={[
          {
            q: "Which PDF do I upload?",
            a: "Download your bulk orders PDF from the Meesho Supplier Panel → Orders section. Upload that PDF directly here.",
          },
          {
            q: "What paper size should I use when printing?",
            a: "Standard A4 (210 × 297 mm). Set your printer to A4 landscape, no margins, scale = 100%.",
          },
          {
            q: "Why is the invoice not being detected?",
            a: "Make sure you're uploading the original Meesho PDF (not a photo or re-saved file). The tool reads the text 'TAX INVOICE' to find the cut boundary.",
          },
          {
            q: "Can I print on a thermal label printer?",
            a: "Yes. Use the 'Test 1 label' button to download a single label page and test your thermal printer before doing the full batch.",
          },
        ]}
      />
    </>
  );
}
