import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  CAPTION_ADMIN_TOKEN_ENV,
  checkCaptionAdminAuth,
} from "@/lib/caption-admin-auth";
import { withNextServer } from "./lib/next-server";

const TEST_TOKEN = "check-api-security-token-0123456789abcdef";
const VERIFICATION_FILE = "google078b551f409128a8.html";

type CaptionPhoto = { id: string; liveCaption: string | null };

function checkAuthHelper() {
  assert.equal(checkCaptionAdminAuth(`Bearer ${TEST_TOKEN}`, ""), "unconfigured");
  assert.equal(checkCaptionAdminAuth(`Bearer short`, "short"), "unconfigured");
  assert.equal(checkCaptionAdminAuth(null, TEST_TOKEN), "unauthorized");
  assert.equal(checkCaptionAdminAuth("", TEST_TOKEN), "unauthorized");
  assert.equal(checkCaptionAdminAuth(TEST_TOKEN, TEST_TOKEN), "unauthorized");
  assert.equal(checkCaptionAdminAuth(`Basic ${TEST_TOKEN}`, TEST_TOKEN), "unauthorized");
  assert.equal(checkCaptionAdminAuth(`Bearer ${TEST_TOKEN}x`, TEST_TOKEN), "unauthorized");
  assert.equal(checkCaptionAdminAuth(`Bearer ${TEST_TOKEN} extra`, TEST_TOKEN), "unauthorized");
  assert.equal(checkCaptionAdminAuth(`Bearer ${TEST_TOKEN}`, TEST_TOKEN), "authorized");
  assert.equal(checkCaptionAdminAuth(`bearer  ${TEST_TOKEN} `, TEST_TOKEN), "authorized");
}

function patchCaption(baseUrl: string, body: unknown, authorization?: string) {
  return fetch(`${baseUrl}/api/photo-captions`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function listPhotos(baseUrl: string): Promise<CaptionPhoto[]> {
  const response = await fetch(`${baseUrl}/api/photo-captions`);
  assert.equal(response.status, 200, "GET /api/photo-captions should stay public");
  const payload = (await response.json()) as { photos: CaptionPhoto[] };
  assert.ok(payload.photos.length > 0, "Caption catalog should not be empty");
  return payload.photos;
}

async function checkCaptionWritesWithToken(baseUrl: string) {
  const preflight = await fetch(`${baseUrl}/api/photo-captions`, {
    method: "OPTIONS",
    headers: { Origin: "https://njo-dashboard.vercel.app" },
  });
  assert.match(
    preflight.headers.get("access-control-allow-headers") ?? "",
    /\bAuthorization\b/,
    "CORS preflight must allow the Authorization header",
  );

  const [photo] = await listPhotos(baseUrl);
  const edit = { id: photo.id, caption: "check-api-security caption" };

  const anonymous = await patchCaption(baseUrl, edit);
  assert.equal(anonymous.status, 401, "PATCH without a token must be rejected");
  assert.match(anonymous.headers.get("www-authenticate") ?? "", /^Bearer/);

  const wrongToken = await patchCaption(baseUrl, edit, `Bearer ${TEST_TOKEN}-wrong`);
  assert.equal(wrongToken.status, 401, "PATCH with the wrong token must be rejected");

  const unauthorizedPhotos = await listPhotos(baseUrl);
  assert.equal(
    unauthorizedPhotos.find((item) => item.id === photo.id)?.liveCaption,
    photo.liveCaption,
    "Rejected PATCH requests must not change the caption",
  );

  const unknownId = await patchCaption(
    baseUrl,
    { id: "not-a-real-photo", caption: "x" },
    `Bearer ${TEST_TOKEN}`,
  );
  assert.equal(unknownId.status, 404, "Authorized PATCH should still validate the photo id");

  const saved = await patchCaption(baseUrl, edit, `Bearer ${TEST_TOKEN}`);
  assert.equal(saved.status, 200, "PATCH with the configured token should save");
  const afterSave = await listPhotos(baseUrl);
  assert.equal(afterSave.find((item) => item.id === photo.id)?.liveCaption, edit.caption);

  const restored = await patchCaption(
    baseUrl,
    { id: photo.id, caption: photo.liveCaption ?? "" },
    `Bearer ${TEST_TOKEN}`,
  );
  assert.equal(restored.status, 200, "Authorized PATCH should restore the previous caption");
}

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

async function checkCaptionWritesWithoutToken(baseUrl: string) {
  const [photo] = await listPhotos(baseUrl);
  const response = await patchCaption(
    baseUrl,
    { id: photo.id, caption: "should not save" },
    `Bearer ${TEST_TOKEN}`,
  );
  assert.equal(response.status, 503, "PATCH must fail closed when no token is configured");
}

async function main() {
  checkAuthHelper();
  await checkNoVerificationRewrite();

  await withNextServer(
    async (baseUrl) => {
      await checkCaptionWritesWithToken(baseUrl);
      await checkSiteVerification(baseUrl);
    },
    { env: { [CAPTION_ADMIN_TOKEN_ENV]: TEST_TOKEN } },
  );

  await withNextServer(checkCaptionWritesWithoutToken, {
    env: { [CAPTION_ADMIN_TOKEN_ENV]: "" },
  });

  console.log("API security checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
