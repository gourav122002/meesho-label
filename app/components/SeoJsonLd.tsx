import { siteUrl, siteName } from "../../lib/site";

interface Faq { q: string; a: string; }

interface SeoJsonLdProps {
  path: string;
  title: string;
  description: string;
  appName?: string;
  faqs?: Faq[];
}

export default function SeoJsonLd({ path, title, description, appName, faqs }: SeoJsonLdProps) {
  const pageUrl = new URL(path, siteUrl).toString();
  const isHome = path === "/";

  const graph: object[] = [
    {
      "@type": "WebPage",
      "@id": pageUrl,
      name: title,
      description,
      url: pageUrl,
      isPartOf: { "@id": siteUrl },
    },
    {
      "@type": "SoftwareApplication",
      name: appName ?? siteName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description,
      url: siteUrl,
    },
  ];

  // Add Organization schema on homepage
  if (isHome) {
    graph.push({
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.svg` },
    });
  }

  // Add BreadcrumbList for non-home pages
  if (!isHome) {
    const segments = path.replace(/^\//, "").split("/");
    const items = [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      ...segments.map((seg, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        item: new URL(segments.slice(0, i + 1).join("/"), siteUrl).toString(),
      })),
    ];
    graph.push({ "@type": "BreadcrumbList", itemListElement: items });
  }

  // Add FAQPage schema if faqs provided
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  const schema = { "@context": "https://schema.org", "@graph": graph };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
