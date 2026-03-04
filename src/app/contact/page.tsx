import type { Metadata } from "next";
import ContactPage from "@/components/pages/contact";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/contact");

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/contact")} id="route-structured-data" />
      <ContactPage />
    </>
  );
}
