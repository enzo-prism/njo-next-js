import type { Metadata } from "next";
import BooksPage from "@/components/pages/books";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

export const metadata: Metadata = buildRouteMetadata("/books");

export default function Page() {
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData("/books")} id="route-structured-data" />
      <BooksPage />
    </>
  );
}
