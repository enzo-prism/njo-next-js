import assert from "node:assert/strict";
import { buildResourceArticlePath, resourceArticles } from "@/data/resource-articles";
import { buildCanonicalUrl } from "@/seo/canonical";
import { buildRouteMetadata } from "@/seo/metadata";

const cases = [
  {
    path: "/",
    title: "Michael Njo DDS | Dental Strategies Consulting",
    descriptionIncludes: "Dental Strategies Consulting",
    ogType: "website",
  },
  {
    path: "/michael-njo-dds",
    title: "Michael Njo DDS | Practice Transitions Consultant",
    descriptionIncludes: "residency speaker",
    ogType: "website",
  },
  {
    path: "/dr-michael-njo-interview",
    title: "Dr. Michael Njo Interview | Dental Practice Transitions & Consulting",
    descriptionIncludes: "Dr. Michael Njo",
    ogType: "website",
  },
  {
    path: "/navigating-dental-insurance-podcast",
    title: "The Right Way to Go Out of Network | Navigating Dental Insurance Podcast",
    descriptionIncludes: "Navigating Dental Insurance Podcast",
    ogType: "website",
  },
  {
    path: "/testimonials",
    title: "Testimonials for Michael Njo, DDS | Dental Strategies",
    descriptionIncludes: "testimonials",
    ogType: "website",
  },
  {
    path: "/testimonials/diana-fat-dds",
    title: "Testimonial from Diana Fat, DDS | Michael Njo DDS",
    descriptionIncludes: "Testimonial from",
    ogType: "article",
  },
  {
    path: "/resources",
    title: "Resources | Michael Njo, DDS",
    descriptionIncludes: "Access Dental Practice Transitions Handbook",
    ogType: "website",
  },
  {
    path: "/contact",
    title: "Contact Michael Njo, DDS | Dental Strategies",
    descriptionIncludes: "Contact Michael Njo",
    ogType: "website",
  },
  {
    path: "/contact/success",
    title: "Message Sent | Michael Njo, DDS",
    descriptionIncludes: "Confirmation",
    ogType: "website",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Michael Njo, DDS",
    descriptionIncludes: "collects, uses, protects",
    ogType: "website",
  },
  {
    path: "/terms",
    title: "Terms of Use | Michael Njo, DDS",
    descriptionIncludes: "terms governing use",
    ogType: "website",
  },
  ...resourceArticles.map((article) => ({
    path: buildResourceArticlePath(article.slug),
    title: article.metaTitle,
    descriptionIncludes: article.description,
    ogType: "article" as const,
  })),
] as const;

for (const item of cases) {
  const metadata = buildRouteMetadata(item.path);
  const titleValue = metadata.title as unknown;
  const title =
    typeof titleValue === "string"
      ? titleValue
      : typeof titleValue === "object" && titleValue !== null && "default" in titleValue
        ? String((titleValue as { default: string }).default)
        : undefined;
  assert.equal(title, item.title, `Unexpected title for ${item.path}`);

  assert.ok(
    metadata.description?.includes(item.descriptionIncludes),
    `Description mismatch for ${item.path}`,
  );

  assert.equal(metadata.alternates?.canonical, buildCanonicalUrl(item.path));
  const openGraph = metadata.openGraph as { type?: string; url?: string } | undefined;
  assert.equal(openGraph?.type, item.ogType);
  assert.equal(openGraph?.url, buildCanonicalUrl(item.path));
}

for (const path of ["/dentalflix", "/phillips-event", "/testimonials/diana-fat-dds"]) {
  const robots = buildRouteMetadata(path).robots as { index?: boolean; follow?: boolean } | undefined;
  assert.equal(robots?.index, false, `${path} should be noindex`);
  assert.equal(robots?.follow, true, `${path} should remain followable`);
}

console.log(`Checked ${cases.length} route metadata snapshots.`);
