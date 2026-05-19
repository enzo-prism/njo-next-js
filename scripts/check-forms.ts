import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { FORMSPREE_ENDPOINTS } from "@/config/form-backends";

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
assert.ok(
  formsDocs.includes(expectedEndpoints.contact) && readme.includes(expectedEndpoints.contact),
  "Contact Formspree endpoint must stay documented in docs/forms-and-backends.md and README.md.",
);

console.log("Validated Formspree form wiring.");

