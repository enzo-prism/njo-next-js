import type { Metadata } from "next";
import ResourcesPage from "@/components/pages/resources";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/resources");

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/resources")} id="route-structured-data" />
      <ResourcesPage />
    </>
  );
}
