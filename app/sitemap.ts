import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const toolPages = [
    "/meesho-label-cropper",
    "/flipkart-label-cropper",
    "/amazon-label-cropper",
    "/myntra-label-cropper",
    "/meesho-label-with-invoice",
    "/a4-meesho-labels",
  ];
  const calculatorPages = [
    "/meesho-payment-analyzer",
    "/meesho-profit-calculator",
    "/amazon-profit-calculator",
    "/flipkart-profit-calculator",
    "/myntra-profit-calculator",
    "/bulk-profit-calculator",
    "/amazon-vs-meesho",
  ];
  const staticPages = ["/privacy", "/terms", "/contact"];

  // Blog posts with real publish dates (updated = better crawl priority)
  const blogPosts: MetadataRoute.Sitemap = [
    { url: new URL("/blog", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "weekly", priority: 0.8 },
    { url: new URL("/blog/meesho-seller-tips-2026", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "monthly", priority: 0.75 },
    { url: new URL("/blog/meesho-commission-calculator-2026", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "monthly", priority: 0.75 },
    { url: new URL("/blog/meesho-vs-amazon-profit-comparison", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "monthly", priority: 0.75 },
    { url: new URL("/blog/reduce-meesho-return-rate", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "monthly", priority: 0.75 },
    { url: new URL("/blog/flipkart-shipping-label-guide", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "monthly", priority: 0.72 },
    { url: new URL("/blog/amazon-easy-ship-vs-fba-india", siteUrl).toString(), lastModified: "2026-10-01", changeFrequency: "monthly", priority: 0.72 },
    { url: new URL("/blog/meesho-label-cropper-a4", siteUrl).toString(), lastModified: "2026-09-18", changeFrequency: "monthly", priority: 0.72 },
    { url: new URL("/blog/how-to-print-meesho-labels-4-on-a4", siteUrl).toString(), lastModified: "2026-09-18", changeFrequency: "monthly", priority: 0.72 },
    { url: new URL("/blog/meesho-label-with-invoice-cropper", siteUrl).toString(), lastModified: "2026-09-18", changeFrequency: "monthly", priority: 0.70 },
  ];

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...toolPages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...calculatorPages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/meesho-payment-analyzer" ? 0.95 : 0.9,
    })),
    ...blogPosts,
    ...staticPages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      lastModified: "2026-01-01",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}


