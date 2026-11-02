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
  /<blockquote className="font-serif text-lg leading-relaxed whitespace-pre-line text-slate-700">/,
  "Story quotes must use Merriweather via font-serif and preserve supplied paragraph breaks.",
);

const valentinaQuote = `Michael Njo is truly a miracle worker!

His dedication, connections, and incredible tenacity are what set him apart. He knows how to get things done, overcome obstacles, and guide his clients across the finish line, no matter how challenging the journey becomes.

Throughout the entire process of selling my dental practice, Michael demonstrated extraordinary patience, wisdom, professionalism, and knowledge. He was always there to offer guidance, reassurance, and support, practically holding my hand every step of the way.

What makes Michael truly special is that he genuinely cares about his clients and never gives up on them. His experience, determination, and ability to make things happen are simply remarkable.

If you are looking for someone who will go above and beyond to get you to the finish line, Michael Njo is the person you want by your side. I cannot recommend him highly enough!`;

const valentina = testimonialPages.find((testimonial) => testimonial.author === "Valentina Holina");
assert.ok(valentina, "Valentina Holina's supplied Google review must be included.");
assert.equal(valentina.source, "google");
assert.equal(valentina.stars, 5);
assert.equal(valentina.slug, "valentina-holina");
assert.equal(valentina.publishedAt, undefined, "Do not turn a Google Business Profile notification into a publication date.");
assert.equal(valentina.receivedAt, "2026-10-19");
assert.equal(valentina.photo, undefined, "Valentina Holina must stay quote-only with no initials avatar.");
assert.equal(valentina.quote, valentinaQuote, "Keep the client-supplied review source-exact, including paragraph breaks.");
assert.equal(testimonialPages[0].slug, valentina.slug, "The newly received review should appear first.");
assert.equal(getLatestFiveStarTestimonial()?.slug, valentina.slug, "The homepage should surface the newly received five-star review.");

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
const craigLetterQuote = `To Whom It May Concern;

This letter is in support of the abilities and contributions that Dr. Michael Njo voluntarily brought to University of the Pacific, Arthur A. Dugoni School of Dentistry and, in particular, the Dugoni Business Club.

I am Dr. Craig Yarborough, former executive associate dean, associate dean for admissions, development and alumni relations, and director of the Center for Success at the Dugoni School which overlooked Dr. Njo's oversight with the Dugoni Business Club (DBC). Our relationship began in 2019 when former dean, Dr. Nader Nadershahi, brought him in as an asset and resource. I was fortunate to sit down with him early on to see what he could do with our fledgling but energetic and foundationally skilled DBC. The student members were educated in business and passionate but lacked focus, governance and direction. Dr. Njo immediately assessed the situation, implementing a strategic plan and the governance to sustain the consistent turnover of members that naturally occurred with graduation.

His contributions were notable and impressive, organizing and creating infrastructure for success, implementing:
- Bylaws
- Creating roles and officers
- Governing body - running the meeting like a "real" board...providing life experiences so that they are prepared to go right into leadership in their offices, communities and organized dentistry!
- Succession plan
- Standard Operating Procedures, SOP's, for events
- Calendar of events

This required broad communications among members and the communities they collaborated with, one of many strengths of Dr. Njo. Membership in the DBC increased six-fold, a tribute to his organizational skills, charisma, inspiration, motivation and passion for students, alumni, stakeholders and the profession.

One of Michael's many strengths is his ability to collaborate and bring people together. This was represented by him establishing events and protocols such as inaugurating Dugoni Mixers at our Annual Alumni meeting, drawing initially 25 attendees in independent activity to 180 students, alumni and business entities and now sponsored by our Alumni Association. Additionally, he instituted an Annual Symposium, a kickoff for membership drive and fund raising from industry vendors to sponsor and support the club. With the increased in membership fees, speaker and sponsor contributions and other fund-raising, he encouraged and accomplished philanthropy among its members. This created a surplus of $15K, reducing membership fees and allowing the Club to adopt the habit of giving back. This started with a first-time gift of $1K to the Arthur Dugoni Scholarship with intent to make this an annual commitment.

If you are looking for someone to engage your stakeholders, assess the organization's strengths and weaknesses, form a strategic plan and successfully implement it, Dr. Michael Njo is your man. I am happy to provide any additional comments upon request.

Respectfully,`;

const craigLetter = testimonialPages.find(
  (testimonial) => testimonial.slug === "craig-yarborough-letter-of-recommendation",
);
assert.ok(craigLetter, "Craig Yarborough's letter of recommendation must be included.");
assert.equal(craigLetter.author, "Craig S. Yarborough, DDS, MBA");
assert.equal(craigLetter.publishedAt, "2026-01-06", "Date the letter by its own date.");
assert.equal(craigLetter.photo, undefined, "The letter stays quote-only.");
assert.equal(craigLetter.quote, craigLetterQuote, "Keep the letter source-exact, including paragraph breaks and its list.");
assert.ok(
  testimonialPages.some((testimonial) => testimonial.slug === "craig-s-yarborough-dds-mba"),
  "Craig Yarborough's earlier thank-you card must keep its indexed slug.",
);

assert.equal(new Set(testimonialPages.map((testimonial) => testimonial.slug)).size, testimonialPages.length);
assert.deepEqual(
  testimonialPages.filter((testimonial) => !testimonial.publishedAt && !testimonial.receivedAt).map((testimonial) => testimonial.quote),
  testimonials.filter((testimonial) => !testimonial.publishedAt && !testimonial.receivedAt).map((testimonial) => testimonial.quote),
  "Undated reviews should retain their original order.",
);

console.log(`Validated ${testimonials.length} testimonial entries.`);
