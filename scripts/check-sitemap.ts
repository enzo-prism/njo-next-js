import assert from "node:assert/strict";
import { STATIC_SITE_PATHS } from "@/config/routes";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { buildCanonicalUrl } from "@/seo/canonical";
import { buildSitemapEntries } from "@/seo/sitemap-data";

const entries = buildSitemapEntries();
const urls = new Set(entries.map((item) => item.url));

for (const path of STATIC_SITE_PATHS) {
  assert.ok(urls.has(buildCanonicalUrl(path)), `Missing static sitemap URL: ${path}`);
}

assert.ok(!urls.has(buildCanonicalUrl("/contact/success")), "contact/success should not be indexed");

for (const testimonial of testimonialPages) {
  const detailUrl = buildCanonicalUrl(`/testimonials/${testimonial.slug}`);
  assert.ok(urls.has(detailUrl), `Missing testimonial URL: ${detailUrl}`);
}

for (const article of resourceArticles) {
  const detailUrl = buildCanonicalUrl(buildResourceArticlePath(article.slug));
  assert.ok(urls.has(detailUrl), `Missing resource article URL: ${detailUrl}`);
}

assert.equal(
  entries.length,
  STATIC_SITE_PATHS.length + testimonialPages.length + resourceArticles.length,
  "Unexpected sitemap entry count",
);

console.log(`Sitemap assertions passed with ${entries.length} total URLs.`);
