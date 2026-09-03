import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  CONFIRMED_TESTIMONIAL_PORTRAITS,
  NJO_TESTIMONIAL_INDEX_SLUGS,
  testimonials,
  testimonialPages,
} from "@/data/testimonials";

const offTopicReviewPattern = /\b(fred|heppner|liz\s+armato|armato)\b/i;

const offTopicTestimonials = testimonials.filter((testimonial) =>
  offTopicReviewPattern.test(testimonial.quote),
);

assert.deepEqual(
  offTopicTestimonials.map((testimonial) => testimonial.author),
  [],
  "Testimonials should only include reviews for Michael Njo, Practice Transitions Institute, or Dental Strategies.",
);

const requiredNamedAuthors = [
  "Tony Choi",
  "Brian Valle",
  "G. Allen Herrera, DDS",
  "Blaine Leeds",
  "Gregory Baird",
  "Lawrence Wong",
  "Dr. Lee Boese",
  "Ankit Sidana",
  "Michael and Courtney Wounacott",
  "Andrew Wang, DDS",
];

for (const author of requiredNamedAuthors) {
  assert.ok(
    testimonials.some((testimonial) => testimonial.author === author),
    `Missing named testimonial from ${author}.`,
  );
}

assert.equal(NJO_TESTIMONIAL_INDEX_SLUGS.length, 16, "The Njo testimonials hub is the locked set of 16 slugs.");

for (const slug of NJO_TESTIMONIAL_INDEX_SLUGS) {
  assert.ok(
    testimonialPages.some((testimonial) => testimonial.slug === slug),
    `Missing Njo hub testimonial slug ${slug}.`,
  );
}

for (const [slug, photo] of Object.entries(CONFIRMED_TESTIMONIAL_PORTRAITS)) {
  assert.ok(
    (NJO_TESTIMONIAL_INDEX_SLUGS as readonly string[]).includes(slug),
    `Portrait ${slug} is outside the locked 16-slug Njo hub.`,
  );
  assert.ok(photo, `Portrait entry ${slug} is empty.`);
  assert.ok(photo.src.startsWith("/media/testimonials/"), `Portrait ${slug} must live under /media/testimonials/.`);
  assert.ok(
    existsSync(path.join(process.cwd(), "public", photo.src.replace(/^\//, ""))),
    `Portrait file missing for ${slug}: ${photo.src}`,
  );
  const page = testimonialPages.find((testimonial) => testimonial.slug === slug);
  assert.ok(page?.photo?.src === photo.src, `testimonialPages did not attach the confirmed portrait for ${slug}.`);
}

const unexpectedPortraits = testimonialPages.filter(
  (testimonial) =>
    testimonial.photo &&
    !(NJO_TESTIMONIAL_INDEX_SLUGS as readonly string[]).includes(testimonial.slug),
);
assert.deepEqual(
  unexpectedPortraits.map((testimonial) => testimonial.slug),
  [],
  "Portraits may only attach to the locked 16 Njo hub slugs.",
);

const quoteOnlyHubSlugs = NJO_TESTIMONIAL_INDEX_SLUGS.filter((slug) => !CONFIRMED_TESTIMONIAL_PORTRAITS[slug]);
for (const slug of quoteOnlyHubSlugs) {
  const page = testimonialPages.find((testimonial) => testimonial.slug === slug);
  assert.equal(page?.photo, undefined, `${slug} has no confirmed portrait and must stay quote-only.`);
}

const portraitSources = [
  "src/components/testimonials/testimonial-portrait.tsx",
  "src/components/testimonials/testimonial-card.tsx",
  "src/components/pages/testimonials.tsx",
  "src/components/pages/testimonial-detail.tsx",
];

for (const sourcePath of portraitSources) {
  const source = readFileSync(path.join(process.cwd(), sourcePath), "utf8");
  assert.doesNotMatch(
    source,
    /charAt\(0\)|author\.slice\(0,\s*1\)|firstName\[0\]|avatarFallback/i,
    `${sourcePath} must not invent initials or letter avatars.`,
  );
}

const portraitComponent = readFileSync(
  path.join(process.cwd(), "src/components/testimonials/testimonial-portrait.tsx"),
  "utf8",
);
assert.match(portraitComponent, /index:\s*56/, "Index portraits must be 56px.");
assert.match(portraitComponent, /story:\s*96/, "Story portraits must be 96px.");

const storyPage = readFileSync(
  path.join(process.cwd(), "src/components/pages/testimonial-detail.tsx"),
  "utf8",
);
assert.match(
  storyPage,
  /CardTitle className="font-serif text-3xl"/,
  "Story titles must use Merriweather via font-serif.",
);
assert.match(
  storyPage,
  /<blockquote className="font-serif text-lg leading-relaxed text-slate-700">/,
  "Story quotes must use Merriweather via font-serif.",
);

console.log(`Validated ${testimonials.length} testimonial entries.`);
