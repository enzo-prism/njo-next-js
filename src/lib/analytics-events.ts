export const ANALYTICS_CONSENT_STORAGE_KEY = "dental-strategies-analytics-consent-v1";
export const ANALYTICS_CONSENT_CHANGE_EVENT = "dental-strategies:analytics-consent-change";
export const ANALYTICS_TRACK_EVENT = "dental-strategies:analytics-event";

export type AnalyticsConsent = "accepted" | "declined";

export type AnalyticsEventDetail = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage can be disabled. The in-page choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent<AnalyticsConsent>(ANALYTICS_CONSENT_CHANGE_EVENT, { detail: value }));
}

export function trackAnalyticsEvent(
  name: string,
  properties?: AnalyticsEventDetail["properties"],
) {
  if (typeof window === "undefined" || getAnalyticsConsent() !== "accepted") return;
  window.dispatchEvent(
    new CustomEvent<AnalyticsEventDetail>(ANALYTICS_TRACK_EVENT, {
      detail: { name, properties },
    }),
  );
}
