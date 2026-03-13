import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Manrope, Merriweather } from "next/font/google";
import SiteShell from "@/components/layout/site-shell";
import { siteRuntime, SITE_URL } from "@/config/site";
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
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

const analyticsScript = `(function () {
  var hostname = (window.location.hostname || "").toLowerCase();
  var isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.endsWith(".local");
  var isHeadless = /HeadlessChrome|Chrome-Lighthouse/i.test((navigator && navigator.userAgent) || "");
  if (isLocalhost || isHeadless) return;

  var gaId = ${JSON.stringify(siteRuntime.gaId)};
  var hotjarId = ${JSON.stringify(siteRuntime.hotjarId)};
  var hotjarSv = ${JSON.stringify(siteRuntime.hotjarSv)};

  if (gaId) {
    var gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", gaId);
  }

  if (hotjarId) {
    window.addEventListener("load", function () {
      (function (h, o, t, j, a, r) {
        h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
        h._hjSettings = { hjid: Number(hotjarId), hjsv: Number(hotjarSv || "6") };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
    });
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${merriweather.variable}`}>
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <Script id="ga-hotjar-bootstrap" strategy="afterInteractive">
          {analyticsScript}
        </Script>
      </body>
    </html>
  );
}
