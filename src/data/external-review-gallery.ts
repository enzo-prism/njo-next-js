export type ExternalReviewScreenshot = {
  src: string;
  alt: string;
  title: string;
};

export type ExternalReviewGallery = {
  title: string;
  description: string;
  platformName: string;
  platformUrl: string;
  screenshots: ExternalReviewScreenshot[];
};

export const externalReviewGallery: ExternalReviewGallery = {
  title: "Recommendations on Alignable",
  description:
    "Browse a few captured recommendations from Michael's Alignable presence, then open the platform to explore more there.",
  platformName: "Alignable",
  // Swap this to Michael's exact public profile URL once it is available.
  platformUrl: "https://www.alignable.com",
  screenshots: [
    {
      src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775057671/Screenshot_2026-03-31_at_10.53.43_AM_txxl6s.png",
      alt: "Screenshot of external recommendations from Mary Lynn Wheaton, Parisa Shahi, Andrew Phillips, and Michael Kowalski on Michael Njo's review profile",
      title: "Screenshot 1 of 3",
    },
    {
      src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775057671/Screenshot_2026-03-31_at_10.54.01_AM_exj6yh.png",
      alt: 'Screenshot of external recommendations from Linda Brown and Osvaldo "Ozzie" Paz on Michael Njo\'s review profile',
      title: "Screenshot 2 of 3",
    },
    {
      src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775057671/Screenshot_2026-03-31_at_10.53.32_AM_pkqkte.png",
      alt: "Screenshot of external recommendations from Kristen Maude, David Alpan, DDS, MSD, Ltd., and Kevin Valle on Michael Njo's review profile",
      title: "Screenshot 3 of 3",
    },
  ],
};
