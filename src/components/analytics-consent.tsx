"use client";

import { Analytics, track } from "@vercel/analytics/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PRODUCTION_HOSTNAME, siteRuntime } from "@/config/site";
import {
  ANALYTICS_CONSENT_CHANGE_EVENT,
  ANALYTICS_TRACK_EVENT,
  getAnalyticsConsent,
  isGoogleAnalyticsAllowed,
  setAnalyticsConsent,
  type AnalyticsConsent,
  type AnalyticsEventDetail,
} from "@/lib/analytics-events";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    hj?: ((...args: unknown[]) => void) & { q?: unknown[] };
    _hjSettings?: { hjid: number; hjsv: number };
    [gaDisableKey: `ga-disable-${string}`]: boolean | undefined;
  }
}

const GA_SCRIPT_ID = "dental-strategies-google-analytics";
const HOTJAR_SCRIPT_ID = "dental-strategies-hotjar";
const ANALYTICS_TEST_PARAM = "analytics_test";
const ANALYTICS_TEST_STORAGE_KEY = "dental-strategies-analytics-test";
const PREVIEW_HOSTNAME_SUFFIX = ".vercel.app";

// EEA, UK, and Switzerland: Google Consent Mode keeps Analytics cookieless here
// until the visitor selects Allow analytics. Everywhere else it is opt-out.
const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

function isProductionBrowser() {
  return typeof window !== "undefined" && window.location.hostname.toLowerCase() === PRODUCTION_HOSTNAME;
}

// Preview deployments stay analytics-free unless opened with ?analytics_test=1, which
// loads Google Analytics in debug mode (visible in GA DebugView) for that browser tab.
function isAnalyticsTestBrowser() {
  if (typeof window === "undefined" || !window.location.hostname.toLowerCase().endsWith(PREVIEW_HOSTNAME_SUFFIX)) {
    return false;
  }
  const requested = new URLSearchParams(window.location.search).get(ANALYTICS_TEST_PARAM) === "1";
  try {
    if (requested) window.sessionStorage.setItem(ANALYTICS_TEST_STORAGE_KEY, "1");
    return window.sessionStorage.getItem(ANALYTICS_TEST_STORAGE_KEY) === "1";
  } catch {
    return requested;
  }
}

function canRunGoogleAnalytics() {
  return isProductionBrowser() || isAnalyticsTestBrowser();
}

function getOrCreateGtag() {
  window.dataLayer = window.dataLayer ?? [];
  if (window.gtag) return window.gtag;

  window.gtag = function gtag() {
    // Google Analytics consumes the Arguments object placed on dataLayer.
    // eslint-disable-next-line prefer-rest-params -- preserve the gtag queue shape
    window.dataLayer?.push(arguments);
  };
  return window.gtag;
}

function loadGoogleAnalytics(consent: AnalyticsConsent | null) {
  if (!siteRuntime.gaId) return;

  const gtag = getOrCreateGtag();
  window[`ga-disable-${siteRuntime.gaId}`] = false;
  if (document.getElementById(GA_SCRIPT_ID)) {
    if (consent === "accepted") gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  const adsDenied = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  gtag("consent", "default", { ...adsDenied, analytics_storage: "denied", region: CONSENT_REQUIRED_REGIONS });
  gtag("consent", "default", { ...adsDenied, analytics_storage: "granted" });
  if (consent === "accepted") gtag("consent", "update", { analytics_storage: "granted" });

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(siteRuntime.gaId)}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", siteRuntime.gaId, isProductionBrowser() ? { anonymize_ip: true } : { anonymize_ip: true, debug_mode: true });
}

function disableGoogleAnalytics() {
  if (!siteRuntime.gaId) return;
  // Stops any already-loaded gtag from sending further hits on this page.
  window[`ga-disable-${siteRuntime.gaId}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

function loadHotjar() {
  if (!siteRuntime.hotjarId || document.getElementById(HOTJAR_SCRIPT_ID)) return;

  window.hj = window.hj ?? function hotjarQueue(...args: unknown[]) {
    (window.hj!.q = window.hj!.q ?? []).push(args);
  };
  window._hjSettings = {
    hjid: Number(siteRuntime.hotjarId),
    hjsv: Number(siteRuntime.hotjarSv || "6"),
  };

  const script = document.createElement("script");
  script.id = HOTJAR_SCRIPT_ID;
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${window._hjSettings.hjid}.js?sv=${window._hjSettings.hjsv}`;
  document.head.appendChild(script);
}

function sendAnalyticsEvent({ name, properties }: AnalyticsEventDetail) {
  const consent = getAnalyticsConsent();
  if (!canRunGoogleAnalytics() || !isGoogleAnalyticsAllowed(consent)) return;

  if (consent === "accepted" && isProductionBrowser()) track(name, properties);
  if (siteRuntime.gaId && window.gtag) {
    window.gtag("event", name, properties ?? {});
  }
}

export function AnalyticsConsentManager() {
  const [consent, setConsentState] = useState<AnalyticsConsent | null>(null);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);

  useEffect(() => {
    setConsentState(getAnalyticsConsent());
    setHasLoadedPreference(true);

    const handleConsentChange = (event: Event) => {
      setConsentState((event as CustomEvent<AnalyticsConsent>).detail);
    };
    window.addEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => window.removeEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference || !canRunGoogleAnalytics()) return;
    if (isGoogleAnalyticsAllowed(consent)) {
      loadGoogleAnalytics(consent);
    } else {
      disableGoogleAnalytics();
    }
    if (consent === "accepted" && isProductionBrowser()) loadHotjar();
  }, [consent, hasLoadedPreference]);

  const isBannerOpen = hasLoadedPreference && consent === null;

  useEffect(() => {
    if (!isBannerOpen) {
      return;
    }
    const previousPadding = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "12rem";
    return () => {
      document.body.style.paddingBottom = previousPadding;
    };
  }, [isBannerOpen]);

  useEffect(() => {
    const handleTrackedEvent = (event: Event) => {
      sendAnalyticsEvent((event as CustomEvent<AnalyticsEventDetail>).detail);
    };
    const handleTrackedClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-analytics-event]")
        : null;
      if (!target) return;

      const name = target.dataset.analyticsEvent;
      if (!name) return;
      sendAnalyticsEvent({
        name,
        properties: {
          label: target.dataset.analyticsLabel ?? target.textContent?.trim() ?? "",
          path: window.location.pathname,
        },
      });
    };

    window.addEventListener(ANALYTICS_TRACK_EVENT, handleTrackedEvent);
    document.addEventListener("click", handleTrackedClick);
    return () => {
      window.removeEventListener(ANALYTICS_TRACK_EVENT, handleTrackedEvent);
      document.removeEventListener("click", handleTrackedClick);
    };
  }, []);

  const chooseConsent = (value: AnalyticsConsent) => {
    setAnalyticsConsent(value);
    setConsentState(value);
  };

  return (
    <>
      {consent === "accepted" && isProductionBrowser() ? <Analytics /> : null}
      {isBannerOpen ? (
        <aside
          aria-label="Analytics privacy choices"
          className="fixed inset-x-3 bottom-3 z-[45] mx-auto max-w-3xl rounded-2xl border border-border bg-background p-4 shadow-2xl sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              We use Google Analytics to understand how visitors use this site. Hotjar session insights load
              only if you allow them, and you can decline analytics here or later under Privacy choices. Read our{" "}
              <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-col gap-2 min-[420px]:flex-row">
              <Button type="button" variant="outline" className="min-h-11" onClick={() => chooseConsent("declined")}>
                Decline
              </Button>
              <Button type="button" className="min-h-11" onClick={() => chooseConsent("accepted")}>
                Allow analytics
              </Button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
