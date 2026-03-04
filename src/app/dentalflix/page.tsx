import type { Metadata } from "next";
import DentalflixPage from "@/components/pages/dentalflix";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("/dentalflix");

export default function Page() {
  return <DentalflixPage />;
}
