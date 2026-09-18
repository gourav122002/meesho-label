import type { Metadata } from "next";
import SeoJsonLd from "../components/SeoJsonLd";
import ToolPageLayout from "../components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Amazon Label Cropper – Free A4 Shipping Label PDF Tool",
  description:
    "Crop and arrange Amazon seller shipping labels from PDF files. Print 4, 6 or 8 labels per A4 page. Free, browser-based, no login required.",
  keywords: [
    "amazon label cropper",
    "amazon shipping label",
    "amazon seller label pdf",
    "amazon a4 label print",
    "amazon easy ship label",
    "amazon seller flex label",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/amazon-label-cropper" },
  openGraph: {
    title: "Amazon Label Cropper – Free A4 Shipping Label PDF Tool",
    description: "Crop and arrange Amazon seller shipping labels from PDF files. Print 4, 6 or 8 labels per A4 page. Free and browser-based.",
    url: "https://www.shiplabeltool.com/amazon-label-cropper",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Amazon Label Cropper Tool" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Label Cropper – Free A4 Shipping Label PDF Tool",
    description: "Crop and arrange Amazon seller shipping labels from PDF files. 100% private, browser-based.",
    images: ["/og-image.png"],
  },
};

const ICON = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#232F3E" />
    <path d="M12 28C17.5 32.5 26.5 32.5 32 28" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M29 26L33 28L31.5 32" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 22C16 18 18.8 15.5 22 15.5C25.2 15.5 28 18 28 22" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export default function AmazonPage() {
  return (
    <>
      <SeoJsonLd
        path="/amazon-label-cropper"
        title="Amazon Label Cropper – Free A4 Shipping Label PDF Tool"
        description="Crop and arrange Amazon seller shipping labels from PDF files. Print 4, 6 or 8 labels per A4 page. Free and browser-based."
      />
      <ToolPageLayout
        name="Amazon"
        tagline="Amazon Shipping Label Cropper"
        color="#FF9900"
        icon={ICON}
        heading="Amazon Shipping Label Cropper"
        subtext="Upload your Amazon Easy Ship or Seller Flex PDF → crop labels → download A4 sheet"
        benefits={[
          {
            emoji: "🚀",
            title: "Fast Batch Processing",
            desc: "Process all your Amazon shipment labels at once. Handles large PDFs with dozens of orders in seconds.",
          },
          {
            emoji: "📄",
            title: "Multiple Layout Options",
            desc: "Fit 4, 6, or 8 Amazon labels on a single A4 landscape page — saving paper and print costs.",
          },
          {
            emoji: "🔒",
            title: "Secure & Private",
            desc: "Your Amazon shipment details and customer addresses never leave your browser. Zero server uploads.",
          },
        ]}
        faqs={[
          {
            q: "Which Amazon PDF should I upload?",
            a: "Download the shipping label PDF from your Amazon Seller Central → Manage Orders → Print Shipping Labels. Upload that file here.",
          },
          {
            q: "Does it work with Amazon Easy Ship labels?",
            a: "Yes. Upload the Easy Ship or Seller Flex label PDF and the tool will crop and arrange the labels on A4 sheets.",
          },
          {
            q: "What printer settings should I use?",
            a: "A4 paper, landscape orientation, 100% scale, no margins. Works on any standard inkjet or laser printer.",
          },
          {
            q: "Is there a limit on the number of labels?",
            a: "No hard limit. The tool runs in your browser and processes each page locally, so it works for any order volume.",
          },
        ]}
      />
    </>
  );
}
