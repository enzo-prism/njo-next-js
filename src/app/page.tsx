import type { Metadata } from "next";
import HomePage from "@/components/pages/home";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/");
export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/")} id="route-structured-data" />
      <HomePage referenceDate={new Date()} />
    </>
  );
}
