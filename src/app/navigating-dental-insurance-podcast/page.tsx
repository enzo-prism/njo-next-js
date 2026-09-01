import type { Metadata } from "next";
import PodcastPage from "@/components/pages/navigating-dental-insurance-podcast";
import { StructuredDataScript } from "@/components/structured-data-script";
import { PODCAST_PATH } from "@/data/podcast-episode";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata(PODCAST_PATH);

export default function Page() {
  return (
    <>
      <StructuredDataScript
        data={buildPageStructuredData(PODCAST_PATH)}
        id="route-structured-data"
      />
      <PodcastPage />
    </>
  );
}
