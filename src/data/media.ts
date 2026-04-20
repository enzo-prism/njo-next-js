import type { StaticImageData } from "next/image";
import backstageQuoteCard from "@/assets/media/backstage-quote-card.png";
import blueprintForSuccessFlyer from "@/assets/media/blueprint-for-success-flyer.jpg";
import boardroomSession from "@/assets/media/boardroom-session.jpg";
import dinnerStrategyGroup from "@/assets/media/dinner-strategy-group.jpg";
import handbookCover from "@/assets/media/handbook-cover.jpg";
import handbookInteriorSpread from "@/assets/media/handbook-interior-spread.jpg";
import mayflowerPortrait from "@/assets/media/mayflower-portrait.jpg";
import medalPortrait from "@/assets/media/medal-portrait.png";
import officeStrategyGroup from "@/assets/media/office-strategy-group.jpg";
import seminarGroupPhoto from "@/assets/media/seminar-group-photo.jpg";
import soloDinnerGalleryOnly from "@/assets/media/solo-dinner-gallery-only.jpg";
import threePersonEvent from "@/assets/media/three-person-event.jpg";
import wineDinnerPhoto from "@/assets/media/wine-dinner-photo.jpg";

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
  galleryOnly?: boolean;
  priority?: boolean;
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
};

type RemoteAssetOptions = Omit<EditorialMediaAsset, "sizes"> & {
  sizes?: string;
};

const createLocalAsset = ({ src, sizes, ...asset }: LocalAssetOptions): EditorialMediaAsset => ({
  ...asset,
  src,
  width: src.width,
  height: src.height,
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
  featuredRoutes: [],
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
  featuredRoutes: ["profile:gallery"],
  objectPosition: "center center",
});

const suppliedMediaAssets: EditorialMediaAsset[] = [
  createLocalAsset({
    id: "boardroom-session",
    src: boardroomSession,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo leading a boardroom-style strategy session with dental professionals.",
    caption: "Boardroom strategy sessions that keep leadership, practice value, and execution connected.",
    featuredRoutes: ["home:leadership", "profile:gallery"],
    objectPosition: "center center",
    priority: true,
  }),
  createLocalAsset({
    id: "office-strategy-group",
    src: officeStrategyGroup,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with healthcare and dental leaders in an office strategy setting.",
    caption: "Cross-functional strategy conversations that connect ownership, leadership, and operational clarity.",
    featuredRoutes: ["home:leadership", "profile:gallery"],
    objectPosition: "center center",
  }),
  createLocalAsset({
    id: "dinner-strategy-group",
    src: dinnerStrategyGroup,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with peers at an evening strategy dinner.",
    caption: "Peer dinner conversations that sharpen perspective on growth, partnerships, and what comes next in the profession.",
    featuredRoutes: ["home:leadership", "profile:gallery"],
    objectPosition: "center center",
  }),
  createLocalAsset({
    id: "mayflower-portrait",
    src: mayflowerPortrait,
    layoutVariant: "square",
    alt: "Dr. Michael Njo with peers at a Mayflower gathering.",
    caption: "Trusted peer relationships that extend beyond transactions and into long-term advisory work.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectPosition: "center center",
  }),
  createLocalAsset({
    id: "wine-dinner-photo",
    src: wineDinnerPhoto,
    layoutVariant: "landscape",
    alt: "Dr. Michael Njo with a colleague at an evening industry dinner.",
    caption: "Relationship capital built through years of trusted work, referrals, and shared leadership conversations.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectPosition: "center center",
    priority: true,
  }),
  createLocalAsset({
    id: "medal-portrait",
    src: medalPortrait,
    layoutVariant: "poster",
    alt: "Dr. Michael Njo with a medal-recipient colleague at a formal professional event.",
    caption: "Recognition, peer trust, and industry presence beyond the consulting room.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectPosition: "center top",
  }),
  createLocalAsset({
    id: "three-person-event",
    src: threePersonEvent,
    layoutVariant: "portrait",
    alt: "Dr. Michael Njo with fellow attendees at a professional event.",
    caption: "A candid event moment underscoring the network around Dr. Njo's consulting and speaking work.",
    featuredRoutes: ["profile:relationships", "profile:gallery"],
    objectPosition: "center top",
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
    id: "handbook-interior-spread",
    src: handbookInteriorSpread,
    layoutVariant: "landscape",
    alt: "Interior spread from Dental Practice Transitions Handbook showing Dr. Michael Njo speaking with dental professionals.",
    caption: "A quick look inside the handbook and the real-world transition guidance behind it.",
    featuredRoutes: ["resources:book", "profile:gallery"],
    objectPosition: "center center",
  }),
  createLocalAsset({
    id: "seminar-group-photo",
    src: seminarGroupPhoto,
    layoutVariant: "landscape",
    alt: "Attendees gathered after a Blueprint for Success educational event.",
    caption: "One of the in-person education settings where Dr. Njo shares transition and practice-growth insight.",
    featuredRoutes: ["profile:news", "profile:gallery"],
    objectPosition: "center center",
    priority: true,
  }),
  createLocalAsset({
    id: "blueprint-for-success-flyer",
    src: blueprintForSuccessFlyer,
    layoutVariant: "square",
    alt: "Blueprint for Success seminar flyer featuring Dr. Michael Njo.",
    caption: "A quick event proof point from Dr. Njo's educational speaking and society programming.",
    featuredRoutes: ["profile:news", "profile:gallery"],
    objectPosition: "center top",
  }),
  createLocalAsset({
    id: "backstage-quote-card",
    src: backstageQuoteCard,
    layoutVariant: "poster",
    alt: "Backstage Mastermind feature card highlighting Dr. Michael Njo's practice support message.",
    caption: "A shareable quote card positioning Dr. Njo as a trusted partner for everything beyond the operatory.",
    featuredRoutes: ["interview:quote", "profile:gallery"],
    objectPosition: "center top",
  }),
  createLocalAsset({
    id: "solo-dinner-gallery-only",
    src: soloDinnerGalleryOnly,
    layoutVariant: "portrait",
    alt: "Dinner portrait from a private celebration setting.",
    caption: "A gallery-only moment kept secondary to the public business narrative.",
    featuredRoutes: ["profile:gallery"],
    objectPosition: "center top",
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
    layoutVariant: "poster",
    alt: "Dr. Michael Njo guiding dental professionals and mentoring future leaders.",
    caption: "Dr. Michael Njo in action guiding dental professionals.",
    featuredRoutes: ["profile:gallery"],
  }),
  gprResidencyPresentationImage,
  createRemoteAsset({
    id: "leadership-retreat",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/Leadership-retreat_peohe1.webp",
    width: 3024,
    height: 4032,
    layoutVariant: "portrait",
    alt: "Leadership retreat with Dr. Njo and peers.",
    caption: "Leadership retreat.",
    featuredRoutes: ["profile:gallery"],
  }),
  createRemoteAsset({
    id: "uop-board-dinner",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/UOP-board-dinner_vvxbkq.webp",
    width: 3024,
    height: 4032,
    layoutVariant: "portrait",
    alt: "University of the Pacific board dinner with Dr. Njo.",
    caption: "UOP board dinner.",
    featuredRoutes: ["profile:gallery"],
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
export const resourceBookInsetImage = getImageById("handbook-interior-spread");
export const interviewQuoteImage = getImageById("backstage-quote-card");
