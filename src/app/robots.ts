import type { MetadataRoute } from "next";
import { buildRobotsRules } from "@/seo/robots-data";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsRules();
}
