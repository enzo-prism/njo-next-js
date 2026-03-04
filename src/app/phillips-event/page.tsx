import type { Metadata } from "next";
import PhillipsEventPage from "@/components/pages/phillips-event";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("/phillips-event");

export default function Page() {
  return <PhillipsEventPage />;
}
