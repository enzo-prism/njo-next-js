import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE } from "@/config/site";

assert.equal(CONTACT_PATH, "/contact", "Primary consultation CTAs must point to the Contact page.");
assert.equal(CONTACT_EMAIL, "michael@dental-strategies.com", "Contact email should stay aligned with public contact CTAs.");
assert.equal(CONTACT_PHONE, "+16504362939", "Contact phone should stay aligned with public contact CTAs.");

const rootDir = process.cwd();
const scannedExtensions = new Set([".ts", ".tsx", ".md", ".json"]);
const ignoredDirs = new Set([".git", ".next", "node_modules"]);
const forbiddenTokens = [
  "BOOK" + "ING_URL",
  "NEXT_PUBLIC_" + "BOOK" + "ING_URL",
  "calend" + "ly.com",
];

function walkFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    if (ignoredDirs.has(entry)) return [];

    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      return walkFiles(fullPath);
    }

    return scannedExtensions.has(path.extname(fullPath)) ? [fullPath] : [];
  });
}

for (const filePath of walkFiles(rootDir)) {
  const source = readFileSync(filePath, "utf8");
  for (const token of forbiddenTokens) {
    assert.ok(
      !source.toLowerCase().includes(token.toLowerCase()),
      `${path.relative(rootDir, filePath)} must not reintroduce booking URL wiring.`,
    );
  }
}

const contactSource = readFileSync(path.join(rootDir, "src/components/pages/contact.tsx"), "utf8");
assert.ok(contactSource.includes('href="#contact-form"'), "Contact page must expose a jump to the form.");
assert.ok(contactSource.includes("mailto:${CONTACT_EMAIL}"), "Contact page must expose the public email address.");
assert.ok(contactSource.includes("tel:${CONTACT_PHONE}"), "Contact page must expose the public phone number.");

const headerSource = readFileSync(path.join(rootDir, "src/components/layout/site-header.tsx"), "utf8");
const footerSource = readFileSync(path.join(rootDir, "src/components/layout/site-footer.tsx"), "utf8");
assert.ok(headerSource.includes("CONTACT_PATH"), "Header CTA must use the shared Contact page path.");
assert.ok(footerSource.includes("CONTACT_PATH"), "Footer CTA must use the shared Contact page path.");

console.log("Validated contact CTA routing.");
