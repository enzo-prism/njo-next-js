import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { withNextServer } from "./lib/next-server";

const VERIFICATION_FILE = "google078b551f409128a8.html";

type ManifestRoute = { source: string; regex: string };

// `next start` does not apply this rewrite the way Vercel does, so inspect the build output too.
async function checkNoVerificationRewrite() {
  const manifest = JSON.parse(
    await readFile(path.join(process.cwd(), ".next", "routes-manifest.json"), "utf8"),
  ) as {
    rewrites?: ManifestRoute[] | Partial<Record<string, ManifestRoute[]>>;
    dynamicRoutes?: ManifestRoute[];
  };
  const rewrites = Array.isArray(manifest.rewrites)
    ? manifest.rewrites
    : Object.values(manifest.rewrites ?? {}).flatMap((group) => group ?? []);

  for (const route of [...rewrites, ...(manifest.dynamicRoutes ?? [])]) {
    assert.ok(
      !new RegExp(route.regex).test("/google0000000000000000.html"),
      `Route ${route.source} must not answer arbitrary google*.html verification files`,
    );
  }
}

async function checkSiteVerification(baseUrl: string) {
  const verificationBody = await readFile(
    path.join(process.cwd(), "public", VERIFICATION_FILE),
    "utf8",
  );
  const real = await fetch(`${baseUrl}/${VERIFICATION_FILE}`);
  assert.equal(real.status, 200, "The Search Console verification file should be served");
  assert.equal(await real.text(), verificationBody);

  const forged = await fetch(`${baseUrl}/google0000000000000000.html`);
  assert.equal(forged.status, 404, "Unknown google*.html files must not verify");

  const legacyRoute = await fetch(
    `${baseUrl}/api/google-site-verification?file=google0000000000000000.html`,
  );
  assert.equal(legacyRoute.status, 404, "The wildcard verification route must stay removed");
}

async function main() {
  await checkNoVerificationRewrite();

  await withNextServer(async (baseUrl) => {
    await checkSiteVerification(baseUrl);
  });

  console.log("API security checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
