import type { Metadata } from "next";
import ResourcesPage from "@/components/pages/resources";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("/resources");

export default function Page() {
  return <ResourcesPage />;
}
