import type { NextConfig } from "next";
import {
  APPLE_PODCASTS_EMBED_ORIGIN,
  CALENDLY_ASSETS_ORIGIN,
  CALENDLY_MESSAGE_ORIGINS,
} from "./src/config/site";

const calendlyAppOrigins = CALENDLY_MESSAGE_ORIGINS.join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://formspree.io",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.hotjar.com https://script.hotjar.com ${CALENDLY_ASSETS_ORIGIN}`,
  `style-src 'self' 'unsafe-inline' ${CALENDLY_ASSETS_ORIGIN}`,
  `img-src 'self' data: blob: https://res.cloudinary.com https://*.google-analytics.com https://*.hotjar.com https://www.instagram.com https://*.cdninstagram.com ${CALENDLY_ASSETS_ORIGIN}`,
  `font-src 'self' data: ${CALENDLY_ASSETS_ORIGIN}`,
  "media-src 'self' https://res.cloudinary.com",
  `frame-src https://www.instagram.com https://vars.hotjar.com ${APPLE_PODCASTS_EMBED_ORIGIN} ${calendlyAppOrigins}`,
  `connect-src 'self' https://formspree.io https://*.google-analytics.com https://*.analytics.google.com https://*.hotjar.com wss://*.hotjar.com ${CALENDLY_ASSETS_ORIGIN} ${calendlyAppOrigins}`,
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
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
        source: "/about",
        destination: "/michael-njo-dds",
        permanent: true,
      },
      {
        source: "/events",
        destination: "/michael-njo-dds?tab=news",
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
