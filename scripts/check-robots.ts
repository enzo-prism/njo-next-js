import assert from "node:assert/strict";
import { buildCanonicalUrl } from "@/seo/canonical";
import { buildRobotsRules } from "@/seo/robots-data";

const robots = buildRobotsRules();

const firstRule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;
assert.equal(firstRule?.userAgent, "*");
assert.equal(firstRule?.allow, "/");

const disallow = firstRule?.disallow;
assert.ok(Array.isArray(disallow), "robots disallow must be an array");
assert.ok(disallow.includes("/admin"));
assert.ok(disallow.includes("/api/private"));
assert.ok(disallow.includes("/_internal"));

assert.equal(robots.sitemap, buildCanonicalUrl("/sitemap.xml"));

console.log("Robots assertions passed.");
