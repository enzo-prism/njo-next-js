import type { Metadata } from "next";
import MichaelNjoDDSPage from "@/components/pages/michael-njo-dds";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/michael-njo-dds");
export const revalidate = 3600;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/michael-njo-dds")} id="route-structured-data" />
      <MichaelNjoDDSPage
        referenceDateIso={new Date().toISOString()}
        initialTab={tab === "news" ? "news" : "overview"}
      />
    </>
  );
}
