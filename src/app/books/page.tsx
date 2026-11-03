import type { Metadata } from "next";
import BooksPage from "@/components/pages/books";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("/books");

export default function Page() {
  return <BooksPage />;
}
