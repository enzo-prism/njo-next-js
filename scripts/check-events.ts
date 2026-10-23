import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { withIrReplaceableTitle } from "@/components/irreplaceable-book-title";
import { IrreplaceableNewsCard } from "@/components/irreplaceable-news-card";
import CommunityPostDetailPage from "@/components/pages/community-post-detail";
import { buildCommunityPostPath, communityPosts } from "@/data/community-posts";
import {
  eventPrograms,
  getOccurrenceRegistrationPrice,
  getUpcomingEventPrograms,
  isEventOccurrenceUpcoming,
  isOccurrenceEarlyBirdAvailable,
  type EventOccurrence,
} from "@/data/events";
import { buildProfileTabPath, resolveProfileTab } from "@/lib/profile-tabs";
import { buildCanonicalUrl } from "@/seo/canonical";
import { buildRouteMetadata } from "@/seo/metadata";

Object.assign(globalThis, { React });

const IRREPLACEABLE_COVER_SHA256 =
  "e30503f800b0b8786b69aa134069e10f60048f48362efb1d336f39640e0fb0de";
const IRREPLACEABLE_OG_SHA256 =
  "0cc47d17d0b77ed0c1d0a2b162697465a3e7e72c47e18565120404f1bd2c836c";
const IRREPLACEABLE_OG_ALT = "Dr. Njo holding a copy of IrReplaceable by Leah Roling.";
const IRREPLACEABLE_OG_PATH = "/media/irreplaceable-leah-roling-og.jpg";
const IRREPLACEABLE_OG_URL = `${buildCanonicalUrl(IRREPLACEABLE_OG_PATH)}?v=2`;
const NEWS_CARD_DATE_CLASS_EXPR = "{newsCardDateClass}";

function fileSha256(relativePath: string) {
  return createHash("sha256")
    .update(readFileSync(path.join(process.cwd(), relativePath)))
    .digest("hex");
}

const sourceSnapshot = JSON.stringify(eventPrograms);

const beforeSeason = getUpcomingEventPrograms(new Date("2026-01-01T00:00:00-08:00"));
assert.equal(beforeSeason.length, 3, "All published programs should be upcoming at the start of the year");
assert.equal(beforeSeason[0].upcomingDates.length, 6, "All seminar dates should initially be upcoming");
assert.equal(beforeSeason[2].slug, "beyond-the-chair-anaheim");
assert.equal(beforeSeason[2].upcomingDates.length, 1);

const augustView = getUpcomingEventPrograms(new Date("2026-08-17T12:00:00-07:00"));
assert.equal(augustView.length, 2, "Completed programs must not render as upcoming");
assert.equal(augustView[0].slug, "mastering-your-dental-transition");
assert.equal(augustView[0].nextDateLabel, "October 2, 2026");
assert.equal(
  augustView[0].nextOccurrence.location,
  "TDIC Headquarters, 1201 K St, 14th Floor, Sacramento, CA",
);
assert.equal(augustView[0].upcomingDates.length, 4);
assert.equal(augustView[0].completedOccurrences.length, 2);
assert.equal(augustView[0].scheduleLabel, "4 dates");
assert.equal(augustView[0].completedEventsLabel, "2 completed dates");
assert.equal(augustView[1].slug, "beyond-the-chair-anaheim");
assert.equal(augustView[1].nextDateLabel, "September 25, 2026");
assert.equal(augustView[1].locationLabel, "The Phillips Group, 2300 E. Katella Ave, Suite 405, Anaheim, CA");

const afterSeason = getUpcomingEventPrograms(new Date("2026-10-03T00:00:00-07:00"));
assert.equal(afterSeason.length, 1, "The 2027 Anaheim seminar should remain available after the 2026 dates");
assert.equal(afterSeason[0].nextDateLabel, "March 12, 2027");
assert.equal(afterSeason[0].upcomingDates.length, 3);

const afterAnaheim = getUpcomingEventPrograms(new Date("2027-03-13T00:00:00-08:00"));
assert.equal(afterAnaheim.length, 1, "2027 San Francisco and Sacramento seminar dates remain after Anaheim");
assert.equal(afterAnaheim[0].nextDateLabel, "July 30, 2027");
assert.equal(
  afterAnaheim[0].nextOccurrence.location,
  "University of the Pacific (UOP) Arthur A. Dugoni School of Dentistry, San Francisco, CA",
);
assert.equal(afterAnaheim[0].upcomingDates.length, 2);

const afterSanFrancisco = getUpcomingEventPrograms(new Date("2027-07-31T00:00:00-07:00"));
assert.equal(afterSanFrancisco.length, 1, "Sacramento October 15, 2027 should remain after San Francisco");
assert.equal(afterSanFrancisco[0].nextDateLabel, "October 15, 2027");
assert.equal(
  afterSanFrancisco[0].nextOccurrence.location,
  "TDIC Headquarters, 1201 K St, 14th Floor, Sacramento, CA",
);

const afterFinal = getUpcomingEventPrograms(new Date("2027-10-16T00:00:00-07:00"));
assert.deepEqual(afterFinal, [], "No seminar should remain open after the final occurrence");

const inProgressOccurrence: EventOccurrence = {
  dateLabel: "Test",
  timeLabel: "Multi-day",
  location: "Test location",
  startDateTime: "2026-06-04T09:00:00-04:00",
  endDateTime: "2026-06-06T17:00:00-04:00",
};
assert.equal(
  isEventOccurrenceUpcoming(inProgressOccurrence, new Date("2026-06-05T12:00:00-04:00")),
  true,
  "An in-progress multi-day event should remain current until its end",
);
assert.equal(
  isEventOccurrenceUpcoming(inProgressOccurrence, new Date("2026-06-06T18:00:00-04:00")),
  false,
  "A multi-day event should close after its end",
);

assert.equal(JSON.stringify(eventPrograms), sourceSnapshot, "Date derivation must not mutate editorial event data");

assert.equal(resolveProfileTab("?tab=news", ""), "news", "The news query should open the news tab");
assert.equal(
  resolveProfileTab("", "#dental-lifestyles-40-over-40-2026"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#irreplaceable-leah-roling"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#backstage-business-spotlight-michael-njo"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#diana-fat-board-of-regents"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#practice-blueprint-roseville-aug-2026"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#another-perfect-match"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#beyond-the-chair-anaheim"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#panel-of-experts-dinner"),
  "news",
  "A direct news-section hash should open the news tab without requiring a query parameter",
);
assert.equal(
  resolveProfileTab("", "#sacramento-seminar-oct-2026"),
  "news",
  "The Sacramento seminar hash should open the news-tab calendar",
);
assert.equal(resolveProfileTab("", "#education-title"), "overview", "Overview hashes should not open the news tab");
assert.equal(
  buildProfileTabPath({
    pathname: "/michael-njo-dds",
    search: "?utm_source=newsletter",
    hash: "#panel-of-experts-dinner",
    tab: "news",
  }),
  "/michael-njo-dds?utm_source=newsletter&tab=news#panel-of-experts-dinner",
  "Selecting news should preserve unrelated query parameters and shareable hashes",
);
assert.equal(
  buildProfileTabPath({
    pathname: "/michael-njo-dds",
    search: "",
    hash: "#education-title",
    tab: "news",
  }),
  "/michael-njo-dds?tab=news",
  "Selecting news should discard a hash that belongs to hidden overview content",
);
assert.equal(
  buildProfileTabPath({
    pathname: "/michael-njo-dds",
    search: "?tab=news&utm_source=newsletter",
    hash: "#panel-of-experts-dinner",
    tab: "overview",
  }),
  "/michael-njo-dds?utm_source=newsletter",
  "Selecting overview should remove stale news state while preserving unrelated query parameters",
);

const beyondTheChair = eventPrograms.find((program) => program.slug === "beyond-the-chair-anaheim");
assert.ok(
  beyondTheChair?.registrationUrl?.startsWith("https://practicetransitionsinstitute.com/"),
  "Beyond the Chair must hand current registration intent to PTI",
);

const seminar = eventPrograms.find((program) => program.slug === "mastering-your-dental-transition");
assert.ok(seminar, "Mastering Your Dental Transition program must exist");
assert.equal(
  seminar?.upcomingDates?.filter((occurrence) => occurrence.startDateTime.startsWith("2026-10-02")).length,
  1,
  "Do not duplicate the October 2, 2026 Sacramento date",
);
const sacramento = seminar?.upcomingDates?.find((occurrence) => occurrence.id === "sacramento-seminar-oct-2026");
assert.ok(sacramento, "Sacramento October 2 occurrence must keep a stable calendar id");
assert.equal(sacramento?.location, "TDIC Headquarters, 1201 K St, 14th Floor, Sacramento, CA");
assert.equal(sacramento?.timeLabel, "8am - 3pm");
assert.equal(sacramento?.startDateTime, "2026-10-02T08:00:00-07:00");
assert.equal(sacramento?.endDateTime, "2026-10-02T15:00:00-07:00");
assert.equal(sacramento?.flyerImage, "/media/sacramento-seminar-oct-2026.webp");
assert.equal(
  sacramento?.flyerImageAlt,
  "Practice Transitions Institute Sacramento seminar flyer, October 2 2026 at TDIC Headquarters.",
);
assert.equal(sacramento?.guestLabel, "Special Sacramento guest: TDIC");
assert.deepEqual(
  sacramento?.speakers?.map((speaker) => speaker.name),
  ["Liz Armato", "Dr. Michael Njo"],
);
assert.equal(
  seminar?.registrationUrl,
  "https://practicetransitionsinstitute.com/events/practice-transition-seminar",
);
assert.equal(sacramento?.registrationPhoneDisplay, "(833) 784-1121");
assert.equal(
  isOccurrenceEarlyBirdAvailable(sacramento as EventOccurrence, new Date("2026-09-01T12:00:00-07:00")),
  true,
  "Early bird must remain available on September 1, 2026",
);
assert.equal(
  getOccurrenceRegistrationPrice(sacramento as EventOccurrence, new Date("2026-09-01T12:00:00-07:00")),
  297,
);
assert.equal(
  isOccurrenceEarlyBirdAvailable(sacramento as EventOccurrence, new Date("2026-09-03T00:00:00-07:00")),
  false,
  "Early bird must close after September 2, 2026",
);
assert.equal(
  getOccurrenceRegistrationPrice(sacramento as EventOccurrence, new Date("2026-09-03T00:00:00-07:00")),
  397,
);
assert.equal(
  communityPosts.some((post) => /sacramento seminar/i.test(`${post.slug} ${post.title}`)),
  false,
  "Sacramento seminar must stay on the calendar and not become a news/community post",
);

const sacramento2027 = seminar?.upcomingDates?.find((occurrence) =>
  occurrence.startDateTime.startsWith("2027-10-15"),
);
assert.ok(sacramento2027, "Sacramento October 15, 2027 must be on the seminar calendar");
assert.equal(sacramento2027?.dateLabel, "October 15, 2027");
assert.equal(sacramento2027?.timeLabel, "8am - 3pm");
assert.equal(sacramento2027?.location, "TDIC Headquarters, 1201 K St, 14th Floor, Sacramento, CA");
assert.equal(sacramento2027?.endDateTime, "2027-10-15T15:00:00-07:00");
assert.equal(sacramento2027?.flyerImage, undefined, "Do not reuse the 2026 Sacramento flyer on the 2027 date");

const sanFrancisco2027 = seminar?.upcomingDates?.find((occurrence) =>
  occurrence.startDateTime.startsWith("2027-07-30"),
);
assert.ok(sanFrancisco2027, "San Francisco July 30, 2027 must be on the seminar calendar");
assert.equal(sanFrancisco2027?.dateLabel, "July 30, 2027");
assert.equal(sanFrancisco2027?.timeLabel, "8am - 3pm");
assert.equal(
  sanFrancisco2027?.location,
  "University of the Pacific (UOP) Arthur A. Dugoni School of Dentistry, San Francisco, CA",
);
assert.equal(sanFrancisco2027?.endDateTime, "2027-07-30T15:00:00-07:00");
assert.equal(
  communityPosts.some((post) => /july 30, 2027|october 15, 2027/i.test(`${post.slug} ${post.title} ${post.body.join(" ")}`)),
  false,
  "2027 calendar dates must not become news/community posts",
);

const fortyOverFortyPost = communityPosts.find((post) => post.slug === "dental-lifestyles-40-over-40-2026");
assert.ok(fortyOverFortyPost, "Dental Lifestyles 40 Over 40 news post must exist");
assert.equal(fortyOverFortyPost?.publishedAt, "2026-10-23");
const fortyOverFortyBody = fortyOverFortyPost?.body.join(" ") ?? "";
assert.equal(fortyOverFortyPost?.link?.href, "https://dentallifestylesmagazine.com/dental-lifestyles-magazine-16th-issue/");
assert.equal(fortyOverFortyPost?.link?.label, "Read the issue");
assert.equal(
  fortyOverFortyPost?.image?.src,
  "/media/dental-lifestyles-40-over-40-honoree-2026.webp",
);
assert.equal(
  fortyOverFortyPost?.images?.[0]?.src,
  "/media/dental-lifestyles-40-over-40-honoree-2026.webp",
);
assert.equal(
  fortyOverFortyPost?.images?.[1]?.src,
  "/media/dental-lifestyles-magazine-16th-issue.webp",
);
assert.equal(fortyOverFortyPost?.image?.width, 1247);
assert.equal(fortyOverFortyPost?.image?.height, 1261);
assert.equal(fortyOverFortyPost?.images?.[0]?.width, 1247);
assert.equal(fortyOverFortyPost?.images?.[0]?.height, 1261);
assert.equal(fortyOverFortyPost?.socialImage?.src, "/media/dental-lifestyles-40-over-40-og.jpg");
assert.equal(fortyOverFortyPost?.socialImage?.width, 1200);
assert.equal(fortyOverFortyPost?.socialImage?.height, 630);
assert.equal(
  existsSync(path.join(process.cwd(), "public/media/dental-lifestyles-40-over-40-og.jpg")),
  true,
);
assert.equal(
  existsSync(path.join(process.cwd(), "public/media/dental-lifestyles-40-over-40-honoree-2026.webp")),
  true,
);
assert.equal(
  existsSync(path.join(process.cwd(), "public/media/dental-lifestyles-40-over-40-2026.webp")),
  false,
  "Unused publisher personalized graphic must be removed",
);
assert.equal(
  /https?:\/\//.test(fortyOverFortyBody),
  false,
  "40 Over 40 body must use the labeled issue link, not a raw URL",
);
assert.equal(
  /\b(Mike|Michael)\b/.test(fortyOverFortyBody),
  false,
  "40 Over 40 post copy must stay first-person and must not name him Mike or Michael",
);
assert.deepEqual(
  fortyOverFortyPost?.body,
  [
    "I am honored to be named one of Dental Lifestyles Magazine’s 2026 40 Over 40 awardees!",
    "After more than 30 years in dentistry, I’m grateful for the opportunities to learn, grow, and support fellow dentists as they navigate the many stages of practice ownership and transition.",
    "Thank you to Dental Lifestyles Magazine and the Nifty Thrifty Dentists community for this recognition. I’m proud to be part of a profession that continues to inspire me, and I look forward to helping more dentists build meaningful, successful futures.",
  ],
  "40 Over 40 body must stay the three approved paragraphs and must not add the pending issue sentence",
);
assert.equal(fortyOverFortyPost?.imageLayout, "stacked-hero");
assert.equal(
  fortyOverFortyBody.includes("Please check out the latest issue"),
  false,
  "Do not add the omitted Please check out the latest issue sentence",
);
assert.equal(
  /#\w|@Dental/.test(fortyOverFortyBody),
  false,
  "40 Over 40 body must not include hashtags or @-tags",
);
assert.equal(
  communityPosts.some((post) => post.slug === "dental-lifestyles-40-over-40-2026" && /eventbrite|registration/i.test(post.body.join(" "))),
  false,
  "40 Over 40 honor is news only and must not become an event listing",
);
assert.deepEqual(
  communityPosts.filter((post) => post.publishedAt === "2026-10-23").map((post) => post.slug),
  ["dental-lifestyles-40-over-40-2026", "irreplaceable-leah-roling"],
  "On the shared October 23 date, 40 Over 40 must render before IrReplaceable",
);

const irreplaceablePost = communityPosts.find((post) => post.slug === "irreplaceable-leah-roling");
assert.ok(irreplaceablePost, "IrReplaceable news post must exist");
assert.equal(irreplaceablePost?.publishedAt, "2026-10-23");
assert.equal(irreplaceablePost?.title, "Dr. Njo recommends IrReplaceable by Leah Roling");
assert.equal(irreplaceablePost?.image?.src, "/media/irreplaceable-leah-roling-dr-njo.webp");
assert.equal(irreplaceablePost?.image?.width, 1122);
assert.equal(irreplaceablePost?.image?.height, 1402);
assert.equal(irreplaceablePost?.socialImage?.src, IRREPLACEABLE_OG_PATH);
assert.equal(irreplaceablePost?.socialImage?.width, 1200);
assert.equal(irreplaceablePost?.socialImage?.height, 630);
assert.equal(irreplaceablePost?.socialImage?.alt, IRREPLACEABLE_OG_ALT);
assert.equal(irreplaceablePost?.socialImage?.cacheVersion, "2");
assert.equal(irreplaceablePost?.link, undefined, "IrReplaceable post must not add an external book link");
const irreplaceableSentCopy =
  "As a dentist and practice consultant, I see how easily business owners become the person everyone depends on for every decision. The focus of Leah Roling’s IrReplaceable—building accountable teams and growing without burnout—speaks directly to that challenge. Role clarity, ownership, and strong leadership are essential to building a business that supports both its team and its owner. These are meaningful topics for any practice owner who wants sustainable growth and more freedom.";
assert.deepEqual(
  irreplaceablePost?.body,
  [irreplaceableSentCopy],
  "IrReplaceable body must stay Dr. Njo's one sent paragraph, including the curly apostrophe",
);
assert.equal(irreplaceablePost?.body.length, 1);
assert.ok(
  irreplaceablePost?.body[0]?.includes("Roling’s"),
  "IrReplaceable body must use the curly apostrophe in Roling’s",
);
const irreplaceableBody = irreplaceablePost?.body.join(" ") ?? "";
assert.equal(
  /\b(Mike|Michael)\b/.test(`${irreplaceablePost?.title} ${irreplaceablePost?.description} ${irreplaceableBody}`),
  false,
  "IrReplaceable post copy must refer to him as Dr. Njo, not Mike or Michael",
);
assert.equal(
  /https?:\/\//.test(irreplaceableBody),
  false,
  "IrReplaceable post must not add an external book link",
);
assert.equal(
  communityPosts.some((post) => post.slug === "irreplaceable-leah-roling" && /eventbrite|registration/i.test(post.body.join(" "))),
  false,
  "IrReplaceable recommendation is news only and must not become an event listing",
);
assert.equal(
  communityPosts.some((post) => post.slug === "thank-you-valentina-holina"),
  false,
  "Do not ship an unrequested Valentina thank-you news post",
);

const communityPostDetailSource = readFileSync(
  path.join(process.cwd(), "src/components/pages/community-post-detail.tsx"),
  "utf8",
);
const profileNewsSource = readFileSync(
  path.join(process.cwd(), "src/components/pages/michael-njo-dds.tsx"),
  "utf8",
);
const irreplaceableNewsCardSource = readFileSync(
  path.join(process.cwd(), "src/components/irreplaceable-news-card.tsx"),
  "utf8",
);
assert.ok(
  communityPostDetailSource.includes("break-words") && communityPostDetailSource.includes("overflow-wrap:anywhere"),
  "Community post body paragraphs must wrap long words on narrow viewports",
);
assert.ok(
  communityPostDetailSource.includes("post.link") && communityPostDetailSource.includes('rel="noopener noreferrer"'),
  "Community posts must be able to render a labeled external link",
);
assert.ok(
  communityPostDetailSource.includes('className="max-w-[54ch] break-words [overflow-wrap:anywhere]"'),
  "Community post body paragraphs must default to the 54ch measure",
);
assert.equal(
  communityPostDetailSource.includes("bodyMeasure") || communityPostDetailSource.includes("max-w-[68ch]"),
  false,
  "Community post body paragraphs must not keep a bodyMeasure opt-in or the 68ch measure",
);
assert.equal(
  communityPosts.some((post) => "bodyMeasure" in post),
  false,
  "Community posts must not carry a bodyMeasure opt-in",
);
assert.equal(communityPosts.length, 15, "Community post inventory must stay at 15 posts");
assert.deepEqual(
  communityPosts.filter((post) => post.imageLayout === "stacked-hero").map((post) => post.slug),
  ["dental-lifestyles-40-over-40-2026"],
  "Only the 40 Over 40 post may opt into the stacked hero layout",
);
for (const slug of [
  "another-perfect-match",
  "panel-of-experts-dinner-roseville",
  "backstage-retreat-2026-orlando",
  "dental-lifestyles-magazine-beyond-brokerage",
  "san-francisco-seminar-july-2026",
  "dugoni-business-club-highlights",
] as const) {
  const post = communityPosts.find((entry) => entry.slug === slug);
  assert.ok(post, `${slug} must exist`);
  assert.notEqual(post?.imageLayout, "stacked-hero", `${slug} must keep the original multi-image grid`);
  assert.ok((post?.images?.length ?? 0) >= 2, `${slug} must still be a multi-image post`);
}

function renderCommunityPost(slug: string) {
  const post = communityPosts.find((entry) => entry.slug === slug);
  assert.ok(post, `${slug} must exist`);
  return renderToStaticMarkup(createElement(CommunityPostDetailPage, { post }));
}

function countBodyMeasure(html: string) {
  return html.split("max-w-[54ch]").length - 1;
}

for (const post of communityPosts) {
  const html = renderCommunityPost(post.slug);
  const expected = post.body.length + (post.link ? 1 : 0);
  assert.equal(
    countBodyMeasure(html),
    expected,
    `${post.slug} must put 54ch on every body paragraph and labeled link`,
  );
  assert.equal(html.includes("max-w-[68ch]"), false, `${post.slug} must not use the 68ch measure`);
}

const fortyOverFortyHtml = renderCommunityPost("dental-lifestyles-40-over-40-2026");
assert.ok(
  fortyOverFortyHtml.includes("w-[80%]") &&
    fortyOverFortyHtml.includes("sm:w-[60%]") &&
    fortyOverFortyHtml.includes("max-w-[538px]") &&
    fortyOverFortyHtml.includes("(max-width: 639px) 80vw, (max-width: 768px) 60vw, 538px"),
  "Rendered 40 Over 40 promo must request 80vw below 640, 60vw through 768, and 538px after",
);
assert.equal(
  /sm:grid-cols-[23]/.test(fortyOverFortyHtml),
  false,
  "Rendered 40 Over 40 page must not use the shared multi-image grid",
);
assert.equal(
  countBodyMeasure(fortyOverFortyHtml),
  4,
  "Rendered 40 Over 40 body must put 54ch on all three paragraphs and the issue link",
);
assert.ok(
  fortyOverFortyHtml.includes("text-[13px]"),
  "Rendered community post tag pill must be 13px",
);

const dugoniHtml = renderCommunityPost("dugoni-business-club-highlights");
assert.ok(
  dugoniHtml.includes("sm:grid-cols-3"),
  "Rendered Dugoni post must keep the original shared multi-image grid",
);
assert.equal(
  dugoniHtml.includes("w-[60%]") || dugoniHtml.includes("w-[80%]") || dugoniHtml.includes("max-w-[538px]"),
  false,
  "Rendered Dugoni post must not receive the 40 Over 40 promo width",
);
assert.ok(
  dugoniHtml.includes("max-w-[54ch]"),
  "Rendered Dugoni post must use the shared 54ch body measure",
);

const fortyOverFortyMetadata = buildRouteMetadata(buildCommunityPostPath("dental-lifestyles-40-over-40-2026"));
const fortyOverFortyOgImages = fortyOverFortyMetadata.openGraph?.images;
const fortyOverFortyOgImage = Array.isArray(fortyOverFortyOgImages)
  ? fortyOverFortyOgImages[0]
  : fortyOverFortyOgImages;
assert.ok(fortyOverFortyOgImage && typeof fortyOverFortyOgImage === "object");
assert.equal(
  "url" in fortyOverFortyOgImage ? fortyOverFortyOgImage.url : undefined,
  "/media/dental-lifestyles-40-over-40-og.jpg",
);
assert.equal(
  "width" in fortyOverFortyOgImage ? fortyOverFortyOgImage.width : undefined,
  1200,
);
assert.equal(
  "height" in fortyOverFortyOgImage ? fortyOverFortyOgImage.height : undefined,
  630,
);
assert.deepEqual(fortyOverFortyMetadata.twitter?.images, ["/media/dental-lifestyles-40-over-40-og.jpg"]);
assert.equal(
  fortyOverFortyPost?.image?.src,
  "/media/dental-lifestyles-40-over-40-honoree-2026.webp",
  "On-page honoree graphic must stay the unaltered original",
);

const irreplaceableMetadata = buildRouteMetadata(buildCommunityPostPath("irreplaceable-leah-roling"));
const irreplaceableOgImages = irreplaceableMetadata.openGraph?.images;
const irreplaceableOgImage = Array.isArray(irreplaceableOgImages)
  ? irreplaceableOgImages[0]
  : irreplaceableOgImages;
assert.ok(irreplaceableOgImage && typeof irreplaceableOgImage === "object");
assert.equal(
  "url" in irreplaceableOgImage ? irreplaceableOgImage.url : undefined,
  IRREPLACEABLE_OG_URL,
);
assert.equal("width" in irreplaceableOgImage ? irreplaceableOgImage.width : undefined, 1200);
assert.equal("height" in irreplaceableOgImage ? irreplaceableOgImage.height : undefined, 630);
assert.deepEqual(irreplaceableMetadata.twitter?.images, [IRREPLACEABLE_OG_URL]);
assert.equal(
  "alt" in irreplaceableOgImage ? irreplaceableOgImage.alt : undefined,
  IRREPLACEABLE_OG_ALT,
);
assert.equal(
  irreplaceablePost?.image?.src,
  "/media/irreplaceable-leah-roling-dr-njo.webp",
  "On-page IrReplaceable cover must stay the pinned original webp",
);
assert.equal(
  fileSha256("public/media/irreplaceable-leah-roling-dr-njo.webp"),
  IRREPLACEABLE_COVER_SHA256,
  "On-page IrReplaceable cover bytes must stay pinned",
);
assert.equal(
  fileSha256("public/media/irreplaceable-leah-roling-og.jpg"),
  IRREPLACEABLE_OG_SHA256,
  "IrReplaceable OG JPEG bytes must stay pinned",
);

const irreplaceableTitleMarkup = '<em><span class="line-through">Ir</span>Replaceable</em>';

function htmlTextContent(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

function countMarkup(html: string) {
  return html.split(irreplaceableTitleMarkup).length - 1;
}

function extractTag(html: string, tag: string) {
  return html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";
}

function extractEm(html: string) {
  return html.match(/<em>([\s\S]*?)<\/em>/)?.[0] ?? "";
}

function accessibleNameFromMarkup(html: string) {
  // Markup name only: do not invent word boundaries from sr-only / 1px CSS.
  const labeled = html.match(/\saria-label="([^"]+)"/);
  if (labeled) {
    return labeled[1];
  }
  const withoutHidden = html.replace(
    /<([a-zA-Z0-9]+)([^>]*\saria-hidden="true"[^>]*)>([\s\S]*?)<\/\1>/g,
    "",
  );
  return htmlTextContent(withoutHidden).replace(/\s+/g, " ").trim();
}

function newsTabCardsSource(profileSource: string) {
  const newsStart = profileSource.indexOf('<TabsContent value="news"');
  assert.ok(newsStart >= 0, "Profile must have a News tab");
  const upcoming = profileSource.indexOf('id="upcoming-events"', newsStart);
  assert.ok(upcoming > newsStart, "News tab must keep upcoming events after the news cards");
  return profileSource.slice(newsStart, upcoming);
}

function newsArticleDateClasses(source: string) {
  return [...source.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map((match, index) => {
    const opening = match[0].match(/<article\b[^>]*>/)?.[0] ?? "";
    const id =
      opening.match(/\bid="([^"]+)"/)?.[1] ??
      opening.match(/\bid=\{([^}]+)\}/)?.[1] ??
      `article-${index + 1}`;
    const firstParagraph = match[1].match(
      /<p\s+className=(\{newsCardDateClass\}|"[^"]*")\s*>/,
    );
    return { id, dateClass: firstParagraph?.[1] ?? "" };
  });
}

function assertNewsCardDates(profileSource: string, newsCardSource: string) {
  const cards = newsArticleDateClasses(newsTabCardsSource(profileSource));
  assert.ok(cards.length > 0, "News tab must render at least one news card");
  for (const card of cards) {
    assert.equal(
      card.dateClass,
      NEWS_CARD_DATE_CLASS_EXPR,
      `News card ${card.id} date must use newsCardDateClass`,
    );
  }
  const irreplaceableCards = newsArticleDateClasses(newsCardSource);
  assert.equal(irreplaceableCards.length, 1, "IrReplaceable News card must be one article");
  assert.equal(
    irreplaceableCards[0]?.dateClass,
    NEWS_CARD_DATE_CLASS_EXPR,
    "IrReplaceable News card date must use newsCardDateClass",
  );
}

function withSyntheticNewsCard(profileSource: string, dateClassAttr: string) {
  const marker = `<div id="upcoming-events"`;
  const at = profileSource.indexOf(marker);
  assert.ok(at >= 0, "Profile News tab must include upcoming-events after the news cards");
  const card = `            <article
              id="synthetic-news-card"
              className={\`\${panel} scroll-mt-28 space-y-4\`}
            >
              <p className=${dateClassAttr}>
                October 23, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                Synthetic news card
              </h2>
            </article>

`;
  return profileSource.slice(0, at) + card + profileSource.slice(at);
}

function assertBookTitleNode(html: string, label: string) {
  const em = extractEm(html);
  assert.equal(em.includes(irreplaceableTitleMarkup) || em === irreplaceableTitleMarkup, true, `${label} must use the line-through span`);
  assert.equal(htmlTextContent(em), "IrReplaceable", `${label} textContent must be exactly IrReplaceable`);
  assert.equal(accessibleNameFromMarkup(em), "IrReplaceable", `${label} accessible name must be exactly IrReplaceable`);
  assert.equal(
    em.includes("sr-only") || em.includes("aria-hidden") || /<s[\s/>]/.test(em) || em.includes("aria-label"),
    false,
    `${label} must not use sr-only, aria-hidden, s, or aria-label`,
  );
}

const irreplaceableH1Html = renderToStaticMarkup(
  createElement("h1", null, withIrReplaceableTitle("IrReplaceable")),
);
assert.equal(htmlTextContent(irreplaceableH1Html), "IrReplaceable", "H1 textContent must be exactly IrReplaceable");
assert.equal(accessibleNameFromMarkup(irreplaceableH1Html), "IrReplaceable", "H1 accessible name must be exactly IrReplaceable");

const irreplaceableHtml = renderCommunityPost("irreplaceable-leah-roling");
assert.equal(
  countBodyMeasure(irreplaceableHtml),
  1,
  "Rendered IrReplaceable body must use the 54ch measure once",
);
const irreplaceablePageH1 = extractTag(irreplaceableHtml, "h1");
const irreplaceableSubtitle =
  irreplaceableHtml.match(/<p class="max-w-3xl[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
const irreplaceableBodyHtml = irreplaceableHtml.split("</header>")[1] ?? "";
assert.equal(countMarkup(irreplaceablePageH1), 1, "IrReplaceable H1 must contain the title markup once");
assert.equal(countMarkup(irreplaceableSubtitle), 1, "IrReplaceable subtitle must contain the title markup once");
assert.equal(countMarkup(irreplaceableBodyHtml), 1, "IrReplaceable body must contain the title markup once");
assert.equal(countMarkup(irreplaceableHtml), 3, "IrReplaceable post must render the title markup exactly 3 times: H1, subtitle, body");
assertBookTitleNode(irreplaceablePageH1, "H1");
assertBookTitleNode(irreplaceableSubtitle, "subtitle");
assertBookTitleNode(irreplaceableBodyHtml, "body");
assert.equal(
  htmlTextContent(irreplaceablePageH1),
  "Dr. Njo recommends IrReplaceable by Leah Roling",
  "Rendered IrReplaceable H1 textContent must not double or split Ir",
);

const irreplaceableNewsCardHtml = renderToStaticMarkup(createElement(IrreplaceableNewsCard));
const irreplaceableNewsH2 = extractTag(irreplaceableNewsCardHtml, "h2");
const irreplaceableNewsBody =
  irreplaceableNewsCardHtml.match(/<p class="text-pretty[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
assert.equal(countMarkup(irreplaceableNewsH2), 1, "News card title must contain the title markup once");
assert.equal(countMarkup(irreplaceableNewsBody), 1, "News card body must contain the title markup once");
assert.equal(countMarkup(irreplaceableNewsCardHtml), 2, "News card must render the title markup in the H2 and body only");
assertBookTitleNode(irreplaceableNewsH2, "News card title");
assertBookTitleNode(irreplaceableNewsBody, "News card body");
assert.ok(
  htmlTextContent(irreplaceableNewsCardHtml).includes(irreplaceableSentCopy),
  "News card must render Dr. Njo's full sent paragraph",
);
assert.ok(
  irreplaceableNewsCardHtml.includes("As a dentist and practice consultant"),
  "Rendered News card must include the opening of Dr. Njo's sent paragraph",
);
assert.ok(
  irreplaceableNewsCardHtml.includes("text-[13px]"),
  "Rendered News card date must stay 13px",
);
assert.equal(
  /<p class="text-xs /.test(irreplaceableNewsCardHtml),
  false,
  "Rendered News card date must not fall back to text-xs",
);
assert.ok(
  irreplaceableNewsCardSource.includes("export const newsCardDateClass =") &&
    irreplaceableNewsCardSource.includes('"text-[13px] font-semibold uppercase tracking-[0.2em] text-brand"'),
  "News card date class must stay 13px",
);
assertNewsCardDates(profileNewsSource, irreplaceableNewsCardSource);
{
  const textXsCard = withSyntheticNewsCard(
    profileNewsSource,
    '"text-xs font-semibold uppercase tracking-[0.2em] text-brand"',
  );
  assert.ok(textXsCard.includes('id="synthetic-news-card"'));
  assert.throws(
    () => assertNewsCardDates(textXsCard, irreplaceableNewsCardSource),
    /synthetic-news-card/,
    "A new News card date using text-xs must fail",
  );
  const styledCard = withSyntheticNewsCard(profileNewsSource, NEWS_CARD_DATE_CLASS_EXPR);
  assert.ok(styledCard.includes('id="synthetic-news-card"'));
  assertNewsCardDates(styledCard, irreplaceableNewsCardSource);
}
assert.ok(
  irreplaceableNewsCardSource.includes("withIrReplaceableTitle(irreplaceableCommunityPost.title)") &&
    irreplaceableNewsCardSource.includes("withIrReplaceableTitle(paragraph)"),
  "IrReplaceable news card title and body must render through the shared title helper",
);
assert.ok(
  profileNewsSource.includes("<IrreplaceableNewsCard />"),
  "Profile News tab must render the shared IrReplaceable news card",
);

const spotlightPost = communityPosts.find((post) => post.slug === "backstage-business-spotlight-michael-njo");
assert.ok(spotlightPost, "Backstage Business Spotlight news post must exist");
assert.equal(spotlightPost?.publishedAt, "2026-09-21");
const spotlightBody = spotlightPost?.body.join(" ") ?? "";
assert.ok(
  spotlightBody.includes("https://www.linkedin.com/in/michael-njo-b215a33a1/"),
  "Spotlight post must use the locked LinkedIn keep-URL",
);
assert.equal(
  (spotlightBody.match(/linkedin\.com\/in\/[^\s]+/g) ?? []).every(
    (url) => url === "linkedin.com/in/michael-njo-b215a33a1/",
  ),
  true,
  "Spotlight post must not use any other LinkedIn profile URL",
);
assert.equal(
  communityPosts.some((post) => post.slug === "backstage-business-spotlight-michael-njo" && /eventbrite|registration/i.test(post.body.join(" "))),
  false,
  "Backstage spotlight is news only and must not become an event listing",
);
const spotlightHtml = renderCommunityPost("backstage-business-spotlight-michael-njo");
assert.ok(
  spotlightHtml.includes("max-w-[54ch]"),
  "Spotlight must use the shared 54ch body measure",
);

const dinnerPost = communityPosts.find((post) => post.slug === "panel-of-experts-dinner-roseville");
assert.ok(dinnerPost, "Panel of Experts dinner recap must exist");
assert.equal(
  dinnerPost?.body.some((paragraph) => /upcoming event scheduled for August 27/i.test(paragraph)),
  false,
  "Dinner recap must not advertise the completed Roseville dinner as upcoming",
);

assert.equal(
  /Looking forward to the next event in Roseville/i.test(profileNewsSource),
  false,
  "Profile news copy must not treat the completed Roseville dinner as upcoming",
);
assert.ok(
  profileNewsSource.includes("communityPosts") &&
    irreplaceableNewsCardSource.includes("communityPosts") &&
    irreplaceableNewsCardSource.includes("withIrReplaceableTitle"),
  "IrReplaceable news card must render from community-posts data",
);
assert.equal(
  profileNewsSource.includes("As a dentist and practice consultant") ||
    irreplaceableNewsCardSource.includes("As a dentist and practice consultant"),
  false,
  "IrReplaceable news card must not hardcode Dr. Njo's sent copy",
);

if (process.env.NEWS_POLISH_MUTANTS === "1") {
  const tsxCli = path.join(process.cwd(), "node_modules/tsx/dist/cli.mjs");
  const result = spawnSync(process.execPath, [tsxCli, "scripts/check-events-mutants.ts"], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "inherit",
  });
  assert.equal(result.status, 0, "opt-in news-polish mutant suite must pass");
}

console.log("Event date-state and profile-tab assertions passed.");
