import type { Metadata } from "next";
import MichaelNjoDDSPage from "@/components/pages/michael-njo-dds";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/michael-njo-dds");

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/michael-njo-dds")} id="route-structured-data" />
      <MichaelNjoDDSPage />
    </>
  );
}
