import { allEditorialImages, type EditorialMediaAsset } from "@/data/media";
import {
  loadLiveCaptionMap,
  type PhotoCaptionMap,
} from "@/lib/photo-caption-store";

export {
  loadLiveCaptionMap,
  saveLiveCaption,
  type PhotoCaptionMap,
  type PhotoCaptionRecord,
} from "@/lib/photo-caption-store";

const SITE_ORIGIN = "https://michaelnjodds.com";

export type WebsitePhoto = {
  id: string;
  imageUrl: string;
  alt: string;
  inventoryCaption: string;
  liveCaption: string | null;
  savedAt: string | null;
  onWebsite: boolean;
  featuredRoutes: string[];
  emailNote: string | null;
  names: string[];
};

type ExtraPhoto = {
  id: string;
  src: string;
  alt: string;
  featuredRoutes: string[];
  emailNote: string | null;
};

const EMAIL_NOTES: Record<string, string> = {
  "dental-lifestyles-feature":
    "Shared by Dr. Njo as the Dental Lifestyles Magazine Summer 2026 feature.",
  "dental-lifestyles-cover":
    "Shared by Dr. Njo with the Summer 2026 Dental Lifestyles cover.",
  "handbook-second-edition-coming-soon":
    "Shared by Dr. Njo for the second-edition Coming Soon graphic.",
  "sf-seminar-presenting":
    "From the July 2026 San Francisco seminar photos Dr. Njo emailed to post.",
  "sf-seminar-attendees":
    "From the July 2026 San Francisco seminar photos Dr. Njo emailed to post.",
  "sf-seminar-duo":
    "From the July 2026 San Francisco seminar photos Dr. Njo emailed to post.",
  "backstage-retreat-book-signing":
    "Shared by Dr. Njo from Backstage Retreat 2026 in Orlando.",
  "backstage-disney-world":
    "Shared by Dr. Njo from Backstage Mastermind at Disney World (POST PLEASE).",
  "backstage-launch-pod-dallas":
    "Shared by Dr. Njo from the Backstage Launch Pod session in Dallas.",
  "found-book-launch":
    "Shared by Dr. Njo from the FOUND book launch with Dr. Anissa Broussard.",
  "bill-mikki-porch":
    "Shared by Dr. Njo for the Bill and Mikki practice-match photos.",
  "bill-mikki-trio":
    "Shared by Dr. Njo for the Bill and Mikki practice-match photos.",
  "poe-roseville-collage":
    "Emailed PLEASE POST: The Practice Blueprint dinner in Roseville, August 2026.",
  "panel-dinner-group":
    "Shared by Dr. Njo from the Los Angeles Panel of Experts dinner.",
  "panel-dinner-book-signing":
    "Shared by Dr. Njo from the Los Angeles Panel of Experts dinner.",
  "panel-dinner-table":
    "Shared by Dr. Njo from the Los Angeles Panel of Experts dinner.",
  "diana-fat-board-of-regents":
    "Emailed PLEASE POST: Dr. Diana Fat Board of Regents congratulations.",
  "sacramento-seminar-oct-2026":
    "Emailed September 1, 2026 as PLEASE POST ASAP AND AGAIN IN 2 WEEKS.",
  "promotional-flyer-dental-strategies":
    "Flyer Dr. Njo shared for Beyond the Chair posting.",
  "dental-lifestyles-40-over-40-honoree-2026":
    "Shared for the Dental Lifestyles 40 Over 40 2026 news post: Congratulations, Dr. Michael Njo! honoree graphic.",
  "dental-lifestyles-magazine-16th-issue":
    "Shared with the Dental Lifestyles Magazine 16th-issue / 40 Over 40 promo.",
  "irreplaceable-leah-roling-dr-njo":
    "Emailed October 21, 2026 as PLEASE POST ASAP.",
  "backstage-business-spotlight-michael-njo":
    "Emailed PLEASE POST: Backstage Business Spotlight featuring Michael Njo and Dental Strategies.",
  "dental-lifestyles-feature-p26":
    "Shared by Dr. Njo with the Summer 2026 Dental Lifestyles feature.",
};

const EXTRA_PHOTOS: ExtraPhoto[] = [
  {
    id: "peninsula-dental-society-merger",
    src: "/media/peninsula-dental-society-merger.webp",
    alt: "Group gathered in front of The Peninsula Dental Society sign.",
    featuredRoutes: ["profile:news", "/blog/peninsula-dental-society-merger"],
    emailNote: "Shared by Dr. Njo on September 17, 2026 with his Peninsula Dental Society merger message.",
  },
  {
    id: "dental-lifestyles-40-over-40-honoree-2026",
    src: "/media/dental-lifestyles-40-over-40-honoree-2026.webp",
    alt: "Congratulations graphic for Dr. Michael Njo, 2026 Dental Lifestyles 40 Over 40 honoree, with his portrait and Dental Strategies and Practice Transitions Institute.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["dental-lifestyles-40-over-40-honoree-2026"] ?? null,
  },
  {
    id: "dental-lifestyles-magazine-16th-issue",
    src: "/media/dental-lifestyles-magazine-16th-issue.webp",
    alt: "Promo for the October 2026 issue of Dental Lifestyles Magazine, showing the 16th-issue spread and cover with the 40 Over 40 awardees.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["dental-lifestyles-magazine-16th-issue"] ?? null,
  },
  {
    id: "irreplaceable-leah-roling-dr-njo",
    src: "/media/irreplaceable-leah-roling-dr-njo.webp",
    alt: "Dr. Njo holding a copy of IrReplaceable by Leah Roling.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["irreplaceable-leah-roling-dr-njo"] ?? null,
  },
  {
    id: "backstage-business-spotlight-michael-njo",
    src: "/media/backstage-business-spotlight-michael-njo.webp",
    alt: "Backstage Business Spotlight graphic featuring Michael Njo, dental practice transition expert and founder of Dental Strategies.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["backstage-business-spotlight-michael-njo"] ?? null,
  },
  {
    id: "dental-lifestyles-feature-p26",
    src: "/media/dental-lifestyles-summer-2026-feature-p26.webp",
    alt: "Continued page of the Dental Lifestyles Magazine Summer 2026 feature on Dr. Michael Njo.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["dental-lifestyles-feature-p26"] ?? null,
  },
  {
    id: "promotional-flyer-dental-strategies",
    src: "/media/promotional-flyer-dental-strategies.webp",
    alt: "Dental Strategies Beyond the Chair promotional flyer.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["promotional-flyer-dental-strategies"] ?? null,
  },
  {
    id: "sacramento-seminar-oct-2026",
    src: "/media/sacramento-seminar-oct-2026.webp",
    alt: "Mastering Your Dental Transition seminar flyer for October 2, 2026 in Sacramento.",
    featuredRoutes: ["profile:news"],
    emailNote: EMAIL_NOTES["sacramento-seminar-oct-2026"] ?? null,
  },
];

export function resolvePublicImageUrl(
  src: EditorialMediaAsset["src"] | string,
): string {
  if (typeof src === "string") {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
    return `${SITE_ORIGIN}${src.startsWith("/") ? src : `/${src}`}`;
  }

  const path = src.src;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function toWebsitePhoto(
  asset: EditorialMediaAsset,
  live: PhotoCaptionMap,
): WebsitePhoto {
  const liveRecord = live[asset.id];
  return {
    id: asset.id,
    imageUrl: resolvePublicImageUrl(asset.src),
    alt: asset.alt,
    inventoryCaption: asset.caption?.trim() ?? "",
    liveCaption: liveRecord?.caption ?? null,
    savedAt: liveRecord?.savedAt ?? null,
    onWebsite: true,
    featuredRoutes: [...asset.featuredRoutes],
    emailNote:
      EMAIL_NOTES[asset.id] ??
      "Photo Dr. Njo shared and published on michaelnjodds.com.",
    names: asset.names ? [...asset.names] : [],
  };
}

export async function listWebsitePhotos(): Promise<WebsitePhoto[]> {
  const live = await loadLiveCaptionMap();
  const photos = allEditorialImages.map((asset) => toWebsitePhoto(asset, live));
  const seen = new Set(photos.map((photo) => photo.id));

  for (const extra of EXTRA_PHOTOS) {
    if (seen.has(extra.id)) {
      continue;
    }
    const liveRecord = live[extra.id];
    photos.push({
      id: extra.id,
      imageUrl: resolvePublicImageUrl(extra.src),
      alt: extra.alt,
      inventoryCaption: "",
      liveCaption: liveRecord?.caption ?? null,
      savedAt: liveRecord?.savedAt ?? null,
      onWebsite: true,
      featuredRoutes: extra.featuredRoutes,
      emailNote: extra.emailNote,
      names: [],
    });
  }

  return photos;
}

export function isKnownPhotoId(id: string): boolean {
  return (
    allEditorialImages.some((asset) => asset.id === id) ||
    EXTRA_PHOTOS.some((photo) => photo.id === id)
  );
}

export function qaCaptionMapFromPhotos(
  photos: WebsitePhoto[],
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const photo of photos) {
    if (photo.liveCaption?.trim()) {
      next[photo.id] = photo.liveCaption.trim();
    }
  }
  return next;
}
