export type CommunityPostImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export type CommunityPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  image?: CommunityPostImage;
  images?: CommunityPostImage[];
  embedUrl?: string;
  embedTitle?: string;
  body: string[];
};

export const communityPosts: CommunityPost[] = [
  {
    slug: "diana-fat-board-of-regents",
    title: "Dr. Diana Fat appointed to the University of the Pacific Board of Regents",
    description:
      "Dr. Michael Njo congratulates longtime client Dr. Diana Fat, a distinguished Sacramento prosthodontist, on her appointment to the University of the Pacific Board of Regents.",
    publishedAt: "2026-08-28",
    image: {
      src: "/media/diana-fat-board-of-regents.webp",
      width: 1003,
      height: 1568,
      alt: "Dr. Michael Njo and Dr. Diana Fat standing in her Sacramento dental office, with a graphic announcing her appointment to the University of the Pacific Board of Regents.",
      caption: "Congratulations to Dr. Diana Fat on her appointment to the University of the Pacific Board of Regents.",
    },
    body: [
      "I am so proud to congratulate my longtime client of more than 20 years, Dr. Diana Fat, a distinguished Sacramento prosthodontist, on her appointment to the University of the Pacific Board of Regents.",
      "Diana continues to make a meaningful difference in dentistry, in her community, and now for our alma mater. Congratulations, Diana—this honor is so well deserved!",
      "#UniversityOfThePacific #BoardOfRegents #PacificProud #DentalLeadership",
    ],
  },
  {
    slug: "practice-blueprint-roseville-aug-2026",
    title: "The Practice Blueprint dinner",
    description:
      "Great night with great Dentists and referral partners at The Practice Blueprint dinner. Thank you Provide, Patterson, Kohan, Carr, and Dr. Diana Fat.",
    publishedAt: "2026-08-28",
    image: {
      src: "/media/poe-roseville-aug-2026.webp",
      width: 864,
      height: 1821,
      alt: "The Practice Blueprint recap collage from an exclusive dinner with industry leaders, showing a restaurant table, a standing group, and black-and-white shots of the welcome sign, table setting, branded notebook, and gift bags.",
      caption: "The Practice Blueprint dinner recap — an exclusive evening with dentists and referral partners.",
    },
    body: [
      "Great night with great Dentists and referral partners! Thank you Provide, Patterson, Kohan, and Carr for including me at this vibrant event. It is so fun to enjoy an evening with Dentists who have dreams and a team that can realize those dreams!",
      "Thank you to my dear friend, colleague, and long time client Dr. Diana Fat for welcoming us to her family restaurant.",
    ],
  },
  {
    slug: "another-perfect-match",
    title: "Another perfect match",
    description:
      "Another perfect match! Dr. Michael Njo is excited to have both clients matched—a former Dugoni Business Club student with an accomplished practitioner.",
    publishedAt: "2026-08-25",
    image: {
      src: "/media/bill-mikki-porch.webp",
      width: 1199,
      height: 1600,
      alt: "Young woman and older man smiling on the brick porch of a house numbered 257.",
      caption: "Young woman and older man smiling on the brick porch of a house numbered 257.",
    },
    images: [
      {
        src: "/media/bill-mikki-porch.webp",
        width: 1199,
        height: 1600,
        alt: "Young woman and older man smiling on the brick porch of a house numbered 257.",
        caption: "Young woman and older man smiling on the brick porch of a house numbered 257.",
      },
      {
        src: "/media/bill-mikki-trio.webp",
        width: 1200,
        height: 1600,
        alt: "Three people smiling outdoors in front of a burgundy building.",
        caption: "Three people smiling outdoors in front of a burgundy building.",
      },
    ],
    body: [
      "Another perfect match! So excited to have both of my clients matched- with my former Dugoni Business Club Student with an accomplished practitioner!",
      "Bill and Mikki, thank you for your incredibly thoughtful words and for trusting me to help guide such an important transition. It was truly an honor to support you in finding the right successor for the practice, patients, team, and legacy you worked so hard to build.",
    ],
  },
  {
    slug: "beyond-the-chair-anaheim",
    title: "The Dental Practice Beyond the Chair",
    description:
      "A 5-hour working session on September 25, 2026 in Anaheim for dentists and practice owners building enterprise value, intellectual property, wealth, and legacy.",
    publishedAt: "2026-08-24",
    image: {
      src: "/media/promotional-flyer-dental-strategies.webp",
      width: 1414,
      height: 2000,
      alt: "Promotional flyer for The Dental Practice Beyond the Chair, a September 25, 2026 working session in Anaheim led by Michael A. Njo, DDS.",
      caption: "The Dental Practice Beyond the Chair — September 25, 2026 at The Phillips Group in Anaheim.",
    },
    body: [
      "The Dental Practice Beyond the Chair is a 5-hour working session for dentists and practice owners, with the subtitle Building Enterprise Value, Intellectual Property, Wealth, and Legacy.",
      "The session is September 25, 2026, from 8:30 AM to 1:30 PM, at The Phillips Group, 2300 E. Katella Ave, Suite 405, Anaheim, CA. It is led by Michael A. Njo, DDS, Director, Dental Strategies.",
      "Current session details are on the Practice Transitions Institute events page. Contact Dr. Njo with questions about the working session.",
    ],
  },
  {
    slug: "amazing-4-days-with-industry-leaders",
    title: "An Amazing 4 Days with Industry Leaders",
    description: "Highlights from four days of conversations with industry leaders in dentistry and healthcare.",
    publishedAt: "2026-08-13",
    embedUrl: "https://www.instagram.com/reel/Db9NKdHJAk2/embed",
    embedTitle: "Instagram reel: An Amazing 4 Days with Industry Leaders",
    body: [
      "An amazing four days with industry leaders. These conversations brought together the people and perspectives that help move dentistry forward.",
      "Dr. Njo values time spent with peers who are committed to thoughtful growth, stronger practices, and meaningful support for the dentists they serve. The original video is shared below with credit to Backstage Dentistry.",
    ],
  },
  {
    slug: "panel-of-experts-dinner-roseville",
    title: "Great Night with Dentists and Referral Partners",
    description:
      "Highlights from the August 14 Panel of Experts dinner, with thanks to Provide, Patterson, Sarv Designs, and Carr.",
    publishedAt: "2026-08-14",
    image: {
      src: "/media/IMG_4918.webp",
      width: 1600,
      height: 2133,
      alt: "Dr. Michael Njo with dentists and referral partners at the Panel of Experts dinner.",
      caption: "The August 14 Panel of Experts dinner with dentists and referral partners.",
    },
    images: [
      {
        src: "/media/IMG_4918.webp",
        width: 1600,
        height: 2133,
        alt: "Dr. Michael Njo with dentists and referral partners at the Panel of Experts dinner.",
        caption: "Dentists and referral partners at the Panel of Experts dinner.",
      },
      {
        src: "/media/IMG_4923.webp",
        width: 1600,
        height: 2133,
        alt: "Dr. Michael Njo autographing Dental Practice Transitions Handbook at the Panel of Experts dinner.",
        caption: "Dr. Njo autographing the Dental Practice Transitions Handbook.",
      },
      {
        src: "/media/IMG_3346.webp",
        width: 1600,
        height: 2133,
        alt: "Panel of Experts dinner table with dentists and referral partners.",
        caption: "A table of dentists and referral partners at the Panel of Experts dinner.",
      },
    ],
    body: [
      "Great night with great dentists and referral partners. Thank you to Provide, Patterson, Sarv Designs, and Carr for including Dr. Njo at this vibrant event.",
      "It is always energizing to spend an evening with dentists who have ambitious goals and a team that can help bring those goals to life.",
      "Dr. Njo was honored to autograph the Dental Practice Transitions Handbook during the evening. The Practice Blueprint dinner followed on August 27 at Fats Asia Bistro in Roseville.",
    ],
  },
  {
    slug: "found-anissa-broussard-book-launch",
    title: "FOUND: Dr. Anissa Broussard's New Book",
    description:
      "Dr. Michael Njo celebrates the launch of FOUND by Dr. Anissa Broussard, on how AI is quietly choosing which practices get recommended to patients.",
    publishedAt: "2026-08-06",
    image: {
      src: "/media/found-book-launch-anissa-broussard.webp",
      width: 1068,
      height: 1600,
      alt: "Dr. Michael Njo and Dr. Anissa Broussard holding a copy of her book FOUND on a staircase.",
      caption: "Dr. Michael Njo with Dr. Anissa Broussard and her new book, FOUND.",
    },
    body: [
      "My friend Dr. Anissa Broussard just launched her book FOUND this week, and if you're in dental or healthcare, you need this.",
      "It's about how AI is quietly choosing which practices get recommended to patients, and which ones get skipped entirely. The window to get ahead of this is open right now.",
      "Find the book at digitalfloss.com/found.",
    ],
  },
  {
    slug: "backstage-retreat-2026-orlando",
    title: "Backstage Retreat 2026 in Orlando",
    description:
      "An amazing time in Florida with fellow Key Opinion Leaders working on making our industry great, including a book signing with all 29 authors under one roof.",
    publishedAt: "2026-08-03",
    image: {
      src: "/media/backstage-retreat-2026-book-signing.webp",
      width: 1600,
      height: 854,
      alt: "Backstage Retreat 2026 book signing in Orlando on July 30, 2026, with contributing authors holding copies of The Dental Exit Blueprint.",
      caption: "Backstage Retreat 2026 book signing, Orlando, July 30, 2026.",
    },
    images: [
      {
        src: "/media/backstage-retreat-2026-book-signing.webp",
        width: 1600,
        height: 854,
        alt: "Backstage Retreat 2026 book signing in Orlando on July 30, 2026, with contributing authors holding copies of The Dental Exit Blueprint.",
        caption: "All 29 authors and Key Opinion Leaders under one roof for The Dental Exit Blueprint book signing.",
      },
      {
        src: "/media/backstage-disney-world-2026.webp",
        width: 1200,
        height: 1600,
        alt: "Dr. Michael Njo with three fellow Backstage Mastermind members holding tickets outside at Disney World.",
        caption: "Fun at Disney World with fellow Backstage Mastermind members.",
      },
    ],
    body: [
      "Orlando Retreat: an amazing time in Florida with fellow Key Opinion Leaders working on making our industry great!",
      "How exciting to have all 29 authors and Key Opinion Leaders under one roof for a book signing. What great energy and great talent in one room. Dr. Njo is a contributing author to The Dental Exit Blueprint, with two chapters in the book: “Know Your Exit Options” and “Plan What Comes Next.”",
      "Experiencing one of the three core values of the Backstage Mastermind: abundance, kindness, and fun. Fun at Disney World with fellow members.",
    ],
  },
  {
    slug: "dental-lifestyles-magazine-beyond-brokerage",
    title: "Featured in Dental Lifestyles Magazine: Beyond Brokerage",
    description:
      "Dr. Glenn Vo profiles Dr. Michael Njo's whole-person approach to dental practice transitions in the Summer 2026 issue of Dental Lifestyles Magazine.",
    publishedAt: "2026-07-20",
    image: {
      src: "/media/dental-lifestyles-summer-2026-feature-p25.webp",
      width: 1082,
      height: 1400,
      alt: "Dental Lifestyles Magazine feature 'Beyond Brokerage: Dr. Michael Njo's Whole-Person Approach to Dental Practice Transitions' by Dr. Glenn Vo.",
      caption: "Dental Lifestyles Magazine, Summer 2026 (15th issue), page 25.",
    },
    images: [
      {
        src: "/media/dental-lifestyles-summer-2026-cover.webp",
        width: 748,
        height: 920,
        alt: "Cover of Dental Lifestyles Magazine, Summer 2026, listing the feature on Dr. Michael Njo's whole-person approach to dental practice transitions.",
        caption: "The Summer 2026 cover, with the feature billed at the top.",
      },
      {
        src: "/media/dental-lifestyles-summer-2026-feature-p25.webp",
        width: 1082,
        height: 1400,
        alt: "Page 25 of Dental Lifestyles Magazine: Beyond Brokerage, by Dr. Glenn Vo.",
        caption: "Beyond Brokerage, page 25.",
      },
      {
        src: "/media/dental-lifestyles-summer-2026-feature-p26.webp",
        width: 1074,
        height: 1400,
        alt: "Page 26 of Dental Lifestyles Magazine: the continuation of Beyond Brokerage.",
        caption: "Beyond Brokerage, page 26.",
      },
    ],
    body: [
      "Dr. Michael Njo is featured in the Summer 2026 issue of Dental Lifestyles Magazine (15th issue). In “Beyond Brokerage: Dr. Michael Njo's Whole-Person Approach to Dental Practice Transitions,” Editor-in-Chief Dr. Glenn Vo tells the story of how a cervical spine injury ended Dr. Njo's clinical career, and how that transition became the foundation for Dental Strategies, Healthcare Strategies, and the Practice Transitions Institute.",
      "The article covers why Dr. Njo's work goes “beyond brokerage”: the difference between a sale and a transition, the lesson about great advisors and great teams he learned from his father, and why he keeps showing up for the next generation of dentists.",
      "Thank you to Dr. Glenn Vo and Dental Lifestyles Magazine for the feature.",
    ],
  },
  {
    slug: "san-francisco-seminar-july-2026",
    title: "Another Great Seminar in San Francisco",
    description:
      "Recap of the July 2026 Mastering Your Dental Transition seminar in San Francisco, with attendee feedback and photos from the room.",
    publishedAt: "2026-07-19",
    image: {
      src: "/media/sf-seminar-jul-2026-presenting.webp",
      width: 1200,
      height: 1600,
      alt: "Dr. Michael Njo presenting Mastering Your Dental Transition to dentists seated around a boardroom table at the July 2026 San Francisco seminar.",
      caption: "Dr. Njo presenting Mastering Your Dental Transition in San Francisco.",
    },
    images: [
      {
        src: "/media/sf-seminar-jul-2026-presenting.webp",
        width: 1200,
        height: 1600,
        alt: "Dr. Michael Njo presenting Mastering Your Dental Transition at the July 2026 San Francisco seminar.",
        caption: "Presenting Mastering Your Dental Transition.",
      },
      {
        src: "/media/sf-seminar-jul-2026-attendees.webp",
        width: 1200,
        height: 1600,
        alt: "Group photo of dentists attending the July 2026 San Francisco seminar, shown on the conference room display.",
        caption: "Attendees at the San Francisco seminar.",
      },
      {
        src: "/media/sf-seminar-jul-2026-duo.webp",
        width: 1200,
        height: 1600,
        alt: "Dr. Michael Njo standing with a colleague holding seminar materials at the San Francisco seminar venue.",
        caption: "With a colleague at the seminar venue.",
      },
    ],
    body: [
      "Another great seminar with dentists who care about their legacy! Some of what attendees shared:",
      "“This was a comprehensive, informative meeting... so much information... delivered in an entertaining manner. Thanks to Dr. Njo for not making me fall asleep.”",
      "“5 stars. Every dentist who cares about their practice legacy should attend.”",
      "“As a buyer there was so much information I had no clue about. Six hours went by fast. I will schedule a call to discuss my future and options with you.”",
      "Upcoming seminar dates are listed on the Practice Transitions Institute events page.",
    ],
  },
  {
    slug: "backstage-mastermind-dallas-retreat",
    title: "My First Backstage Mastermind Retreat in Dallas",
    description:
      "Dr. Michael Njo reflects on his first Backstage Mastermind Retreat in Dallas: generosity, wisdom, and a community of entrepreneurs helping one another succeed.",
    publishedAt: "2026-06-01",
    image: {
      src: "/media/backstage-launch-pod-dallas-2026.webp",
      width: 1600,
      height: 1136,
      alt: "Dr. Michael Njo with fellow Backstage Mastermind members in matching Launch Pod shirts at the Dallas retreat.",
      caption: "The Launch Pod group at the Backstage Mastermind Retreat in Dallas.",
    },
    body: [
      "I just attended my first Backstage Mastermind Retreat in Dallas, and I am still processing what an incredible experience it was.",
      "To be honest, I didn't know exactly what to expect. What unfolded over the weekend exceeded every expectation I had. The generosity, wisdom, and willingness of successful entrepreneurs to openly share their ideas, experiences, and support was truly remarkable. Being surrounded by some of the brightest minds, all committed to helping one another succeed, was both inspiring and humbling.",
      "What struck me most was the intentionality behind this community. The way this group has been carefully cultivated is both artful and powerful. From the moment I arrived, it was clear that everyone shared a common set of values, values that were not merely spoken, but genuinely lived. Over the course of several days, we learned together, collaborated together, and supported one another in ways that were deeply meaningful.",
      "Thank you to the Backstage community for an unforgettable pod session.",
    ],
  },
  {
    slug: "dugoni-business-club-highlights",
    title: "Dugoni Business Club: Symposium, Alumni Evening, and Celebration Lunch",
    description:
      "Dr. Michael Njo with the Dugoni Business Club: symposium, industry sponsors, alumni evening, celebration lunch, and golf with club leadership.",
    publishedAt: "2026-04-12",
    image: {
      src: "/media/dugoni-symposium-2023-keynote.webp",
      width: 1200,
      height: 1600,
      alt: "Dr. Michael Njo speaking at the podium during the Dugoni Business Club Symposium.",
      caption: "Speaking at the Dugoni Business Club Symposium.",
    },
    images: [
      {
        src: "/media/dugoni-symposium-2023-keynote.webp",
        width: 1200,
        height: 1600,
        alt: "Dr. Michael Njo speaking at the podium during the Dugoni Business Club Symposium.",
        caption: "Dugoni Business Club Symposium.",
      },
      {
        src: "/media/dugoni-symposium-2023-sponsors.webp",
        width: 1284,
        height: 924,
        alt: "Dr. Michael Njo with two industry sponsor representatives at the Dugoni Business Club Symposium vendor fair.",
        caption: "Thank you to our industry sponsors.",
      },
      {
        src: "/media/dugoni-symposium-2023-sponsor-team.webp",
        width: 1101,
        height: 732,
        alt: "Industry sponsor representatives gathered at the Dugoni Business Club Symposium vendor fair.",
        caption: "Industry sponsors at the symposium vendor fair.",
      },
      {
        src: "/media/dugoni-business-club-dinner.webp",
        width: 1200,
        height: 1600,
        alt: "Dr. Michael Njo at a long restaurant table with Dugoni Business Club members during an alumni evening.",
        caption: "Great evening at the Dugoni Alumni meeting with Business Club members.",
      },
      {
        src: "/media/dugoni-business-club-members.webp",
        width: 1600,
        height: 1200,
        alt: "Dr. Michael Njo standing with three Dugoni Business Club student members inside the Arthur A. Dugoni School of Dentistry.",
        caption: "With Dugoni Business Club members at the school.",
      },
      {
        src: "/media/dugoni-alumni-gala-table.webp",
        width: 1600,
        height: 1058,
        alt: "Dr. Michael Njo with Pacific Dugoni alumni colleagues and classmates in formal attire gathered around a table at an Alumni Association evening.",
        caption: "Alumni reunion: great seeing, and now working with, colleagues and classmates.",
      },
      {
        src: "/media/dugoni-business-club-celebration-lunch.webp",
        width: 1600,
        height: 1200,
        alt: "Dr. Michael Njo with a large group of Dugoni Business Club members at a celebration lunch.",
        caption: "Celebration lunch for another great year.",
      },
      {
        src: "/media/dugoni-business-club-golf.webp",
        width: 1600,
        height: 1200,
        alt: "Dr. Michael Njo seated at a clubhouse table with four Dugoni Business Club leaders after a round of golf.",
        caption: "A round of golf with club leadership before finals.",
      },
    ],
    body: [
      "Dugoni Business Club Symposium. Thank you to our industry sponsors!",
      "Great evening at the Dugoni Alumni meeting with Business Club members.",
      "Alumni Reunion! Great seeing, and now working with, my colleagues and classmates. What a privilege to help them with their transitions and their businesses!",
      "Celebration lunch for another great year. Proud to be your advisor and consultant! And supporting the leadership at the Dugoni Business Club with a nice round of golf and down time before finals.",
    ],
  },
];

export function buildCommunityPostPath(slug: string) {
  return `/blog/${slug}`;
}

export function getCommunityPostBySlug(slug: string) {
  return communityPosts.find((post) => post.slug === slug);
}

export function getCommunityPostByPath(pathname: string) {
  return communityPosts.find((post) => buildCommunityPostPath(post.slug) === pathname);
}
