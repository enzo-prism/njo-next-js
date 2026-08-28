import assert from "node:assert/strict";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { buildCommunityPostPath } from "@/data/community-posts";
import { testimonialPages } from "@/data/testimonials";
import { buildPageStructuredData } from "@/seo/route-structured-data";
import { buildUpcomingEventNodes } from "@/seo/structured-data";

const forbiddenTypes = new Set(["Review", "AggregateRating", "Rating"]);

function walk(value: unknown, visitor: (value: unknown) => void) {
  visitor(value);
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visitor));
    return;
  }
  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      walk(nested, visitor);
    }
  }
}

const paths = [
  "/",
  "/michael-njo-dds",
  "/dr-michael-njo-interview",
  "/resources",
  "/contact",
  "/contact/success",
  "/testimonials",
  ...testimonialPages.slice(0, 12).map((item) => `/testimonials/${item.slug}`),
  ...resourceArticles.slice(0, 12).map((item) => buildResourceArticlePath(item.slug)),
];

for (const path of paths) {
  const data = buildPageStructuredData(path);
  assert.ok(data, `Expected structured data for ${path}`);

  walk(data, (node) => {
    if (!node) return;
    if (typeof node === "string" && forbiddenTypes.has(node)) {
      throw new Error(`Forbidden schema type ${node} detected for ${path}`);
    }
  });
}

const dentalExitBlueprintPath = buildResourceArticlePath("dental-exit-blueprint");
const dentalExitBlueprintSchema = buildPageStructuredData(dentalExitBlueprintPath);
assert.ok(dentalExitBlueprintSchema, "Expected structured data for the Dental Exit Blueprint launch");

const dentalExitBlueprintGraph = dentalExitBlueprintSchema["@graph"] as Array<Record<string, unknown>>;
const dentalExitBlueprintBook = dentalExitBlueprintGraph.find((node) => node["@type"] === "Book");
const dentalExitBlueprintNews = dentalExitBlueprintGraph.find((node) => node["@type"] === "NewsArticle");

assert.deepEqual(
  dentalExitBlueprintBook,
  {
    "@type": "Book",
    "@id": "https://michaelnjodds.com/resources/dental-exit-blueprint#book",
    name: "The Dental Exit Blueprint: The 13 EBITDA Levers That Drive Maximum Value",
    description:
      "The Dental Exit Blueprint: The 13 EBITDA Levers That Drive Maximum Value is a new guide led by Elijah Desmond, with Dr. Michael A. Njo as a contributing author.",
    url: "https://dentalexitblueprint.com",
    sameAs: ["https://dentalexitblueprint.com", "https://www.amazon.com/dp/B0H8WL3F6H"],
    image: {
      "@id": "https://michaelnjodds.com/resources/dental-exit-blueprint#primaryimage",
    },
    datePublished: "2026-07-15T00:00:00Z",
    author: {
      "@type": "Person",
      name: "Elijah Desmond",
    },
    contributor: [
      {
        "@type": "Person",
        name: "Michael A. Njo",
      },
    ],
    subjectOf: {
      "@id": "https://michaelnjodds.com/resources/dental-exit-blueprint#launch-announcement",
    },
  },
  "Dental Exit Blueprint book schema changed unexpectedly",
);

assert.ok(dentalExitBlueprintNews, "Dental Exit Blueprint launch must emit NewsArticle schema");
assert.equal(dentalExitBlueprintNews?.datePublished, "2026-07-15T00:00:00Z");
assert.equal(
  dentalExitBlueprintNews?.isBasedOn,
  "https://dental.einnews.com/pr_news/926794522/dental-pitch-advisory-brokerage-launches-29-author-exit-guide-at-the-dykema-dso-conference-2026",
);
assert.ok(!("isbn" in (dentalExitBlueprintBook || {})), "Do not add an unverified Dental Exit Blueprint ISBN");
assert.ok(!("publisher" in (dentalExitBlueprintBook || {})), "Do not add an unverified Dental Exit Blueprint publisher");
assert.ok(!JSON.stringify(dentalExitBlueprintSchema).includes("#1"), "Do not add an unverified #1 claim");

const augustEventNodes = buildUpcomingEventNodes(new Date("2026-08-17T12:00:00-07:00"));
assert.equal(augustEventNodes.length, 3, "October, March, and September 25 Anaheim occurrences should be upcoming in August");
assert.equal(augustEventNodes[0].startDate, "2026-10-02T08:00:00-07:00");
assert.equal(augustEventNodes[1].startDate, "2027-03-12T08:00:00-08:00");
assert.equal(augustEventNodes[2].startDate, "2026-09-25T08:30:00-07:00");
assert.equal(augustEventNodes[2].name, "The Dental Practice Beyond the Chair");
assert.ok(!JSON.stringify(augustEventNodes).includes("2026-04-10"), "Past April event must not remain in schema");
assert.ok(!JSON.stringify(augustEventNodes).includes("2026-07-17"), "Past July event must not remain in schema");
assert.ok(!JSON.stringify(augustEventNodes).includes("leadership-retreat"), "Past retreat must not remain in schema");

const matchPath = buildCommunityPostPath("another-perfect-match");
const matchSchema = buildPageStructuredData(matchPath);
assert.ok(matchSchema, "Expected structured data for the Another perfect match community post");
const matchGraph = matchSchema["@graph"] as Array<Record<string, unknown>>;
const matchArticle = matchGraph.find((node) => node["@type"] === "BlogPosting");
assert.equal(matchArticle?.headline, "Another perfect match");
assert.equal(matchArticle?.datePublished, "2026-08-25");
assert.ok(!JSON.stringify(matchSchema).includes("sold-out"), "Do not claim sold-out for a news match post");
assert.ok(!JSON.stringify(matchSchema).includes("Registration"), "Do not add registration claims for a news match post");

const blueprintPath = buildCommunityPostPath("practice-blueprint-roseville-aug-2026");
const blueprintSchema = buildPageStructuredData(blueprintPath);
assert.ok(blueprintSchema, "Expected structured data for The Practice Blueprint dinner community post");
const blueprintGraph = blueprintSchema["@graph"] as Array<Record<string, unknown>>;
const blueprintArticle = blueprintGraph.find((node) => node["@type"] === "BlogPosting");
assert.equal(blueprintArticle?.headline, "The Practice Blueprint dinner");
assert.equal(blueprintArticle?.datePublished, "2026-08-28");
assert.ok(!JSON.stringify(blueprintSchema).includes("sold-out"), "Do not claim sold-out for a news recap post");
assert.ok(!JSON.stringify(blueprintSchema).includes("Registration"), "Do not add registration claims for a news recap post");
assert.ok(!JSON.stringify(blueprintSchema).includes("panel-of-experts-dinner-roseville"), "Do not reuse the August 14 dinner slug");

console.log(`Validated structured data for ${paths.length} routes.`);
