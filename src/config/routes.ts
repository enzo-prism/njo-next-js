export const LEGACY_REDIRECTS: Record<string, string> = {
  "/about": "/michael-njo-dds",
  "/events": "/michael-njo-dds?tab=news",
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
  "/dr-michael-njo-interview",
  "/testimonials",
  "/resources",
  "/dentalflix",
  "/phillips-event",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export const NOINDEX_STATIC_SITE_PATHS = ["/dentalflix", "/phillips-event"] as const;

export const INDEXABLE_STATIC_SITE_PATHS = STATIC_SITE_PATHS.filter(
  (path) => !(NOINDEX_STATIC_SITE_PATHS as readonly string[]).includes(path),
);
