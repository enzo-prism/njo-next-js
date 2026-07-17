import assert from "node:assert/strict";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { buildPageStructuredData } from "@/seo/route-structured-data";

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

console.log(`Validated structured data for ${paths.length} routes.`);
