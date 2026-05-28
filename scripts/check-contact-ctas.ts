import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { BOOKING_URL, CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, DSO_PRICING_BOOKING_URL } from "@/config/site";

assert.equal(CONTACT_PATH, "/contact", "Primary consultation CTAs must point to the Contact page.");
assert.equal(CONTACT_EMAIL, "michael@dental-strategies.com", "Contact email should stay aligned with public contact CTAs.");
assert.equal(CONTACT_PHONE, "+16504362939", "Contact phone should stay aligned with public contact CTAs.");

// Booking host kept split so this guard never trips its own centralization scan.
const BOOKING_HOST = "calend" + "ly.com";
const EXPECTED_BOOKING_URL = "https://" + BOOKING_HOST + "/michael-dental-strategies/30min";
const EXPECTED_DSO_PRICING_BOOKING_URL =
  "https://" + BOOKING_HOST + "/michael-dental-strategies/dso-pricing-dental-strategies-intro-call";

assert.equal(
  BOOKING_URL,
  EXPECTED_BOOKING_URL,
  "BOOKING_URL must point to the approved Calendly intro-call link.",
);
assert.equal(
  DSO_PRICING_BOOKING_URL,
  EXPECTED_DSO_PRICING_BOOKING_URL,
  "DSO_PRICING_BOOKING_URL must point to the approved Calendly DSO pricing-call link.",
);

const rootDir = process.cwd();
const scannedExtensions = new Set([".ts", ".tsx"]);
const ignoredDirs = new Set([".git", ".next", "node_modules"]);
const bookingConfigFile = path.join("src", "config", "site.ts");

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

// The raw booking host must live only in the centralized config. Every other
// source file is expected to import the shared BOOKING_URL constant.
for (const filePath of walkFiles(rootDir)) {
  const relativePath = path.relative(rootDir, filePath);
  if (relativePath === bookingConfigFile) continue;

  const source = readFileSync(filePath, "utf8");
  assert.ok(
    !source.toLowerCase().includes(BOOKING_HOST.toLowerCase()),
    `${relativePath} must reference the shared BOOKING_URL constant instead of hardcoding the booking link.`,
  );
}

const contactSource = readFileSync(path.join(rootDir, "src/components/pages/contact.tsx"), "utf8");
assert.ok(contactSource.includes('href="#contact-form"'), "Contact page must expose a jump to the form.");
assert.ok(contactSource.includes("mailto:${CONTACT_EMAIL}"), "Contact page must expose the public email address.");
assert.ok(contactSource.includes("tel:${CONTACT_PHONE}"), "Contact page must expose the public phone number.");
assert.ok(contactSource.includes("BookingButton"), "Contact page must surface the booking CTA.");

const headerSource = readFileSync(path.join(rootDir, "src/components/layout/site-header.tsx"), "utf8");
const footerSource = readFileSync(path.join(rootDir, "src/components/layout/site-footer.tsx"), "utf8");
assert.ok(headerSource.includes("CONTACT_PATH"), "Header CTA must use the shared Contact page path.");
assert.ok(footerSource.includes("CONTACT_PATH"), "Footer CTA must use the shared Contact page path.");
assert.ok(headerSource.includes("BookingButton"), "Header must surface the booking CTA.");
assert.ok(footerSource.includes("BookingButton"), "Footer must surface the booking CTA.");

console.log("Validated contact and booking CTA wiring.");
