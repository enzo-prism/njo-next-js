import assert from "node:assert/strict";
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
  "/contact",
  "/contact/success",
  "/testimonials",
  ...testimonialPages.slice(0, 12).map((item) => `/testimonials/${item.slug}`),
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

console.log(`Validated structured data for ${paths.length} routes.`);
