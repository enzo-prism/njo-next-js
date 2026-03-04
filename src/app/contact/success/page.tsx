import type { Metadata } from "next";
import ContactSuccessPage from "@/components/pages/contact-success";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = {
  ...buildRouteMetadata("/contact/success"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/contact/success")} id="route-structured-data" />
      <ContactSuccessPage />
    </>
  );
}
