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
  alt: "Dr. Michael Njo working with the University of the Pacific Arthur A Dugoni School of Dentistry",
  caption: "Working closely with the University of the Pacific Arthur A Dugoni School of Dentistry.",
  featuredRoutes: ["profile:relationships", "profile:gallery"],
  objectPosition: "center top",
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
    alt: "Candid office photo with an AI startup founder and board of directors, including Nader Nadershahi, former Dean of the University of the Pacific School of Dentistry",
    caption:
      "With an AI startup founder and board of directors, notably former Dean of University of the Pacific School of Dentistry, Nader Nadershahi.",
    featuredRoutes: ["home:leadership", "profile:relationships", "profile:gallery"],
    objectPosition: "center center",
    objectFit: "contain",
    priority: true,
    names: ["Nader Nadershahi, former Dean, University of the Pacific School of Dentistry"],
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
    alt: "University of the Pacific board dinner with Dr. Njo.",
    caption: "UOP board dinner — relationship capital that surrounds the consulting work.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    gridSpan: "wide",
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

export const allEditorialImages: EditorialMediaAsset[] = [...suppliedMediaAssets, ...legacyGalleryImages];

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
