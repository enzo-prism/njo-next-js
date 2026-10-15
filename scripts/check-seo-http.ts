import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { INDEXABLE_STATIC_SITE_PATHS, NOINDEX_STATIC_SITE_PATHS } from "@/config/routes";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { buildCanonicalUrl } from "@/seo/canonical";

async function getAvailablePort(): Promise<number> {
  return await new Promise((resolve, reject) => {
    const server = createServer();

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not determine an available port."));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });
}

async function waitForServer(baseUrl: string, child: ReturnType<typeof spawn>) {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`next start exited early with code ${child.exitCode}.`);
    }

    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) {
        return;
      }
    } catch {
      // The server may still be starting; keep polling until the deadline.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Timed out waiting for next start to become ready.");
}

function parseSitemapLocs(xml: string) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

async function main() {
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const stdout: string[] = [];
  const stderr: string[] = [];
  const nextBin = `${process.cwd()}/node_modules/.bin/next`;

  const child = spawn(nextBin, ["start", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => stdout.push(chunk));
  child.stderr.on("data", (chunk) => stderr.push(chunk));

  try {
    await waitForServer(baseUrl, child);

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

    assert.match(
      robotsText,
      new RegExp(`Sitemap: ${buildCanonicalUrl("/sitemap.xml").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      "robots.txt should advertise the canonical sitemap URL",
    );

    console.log(
      `HTTP SEO smoke checks passed on ${baseUrl} with ${sitemapUrls.size} sitemap URLs.`,
    );
  } catch (error) {
    const details = [
      `next start stdout:\n${stdout.join("").trim() || "(empty)"}`,
      `next start stderr:\n${stderr.join("").trim() || "(empty)"}`,
    ].join("\n\n");

    if (error instanceof Error) {
      error.message = `${error.message}\n\n${details}`;
    }
    throw error;
  } finally {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
      await once(child, "exit");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
