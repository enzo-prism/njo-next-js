import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.michaelnjodds.com" }],
        destination: "https://michaelnjodds.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "host", value: "michaelnjodds.com" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://michaelnjodds.com/:path*",
        permanent: true,
      },
      {
        source: "/dr-michael-neal-interview",
        destination: "/dr-michael-njo-interview",
        permanent: true,
      },
      {
        source: "/testimonials/dr-fat",
        destination: "/testimonials/diana-fat-dds",
        permanent: true,
      },
      {
        source: "/testimonials/richard-and-kimberly-crum",
        destination: "/testimonials/kimberly-crum",
        permanent: true,
      },
      {
        source: "/testimonials/team-member-2",
        destination: "/testimonials/team-member",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
