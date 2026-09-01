import assert from "node:assert/strict";
import { testimonials } from "@/data/testimonials";

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

console.log(`Validated ${testimonials.length} testimonial entries.`);
