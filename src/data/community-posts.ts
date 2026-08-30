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
