import { buildResourceArticlePath, getResourceArticleByPath, resourceArticles } from "@/data/resource-articles";
import { testimonialPages } from "@/data/testimonials";
import { LEGACY_TESTIMONIAL_SLUGS } from "@/config/routes";
import { CANONICAL_ORIGIN, SOCIAL_SHARE_IMAGE } from "@/config/site";
import { buildCanonicalUrl, normalizePathname } from "@/seo/canonical";
import {
  buildPageDescription,
  buildPageTitle,
} from "@/seo/metadata";
import {
  getContactStructuredData,
  getContactSuccessStructuredData,
  getHomeStructuredData,
  getMichaelNjoInterviewStructuredData,
  getMichaelNjoStructuredData,
} from "@/seo/structured-data";

const WEBSITE_NODE_ID = `${CANONICAL_ORIGIN}/#website`;
const PERSON_NODE_ID = `${CANONICAL_ORIGIN}/#person`;

type SchemaNode = Record<string, unknown>;

function resolveTestimonialSlug(slug: string) {
  return LEGACY_TESTIMONIAL_SLUGS[slug] || slug;
}

function getTestimonialBySlug(slug: string) {
  const normalizedSlug = resolveTestimonialSlug(slug);
  return testimonialPages.find((item) => item.slug === normalizedSlug);
}

const testimonialAuthorCounts = (() => {
  const counts = new Map<string, number>();
  for (const testimonial of testimonialPages) {
    counts.set(testimonial.author, (counts.get(testimonial.author) || 0) + 1);
  }
  return counts;
})();

function getTestimonialTitleSuffix(slug: string, author: string): string {
  const count = testimonialAuthorCounts.get(author) || 0;
  if (count <= 1) return "";
  const match = slug.match(/-(\d+)$/);
  if (!match) return "";
  return ` (${match[1]})`;
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

function buildBreadcrumb(items: Array<{ name: string; item: string }>, id: string): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function buildTestimonialCreativeWork(
  testimonial: (typeof testimonialPages)[number],
  detailPath: string,
  useExcerpt: boolean,
): SchemaNode {
  const canonicalUrl = buildCanonicalUrl(detailPath);
  const node: SchemaNode = {
    "@type": "CreativeWork",
    "@id": `${canonicalUrl}#testimonial`,
    url: canonicalUrl,
    name: `Testimonial from ${testimonial.author}`,
    author: {
      "@type": "Person",
      name: testimonial.author,
    },
    text: useExcerpt ? testimonial.excerpt : testimonial.quote,
    inLanguage: "en",
    about: {
      "@id": PERSON_NODE_ID,
    },
    publisher: {
      "@type": "Organization",
      name: "Dental Strategies",
      url: CANONICAL_ORIGIN,
    },
  };

  if (testimonial.publishedAt) {
    node.datePublished = testimonial.publishedAt;
    node.dateModified = testimonial.publishedAt;
  }

  return node;
}

function buildTestimonialsCollectionStructuredData(): SchemaNode {
  const pathname = "/testimonials";
  const collectionUrl = buildCanonicalUrl(pathname);
  const breadcrumbId = `${collectionUrl}#breadcrumb`;
  const itemListId = `${collectionUrl}#item-list`;

  const breadcrumb = buildBreadcrumb(
    [
      { name: "Home", item: buildCanonicalUrl("/") },
      { name: "Testimonials", item: collectionUrl },
    ],
    breadcrumbId,
  );

  const itemListElements = testimonialPages.map((testimonial, index) => {
    const detailPath = `/testimonials/${testimonial.slug}`;
    return {
      "@type": "ListItem",
      position: index + 1,
      url: buildCanonicalUrl(detailPath),
      item: buildTestimonialCreativeWork(testimonial, detailPath, true),
    };
  });

  const itemList: SchemaNode = {
    "@type": "ItemList",
    "@id": itemListId,
    name: "Client testimonials for Michael Njo, DDS",
    numberOfItems: testimonialPages.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: itemListElements,
  };

  const page: SchemaNode = {
    "@type": ["CollectionPage", "WebPage"],
    "@id": `${collectionUrl}#webpage`,
    url: collectionUrl,
    name: buildPageTitle(pathname),
    description: buildPageDescription(pathname),
    inLanguage: "en",
    isPartOf: {
      "@id": WEBSITE_NODE_ID,
    },
    about: {
      "@id": PERSON_NODE_ID,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    mainEntity: {
      "@id": itemListId,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [page, breadcrumb, itemList],
  };
}

function buildTestimonialDetailStructuredData(pathname: string): SchemaNode | null {
  const context = getTestimonialContext(pathname);
  if (!context) return null;

  const detailPath = `/testimonials/${context.slug}`;
  const detailUrl = buildCanonicalUrl(detailPath);
  const testimonialsUrl = buildCanonicalUrl("/testimonials");
  const suffix = getTestimonialTitleSuffix(context.slug, context.testimonial.author);
  const breadcrumbId = `${detailUrl}#breadcrumb`;
  const testimonialNode = buildTestimonialCreativeWork(context.testimonial, detailPath, false);

  const breadcrumb = buildBreadcrumb(
    [
      { name: "Home", item: buildCanonicalUrl("/") },
      { name: "Testimonials", item: testimonialsUrl },
      { name: `${context.testimonial.author}${suffix}`, item: detailUrl },
    ],
    breadcrumbId,
  );

  const page: SchemaNode = {
    "@type": ["WebPage", "Article"],
    "@id": `${detailUrl}#webpage`,
    url: detailUrl,
    name: buildPageTitle(detailPath),
    description: buildPageDescription(detailPath),
    inLanguage: "en",
    isPartOf: {
      "@id": `${testimonialsUrl}#webpage`,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    about: {
      "@id": PERSON_NODE_ID,
    },
    mainEntity: {
      "@id": testimonialNode["@id"] as string,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [page, breadcrumb, testimonialNode],
  };
}

function buildResourcesCollectionStructuredData(): SchemaNode {
  const pathname = "/resources";
  const collectionUrl = buildCanonicalUrl(pathname);
  const breadcrumbId = `${collectionUrl}#breadcrumb`;
  const itemListId = `${collectionUrl}#item-list`;

  const breadcrumb = buildBreadcrumb(
    [
      { name: "Home", item: buildCanonicalUrl("/") },
      { name: "Resources", item: collectionUrl },
    ],
    breadcrumbId,
  );

  const itemList: SchemaNode = {
    "@type": "ItemList",
    "@id": itemListId,
    name: "Resource articles and ownership guidance",
    numberOfItems: resourceArticles.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: resourceArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildCanonicalUrl(buildResourceArticlePath(article.slug)),
      name: article.title,
      description: article.excerpt,
    })),
  };

  const page: SchemaNode = {
    "@type": ["CollectionPage", "WebPage"],
    "@id": `${collectionUrl}#webpage`,
    url: collectionUrl,
    name: buildPageTitle(pathname),
    description: buildPageDescription(pathname),
    inLanguage: "en",
    isPartOf: {
      "@id": WEBSITE_NODE_ID,
    },
    about: {
      "@id": PERSON_NODE_ID,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    mainEntity: {
      "@id": itemListId,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [page, breadcrumb, itemList],
  };
}

function buildResourceArticleStructuredData(pathname: string): SchemaNode | null {
  const article = getResourceArticleByPath(pathname);
  if (!article) return null;

  const detailUrl = buildCanonicalUrl(pathname);
  const resourcesUrl = buildCanonicalUrl("/resources");
  const breadcrumbId = `${detailUrl}#breadcrumb`;
  const articleId = `${detailUrl}#article`;
  const faqId = `${detailUrl}#faq`;
  const imageId = `${detailUrl}#primaryimage`;

  const breadcrumb = buildBreadcrumb(
    [
      { name: "Home", item: buildCanonicalUrl("/") },
      { name: "Resources", item: resourcesUrl },
      { name: article.title, item: detailUrl },
    ],
    breadcrumbId,
  );

  const imageNode: SchemaNode = {
    "@type": "ImageObject",
    "@id": imageId,
    url: SOCIAL_SHARE_IMAGE.url,
    width: SOCIAL_SHARE_IMAGE.width,
    height: SOCIAL_SHARE_IMAGE.height,
  };

  const articleNode: SchemaNode = {
    "@type": "BlogPosting",
    "@id": articleId,
    url: detailUrl,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: "en",
    articleSection: "Resources",
    keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(", "),
    image: {
      "@id": imageId,
    },
    author: {
      "@type": "Person",
      "@id": PERSON_NODE_ID,
      name: "Michael Njo, DDS",
    },
    publisher: {
      "@type": "Organization",
      name: "Dental Strategies",
      url: CANONICAL_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: SOCIAL_SHARE_IMAGE.url,
      },
    },
    mainEntityOfPage: {
      "@id": `${detailUrl}#webpage`,
    },
    about: {
      "@id": PERSON_NODE_ID,
    },
  };

  const faqNode: SchemaNode | null = article.faq.length
    ? {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: article.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const page: SchemaNode = {
    "@type": ["WebPage", "Article"],
    "@id": `${detailUrl}#webpage`,
    url: detailUrl,
    name: buildPageTitle(pathname),
    description: buildPageDescription(pathname),
    inLanguage: "en",
    isPartOf: {
      "@id": `${resourcesUrl}#webpage`,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    about: {
      "@id": PERSON_NODE_ID,
    },
    mainEntity: {
      "@id": articleId,
    },
    primaryImageOfPage: {
      "@id": imageId,
    },
    hasPart: faqNode
      ? {
          "@id": faqId,
        }
      : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [page, breadcrumb, imageNode, articleNode, ...(faqNode ? [faqNode] : [])],
  };
}

export function buildPageStructuredData(pathname: string): SchemaNode | null {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    return getHomeStructuredData();
  }

  if (normalizedPath === "/about" || normalizedPath === "/michael-njo-dds") {
    return getMichaelNjoStructuredData();
  }

  if (normalizedPath === "/dr-michael-njo-interview") {
    return getMichaelNjoInterviewStructuredData();
  }

  if (normalizedPath === "/resources") {
    return buildResourcesCollectionStructuredData();
  }

  if (normalizedPath.startsWith("/resources/")) {
    return buildResourceArticleStructuredData(normalizedPath);
  }

  if (normalizedPath === "/contact") {
    return getContactStructuredData();
  }

  if (normalizedPath === "/contact/success") {
    return getContactSuccessStructuredData();
  }

  if (normalizedPath === "/testimonials") {
    return buildTestimonialsCollectionStructuredData();
  }

  if (normalizedPath.startsWith("/testimonials/")) {
    return buildTestimonialDetailStructuredData(normalizedPath);
  }

  return null;
}
