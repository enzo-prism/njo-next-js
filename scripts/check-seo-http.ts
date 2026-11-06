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
const PRELAUNCH_AMAZON_BUY_LABEL_RE = /\b(?:second edition|new edition|kindle)\b/i;
const ANCHOR_HREF_RE = /<a\b[^>]*\bhref\s*=\s*(["'])([^"']+)\1[^>]*>([\s\S]*?)<\/a>/gi;
const AMAZON_ASIN_RE = /\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/ASIN)\/([A-Z0-9]{10})(?:[/?#]|$)/i;
const AMAZON_SHORT_HOSTS = new Set(["amzn.to", "amzn.eu", "amzn.asia", "a.co"]);
const AMAZON_FAMILY_EXTRA_HOSTS = new Set(["amzn.com"]);
const AMAZON_RETAIL_HOST_RE = /(?:^|\.)amazon(?:\.[a-z]+)+$/;
const AWS_AMAZON_HOST_RE = /(?:^|\.)aws\.amazon(?:\.[a-z]+)+$/;
const FAKE_AMAZON_VARIANTS = [
  { href: "https://amzn.to/3FAKE2N", name: "amzn.to short link" },
  { href: "https://a.co/d/fAKE2nd", name: "a.co short link" },
  { href: `https://www.amazon.co.uk/dp/${FAKE_SECOND_EDITION_ASIN}`, name: "amazon.co.uk ASIN" },
  { href: `https://WWW.AMAZON.COM/dp/${FAKE_SECOND_EDITION_ASIN}`, name: "uppercase amazon.com ASIN" },
  { href: "//amzn.to/3FAKE2N", name: "protocol-relative amzn.to" },
  { href: `//www.amazon.com/dp/${FAKE_SECOND_EDITION_ASIN}`, name: "protocol-relative amazon.com ASIN" },
  { href: `https://read.amazon.com/dp/${FAKE_SECOND_EDITION_ASIN}`, name: "read.amazon.com ASIN" },
  { href: `https://m.amazon.com/dp/${FAKE_SECOND_EDITION_ASIN}`, name: "m.amazon.com ASIN" },
  { href: "https://amzn.eu/d/fAKE2nd", name: "amzn.eu short link" },
  { href: "https://amzn.asia/d/fAKE2nd", name: "amzn.asia short link" },
  { href: "https://www.google.com/url?q=https%3A%2F%2Famzn.to%2F3FAKE2N", name: "Google /url?q= wrapper" },
  { href: `https://l.example.com/r?u=https://www.amazon.com/dp/${FAKE_SECOND_EDITION_ASIN}`, name: "redirect ?u= wrapper" },
] as const;
const ALLOWLISTED_ASIN_PATH_FORMS = [
  { href: `https://www.amazon.com/gp/aw/d/${FIRST_EDITION_ASIN}`, name: "/gp/aw/d/ first-edition ASIN" },
  { href: `https://www.amazon.com/exec/obidos/ASIN/${FIRST_EDITION_ASIN}`, name: "/exec/obidos/ASIN/ first-edition ASIN" },
] as const;
const NON_AMAZON_FAMILY_HREFS = [
  "https://aws.amazon.com/what-is-aws/",
  "https://s3.amazonaws.com/bucket/key",
  "https://data.com/",
  "https://mexica.co/",
  "https://example.com/amazon.com/dp/B0FAKE2ND0",
  "https://example.org/a.co/d/fAKE2nd",
] as const;

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

function normalizeAmazonHost(hostname: string) {
  return hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
}

function isAmazonFamilyHost(hostname: string) {
  const host = normalizeAmazonHost(hostname);
  if (AMAZON_SHORT_HOSTS.has(host) || AMAZON_FAMILY_EXTRA_HOSTS.has(host)) return true;
  if (AWS_AMAZON_HOST_RE.test(host)) return false;
  return AMAZON_RETAIL_HOST_RE.test(host);
}

function isShortAmazonHost(hostname: string) {
  return AMAZON_SHORT_HOSTS.has(normalizeAmazonHost(hostname));
}

function parseHref(href: string, baseUrl: string) {
  try {
    const url = new URL(decodeHtmlEntities(href), baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url;
  } catch {
    return undefined;
  }
}

function authorityLooksAmazonFamily(href: string) {
  const match = href.trim().match(/^(?:[a-z][a-z0-9+.-]*:)?\/\/([^/?#]+)/i);
  if (!match) return false;
  const authority = match[1];
  const host = authority.startsWith("[")
    ? authority.slice(1, Math.max(authority.indexOf("]"), 1))
    : authority.replace(/^.*@/, "").replace(/:\d+$/, "");
  return isAmazonFamilyHost(host);
}

function extractAmazonAsin(href: string) {
  const decoded = decodeHtmlEntities(href);
  const match = decoded.match(AMAZON_ASIN_RE);
  return match?.[1]?.toUpperCase();
}

function embeddedHttpUrls(url: URL, baseUrl: string) {
  const found: URL[] = [];
  for (const value of url.searchParams.values()) {
    const inner = parseHref(value, baseUrl);
    if (inner) found.push(inner);
  }
  return found;
}

function collectAmazonLinks(html: string, pageLabel: string, baseUrl: string) {
  const anchorHrefRe = new RegExp(ANCHOR_HREF_RE.source, ANCHOR_HREF_RE.flags);
  const links: Array<{ href: string; hostname: string; asin: string | undefined; label: string }> = [];

  for (const [, , href, labelHtml] of html.matchAll(anchorHrefRe)) {
    const decodedHref = decodeHtmlEntities(href);
    const url = parseHref(decodedHref, baseUrl);
    if (!url) {
      assert.ok(
        !authorityLooksAmazonFamily(decodedHref),
        `${pageLabel} Amazon-looking href must parse as http(s): ${decodedHref}`,
      );
      continue;
    }

    for (const candidate of [url, ...embeddedHttpUrls(url, baseUrl)]) {
      if (!isAmazonFamilyHost(candidate.hostname)) continue;
      links.push({
        href: decodedHref,
        hostname: candidate.hostname,
        asin: extractAmazonAsin(candidate.href),
        label: visibleLinkLabel(labelHtml),
      });
    }
  }

  return links;
}

function assertAmazonLinksAllowed(
  html: string,
  pageLabel: string,
  allowedAsins: readonly string[],
  baseUrl: string,
) {
  const allowed = new Set(allowedAsins.map((asin) => asin.toUpperCase()));
  const amazonLinks = collectAmazonLinks(html, pageLabel, baseUrl);
  assert.ok(amazonLinks.length > 0, `${pageLabel} must keep at least one Amazon destination`);

  for (const { href, hostname, asin, label } of amazonLinks) {
    assert.ok(
      !isShortAmazonHost(hostname),
      `${pageLabel} must not use a short Amazon link (${href})`,
    );
    assert.ok(asin, `${pageLabel} Amazon-family link must include an allowlisted ASIN: ${href}`);
    assert.ok(
      allowed.has(asin),
      `${pageLabel} Amazon-family link must use an allowlisted ASIN (saw ${asin} in ${href}; allowed: ${[...allowed].join(", ")})`,
    );
    assert.doesNotMatch(
      label,
      PRELAUNCH_AMAZON_BUY_LABEL_RE,
      `${pageLabel} Amazon-family CTA must not use a second-edition, new-edition, or Kindle buy label (saw "${label}" for ${href})`,
    );
    if (asin !== FIRST_EDITION_ASIN) continue;
    assert.match(
      label,
      /first edition/i,
      `${pageLabel} Amazon CTA for ASIN ${FIRST_EDITION_ASIN} must be labeled as the first edition (saw "${label}")`,
    );
  }

  if (allowed.has(FIRST_EDITION_ASIN)) {
    assert.ok(
      amazonLinks.some((link) => link.asin === FIRST_EDITION_ASIN),
      `${pageLabel} must keep the first-edition Amazon destination`,
    );
  }
}

function withAmazonLink(html: string, href: string, label: string) {
  const planted = `<a href="${href}">${label}</a>`;
  if (html.includes("</body>")) {
    return html.replace("</body>", `${planted}</body>`);
  }
  return `${html}${planted}`;
}

function withFakeAmazonLink(html: string, href: string) {
  return withAmazonLink(html, href, "Buy the new edition on Kindle");
}

function assertFakeAmazonVariantsAreRejected(
  html: string,
  pageLabel: string,
  allowedAsins: readonly string[],
  baseUrl: string,
) {
  for (const variant of FAKE_AMAZON_VARIANTS) {
    assert.throws(
      () => assertAmazonLinksAllowed(withFakeAmazonLink(html, variant.href), pageLabel, allowedAsins, baseUrl),
      (error: unknown) => {
        assert.ok(error instanceof assert.AssertionError, `${pageLabel} ${variant.name} mutant must throw AssertionError`);
        assert.match(
          error.message,
          /short Amazon link|allowlisted ASIN|B0FAKE2ND0|must parse as http/i,
          `${pageLabel} ${variant.name} mutant must fail the Amazon-family allowlist (saw: ${error.message})`,
        );
        return true;
      },
      `${pageLabel} must reject ${variant.name} (${variant.href})`,
    );
  }

  if (!html.includes("Buy The Dental Exit Blueprint on Amazon")) return;
  assert.throws(
    () =>
      assertAmazonLinksAllowed(
        html.replace("Buy The Dental Exit Blueprint on Amazon", "Buy the Second Edition on Kindle"),
        pageLabel,
        allowedAsins,
        baseUrl,
      ),
    (error: unknown) => {
      assert.ok(error instanceof assert.AssertionError, `${pageLabel} Blueprint buy-label mutant must throw AssertionError`);
      assert.match(
        error.message,
        /second-edition|new-edition|Kindle buy label/i,
        `${pageLabel} Blueprint buy-label mutant must fail the prelaunch Amazon buy-label ban`,
      );
      return true;
    },
    `${pageLabel} must reject relabeling the Blueprint Amazon CTA as a Second Edition Kindle purchase`,
  );
}

function assertAllowlistedAsinFormsPass(
  html: string,
  pageLabel: string,
  allowedAsins: readonly string[],
  baseUrl: string,
) {
  for (const form of ALLOWLISTED_ASIN_PATH_FORMS) {
    try {
      assertAmazonLinksAllowed(
        withAmazonLink(html, form.href, "View the first edition on Amazon"),
        pageLabel,
        allowedAsins,
        baseUrl,
      );
    } catch (error) {
      assert.fail(
        `${pageLabel} must accept allowlisted ASIN form ${form.name} (${form.href}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

function assertNonAmazonHrefsAreIgnored(
  html: string,
  pageLabel: string,
  allowedAsins: readonly string[],
  baseUrl: string,
) {
  for (const href of NON_AMAZON_FAMILY_HREFS) {
    try {
      assertAmazonLinksAllowed(withFakeAmazonLink(html, href), pageLabel, allowedAsins, baseUrl);
    } catch (error) {
      assert.fail(
        `${pageLabel} must ignore non-Amazon href ${href}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
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
    const decodedResourcesHtml = decodeHtmlEntities(resourcesHtml.replace(/<!--[\s\S]*?-->/g, ""));
    assert.ok(
      decodedResourcesHtml.includes(secondBookArticle.excerpt),
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

    const prelaunchPages = [
      { html: homeHtml, label: "Home page", asins: HOME_AMAZON_ASINS },
      { html: resourcesHtml, label: "Resources hub", asins: RESOURCES_AMAZON_ASINS },
      { html: secondBookHtml, label: "Second Edition page", asins: SECOND_BOOK_AMAZON_ASINS },
    ] as const;
    for (const page of prelaunchPages) {
      assertAmazonLinksAllowed(page.html, page.label, page.asins, baseUrl);
      assertFakeAmazonVariantsAreRejected(page.html, page.label, page.asins, baseUrl);
      assertAllowlistedAsinFormsPass(page.html, page.label, page.asins, baseUrl);
      assertNonAmazonHrefsAreIgnored(page.html, page.label, page.asins, baseUrl);
    }
    console.log(
      `Rejected Amazon-family mutants ${FAKE_AMAZON_VARIANTS.map((variant) => variant.href).join(", ")} on home, resources, and second-book.`,
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
