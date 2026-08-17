import type { Metadata } from "next";
import { Manrope, Merriweather } from "next/font/google";
import { CalendlyLeadTracker } from "@/components/analytics/calendly-lead-tracker";
import { AnalyticsConsentManager } from "@/components/analytics-consent";
import SiteShell from "@/components/layout/site-shell";
import { SITE_URL } from "@/config/site";
import { buildRouteMetadata } from "@/seo/metadata";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  weight: ["400", "700", "900"],
});

const homeMetadata = buildRouteMetadata("/");

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${merriweather.variable}`}>
        <SiteShell>{children}</SiteShell>
        <CalendlyLeadTracker />
        <AnalyticsConsentManager />
      </body>
    </html>
  );
}
