import type { Metadata } from "next";
import LabelCropper from "../components/LabelCropper";
import SeoJsonLd from "../components/SeoJsonLd";

export const metadata: Metadata = {
  title: "Meesho Label with Invoice Cropper – Crop Shipping Label Above TAX INVOICE",
  description:
    "Automatically crop the Meesho shipping label from PDFs that include a TAX INVOICE section below. Get print-ready A4 labels with 4, 6 or 8 per page. Free, browser-based.",
  keywords: [
    "meesho label with invoice",
    "meesho shipping label invoice cropper",
    "meesho tax invoice crop",
    "meesho label above invoice",
    "meesho seller pdf label",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/meesho-label-with-invoice" },
  openGraph: {
    title: "Meesho Label with Invoice Cropper – Crop Shipping Label Above TAX INVOICE",
    description: "Automatically crop the Meesho shipping label from PDFs that include a TAX INVOICE section. 100% browser-based, free.",
    url: "https://www.shiplabeltool.com/meesho-label-with-invoice",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Meesho Label with Invoice Cropper" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meesho Label with Invoice Cropper",
    description: "Crop Meesho shipping label above TAX INVOICE from bulk order PDFs. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

export default function Page(){return <main><SeoJsonLd path="/meesho-label-with-invoice" title="Meesho Label With Invoice Cropper" description="Crop the shipping label above TAX INVOICE from Meesho PDFs and create A4-ready labels."/><section className="hero container"><span className="eyebrow">Invoice-aware cropping</span><h1>Meesho label with invoice cropper</h1><p>Use this version when every order page contains a shipping label followed by a TAX INVOICE section.</p></section><section className="container"><LabelCropper/></section><section className="section container"><h2>What the crop includes</h2><p className="section-intro">The crop begins at the top of the page and ends immediately before the detected tax invoice section. This keeps customer address, courier, destination/return information, product details and other content that belongs to the shipping label, while excluding the invoice below.</p><div className="faq"><details><summary>Does it upload my PDF?</summary><p>The default implementation processes the selected file in the browser. It does not send the PDF to an application server.</p></details><details><summary>What if TAX INVOICE is not detected?</summary><p>The tool shows an error rather than silently producing a potentially incorrect crop.</p></details><details><summary>Can I create A4 pages?</summary><p>Yes. The main export uses A4 landscape and places four labels per page.</p></details></div></section></main>}
