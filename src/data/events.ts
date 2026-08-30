export type EventOccurrence = {
  dateLabel: string;
  timeLabel: string;
  location: string;
  startDateTime: string;
  endDateTime?: string;
};

export type EventProgram = {
  slug: string;
  category: "seminar" | "conference";
  registrationStatus: "Registration Open";
  scheduleLabel?: string;
  title: string;
  nextDateLabel: string;
  nextDateTime: string;
  timeLabel: string;
  locationLabel: string;
  description: string;
  highlights?: string[];
  upcomingDates?: EventOccurrence[];
  completedEventsLabel?: string;
  registrationUrl?: string;
};

export type UpcomingEventProgram = EventProgram & {
  nextOccurrence: EventOccurrence;
  upcomingDates: EventOccurrence[];
  completedOccurrences: EventOccurrence[];
};

function parseDateTime(value: string): number {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid event date-time: ${value}`);
  }
  return timestamp;
}

function getProgramOccurrences(program: EventProgram): EventOccurrence[] {
  if (program.upcomingDates?.length) return [...program.upcomingDates];

  return [
    {
      dateLabel: program.nextDateLabel,
      timeLabel: program.timeLabel,
      location: program.locationLabel,
      startDateTime: program.nextDateTime,
    },
  ];
}

export function isEventOccurrenceUpcoming(occurrence: EventOccurrence, referenceDate: Date): boolean {
  const eventEnd = occurrence.endDateTime || occurrence.startDateTime;
  return parseDateTime(eventEnd) >= referenceDate.getTime();
}

/**
 * Builds display-ready event programs without mutating the editorial source.
 * Callers inject the reference date so rendering and tests use the same clock.
 */
export function getUpcomingEventPrograms(
  referenceDate: Date,
  programs: readonly EventProgram[] = eventPrograms,
): UpcomingEventProgram[] {
  return programs.flatMap((program) => {
    const occurrences = getProgramOccurrences(program).sort(
      (left, right) => parseDateTime(left.startDateTime) - parseDateTime(right.startDateTime),
    );
    const upcomingDates = occurrences.filter((occurrence) => isEventOccurrenceUpcoming(occurrence, referenceDate));

    if (upcomingDates.length === 0) return [];

    const nextOccurrence = upcomingDates[0];
    const completedOccurrences = occurrences.filter(
      (occurrence) => !isEventOccurrenceUpcoming(occurrence, referenceDate),
    );

    return [
      {
        ...program,
        nextOccurrence,
        nextDateLabel: nextOccurrence.dateLabel,
        nextDateTime: nextOccurrence.startDateTime,
        timeLabel: nextOccurrence.timeLabel,
        locationLabel:
          upcomingDates.length === 1 ? nextOccurrence.location : `${upcomingDates.length} locations available`,
        upcomingDates,
        completedOccurrences,
        completedEventsLabel:
          completedOccurrences.length > 0
            ? `${completedOccurrences.length} completed ${completedOccurrences.length === 1 ? "date" : "dates"}`
            : undefined,
        scheduleLabel: `${upcomingDates.length} ${upcomingDates.length === 1 ? "date" : "dates"}`,
      },
    ];
  });
}

export const eventPrograms: EventProgram[] = [
  {
    slug: "mastering-your-dental-transition",
    category: "seminar",
    registrationStatus: "Registration Open",
    scheduleLabel: "4 dates",
    title: "Mastering Your Dental Transition Into and Out of Practice",
    nextDateLabel: "April 10, 2026",
    nextDateTime: "2026-04-10T08:00:00-07:00",
    timeLabel: "8am - 3pm",
    locationLabel: "5 locations available",
    description:
      "Whether entering, expanding, or exiting your career, careful planning matters. Dr. Michael Njo and Practice Transitions Institute experts explain the decisions, tradeoffs, and professional coordination involved at each stage of a dental practice transition.",
    highlights: [
      "Negotiate a win-win practice transition",
      "Understand the economic climate and its effect on practice value and ownership",
      "Develop clear associate and partnership agreements safeguarding your interests and fostering collaboration",
      "Determine the value of a practice",
      "Maximize your practice value for a lucrative transition",
      "Avoid tax pitfalls by structuring the sale to minimize tax liability and maximize financial gains",
    ],
    upcomingDates: [
      {
        dateLabel: "April 10, 2026",
        timeLabel: "8am - 3pm",
        location: "Orange County, CA",
        startDateTime: "2026-04-10T08:00:00-07:00",
        endDateTime: "2026-04-10T15:00:00-07:00",
      },
      {
        dateLabel: "July 17, 2026",
        timeLabel: "8am - 3pm",
        location: "University of the Pacific (UOP) Arthur A. Dugoni School of Dentistry, San Francisco, CA",
        startDateTime: "2026-07-17T08:00:00-07:00",
        endDateTime: "2026-07-17T15:00:00-07:00",
      },
      {
        dateLabel: "October 2, 2026",
        timeLabel: "8am - 3pm",
        location: "Sacramento, CA",
        startDateTime: "2026-10-02T08:00:00-07:00",
        endDateTime: "2026-10-02T15:00:00-07:00",
      },
      {
        dateLabel: "March 12, 2027",
        timeLabel: "8am - 3pm",
        location: "The Phillips Group, 2300 E Katella Ave #405, Anaheim, CA",
        startDateTime: "2027-03-12T08:00:00-08:00",
        endDateTime: "2027-03-12T15:00:00-08:00",
      },
    ],
    completedEventsLabel: "View 2 completed events",
    registrationUrl: "https://practicetransitionsinstitute.com/events/practice-transition-seminar",
  },
  {
    slug: "leadership-retreat-2026",
    category: "conference",
    registrationStatus: "Registration Open",
    title: "Leadership Retreat",
    nextDateLabel: "June 4-6, 2026",
    nextDateTime: "2026-06-04T09:00:00-04:00",
    timeLabel: "Multi-day",
    locationLabel: "Savannah, GA",
    description:
      "An immersive leadership retreat for practice owners ready to lead with clarity and confidence, hosted by MaryLynn Wheaton and Liz Armato with featured speaker Brian Parsley and a PTI panel on transition readiness that includes Dr. Michael Njo.",
    upcomingDates: [
      {
        dateLabel: "June 4-6, 2026",
        timeLabel: "Multi-day",
        location: "Savannah, GA",
        startDateTime: "2026-06-04T09:00:00-04:00",
        endDateTime: "2026-06-06T17:00:00-04:00",
      },
    ],
    registrationUrl: "https://practicetransitionsinstitute.com/events/leadership-retreat",
  },
  {
    slug: "beyond-the-chair-anaheim",
    category: "seminar",
    registrationStatus: "Registration Open",
    title: "The Dental Practice Beyond the Chair",
    nextDateLabel: "September 25, 2026",
    nextDateTime: "2026-09-25T08:30:00-07:00",
    timeLabel: "8:30 AM – 1:30 PM",
    locationLabel: "The Phillips Group, 2300 E. Katella Ave, Suite 405, Anaheim, CA",
    description:
      "A 5-hour working session for dentists and practice owners. Building Enterprise Value, Intellectual Property, Wealth, and Legacy. Led by Michael A. Njo, DDS, Director, Dental Strategies.",
    highlights: [
      "Redefine practice equity: move from running a clinical job to building a scalable, bankable asset",
      "Master modern valuation: how lenders and buyers evaluate normalized EBITDA, collections, and payer concentration",
      "Monetize intellectual property: turn operational frameworks, team systems, clinical protocols, and brand into transferable enterprise value",
      "Optimize career transition: create clear associate pathways, plan strategic exits early, and protect proceeds with tax-smart strategies",
    ],
    upcomingDates: [
      {
        dateLabel: "September 25, 2026",
        timeLabel: "8:30 AM – 1:30 PM",
        location: "The Phillips Group, 2300 E. Katella Ave, Suite 405, Anaheim, CA",
        startDateTime: "2026-09-25T08:30:00-07:00",
        endDateTime: "2026-09-25T13:30:00-07:00",
      },
    ],
    registrationUrl: "https://practicetransitionsinstitute.com/events",
  },
];
