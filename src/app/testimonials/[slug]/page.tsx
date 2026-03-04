import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestimonialDetailPage from "@/components/pages/testimonial-detail";
import { StructuredDataScript } from "@/components/structured-data-script";
import { testimonialPages } from "@/data/testimonials";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return testimonialPages.map((testimonial) => ({ slug: testimonial.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildRouteMetadata(`/testimonials/${slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const exists = testimonialPages.some((testimonial) => testimonial.slug === slug);
  if (!exists) {
    notFound();
  }

  return (
    <>
      <StructuredDataScript data={buildPageStructuredData(`/testimonials/${slug}`)} id="route-structured-data" />
      <TestimonialDetailPage slug={slug} />
    </>
  );
}
