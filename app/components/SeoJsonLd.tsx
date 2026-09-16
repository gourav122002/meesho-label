export default function SeoJsonLd({ path, title, description }: { path: string; title: string; description: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: title, description, url: new URL(path, siteUrl).toString() },
      { "@type": "SoftwareApplication", name: "Meesho Label Cropper", applicationCategory: "BusinessApplication", operatingSystem: "Web Browser", description, url: siteUrl }
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
