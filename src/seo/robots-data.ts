import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/seo/canonical";

export function buildRobotsRules(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/private", "/_internal"],
    },
    sitemap: buildCanonicalUrl("/sitemap.xml"),
  };
}
