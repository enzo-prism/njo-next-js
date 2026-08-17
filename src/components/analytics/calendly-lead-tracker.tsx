"use client";

import { useEffect } from "react";
import {
  BOOKING_URL,
  CALENDLY_WIDGET_CSS,
  CALENDLY_WIDGET_JS,
  DSO_PRICING_BOOKING_URL,
} from "@/config/site";
import {
  calendlyFormLeadParams,
  isCalendlyEventScheduledMessage,
  isCalendlyOrigin,
  locationFromPathname,
  recordFormLead,
} from "@/lib/ga4";

type PopupWidgetApi = {
  initPopupWidget: (options: { url: string }) => void;
};

declare global {
  interface Window {
    Calendly?: PopupWidgetApi;
  }
}

function bookingPaths(): string[] {
  return [BOOKING_URL, DSO_PRICING_BOOKING_URL].map((url) => {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  });
}

function isBookingHref(href: string): boolean {
  try {
    const resolved = new URL(href, window.location.href);
    const normalized = `${resolved.origin}${resolved.pathname}`;
    return bookingPaths().includes(normalized);
  } catch {
    return false;
  }
}

function loadWidgetStylesheet() {
  if (document.querySelector(`link[href="${CALENDLY_WIDGET_CSS}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CALENDLY_WIDGET_CSS;
  document.head.appendChild(link);
}

function preloadWidgetScript() {
  if (window.Calendly || document.querySelector(`script[src="${CALENDLY_WIDGET_JS}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = CALENDLY_WIDGET_JS;
  script.async = true;
  document.head.appendChild(script);
}

export function CalendlyLeadTracker() {
  useEffect(() => {
    loadWidgetStylesheet();
    preloadWidgetScript();

    const onMessage = (event: MessageEvent) => {
      if (!isCalendlyOrigin(event.origin) || !isCalendlyEventScheduledMessage(event.data)) {
        return;
      }

      recordFormLead(calendlyFormLeadParams(locationFromPathname(window.location.pathname)));
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || !isBookingHref(href)) {
        return;
      }

      // Only intercept when the official popup API is already available. Otherwise
      // leave the native new-tab <a> alone so a blocked/failed widget never
      // swallows the primary booking CTA.
      const popupApi = window.Calendly;
      if (!popupApi) {
        return;
      }

      event.preventDefault();
      try {
        popupApi.initPopupWidget({ url: anchor.href });
      } catch {
        window.open(anchor.href, "_blank", "noopener,noreferrer");
      }
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
