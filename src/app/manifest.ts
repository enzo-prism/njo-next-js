import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Michael Njo, DDS | Dental Strategies",
    short_name: "Dental Strategies",
    description: "Practice strategy, valuation, growth, and transition guidance from Dr. Michael Njo.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#163f6d",
    icons: [
      { src: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
