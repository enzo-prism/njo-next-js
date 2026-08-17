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
  }
}

const GA_SCRIPT_ID = "dental-strategies-google-analytics";
const HOTJAR_SCRIPT_ID = "dental-strategies-hotjar";

function isProductionBrowser() {
  return typeof window !== "undefined" && window.location.hostname.toLowerCase() === PRODUCTION_HOSTNAME;
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

function loadGoogleAnalytics() {
  if (!siteRuntime.gaId || document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(siteRuntime.gaId)}`;
  document.head.appendChild(script);

  const gtag = getOrCreateGtag();
  gtag("js", new Date());
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("config", siteRuntime.gaId, { anonymize_ip: true });
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
  if (!isProductionBrowser() || getAnalyticsConsent() !== "accepted") return;

  track(name, properties);
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
    if (consent !== "accepted" || !isProductionBrowser()) return;
    loadGoogleAnalytics();
    loadHotjar();
  }, [consent]);

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
      {hasLoadedPreference && consent === null ? (
        <aside
          aria-label="Analytics privacy choices"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-border bg-background p-4 shadow-2xl sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              We use optional analytics to understand site usage and improve the experience. Hotjar session
              insights and Google Analytics load only if you allow them. Read our{" "}
              <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-col gap-2 min-[420px]:flex-row">
              <Button type="button" variant="outline" onClick={() => chooseConsent("declined")}>
                Decline
              </Button>
              <Button type="button" onClick={() => chooseConsent("accepted")}>
                Allow analytics
              </Button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
