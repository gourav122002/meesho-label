import type { Metadata } from "next";
import LabelCropper from "../components/LabelCropper";
import SeoJsonLd from "../components/SeoJsonLd";

export const metadata: Metadata = {
  title: "A4 Multi-Label Arranger – Print 4, 6 or 8 Meesho Labels Per Page",
  description:
    "Arrange multiple Meesho shipping labels on a single A4 landscape sheet. Choose 4-up (2×2), 6-up (3×2) or 8-up (4×2) layouts. Free, browser-based, no uploads.",
  keywords: [
    "meesho labels on A4",
    "4 meesho labels per page",
    "a4 label arranger",
    "meesho label layout",
    "print multiple labels A4",
    "meesho 4 up label",
  ],
  alternates: { canonical: "https://www.shiplabeltool.com/a4-meesho-labels" },
  openGraph: {
    title: "A4 Multi-Label Arranger – Print 4, 6 or 8 Meesho Labels Per Page",
    description: "Arrange multiple Meesho shipping labels on a single A4 sheet with 4, 6 or 8-up layouts. Free, browser-based.",
    url: "https://www.shiplabeltool.com/a4-meesho-labels",
    siteName: "ShipLabelTool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "A4 Multi-Label Arranger" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "A4 Multi-Label Arranger – Print 4, 6 or 8 Labels Per Page",
    description: "Arrange Meesho shipping labels on A4 sheets. Free, browser-based.",
    images: ["/og-image.png"],
  },
};

export default function Page(){return <main><SeoJsonLd path="/a4-meesho-labels" title="Meesho Labels 4 on A4 Landscape" description="Create an A4 landscape PDF with four cropped Meesho shipping labels per page."/><section className="hero container"><span className="eyebrow">A4 printing</span><h1>Put 4 Meesho labels on one A4 landscape page</h1><p>A simple 2 × 2 layout for sellers using A4 sticker sheets or laser printing.</p></section><section className="container"><LabelCropper/></section><section className="section container"><h2>A4 4-up layout</h2><p className="section-intro">Each A4 page is divided into two columns and two rows. Labels are scaled to fit their quadrant without stretching. A batch of ten labels becomes three A4 pages: four, four and two.</p><div className="grid"><article className="card"><h3>Landscape A4</h3><p>841.89 × 595.28 PDF points.</p></article><article className="card"><h3>2 × 2 grid</h3><p>Four label slots per sheet with small margins and gaps.</p></article><article className="card"><h3>Aspect ratio preserved</h3><p>The label is scaled proportionally inside its slot.</p></article></div></section></main>}
