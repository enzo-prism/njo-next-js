import assert from "node:assert/strict";
import nextConfig from "../next.config";
import { LEGACY_REDIRECTS } from "@/config/routes";
import { CANONICAL_PROTOCOL, PREFERRED_HOSTNAME } from "@/config/site";
import { getCanonicalRedirectLocation } from "@/seo/canonical";

const requiredLegacyRedirects = [
  "/about",
  "/events",
  "/dr-michael-neal-interview",
  "/testimonials/dr-fat",
  "/testimonials/richard-and-kimberly-crum",
] as const;

for (const route of requiredLegacyRedirects) {
  assert.ok(LEGACY_REDIRECTS[route], `Missing legacy redirect for ${route}`);
}

assert.equal(
  getCanonicalRedirectLocation({
    host: `www.${PREFERRED_HOSTNAME}`,
    protocol: CANONICAL_PROTOCOL,
    originalUrl: "/resources?source=test",
  }),
  `${CANONICAL_PROTOCOL}://${PREFERRED_HOSTNAME}/resources?source=test`,
);

assert.equal(
  getCanonicalRedirectLocation({
    host: PREFERRED_HOSTNAME,
    protocol: CANONICAL_PROTOCOL === "https" ? "http" : "https",
    originalUrl: "/contact",
  }),
  `${CANONICAL_PROTOCOL}://${PREFERRED_HOSTNAME}/contact`,
);

assert.equal(
  getCanonicalRedirectLocation({
    host: PREFERRED_HOSTNAME,
    protocol: CANONICAL_PROTOCOL,
    originalUrl: "/michael-njo-dds/",
  }),
  `${CANONICAL_PROTOCOL}://${PREFERRED_HOSTNAME}/michael-njo-dds`,
);

assert.equal(
  getCanonicalRedirectLocation({
    host: "example.com",
    protocol: "https",
    originalUrl: "/resources",
  }),
  null,
);

async function main() {
  const headerRules = await nextConfig.headers?.();
  const globalHeaders = headerRules?.find((rule) => rule.source === "/:path*")?.headers ?? [];
  const headerMap = new Map(globalHeaders.map((header) => [header.key.toLowerCase(), header.value]));
  for (const requiredHeader of [
    "content-security-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
  ]) {
    assert.ok(headerMap.has(requiredHeader), `Missing global security header: ${requiredHeader}`);
  }
  assert.ok(
    headerMap.get("content-security-policy")?.includes("frame-ancestors 'none'"),
    "Content Security Policy must prevent framing.",
  );

  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects && redirects.length >= 4, "next.config redirects should include legacy mappings");

  for (const [source, destination] of Object.entries(LEGACY_REDIRECTS)) {
    assert.ok(
      redirects?.some(
        (redirect) =>
          redirect.source === source &&
          redirect.destination === destination &&
          redirect.permanent === true,
      ),
      `next.config.ts is missing permanent legacy redirect ${source} -> ${destination}`,
    );
  }

  const hasHttpToHttpsRedirect = redirects?.some(
    (redirect) =>
      redirect.source === "/:path*" &&
      redirect.destination === "https://michaelnjodds.com/:path*" &&
      redirect.has?.some(
        (condition) =>
          condition.type === "header" &&
          condition.key === "x-forwarded-proto" &&
          condition.value === "http",
      ),
  );

  assert.ok(
    hasHttpToHttpsRedirect,
    "Missing http-to-https canonical redirect for apex host in next.config.ts",
  );

  console.log("Redirect assertions passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
