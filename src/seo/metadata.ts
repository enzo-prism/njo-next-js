import type { Metadata } from "next";
import { getResourceArticleByPath } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { LEGACY_TESTIMONIAL_SLUGS } from "@/config/routes";
import { buildCanonicalUrl, normalizePathname } from "@/seo/canonical";

const OG_IMAGE = {
  url: "/og-image.svg",
  width: 1200,
  height: 630,
  type: "image/svg+xml",
  alt: "Michael Njo, DDS | Dental Strategies",
} as const;

const testimonialAuthorCounts = (() => {
  const counts = new Map<string, number>();
  for (const testimonial of testimonialPages) {
    counts.set(testimonial.author, (counts.get(testimonial.author) || 0) + 1);
  }
  return counts;
})();

function resolveTestimonialSlug(slug: string) {
  return LEGACY_TESTIMONIAL_SLUGS[slug] || slug;
}

function getTestimonialBySlug(slug: string) {
  const normalizedSlug = resolveTestimonialSlug(slug);
  return testimonialPages.find((item) => item.slug === normalizedSlug);
}

function getTestimonialTitleSuffix(slug: string, author: string): string {
  const count = testimonialAuthorCounts.get(author) || 0;
  if (count <= 1) return "";
  const match = slug.match(/-(\d+)$/);
  if (!match) return "";
  return ` (${match[1]})`;
}

function buildTestimonialMetaExcerpt(quote: string, maxLength = 155): string {
  const cleaned = quote.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

function getTestimonialContext(pathname: string) {
  const normalizedPath = normalizePathname(pathname);
  if (!normalizedPath.startsWith("/testimonials/")) return null;

  const requestedSlug = normalizedPath.replace("/testimonials/", "");
  if (!requestedSlug) return null;

  const slug = resolveTestimonialSlug(requestedSlug);
  const testimonial = getTestimonialBySlug(slug);
  if (!testimonial) return null;

  return { requestedSlug, slug, testimonial };
}

function buildTestimonialMetaDescription({
  quote,
  author,
  suffix,
  maxLength = 155,
}: {
  quote: string;
  author: string;
  suffix: string;
  maxLength?: number;
}) {
  const authorLabel = `${author}${suffix}`;
  const prefix = `Testimonial from ${authorLabel} for Michael Njo DDS. `;

  if (prefix.length >= maxLength) {
    return `${prefix.slice(0, maxLength - 1).trimEnd()}…`;
  }

  const excerpt = buildTestimonialMetaExcerpt(quote, maxLength - prefix.length);
  return `${prefix}${excerpt}`;
}

export function buildPageTitle(pathname: string): string {
  const normalizedPath = normalizePathname(pathname);
  const resourceArticle = getResourceArticleByPath(normalizedPath);

  if (resourceArticle) {
    return resourceArticle.metaTitle;
  }

  if (normalizedPath.startsWith("/testimonials/")) {
    const context = getTestimonialContext(normalizedPath);
    if (context) {
      const suffix = getTestimonialTitleSuffix(context.slug, context.testimonial.author);
      return `Testimonial from ${context.testimonial.author}${suffix} | Michael Njo DDS`;
    }
    return "Testimonials | Michael Njo DDS";
  }

  switch (normalizedPath) {
    case "/":
      return "Michael Njo DDS | Dental Strategies Consulting";
    case "/about":
    case "/michael-njo-dds":
      return "Michael Njo DDS | Practice Transitions Consultant";
    case "/phillips-event":
      return "Phillips Event | Building a Sale-Ready Dental Practice | Dental Strategies";
    case "/dr-michael-njo-interview":
      return "Dr. Michael Njo Interview | Dental Practice Transitions & Consulting";
    case "/dr-michael-neal-interview":
      return "Dr. Michael Neal Interview | Dental Strategies";
    case "/testimonials":
      return "Testimonials for Michael Njo, DDS | Dental Strategies";
    case "/resources":
      return "Resources | Michael Njo, DDS";
    case "/dentalflix":
      return "DentalFlix Event Offer | Michael Njo, DDS";
    case "/contact":
      return "Contact Michael Njo, DDS | Dental Strategies";
    case "/contact/success":
      return "Message Sent | Michael Njo, DDS";
    default:
      return "Michael Njo, DDS | Dental Strategies";
  }
}

export function buildPageDescription(pathname: string): string {
  const normalizedPath = normalizePathname(pathname);
  const resourceArticle = getResourceArticleByPath(normalizedPath);

  if (resourceArticle) {
    return resourceArticle.description;
  }

  if (normalizedPath.startsWith("/testimonials/")) {
    const context = getTestimonialContext(normalizedPath);
    if (context) {
      const suffix = getTestimonialTitleSuffix(context.slug, context.testimonial.author);
      return buildTestimonialMetaDescription({
        quote: context.testimonial.quote,
        author: context.testimonial.author,
        suffix,
      });
    }
    return "Read client testimonials for Michael Njo DDS and Dental Strategies Consulting.";
  }

  switch (normalizedPath) {
    case "/":
      return "Michael Njo DDS leads Dental Strategies Consulting, guiding dentists and healthcare owners through practice launches, growth, valuations, and transitions.";
    case "/contact":
      return "Contact Michael Njo, DDS for consulting, coaching, or speaking inquiries. Send a message to Dental Strategies and receive a personal response.";
    case "/about":
    case "/michael-njo-dds":
      return "Learn about Michael Njo DDS, founder of Dental Strategies Consulting and Practice Transitions Institute, specializing in dental practice transitions and growth strategy.";
    case "/dr-michael-njo-interview":
      return "Watch Dr. Michael Njo discuss his journey from private practice to building Dental Strategies through transitions, management, and legal guidance.";
    case "/testimonials":
      return "Read testimonials from dentists and healthcare professionals who have worked with Michael Njo, DDS through Dental Strategies and Practice Transitions Institute.";
    case "/resources":
      return "Access Dental Practice Transitions Handbook, Practice Transitions Institute, and other resources curated by Michael Njo, DDS for practice owners.";
    case "/phillips-event":
      return "Attend the Phillips Event in Anaheim to learn how to make your dental practice more valuable, more durable, and ready for any transition.";
    case "/dentalflix":
      return "DentalFlix event offer: get $500 off any service with Dr. Michael Njo. When you book or reach out, mention you heard about Michael from the DentalFlix event.";
    case "/dr-michael-neal-interview":
      return "Watch the Dr. Michael Neal interview, then read how these lessons connect to Dr. Michael Njo's practice transition work.";
    case "/contact/success":
      return "Confirmation that your message was sent to Michael Njo, DDS. Dental Strategies will respond within two business days.";
    default:
      return "Dental Strategies Consulting by Dr. Michael Njo helps healthcare owners launch, grow, value, and transition practices successfully.";
  }
}

export function buildOpenGraphType(pathname: string): "website" | "article" {
  const normalizedPath = normalizePathname(pathname);
  if (normalizedPath.startsWith("/testimonials/")) return "article";
  if (getResourceArticleByPath(normalizedPath)) return "article";
  return "website";
}

export function buildPageKeywords(pathname: string): string[] | undefined {
  const normalizedPath = normalizePathname(pathname);
  const resourceArticle = getResourceArticleByPath(normalizedPath);

  if (!resourceArticle) return undefined;
  return [resourceArticle.primaryKeyword, ...resourceArticle.secondaryKeywords];
}

export function buildRouteMetadata(pathname: string): Metadata {
  const normalizedPath = normalizePathname(pathname);
  const resourceArticle = getResourceArticleByPath(normalizedPath);
  const title = buildPageTitle(pathname);
  const description = buildPageDescription(pathname);
  const canonical = buildCanonicalUrl(pathname);
  const ogType = buildOpenGraphType(pathname);
  const keywords = buildPageKeywords(pathname);

  return {
    title,
    description,
    keywords,
    authors: resourceArticle ? [{ name: "Michael Njo, DDS" }] : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonical,
      images: [OG_IMAGE],
      publishedTime: resourceArticle?.publishedAt,
      modifiedTime: resourceArticle?.updatedAt || resourceArticle?.publishedAt,
      authors: resourceArticle ? ["Michael Njo, DDS"] : undefined,
      section: resourceArticle ? "Resources" : undefined,
      tags: resourceArticle ? [resourceArticle.primaryKeyword, ...resourceArticle.secondaryKeywords] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
