import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FORMSPREE_ENDPOINTS } from "@/config/form-backends";
import { sharedLeadFormFields } from "@/lib/lead-form-validation";
import { serviceInterestOptions } from "@/data/service-interest-options";

const expectedEndpoints = {
  contact: "https://formspree.io/f/manaywyw",
  phillipsEvent: "https://formspree.io/f/mdalbpae",
} as const;

assert.equal(
  FORMSPREE_ENDPOINTS.contact,
  expectedEndpoints.contact,
  "Contact form must submit to the Formspree manaywyw backend.",
);
assert.equal(
  FORMSPREE_ENDPOINTS.phillipsEvent,
  expectedEndpoints.phillipsEvent,
  "Phillips event form must submit to the Formspree mdalbpae backend.",
);

const rootDir = process.cwd();
const contactSource = readFileSync(path.join(rootDir, "src/components/pages/contact.tsx"), "utf8");
const phillipsEventSource = readFileSync(path.join(rootDir, "src/components/pages/phillips-event.tsx"), "utf8");
const formsDocs = readFileSync(path.join(rootDir, "docs/forms-and-backends.md"), "utf8");
const readme = readFileSync(path.join(rootDir, "README.md"), "utf8");
const leadValidationSource = readFileSync(path.join(rootDir, "src/lib/lead-form-validation.ts"), "utf8");
const ga4Source = readFileSync(path.join(rootDir, "src/lib/ga4.ts"), "utf8");
const calendlyTrackerSource = readFileSync(
  path.join(rootDir, "src/components/analytics/calendly-lead-tracker.tsx"),
  "utf8",
);

assert.match(
  contactSource,
  /fetch\(\s*FORMSPREE_ENDPOINTS\.contact\s*,/,
  "Contact form must fetch the centralized contact Formspree endpoint.",
);
assert.match(
  contactSource,
  /router\.push\("\/contact\/success"\)/,
  "Contact form must keep the existing success redirect.",
);
assert.match(
  phillipsEventSource,
  /fetch\(\s*FORMSPREE_ENDPOINTS\.phillipsEvent\s*,/,
  "Phillips event form must fetch the centralized event Formspree endpoint.",
);
assert.ok(
  !existsSync(path.join(rootDir, "src/app/api/contact")) &&
    !existsSync(path.join(rootDir, "src/app/api/forms")),
  "Forms must keep submitting directly to Formspree, not through internal API routes.",
);
for (const [label, source] of [
  ["contact", contactSource],
  ["Phillips event", phillipsEventSource],
] as const) {
  assert.ok(source.includes('payload.append("_gotcha"'), `${label} form must include the spam honeypot.`);
  assert.ok(source.includes("privacyAcknowledged"), `${label} form must require the privacy acknowledgment.`);
  assert.ok(source.includes("LEAD_FORM_LIMITS"), `${label} form must apply shared input limits.`);
  assert.ok(source.includes('trackAnalyticsEvent("form_success"'), `${label} form must track successful conversion.`);
}
assert.ok(
  leadValidationSource.includes("normalizePracticeWebsite") && leadValidationSource.includes("isLeadFormRateLimited"),
  "Shared lead validation must normalize URLs and throttle immediate repeat submissions.",
);
assert.ok(
  ga4Source.includes('getAnalyticsConsent() === "accepted"') &&
    ga4Source.includes("PRODUCTION_HOSTNAME") &&
    ga4Source.includes('trackAnalyticsEvent("generate_lead"'),
  "GA4 lead events must use the canonical-host, consent-gated analytics path.",
);
assert.ok(
  contactSource.includes("recordFormLead(CONTACT_FORM_LEAD_PARAMS)"),
  "Contact success must preserve the consent-gated GA4 generate_lead event.",
);
assert.ok(
  calendlyTrackerSource.includes('document.addEventListener("pointerover", warmWidget') &&
    calendlyTrackerSource.includes("recordFormLead(calendlyFormLeadParams"),
  "Calendly assets must warm on booking intent rather than loading site-wide at mount.",
);
assert.ok(existsSync(path.join(rootDir, "src/app/privacy/page.tsx")), "Privacy Policy route must exist.");
assert.ok(
  formsDocs.includes(expectedEndpoints.contact) && readme.includes(expectedEndpoints.contact),
  "Contact Formspree endpoint must stay documented in docs/forms-and-backends.md and README.md.",
);

async function checkLeadFormResolver() {
  const schema = z.object(sharedLeadFormFields);
  const validInput = {
    name: "  Example Dentist  ",
    email: "  dentist@example.com  ",
    practiceCity: "  San Mateo  ",
    practiceWebsite: " example.com ",
    services: [serviceInterestOptions[0]],
    privacyAcknowledged: true,
    companyWebsite: "",
  };
  const invalidInput = {
    ...validInput,
    name: "",
    email: "invalid",
    practiceCity: "",
    practiceWebsite: "not a website",
    services: [],
    privacyAcknowledged: false,
    companyWebsite: "spam",
  };

  for (const mode of ["async", "sync"] as const) {
    const resolver = zodResolver(schema, undefined, { mode });
    const options = { fields: {}, shouldUseNativeValidation: false };
    const invalid = await resolver(invalidInput, undefined, options);
    assert.deepEqual(invalid.values, {}, `${mode}: invalid input must not become a submission.`);
    for (const field of Object.keys(invalidInput)) {
      assert.ok(
        invalid.errors[field as keyof typeof invalidInput]?.message,
        `${mode}: invalid ${field} must return a field error instead of throwing a ZodError.`,
      );
    }

    const valid = await resolver(validInput, undefined, options);
    assert.deepEqual(valid.errors, {}, `${mode}: valid input must not have field errors.`);
    assert.deepEqual(valid.values, {
      ...validInput,
      name: "Example Dentist",
      email: "dentist@example.com",
      practiceCity: "San Mateo",
      practiceWebsite: "https://example.com",
    }, `${mode}: resolver must preserve trimmed values and the normalized website.`);
  }
}

checkLeadFormResolver().then(() => {
  console.log("Validated Formspree form wiring and shared lead-form resolver behavior.");
}).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
