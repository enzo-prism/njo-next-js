import type { Metadata } from "next";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildPageStructuredData } from "@/seo/route-structured-data";
import BooksPage from "@/components/pages/books";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("/books");

export default function Page() {
  return <><StructuredDataScript data={buildPageStructuredData("/books")} id="route-structured-data" /><BooksPage /></>;
}
