import type { StaticImageData } from "next/image";
import backstageQuoteCard from "@/assets/media/backstage-quote-card.png";
import dinnerStrategyGroup from "@/assets/media/dinner-strategy-group.jpg";
import handbookCover from "@/assets/media/handbook-cover.jpg";
import medalPortrait from "@/assets/media/medal-portrait.png";
import officeStrategyGroup from "@/assets/media/office-strategy-group.jpg";
import soloDinnerGalleryOnly from "@/assets/media/solo-dinner-gallery-only.jpg";
import threePersonEvent from "@/assets/media/three-person-event.jpg";

export type MediaLayoutVariant = "landscape" | "portrait" | "poster" | "square";

export type MediaFeatureRoute =
  | "home:leadership"
  | "profile:relationships"
  | "profile:news"
  | "profile:gallery"
  | "resources:book"
  | "interview:quote";

export type EditorialMediaAsset = {
  id: string;
  src: StaticImageData | string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  sizes: string;
  layoutVariant: MediaLayoutVariant;
  featuredRoutes: MediaFeatureRoute[];
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  gridSpan?: "wide" | "full";
  galleryOnly?: boolean;
  priority?: boolean;
  /** Known names only. Leave unidentified faces unlabeled. */
  names?: string[];
};

const defaultSizesByVariant: Record<MediaLayoutVariant, string> = {
  landscape: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 720px",
  portrait: "(max-width: 768px) 100vw, (max-width: 1280px) 38vw, 420px",
  poster: "(max-width: 768px) 72vw, (max-width: 1280px) 24vw, 280px",
  square: "(max-width: 768px) 86vw, (max-width: 1280px) 28vw, 320px",
};

type LocalAssetOptions = Omit<EditorialMediaAsset, "src" | "width" | "height" | "sizes"> & {
  src: StaticImageData;
  sizes?: string;
  displayWidth?: number;
  displayHeight?: number;
};

type RemoteAssetOptions = Omit<EditorialMediaAsset, "sizes"> & {
  sizes?: string;
};

const createLocalAsset = ({ src, sizes, displayWidth, displayHeight, ...asset }: LocalAssetOptions): EditorialMediaAsset => ({
  ...asset,
  src,
  width: displayWidth ?? src.width,
  height: displayHeight ?? src.height,
  sizes: sizes ?? defaultSizesByVariant[asset.layoutVariant],
});

const createRemoteAsset = ({ sizes, ...asset }: RemoteAssetOptions): EditorialMediaAsset => ({
  ...asset,
  sizes: sizes ?? defaultSizesByVariant[asset.layoutVariant],
});

export const dugoniCollaborationImage = createRemoteAsset({
  id: "dugoni-collaboration",
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767551710/university-of-the-pacific-dr-njo_pkcbs4.webp",
  width: 2076,
  height: 2170,
  layoutVariant: "portrait",
  sizes: "(max-width: 768px) 100vw, 420px",
  alt: "Dr. Michael Njo working with the University of the Pacific Arthur A Dugoni School of Dentistry, with Dean Nadershahi and Interim Dean Chavez",
  caption:
    "Working closely with the University of the Pacific Arthur A Dugoni School of Dentistry, with Dean Nadershahi and Interim Dean Chavez.",
  featuredRoutes: ["profile:relationships", "profile:gallery"],
  objectPosition: "center top",
  names: ["Dr. Michael Njo", "Dean Nadershahi", "Interim Dean Chavez"],
});

export const gprResidencyPresentationImage = createRemoteAsset({
  id: "gpr-residency-presentation",
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1773587933/d85667bc-c2ea-4be4-9bfd-790829b947d3_wgoug0.webp",
  width: 4032,
  height: 3024,
  layoutVariant: "landscape",
  alt: "Dr. Michael Njo, DDS presenting to General Practice Residency residents holding copies of Dental Practice Transitions Handbook",
  caption:
    "Dr. Michael Njo, DDS presenting to General Practice Residency residents while they hold copies of Dental Practice Transitions Handbook, highlighting his ongoing role in dental education, mentorship, and practice transition guidance.",
  featuredRoutes: ["resources:book", "profile:gallery"],
  objectPosition: "center center",
});

const suppliedMediaAssets: EditorialMediaAsset[] = [
  createLocalAsset({
    id: "office-strategy-group",
    src: officeStrategyGroup,
    layoutVariant: "landscape",
    alt: "Candid office photo of Dr. Michael Njo with an AI startup founder and board of directors, including Nader Nadershahi, former Dean of the University of the Pacific School of Dentistry",
    caption:
      "On the board of an AI startup (in stealth mode): with the founder and board of directors, notably former Dean of University of the Pacific School of Dentistry, Nader Nadershahi.",
    featuredRoutes: ["home:leadership", "profile:relationships", "profile:gallery"],
    objectPosition: "center center",
    objectFit: "contain",
    priority: true,
    names: [
      "Dr. Michael Njo",
      "Nader Nadershahi, former Dean, University of the Pacific School of Dentistry",
    ],
  }),
  createLocalAsset({
    id: "black-tie-medal-portrait",
    src: medalPortrait,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo standing with Dr. Allen Budenz, who is wearing a tuxedo and medallion, at a formal event",
    caption: "Dr. Michael Njo with Dr. Allen Budenz.",
    featuredRoutes: ["home:leadership", "profile:relationships", "profile:gallery"],
    objectPosition: "center center",
    objectFit: "contain",
    names: ["Dr. Michael Njo", "Dr. Allen Budenz"],
  }),
  createLocalAsset({
    id: "dinner-strategy-group",
    src: dinnerStrategyGroup,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with peers at an evening strategy dinner.",
    caption: "Peer dinner conversations that sharpen perspective on growth, partnerships, and what comes next in the profession.",
    featuredRoutes: ["home:leadership", "profile:relationships", "profile:gallery"],
    objectPosition: "center center",
    objectFit: "contain",
    gridSpan: "full",
  }),
  createLocalAsset({
    id: "three-person-event",
    src: threePersonEvent,
    layoutVariant: "portrait",
    displayWidth: 3024,
    displayHeight: 4032,
    alt: "Dr. Michael Njo with fellow attendees at a professional event.",
    caption: "A candid event moment underscoring the network around Dr. Njo's consulting and speaking work.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectPosition: "center center",
    objectFit: "contain",
  }),
  createLocalAsset({
    id: "handbook-cover",
    src: handbookCover,
    layoutVariant: "landscape",
    alt: "Cover of Dental Practice Transitions Handbook by Michael A. Njo, DDS.",
    caption: "Dr. Njo's handbook gives dentists a practical blueprint for buying, selling, and structuring transitions.",
    featuredRoutes: ["resources:book", "profile:gallery"],
    objectPosition: "center center",
    priority: true,
  }),
  createLocalAsset({
    id: "backstage-quote-card",
    src: backstageQuoteCard,
    layoutVariant: "portrait",
    alt: "Backstage Mastermind feature card highlighting Dr. Michael Njo's practice support message.",
    caption: "A shareable quote card positioning Dr. Njo as a trusted partner for everything beyond the operatory.",
    featuredRoutes: ["interview:quote", "profile:gallery"],
    objectPosition: "center top",
  }),
  createLocalAsset({
    id: "solo-dinner-gallery-only",
    src: soloDinnerGalleryOnly,
    layoutVariant: "landscape",
    alt: "Dinner portrait from a private celebration setting.",
    caption: "A gallery-only moment kept secondary to the public business narrative.",
    featuredRoutes: ["profile:gallery"],
    objectPosition: "center center",
    objectFit: "contain",
    galleryOnly: true,
  }),
];

const legacyGalleryImages: EditorialMediaAsset[] = [
  createRemoteAsset({
    id: "student-gratitude-1",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776241/1_uiehhq.jpg",
    width: 4032,
    height: 3024,
    layoutVariant: "landscape",
    alt: "Interviewee thanking Dr. Michael Njo for inspiring insights and mentorship.",
    caption:
      "Thank you for the interview and your inspiring insights. From admissions interviewee to attendee as a senior at UOP's IDS program in Sacramento.",
    featuredRoutes: ["profile:gallery"],
  }),
  createRemoteAsset({
    id: "student-gratitude-2",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776279/3_yt7juv.jpg",
    width: 4032,
    height: 3024,
    layoutVariant: "landscape",
    alt: "From admissions interviewee to UOP IDS senior in Sacramento, showing gratitude to Dr. Njo.",
    featuredRoutes: ["profile:gallery"],
  }),
  createRemoteAsset({
    id: "student-gratitude-3",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776282/2_lxrfhn.jpg",
    width: 4032,
    height: 3024,
    layoutVariant: "landscape",
    alt: "Kind gifts from Shuang's country shared with Dr. Michael Njo in gratitude for his kindness and mentorship.",
    featuredRoutes: ["profile:gallery"],
  }),
  createRemoteAsset({
    id: "mentorship-poster",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776307/Updated_cskep5.png",
    width: 724,
    height: 888,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo guiding dental professionals and mentoring future leaders.",
    caption: "Dr. Michael Njo in action guiding dental professionals.",
    featuredRoutes: ["profile:news", "profile:gallery"],
  }),
  gprResidencyPresentationImage,
  createRemoteAsset({
    id: "leadership-retreat",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/Leadership-retreat_peohe1.webp",
    width: 4032,
    height: 3024,
    layoutVariant: "landscape",
    alt: "Leadership retreat with Dr. Njo and peers.",
    caption: "Leadership retreat with peers from across the profession.",
    featuredRoutes: ["profile:news", "profile:gallery"],
  }),
  createRemoteAsset({
    id: "uop-board-dinner",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/UOP-board-dinner_vvxbkq.webp",
    width: 4032,
    height: 3024,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with University of the Pacific alumni board members around a long dinner table.",
    caption: "University of the Pacific alumni board dinner — the relationship capital that surrounds the consulting work.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    gridSpan: "wide",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "panel-dinner-group",
    src: "/media/IMG_4918.webp",
    width: 1600,
    height: 2133,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo with dentists and referral partners at the Los Angeles Panel of Experts dinner",
    caption: "Los Angeles Panel of Experts dinner with dentists and referral partners.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "panel-dinner-book-signing",
    src: "/media/IMG_4923.webp",
    width: 1600,
    height: 2133,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo autographing Dental Practice Transitions Handbook at the Los Angeles Panel of Experts dinner",
    caption:
      "Dr. Michael Njo autographing the Dental Practice Transitions Handbook at the Los Angeles Panel of Experts dinner.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "panel-dinner-table",
    src: "/media/IMG_3346.webp",
    width: 1600,
    height: 2133,
    layoutVariant: "portrait",
    alt: "Los Angeles Panel of Experts dinner table with dentists and referral partners",
    caption: "The Los Angeles Panel of Experts dinner table.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "poe-roseville-collage",
    src: "/media/poe-roseville-aug-2026.webp",
    width: 864,
    height: 1821,
    layoutVariant: "poster",
    alt: "The Practice Blueprint recap collage from the August 2026 Roseville dinner, including a dinner-table group photo and a five-person portrait",
    caption: "The Practice Blueprint dinner in Roseville, August 2026.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "diana-fat-board-of-regents",
    src: "/media/diana-fat-board-of-regents.webp",
    width: 1003,
    height: 1568,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo and Dr. Diana Fat standing together in her Sacramento dental office, beside a navy overlay announcing her appointment to the University of the Pacific Board of Regents",
    caption:
      "Dr. Michael Njo with Dr. Diana Fat on her appointment to the University of the Pacific Board of Regents.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo", "Dr. Diana Fat"],
  }),
  createRemoteAsset({
    id: "bill-mikki-porch",
    src: "/media/bill-mikki-porch.webp",
    width: 1199,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Bill and Mikki standing together on a brick walkway in front of a house numbered 257",
    caption: "Bill and Mikki, from a practice-match celebration.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Bill", "Mikki"],
  }),
  createRemoteAsset({
    id: "bill-mikki-trio",
    src: "/media/bill-mikki-trio.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Three people standing outdoors: a man in light blue scrubs holding a yellow folder, a woman in navy scrubs, and a man in a white shirt and blue tie",
    caption: "Bill, Mikki, and Dr. Michael Njo at the practice-match celebration.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Bill", "Mikki", "Dr. Michael Njo"],
  }),
];

export const secondEditionAnnouncementImage = createRemoteAsset({
  id: "handbook-second-edition-coming-soon",
  src: "/media/handbook-second-edition-coming-soon.webp",
  width: 1120,
  height: 1400,
  layoutVariant: "portrait",
  sizes: "(max-width: 768px) 100vw, 420px",
  alt: "Coming soon announcement for the second edition of Dental Practice Transitions Handbook by Michael A. Njo, DDS, Founder of Practice Transitions Institute, with a foreword by Dr. Glenn Vo",
  caption: "Coming soon: the expanded second edition of the Dental Practice Transitions Handbook, with a foreword by Dr. Glenn Vo.",
  featuredRoutes: ["resources:book", "profile:gallery"],
  objectFit: "contain",
  names: ["Dr. Michael Njo"],
});

// Photos shared by Dr. Njo (July–September 2026 update) plus the set that
// previously lived only on the PTI site. Both sites now carry the same photos.
const sharedUpdateImages: EditorialMediaAsset[] = [
  secondEditionAnnouncementImage,
  createRemoteAsset({
    id: "dental-lifestyles-feature",
    src: "/media/dental-lifestyles-summer-2026-feature-p25.webp",
    width: 1082,
    height: 1400,
    layoutVariant: "portrait",
    alt: "Dental Lifestyles Magazine feature 'Beyond Brokerage: Dr. Michael Njo's Whole-Person Approach to Dental Practice Transitions' by Dr. Glenn Vo.",
    caption:
      "\"Beyond Brokerage: Dr. Michael Njo's Whole-Person Approach to Dental Practice Transitions,\" by Dr. Glenn Vo, Editor-in-Chief, Dental Lifestyles Magazine (Summer 2026).",
    featuredRoutes: ["profile:news", "profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dental-lifestyles-cover",
    src: "/media/dental-lifestyles-summer-2026-cover.webp",
    width: 748,
    height: 920,
    layoutVariant: "portrait",
    alt: "Cover of Dental Lifestyles Magazine, Summer 2026 (15th issue), listing the feature on Dr. Michael Njo's whole-person approach to dental practice transitions.",
    caption: "Dental Lifestyles Magazine, Summer 2026 (15th issue).",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "dugoni-symposium-keynote",
    src: "/media/dugoni-symposium-2023-keynote.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo speaking at the podium during the Dugoni Business Club Symposium, with the symposium schedule projected behind him.",
    caption: "Speaking at the Dugoni Business Club Symposium, University of the Pacific Arthur A. Dugoni School of Dentistry.",
    featuredRoutes: ["profile:news", "profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "sf-seminar-presenting",
    src: "/media/sf-seminar-jul-2026-presenting.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo presenting Mastering Your Dental Transition to dentists seated around a boardroom table at the July 2026 San Francisco seminar.",
    caption: "Presenting Mastering Your Dental Transition at the July 2026 San Francisco Practice Transitions seminar.",
    featuredRoutes: ["profile:news", "profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "sf-seminar-attendees",
    src: "/media/sf-seminar-jul-2026-attendees.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Group photo of dentists attending the July 2026 San Francisco Practice Transitions seminar, shown on the conference room display.",
    caption: "Dentists who care about their legacy: attendees at the July 2026 San Francisco seminar.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "sf-seminar-duo",
    src: "/media/sf-seminar-jul-2026-duo.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo standing with a colleague holding seminar materials at the July 2026 San Francisco seminar venue.",
    caption: "With a colleague at the July 2026 San Francisco Practice Transitions seminar.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "backstage-retreat-book-signing",
    src: "/media/backstage-retreat-2026-book-signing.webp",
    width: 1600,
    height: 854,
    layoutVariant: "landscape",
    alt: "Backstage Retreat 2026 book signing in Orlando on July 30, 2026, with contributing authors holding copies of The Dental Exit Blueprint.",
    caption: "Backstage Retreat 2026, Orlando: all 29 contributing authors and Key Opinion Leaders under one roof for The Dental Exit Blueprint book signing.",
    featuredRoutes: ["profile:news", "profile:gallery"],
    objectFit: "contain",
    gridSpan: "wide",
  }),
  createRemoteAsset({
    id: "backstage-disney-world",
    src: "/media/backstage-disney-world-2026.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo with three fellow Backstage Mastermind members holding tickets outside at Disney World.",
    caption: "Living one of the Backstage Mastermind's core values, fun, at Disney World with fellow members (abundance, kindness, and fun).",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "backstage-launch-pod-dallas",
    src: "/media/backstage-launch-pod-dallas-2026.webp",
    width: 1600,
    height: 1136,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with fellow Backstage Mastermind members in matching Launch Pod shirts at the Dallas retreat.",
    caption: "Backstage Mastermind Launch Pod session in Dallas: surrounded by entrepreneurs committed to helping one another succeed.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "found-book-launch",
    src: "/media/found-book-launch-anissa-broussard.webp",
    width: 1068,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo and Dr. Anissa Broussard holding a copy of her book FOUND on a staircase.",
    caption: "Celebrating the launch of FOUND with author Dr. Anissa Broussard.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo", "Dr. Anissa Broussard"],
  }),
  createRemoteAsset({
    id: "dugoni-alumni-gala-table",
    src: "/media/dugoni-alumni-gala-table.webp",
    width: 1600,
    height: 1058,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with Pacific Dugoni alumni colleagues and classmates in formal attire gathered around a table at an Alumni Association evening.",
    caption: "Alumni Association evening: great seeing, and now working with, Pacific Dugoni colleagues and classmates on their transitions and their businesses.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-business-club-members",
    src: "/media/dugoni-business-club-members.webp",
    width: 1600,
    height: 1200,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo standing with three Dugoni Business Club student members inside the Arthur A. Dugoni School of Dentistry.",
    caption: "With Dugoni Business Club members at the Arthur A. Dugoni School of Dentistry.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-business-club-dinner",
    src: "/media/dugoni-business-club-dinner.webp",
    width: 1200,
    height: 1600,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo at a long restaurant table with Dugoni Business Club members during an alumni evening.",
    caption: "Great evening at the Dugoni Alumni meeting with Business Club members.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-business-club-celebration-lunch",
    src: "/media/dugoni-business-club-celebration-lunch.webp",
    width: 1600,
    height: 1200,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with a large group of Dugoni Business Club members at a celebration lunch.",
    caption: "Celebration lunch for another great year with the Dugoni Business Club. Proud to be their advisor and consultant.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-business-club-golf",
    src: "/media/dugoni-business-club-golf.webp",
    width: 1600,
    height: 1200,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo seated at a clubhouse table with four Dugoni Business Club leaders after a round of golf.",
    caption: "Supporting Dugoni Business Club leadership with a round of golf and down time before finals.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-symposium-sponsors",
    src: "/media/dugoni-symposium-2023-sponsors.webp",
    width: 1284,
    height: 924,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with two industry sponsor representatives at the Dugoni Business Club Symposium vendor fair.",
    caption: "Dugoni Business Club Symposium: thank you to our industry sponsors.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-symposium-sponsor-team",
    src: "/media/dugoni-symposium-2023-sponsor-team.webp",
    width: 1101,
    height: 732,
    layoutVariant: "landscape",
    alt: "Industry sponsor representatives gathered at the Dugoni Business Club Symposium vendor fair.",
    caption: "Industry sponsors supporting the Dugoni Business Club Symposium.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "publication-spread",
    src: "/media/publication-spread.webp",
    width: 240,
    height: 320,
    layoutVariant: "portrait",
    alt: "Publication spread showing Dr. Michael Njo speaking with younger dental professionals at the Dugoni Business Club networking night.",
    caption: "Published moment: Dr. Njo mentoring early-career dentists at the Dugoni Business Club networking night.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "conference-room-meeting",
    src: "/media/conference-room-meeting.webp",
    width: 320,
    height: 240,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo participating in a boardroom-style meeting with dental leaders seated around a conference table.",
    caption: "Leadership conversations focused on strategy, ownership, and where dentistry is heading next.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "mayflower-trio",
    src: "/media/mayflower-trio.webp",
    width: 320,
    height: 240,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo standing with two colleagues in front of a Mayflower sign.",
    caption: "Professional relationships built over years of trust, perspective, and shared work in the dental industry.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dinner-duo",
    src: "/media/dinner-duo.webp",
    width: 320,
    height: 240,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo sharing dinner with a colleague at a restaurant.",
    caption: "Long-term professional relationships built far beyond the transaction itself.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-lunch-learn-presentation",
    src: "/media/presentation-photo.webp",
    width: 1600,
    height: 2134,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo presenting to Dugoni students during a Lunch & Learn session.",
    caption: "Presenting to students at the Arthur A. Dugoni School of Dentistry during a Lunch & Learn session.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-lunch-learn-flyer",
    src: "/media/flyer-photo.webp",
    width: 1700,
    height: 2188,
    layoutVariant: "portrait",
    alt: "Lunch & Learn flyer for Dr. Michael Njo's presentation at the Dugoni School of Dentistry.",
    caption: "The Lunch & Learn flyer announcing Dr. Njo's talk at the Dugoni School of Dentistry.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
  createRemoteAsset({
    id: "smcds-symposium-workshop",
    src: "/media/san-mateo-symposium-workshop.jpg",
    width: 1800,
    height: 1200,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo leading a workshop with associate dentists at the SMCDS Peninsula Dental Compliance Symposium.",
    caption: "Leading an associate workshop at the SMCDS Peninsula Dental Compliance Symposium.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "smcds-associate-workshop",
    src: "/media/smcds-associate-workshop-2.jpg",
    width: 1800,
    height: 1012,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with future dental professionals at the SMCDS Peninsula Dental Compliance Symposium.",
    caption: "Working with future dental buyers and associates on career and ownership decisions.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
    names: ["Dr. Michael Njo"],
  }),
  createRemoteAsset({
    id: "dugoni-donation-ceremony",
    src: "/media/dugoni-business-club-donation-ceremony.webp",
    width: 1600,
    height: 1066,
    layoutVariant: "landscape",
    alt: "Dugoni Business Club members presenting a donation check to the Arthur A. Dugoni School of Dentistry.",
    caption: "A Dugoni Business Club donation ceremony supporting the Arthur A. Dugoni School of Dentistry.",
    featuredRoutes: ["profile:gallery"],
    objectFit: "contain",
  }),
];

export const allEditorialImages: EditorialMediaAsset[] = [
  ...suppliedMediaAssets,
  ...legacyGalleryImages,
  ...sharedUpdateImages,
];

const getImagesForFeature = (featureRoute: MediaFeatureRoute) =>
  allEditorialImages.filter((image) => image.featuredRoutes.includes(featureRoute));

const getImageById = (id: string) => {
  const image = allEditorialImages.find((asset) => asset.id === id);

  if (!image) {
    throw new Error(`Missing media asset: ${id}`);
  }

  return image;
};

export const homeLeadershipImages = getImagesForFeature("home:leadership");
export const profileRelationshipImages = getImagesForFeature("profile:relationships");
export const profileNewsImages = getImagesForFeature("profile:news");
export const profileGalleryImages = getImagesForFeature("profile:gallery");
export const resourceBookImages = getImagesForFeature("resources:book");
export const resourceBookFeatureImage = getImageById("handbook-cover");
export const resourceBookInsetImage = getImageById("gpr-residency-presentation");
export const interviewQuoteImage = getImageById("backstage-quote-card");
