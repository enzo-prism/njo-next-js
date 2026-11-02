import assert from "node:assert/strict";
import { INDEXABLE_STATIC_SITE_PATHS, NOINDEX_STATIC_SITE_PATHS } from "@/config/routes";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { buildCanonicalUrl } from "@/seo/canonical";
import { withNextServer } from "./lib/next-server";

const FIRST_EDITION_ASIN = "1627878718";
const DENTAL_EXIT_BLUEPRINT_ASIN = "B0H8WL3F6H";
const FAKE_SECOND_EDITION_ASIN = "B0FAKE2ND0";
const LAUNCH_DATE = "November 17, 2026";
const LAUNCH_SECTION_TITLE = "Launching November 17, 2026";
const HUB_DATED_CTA = "Second edition launches Nov\u00a017,\u00a02026";
const FIRST_EDITION_BUY_LABEL_RE = /\b(?:second edition|new edition|kindle)\b/i;
const AMAZON_LINK_RE = /<a\b[^>]*href="([^"]*amazon\.com[^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
const AMAZON_ASIN_RE = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?#]|$)/i;

const HOME_AMAZON_ASINS = [FIRST_EDITION_ASIN, DENTAL_EXIT_BLUEPRINT_ASIN] as const;
const RESOURCES_AMAZON_ASINS = [FIRST_EDITION_ASIN, DENTAL_EXIT_BLUEPRINT_ASIN] as const;
const SECOND_BOOK_AMAZON_ASINS = [FIRST_EDITION_ASIN] as const;

function parseSitemapLocs(xml: string) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function visibleLinkLabel(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseJsonLdGraphs(html: string): Array<Record<string, unknown>> {
  const nodes: Array<Record<string, unknown>> = [];
  for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(json) as Record<string, unknown>;
    const graph = data["@graph"];
    if (Array.isArray(graph)) {
      nodes.push(...(graph as Array<Record<string, unknown>>));
    } else {
      nodes.push(data);
    }
  }
  return nodes;
}

function readMetaDescription(html: string) {
  const encoded = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  assert.ok(encoded, "Page must expose a meta description");
  return decodeHtmlEntities(encoded);
}

function findFaqAnswer(html: string, questionPattern: RegExp) {
  for (const node of parseJsonLdGraphs(html)) {
    if (node["@type"] !== "FAQPage") continue;
    const entities = node.mainEntity;
    if (!Array.isArray(entities)) continue;
    for (const entity of entities) {
      if (!entity || typeof entity !== "object") continue;
      const question = entity as Record<string, unknown>;
      if (typeof question.name !== "string" || !questionPattern.test(question.name)) continue;
      const accepted = question.acceptedAnswer;
      if (!accepted || typeof accepted !== "object") continue;
      const text = (accepted as Record<string, unknown>).text;
      if (typeof text === "string") return text;
    }
  }
  return undefined;
}

function extractAmazonAsin(href: string) {
  const decoded = decodeHtmlEntities(href);
  const match = decoded.match(AMAZON_ASIN_RE);
  return match?.[1]?.toUpperCase();
}

function collectAmazonLinks(html: string) {
  return [...html.matchAll(AMAZON_LINK_RE)].map(([, href, labelHtml]) => ({
    href: decodeHtmlEntities(href),
    asin: extractAmazonAsin(href),
    label: visibleLinkLabel(labelHtml),
  }));
}

function assertAmazonLinksAllowed(
  html: string,
  pageLabel: string,
  allowedAsins: readonly string[],
) {
  const allowed = new Set(allowedAsins.map((asin) => asin.toUpperCase()));
  const amazonLinks = collectAmazonLinks(html);
  assert.ok(amazonLinks.length > 0, `${pageLabel} must keep at least one Amazon destination`);

  for (const { href, asin, label } of amazonLinks) {
    assert.ok(asin, `${pageLabel} Amazon link must include a recognizable ASIN: ${href}`);
    assert.ok(
      allowed.has(asin),
      `${pageLabel} Amazon link must use an allowlisted ASIN (saw ${asin} in ${href}; allowed: ${[...allowed].join(", ")})`,
    );
    if (asin !== FIRST_EDITION_ASIN) continue;
    assert.match(
      label,
      /first edition/i,
      `${pageLabel} Amazon CTA for ASIN ${FIRST_EDITION_ASIN} must be labeled as the first edition (saw "${label}")`,
    );
    assert.doesNotMatch(
      label,
      FIRST_EDITION_BUY_LABEL_RE,
      `${pageLabel} first-edition Amazon CTA must not use a second-edition, new-edition, or Kindle buy label (saw "${label}")`,
    );
  }

  if (allowed.has(FIRST_EDITION_ASIN)) {
    assert.ok(
      amazonLinks.some((link) => link.asin === FIRST_EDITION_ASIN),
      `${pageLabel} must keep the first-edition Amazon destination`,
    );
  }
}

function withFakeAmazonLink(html: string) {
  const fakeLink = `<a href="https://www.amazon.com/dp/${FAKE_SECOND_EDITION_ASIN}">Buy the new edition on Kindle</a>`;
  if (html.includes("</body>")) {
    return html.replace("</body>", `${fakeLink}</body>`);
  }
  return `${html}${fakeLink}`;
}

function assertFakeAmazonLinkIsRejected(
  html: string,
  pageLabel: string,
  allowedAsins: readonly string[],
) {
  assert.throws(
    () => assertAmazonLinksAllowed(withFakeAmazonLink(html), pageLabel, allowedAsins),
    (error: unknown) => {
      assert.ok(error instanceof assert.AssertionError, `${pageLabel} fake-ASIN mutant must throw AssertionError`);
      assert.match(
        error.message,
        new RegExp(`${FAKE_SECOND_EDITION_ASIN}|allowlisted ASIN`, "i"),
        `${pageLabel} fake-ASIN mutant must fail the allowlist, not a different assertion`,
      );
      return true;
    },
    `${pageLabel} must reject an extra unlisted Amazon ASIN`,
  );
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

    // Check the rendered journey, including full attributed comments, not only sitemap inclusion.
    const [homeResponse, resourcesResponse] = await Promise.all([
      fetch(baseUrl),
      fetch(`${baseUrl}/resources`),
    ]);
    assert.equal(homeResponse.status, 200);
    assert.equal(resourcesResponse.status, 200);
    const [homeHtml, resourcesHtml] = await Promise.all([homeResponse.text(), resourcesResponse.text()]);
    assert.ok(homeHtml.includes('href="/resources#from-dr-njos-network"'), "Homepage must link to network recommendations");
    const networkSection = resourcesHtml.match(/<section[^>]*id="from-dr-njos-network"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(networkSection, "Resources must expose a network recommendation section");
    for (const article of resourceArticles.filter((item) => item.networkResource)) {
      const resource = article.networkResource!;
      const detailPath = buildResourceArticlePath(article.slug);
      assert.ok(networkSection.includes(`href="${detailPath}"`), `Missing network recommendation link: ${detailPath}`);
      const response = await fetch(`${baseUrl}${detailPath}`);
      assert.equal(response.status, 200, `Recommendation must render: ${detailPath}`);
      const html = await response.text();
      const quote = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)?.[1];
      assert.ok(quote, `Missing attributed recommendation: ${detailPath}`);
      for (const paragraph of resource.recommendation.paragraphs) {
        const escaped = paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
        assert.ok(quote.includes(escaped), `Recommendation text must render in full: ${detailPath}`);
      }
      assert.ok(quote.includes("Dr. Michael Njo"), "Recommendation must be attributed to Michael");
      assert.ok(html.includes(`href="${resource.url}"`), "Recommendation must link to its source");
      for (const author of resource.authors) {
        assert.ok(html.includes(author), `Book author missing from recommendation: ${author}`);
      }
    }

    // The book campaign must lead to current prelaunch information, not an old-edition purchase CTA.
    const [secondBookResponse, llmsResponse] = await Promise.all([
      fetch(`${baseUrl}/resources/second-book`),
      fetch(`${baseUrl}/llms.txt`),
    ]);
    assert.equal(secondBookResponse.status, 200, "Second Edition page must render");
    assert.equal(llmsResponse.status, 200, "llms.txt must remain accessible");
    const [secondBookHtml, llmsText] = await Promise.all([
      secondBookResponse.text(),
      llmsResponse.text(),
    ]);
    assert.ok(resourcesHtml.includes("Upcoming book · November 17, 2026"), "Resources feature must show the same launch date");
    const resourcesText = resourcesHtml.replace(/<!--[\s\S]*?-->/g, "");
    assert.ok(
      resourcesText.includes(HUB_DATED_CTA),
      "Resources hub first-edition card must use the dated Second Edition CTA with non-breaking spaces",
    );
    assert.ok(
      !resourcesHtml.includes("Second edition (coming soon)"),
      "Resources hub must not keep the undated coming-soon CTA beside the first-edition Amazon button",
    );
    assert.ok(!secondBookHtml.includes("date has not been announced"), "Second Edition page must not retain the superseded release status");
    assert.ok(secondBookHtml.includes("purchase link will be added here when the new listing is confirmed"), "Prelaunch page must not imply a verified purchase destination");
    assert.ok(
      !secondBookHtml.includes("Amazon link below"),
      "First-edition Amazon link must not be described as below the article",
    );
    assert.ok(
      secondBookHtml.includes("first-edition Amazon link is for the earlier edition"),
      "Second Edition closing must still point readers to the first-edition Amazon link",
    );

    const secondBookMeta = readMetaDescription(secondBookHtml);
    assert.match(
      secondBookMeta,
      new RegExp(LAUNCH_DATE),
      `Second Edition meta description must include ${LAUNCH_DATE}`,
    );
    const publicationFaq = findFaqAnswer(secondBookHtml, /when will the second edition/i);
    assert.ok(publicationFaq, "Second Edition FAQ must include the publication-date question");
    assert.match(
      publicationFaq,
      new RegExp(LAUNCH_DATE),
      `Second Edition FAQ answer must include ${LAUNCH_DATE}`,
    );
    const secondBookHeadings = [...secondBookHtml.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(([, headingHtml]) =>
      visibleLinkLabel(headingHtml),
    );
    assert.ok(
      secondBookHeadings.includes(LAUNCH_SECTION_TITLE),
      `Second Edition section title must be exactly "${LAUNCH_SECTION_TITLE}"`,
    );
    const secondBookArticle = resourceArticles.find((article) => article.slug === "second-book");
    assert.ok(secondBookArticle, "Second Edition article must exist");
    assert.match(secondBookArticle.excerpt, new RegExp(LAUNCH_DATE), "Second Edition excerpt must include the launch date");
    assert.ok(
      resourcesHtml.includes(secondBookArticle.excerpt),
      "Resources hub must render the dated Second Edition excerpt",
    );

    const secondBookLlmsLine = llmsText.split("\n").find((line) => line.includes("/resources/second-book"));
    assert.ok(secondBookLlmsLine, "llms.txt must describe /resources/second-book");
    assert.match(
      secondBookLlmsLine,
      new RegExp(LAUNCH_DATE),
      `llms.txt second-book line must include ${LAUNCH_DATE}`,
    );
    const firstEditionLlmsLine = llmsText.split("\n").find((line) => line.includes(FIRST_EDITION_ASIN));
    assert.ok(firstEditionLlmsLine, "llms.txt must keep the existing first-edition Amazon destination");
    assert.match(
      firstEditionLlmsLine,
      /first edition/i,
      "llms.txt must label the existing Amazon book as the first edition",
    );

    assertAmazonLinksAllowed(homeHtml, "Home page", HOME_AMAZON_ASINS);
    assertAmazonLinksAllowed(resourcesHtml, "Resources hub", RESOURCES_AMAZON_ASINS);
    assertAmazonLinksAllowed(secondBookHtml, "Second Edition page", SECOND_BOOK_AMAZON_ASINS);
    assertFakeAmazonLinkIsRejected(homeHtml, "Home page", HOME_AMAZON_ASINS);
    assertFakeAmazonLinkIsRejected(resourcesHtml, "Resources hub", RESOURCES_AMAZON_ASINS);
    assertFakeAmazonLinkIsRejected(secondBookHtml, "Second Edition page", SECOND_BOOK_AMAZON_ASINS);
    console.log(
      `Rejected fake Amazon ASIN ${FAKE_SECOND_EDITION_ASIN} on home, resources, and second-book.`,
    );

    const handbookBookNode = parseJsonLdGraphs(homeHtml).find(
      (node) => node["@type"] === "Book" && node.isbn === FIRST_EDITION_ASIN,
    );
    assert.ok(handbookBookNode, "Home JSON-LD must include the published handbook Book node");
    assert.match(
      String(handbookBookNode.bookEdition || handbookBookNode.name || ""),
      /first edition/i,
      "Home Book structured data must label the existing Amazon book as the first edition",
    );

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
