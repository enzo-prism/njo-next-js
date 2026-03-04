import type { Metadata } from "next";
import InterviewPage from "@/components/pages/dr-michael-njo-interview";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/dr-michael-njo-interview");

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/dr-michael-njo-interview")} id="route-structured-data" />
      <InterviewPage />
    </>
  );
}
