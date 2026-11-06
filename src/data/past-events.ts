/**
 * Past events archive, mirrored from the PTI site's /events archive
 * (enzo-prism/pti `src/data/eventArchive.ts`). Dr. Njo asked in the
 * November 2, 2026 sync for "sold out" banners on past events and a 2025
 * events section on both sites. Cities only, no venue or firm names.
 * When an event ends, add it here and on PTI with the same city and flag.
 */
export type PastEvent = {
  id: string;
  title: string;
  category: "seminar" | "workshop" | "dinner" | "conference" | "webinar";
  dateLabel: string;
  /** Last calendar day of the event, YYYY-MM-DD, Pacific. */
  lastDay: string;
  city: string;
  soldOut: boolean;
};

export type PastEventYear = {
  year: number;
  events: PastEvent[];
};

const MASTERING = "Mastering Your Dental Transition Into and Out of Practice";

export const pastEvents: readonly PastEvent[] = [
  {
    id: "sacramento-seminar-oct-2026",
    title: MASTERING,
    category: "seminar",
    dateLabel: "October 2, 2026",
    lastDay: "2026-10-02",
    city: "Sacramento",
    soldOut: true,
  },
  {
    id: "beyond-the-chair-anaheim-2026",
    title: "The Dental Practice Beyond the Chair",
    category: "workshop",
    dateLabel: "September 25, 2026",
    lastDay: "2026-09-25",
    city: "Anaheim",
    soldOut: true,
  },
  {
    id: "practice-blueprint-dinner-roseville-2026",
    title: "The Practice Blueprint Dinner",
    category: "dinner",
    dateLabel: "August 27, 2026",
    lastDay: "2026-08-27",
    city: "Roseville",
    soldOut: true,
  },
  {
    id: "san-francisco-seminar-jul-2026",
    title: MASTERING,
    category: "seminar",
    dateLabel: "July 17, 2026",
    lastDay: "2026-07-17",
    city: "San Francisco",
    soldOut: true,
  },
  {
    id: "leadership-retreat-savannah-2026",
    title: "Leadership Retreat",
    category: "conference",
    dateLabel: "June 4-6, 2026",
    lastDay: "2026-06-06",
    city: "Savannah, Georgia",
    soldOut: false,
  },
  {
    id: "orange-county-seminar-apr-2026",
    title: MASTERING,
    category: "seminar",
    dateLabel: "April 10, 2026",
    lastDay: "2026-04-10",
    city: "Orange County",
    soldOut: true,
  },
  {
    id: "financial-insights-webinar-aug-2025",
    title: "2025 & Beyond: Essential Financial & Practice-Transition Insights for Dentists",
    category: "webinar",
    dateLabel: "August 27, 2025",
    lastDay: "2025-08-27",
    city: "Online",
    soldOut: false,
  },
  {
    id: "san-francisco-seminar-jul-2025",
    title: MASTERING,
    category: "seminar",
    dateLabel: "July 11, 2025",
    lastDay: "2025-07-11",
    city: "San Francisco",
    soldOut: true,
  },
  {
    id: "costa-mesa-seminar-mar-2025",
    title: MASTERING,
    category: "seminar",
    dateLabel: "March 28, 2025",
    lastDay: "2025-03-28",
    city: "Costa Mesa",
    soldOut: true,
  },
];

function pacificDayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Past events grouped by year, newest first. An event joins the archive the
 * Pacific calendar day after its last day.
 */
export function getPastEventYears(
  referenceDate: Date,
  events: readonly PastEvent[] = pastEvents,
): PastEventYear[] {
  const today = pacificDayKey(referenceDate);
  const years = new Map<number, PastEvent[]>();

  for (const event of [...events].sort((a, b) => b.lastDay.localeCompare(a.lastDay))) {
    if (event.lastDay >= today) continue;
    const year = Number(event.lastDay.slice(0, 4));
    const bucket = years.get(year);
    if (bucket) bucket.push(event);
    else years.set(year, [event]);
  }

  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearEvents]) => ({ year, events: yearEvents }));
}
