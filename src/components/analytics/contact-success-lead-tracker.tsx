"use client";

import { useEffect } from "react";
import { CONTACT_FORM_LEAD_PARAMS, recordFormLead } from "@/lib/ga4";
import { ANALYTICS_CONSENT_CHANGE_EVENT, type AnalyticsConsent } from "@/lib/analytics-events";

export function ContactSuccessLeadTracker() {
  useEffect(() => {
    recordFormLead(CONTACT_FORM_LEAD_PARAMS);

    const handleConsentChange = (event: Event) => {
      if ((event as CustomEvent<AnalyticsConsent>).detail === "accepted") {
        recordFormLead(CONTACT_FORM_LEAD_PARAMS);
      }
    };

    window.addEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => window.removeEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, handleConsentChange);
  }, []);

  return null;
}
