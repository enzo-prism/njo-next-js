import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  CONFIRMED_TESTIMONIAL_PORTRAITS,
  getLatestFiveStarTestimonial,
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
  "Brittany",
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

const tanya = testimonialPages.find((testimonial) => testimonial.author === "Tanya Harris");
assert.ok(tanya, "Tanya Harris's supplied Google review must be included.");
assert.equal(tanya.source, "google");
assert.equal(tanya.stars, 5);
assert.equal(tanya.slug, "tanya-harris");
assert.equal(tanya.publishedAt, undefined, "Do not turn Google's relative edited date into a publication date.");
assert.equal(tanya.receivedAt, "2026-09-27");
assert.equal(
  tanya.quote,
  "Michael is professional, knowledgeable and responsive but most importantly he listened to what told him I was looking for in this transition from a practice owner to an associate. He was able to find an opportunity for me that is a great fit. The whole process was smooth and stress was kept to a minimum. Highly recommend.",
  "Keep the client-supplied review source-exact.",
);
assert.equal(testimonialPages[0].slug, tanya.slug, "The newly received review should appear first.");
assert.equal(getLatestFiveStarTestimonial()?.slug, tanya.slug, "The homepage should surface the newly received five-star review.");
assert.equal(new Set(testimonialPages.map((testimonial) => testimonial.slug)).size, testimonialPages.length);
assert.deepEqual(
  testimonialPages.filter((testimonial) => !testimonial.publishedAt && !testimonial.receivedAt).map((testimonial) => testimonial.quote),
  testimonials.filter((testimonial) => !testimonial.publishedAt && !testimonial.receivedAt).map((testimonial) => testimonial.quote),
  "Undated reviews should retain their original order.",
);

console.log(`Validated ${testimonials.length} testimonial entries.`);
