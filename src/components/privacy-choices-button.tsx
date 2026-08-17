"use client";

import { Button } from "@/components/ui/button";
import { ANALYTICS_CONSENT_STORAGE_KEY, ANALYTICS_CONSENT_CHANGE_EVENT } from "@/lib/analytics-events";

export function PrivacyChoicesButton() {
  const resetConsent = () => {
    try {
      window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
    } catch {
      // A browser may block storage. Reloading still clears loaded analytics from this document.
    }
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_CHANGE_EVENT, { detail: null }));
    window.location.reload();
  };

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="h-auto min-h-6 p-0 text-xs text-slate-300 hover:text-white"
      onClick={resetConsent}
    >
      Privacy choices
    </Button>
  );
}
