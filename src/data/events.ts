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
  callToAction?: {
    phone: string;
    email: string;
  };
};

export const eventPrograms: EventProgram[] = [
  {
    slug: "mastering-your-dental-transition",
    category: "seminar",
    registrationStatus: "Registration Open",
    scheduleLabel: "5 dates",
    title: "Mastering Your Dental Transition Into and Out of Practice",
    nextDateLabel: "April 10, 2026",
    nextDateTime: "2026-04-10T08:00:00-07:00",
    timeLabel: "8am - 3pm",
    locationLabel: "5 locations available",
    description:
      "Whether entering, expanding, or exiting your career, meticulous planning is essential. Dr. Michael Njo and Practice Transitions Institute experts guide you through each stage, helping you avoid costly missteps and ensuring a seamless and prosperous transition.",
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
    ],
    completedEventsLabel: "View 2 completed events",
    callToAction: {
      phone: "+16504362939",
      email: "dentalstrategies@gmail.com",
    },
  },
  {
    slug: "leadership-retreat-2026",
    category: "conference",
    registrationStatus: "Registration Open",
    title: "Leadership Retreat",
    nextDateLabel: "June 4-6, 2026",
    nextDateTime: "2026-06-04",
    timeLabel: "Multi-day",
    locationLabel: "Savannah, GA",
    description:
      "An immersive leadership retreat for practice owners ready to lead with clarity and confidence, hosted by MaryLynn Wheaton and Liz Armato with featured speaker Brian Parsley and a PTI panel on transition readiness that includes Dr. Michael Njo.",
  },
];
