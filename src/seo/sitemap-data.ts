import type { MetadataRoute } from "next";
import { STATIC_SITE_PATHS } from "@/config/routes";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { buildCanonicalUrl } from "@/seo/canonical";

function parseLastModified(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_SITE_PATHS.map((path) => ({
    url: buildCanonicalUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const testimonialEntries: MetadataRoute.Sitemap = testimonialPages.map((testimonial) => ({
    url: buildCanonicalUrl(`/testimonials/${testimonial.slug}`),
    lastModified: parseLastModified(testimonial.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const resourceArticleEntries: MetadataRoute.Sitemap = resourceArticles.map((article) => ({
    url: buildCanonicalUrl(buildResourceArticlePath(article.slug)),
    lastModified: parseLastModified(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticEntries, ...testimonialEntries, ...resourceArticleEntries];
}
