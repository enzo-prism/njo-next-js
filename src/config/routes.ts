export const LEGACY_REDIRECTS: Record<string, string> = {
  "/testimonials/team-member-2": "/testimonials/team-member",
  "/testimonials/dr-fat": "/testimonials/diana-fat-dds",
  "/testimonials/richard-and-kimberly-crum": "/testimonials/kimberly-crum",
  "/dr-michael-neal-interview": "/dr-michael-njo-interview",
};

export const LEGACY_TESTIMONIAL_SLUGS: Record<string, string> = {
  "dr-fat": "diana-fat-dds",
  "richard-and-kimberly-crum": "kimberly-crum",
};

export const STATIC_SITE_PATHS = [
  "/",
  "/michael-njo-dds",
  "/dr-michael-neal-interview",
  "/dr-michael-njo-interview",
  "/testimonials",
  "/resources",
  "/dentalflix",
  "/phillips-event",
  "/contact",
] as const;
