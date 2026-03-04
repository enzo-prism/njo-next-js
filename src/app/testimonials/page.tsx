import type { Metadata } from "next";
import TestimonialsPage from "@/components/pages/testimonials";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/testimonials");

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/testimonials")} id="route-structured-data" />
      <TestimonialsPage />
    </>
  );
}
