import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { communityPosts } from "@/data/community-posts";
import {
  eventPrograms,
  getOccurrenceRegistrationPrice,
  getUpcomingEventPrograms,
  isEventOccurrenceUpcoming,
  isOccurrenceEarlyBirdAvailable,
  type EventOccurrence,
} from "@/data/events";
import { buildProfileTabPath, resolveProfileTab } from "@/lib/profile-tabs";

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
assert.equal(
  fortyOverFortyPost?.body[0],
  "I am honored to be named one of Dental Lifestyles Magazine’s 2026 40 Over 40 awardees!",
);
assert.match(fortyOverFortyBody, /more than 30 years in dentistry/);
assert.match(fortyOverFortyBody, /Nifty Thrifty Dentists/);
assert.match(fortyOverFortyBody, /Dental Lifestyles Magazine/);
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
assert.ok(
  communityPostDetailSource.includes("break-words") && communityPostDetailSource.includes("overflow-wrap:anywhere"),
  "Community post body paragraphs must wrap long words on narrow viewports",
);
assert.ok(
  communityPostDetailSource.includes("post.link") && communityPostDetailSource.includes('rel="noopener noreferrer"'),
  "Community posts must be able to render a labeled external link",
);
assert.equal(
  communityPostDetailSource.includes("sm:grid-cols-2"),
  false,
  "Community post images must not sit side by side from 640px up",
);
assert.ok(
  communityPostDetailSource.includes("index === 0") && communityPostDetailSource.includes("max-w-md"),
  "The first community-post image is the full-width hero; later images stay smaller below it",
);
assert.ok(
  communityPostDetailSource.includes("withIrReplaceableTitle"),
  "Community post bodies must style IrReplaceable mentions from the shared helper",
);

const irreplaceableTitleSource = readFileSync(
  path.join(process.cwd(), "src/components/irreplaceable-book-title.tsx"),
  "utf8",
);
assert.ok(
  irreplaceableTitleSource.includes("<s>") &&
    irreplaceableTitleSource.includes("Ir") &&
    irreplaceableTitleSource.includes('aria-label="IrReplaceable"'),
  "Book title styling must strike Ir and expose an accessible IrReplaceable label",
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

const dinnerPost = communityPosts.find((post) => post.slug === "panel-of-experts-dinner-roseville");
assert.ok(dinnerPost, "Panel of Experts dinner recap must exist");
assert.equal(
  dinnerPost?.body.some((paragraph) => /upcoming event scheduled for August 27/i.test(paragraph)),
  false,
  "Dinner recap must not advertise the completed Roseville dinner as upcoming",
);

const profileNewsSource = readFileSync(
  path.join(process.cwd(), "src/components/pages/michael-njo-dds.tsx"),
  "utf8",
);
assert.equal(
  /Looking forward to the next event in Roseville/i.test(profileNewsSource),
  false,
  "Profile news copy must not treat the completed Roseville dinner as upcoming",
);
assert.ok(
  profileNewsSource.includes("communityPosts") && profileNewsSource.includes("withIrReplaceableTitle"),
  "IrReplaceable news card must render from community-posts data",
);
assert.equal(
  profileNewsSource.includes("As a dentist and practice consultant"),
  false,
  "IrReplaceable news card must not hardcode Dr. Njo's sent copy",
);

console.log("Event date-state and profile-tab assertions passed.");
