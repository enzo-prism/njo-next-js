import assert from "node:assert/strict";
import { INDEXABLE_STATIC_SITE_PATHS, NOINDEX_STATIC_SITE_PATHS } from "@/config/routes";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { buildCanonicalUrl } from "@/seo/canonical";
import { withNextServer } from "./lib/next-server";

function parseSitemapLocs(xml: string) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

async function main() {
  await withNextServer(async (baseUrl) => {
    const [sitemapResponse, robotsResponse] = await Promise.all([
      fetch(`${baseUrl}/sitemap.xml`),
      fetch(`${baseUrl}/robots.txt`),
    ]);

    assert.equal(sitemapResponse.status, 200, "sitemap.xml should return HTTP 200");
    assert.match(
      sitemapResponse.headers.get("content-type") || "",
      /application\/xml|text\/xml/i,
      "sitemap.xml should return an XML content type",
    );

    assert.equal(robotsResponse.status, 200, "robots.txt should return HTTP 200");
    assert.match(
      robotsResponse.headers.get("content-type") || "",
      /^text\/plain/i,
      "robots.txt should return text/plain",
    );

    const sitemapXml = await sitemapResponse.text();
    const robotsText = await robotsResponse.text();
    const sitemapUrls = new Set(parseSitemapLocs(sitemapXml));

    assert.ok(sitemapXml.includes("<urlset"), "sitemap.xml should contain a <urlset>");
    assert.ok(sitemapUrls.has(buildCanonicalUrl("/")), "sitemap.xml should include the homepage");
    assert.ok(
      !sitemapUrls.has(buildCanonicalUrl("/contact/success")),
      "sitemap.xml should not index /contact/success",
    );

    for (const path of INDEXABLE_STATIC_SITE_PATHS) {
      assert.ok(sitemapUrls.has(buildCanonicalUrl(path)), `Missing static sitemap URL: ${path}`);
    }

    for (const path of NOINDEX_STATIC_SITE_PATHS) {
      assert.ok(!sitemapUrls.has(buildCanonicalUrl(path)), `Noindex campaign route should not be in sitemap: ${path}`);
    }

    for (const testimonial of testimonialPages) {
      const detailUrl = buildCanonicalUrl(`/testimonials/${testimonial.slug}`);
      assert.ok(!sitemapUrls.has(detailUrl), `Noindex testimonial URL should not be in sitemap: ${detailUrl}`);
    }

    for (const article of resourceArticles) {
      const detailUrl = buildCanonicalUrl(buildResourceArticlePath(article.slug));
      assert.ok(sitemapUrls.has(detailUrl), `Missing resource article URL: ${detailUrl}`);
    }

    assert.match(
      robotsText,
      new RegExp(`Sitemap: ${buildCanonicalUrl("/sitemap.xml").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      "robots.txt should advertise the canonical sitemap URL",
    );

    console.log(
      `HTTP SEO smoke checks passed on ${baseUrl} with ${sitemapUrls.size} sitemap URLs.`,
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
