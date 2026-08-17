"use client";

import { useEffect } from "react";
import { CONTACT_FORM_LEAD_PARAMS, recordFormLead } from "@/lib/ga4";

export function ContactSuccessLeadTracker() {
  useEffect(() => {
    recordFormLead(CONTACT_FORM_LEAD_PARAMS);
  }, []);

  return null;
}
