import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/meesho-label-cropper", "/flipkart-label-cropper", "/amazon-label-cropper", "/meesho-label-with-invoice", "/a4-meesho-labels", "/blog/meesho-label-cropper-a4", "/blog/how-to-print-meesho-labels-4-on-a4", "/blog/meesho-label-with-invoice-cropper", "/privacy", "/terms", "/contact"];
  return paths.map((path) => ({ url: new URL(path, siteUrl).toString(), changeFrequency: path.startsWith("/blog/") ? "monthly" : "yearly", priority: path === "/" ? 1 : path.endsWith("-label-cropper") ? 0.9 : 0.7 }));

}
