import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
assert.equal(beforeSeason[0].upcomingDates.length, 4, "All seminar dates should initially be upcoming");
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
assert.equal(augustView[0].upcomingDates.length, 2);
assert.equal(augustView[0].completedOccurrences.length, 2);
assert.equal(augustView[0].scheduleLabel, "2 dates");
assert.equal(augustView[0].completedEventsLabel, "2 completed dates");
assert.equal(augustView[1].slug, "beyond-the-chair-anaheim");
assert.equal(augustView[1].nextDateLabel, "September 25, 2026");
assert.equal(augustView[1].locationLabel, "The Phillips Group, 2300 E. Katella Ave, Suite 405, Anaheim, CA");

const afterSeason = getUpcomingEventPrograms(new Date("2026-10-03T00:00:00-07:00"));
assert.equal(afterSeason.length, 1, "The 2027 Anaheim seminar should remain available after the 2026 dates");
assert.equal(afterSeason[0].nextDateLabel, "March 12, 2027");

const afterAnaheim = getUpcomingEventPrograms(new Date("2027-03-13T00:00:00-08:00"));
assert.deepEqual(afterAnaheim, [], "No seminar should remain open after the final occurrence");

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

console.log("Event date-state and profile-tab assertions passed.");
