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
      "Dr. Njo was honored to autograph the Dental Practice Transitions Handbook during the evening. The Roseville Practice Blueprint dinner was a separate upcoming event scheduled for August 27.",
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
