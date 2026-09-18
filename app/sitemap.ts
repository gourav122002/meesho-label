import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const toolPages = [
    "/meesho-label-cropper",
    "/flipkart-label-cropper",
    "/amazon-label-cropper",
    "/meesho-label-with-invoice",
    "/a4-meesho-labels",
  ];
  const blogPages = [
    "/blog/meesho-label-cropper-a4",
    "/blog/how-to-print-meesho-labels-4-on-a4",
    "/blog/meesho-label-with-invoice-cropper",
  ];
  const staticPages = ["/privacy", "/terms", "/contact"];

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
    ...blogPages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...staticPages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}

