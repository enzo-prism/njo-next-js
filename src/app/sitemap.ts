import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/seo/sitemap-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
