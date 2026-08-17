import { CALENDLY_MESSAGE_ORIGINS } from "@/config/site";

export const generateLeadMethods = {
  form: "form",
  calendly: "calendly",
} as const;

export type GenerateLeadMethod = (typeof generateLeadMethods)[keyof typeof generateLeadMethods];

export type GenerateLeadParams = {
  form_id?: string;
  form_name?: string;
  lead_source?: string;
  location?: string;
  method?: GenerateLeadMethod;
  contact_method?: GenerateLeadMethod;
};

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
  }
}

const ALLOWED_GENERATE_LEAD_KEYS = new Set<keyof GenerateLeadParams>([
  "form_id",
  "form_name",
  "lead_source",
  "location",
  "method",
  "contact_method",
]);

const SAFE_PARAM_VALUE = /^[A-Za-z0-9._-]{1,80}$/;

function isSafeLeadParamValue(value: unknown): value is string {
  return typeof value === "string" && SAFE_PARAM_VALUE.test(value);
}

export function sanitizeGenerateLeadParams(params: GenerateLeadParams): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const key of ALLOWED_GENERATE_LEAD_KEYS) {
    const value = params[key];
    if (isSafeLeadParamValue(value)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function locationFromPathname(pathname: string): string {
  if (pathname === "/") {
    return "home";
  }

  const slug = pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return SAFE_PARAM_VALUE.test(slug) ? slug : "unknown";
}

export const CONTACT_FORM_LEAD_PARAMS: GenerateLeadParams = {
  form_id: "contact",
  form_name: "contact",
  lead_source: "website_contact_form",
  location: "contact",
  method: generateLeadMethods.form,
  contact_method: generateLeadMethods.form,
};

export function calendlyFormLeadParams(location: string): GenerateLeadParams {
  return {
    form_id: "calendly",
    form_name: "calendly",
    lead_source: "website_calendly",
    location: isSafeLeadParamValue(location) ? location : locationFromPathname(location),
    method: generateLeadMethods.calendly,
    contact_method: generateLeadMethods.calendly,
  };
}

export function isCalendlyOrigin(origin: string): boolean {
  return (CALENDLY_MESSAGE_ORIGINS as readonly string[]).includes(origin);
}

export function isCalendlyEventScheduledMessage(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }

  return (data as { event?: unknown }).event === "calendly.event_scheduled";
}

function getGtag(): GtagFunction | null {
  if (typeof window === "undefined") {
    return null;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag === "function") {
    return window.gtag;
  }

  const gtagBridge: GtagFunction = function gtagBridge() {
    // gtag.js reads the Arguments object, not a rest array
    // eslint-disable-next-line prefer-rest-params -- match gtag dataLayer queue shape
    window.dataLayer?.push(arguments);
  };

  window.gtag = gtagBridge;
  return gtagBridge;
}

export function trackGenerateLead(params: GenerateLeadParams): void {
  const sanitizedParams = sanitizeGenerateLeadParams(params);

  if (process.env.NODE_ENV !== "production") {
    console.info("[ga4]", "generate_lead", sanitizedParams);
  }

  getGtag()?.("event", "generate_lead", sanitizedParams);
}

const FORM_LEAD_DEDUP_PREFIX = "njo_ga4_generate_lead_form";
const FORM_LEAD_DEDUP_TTL_MS = 10 * 60 * 1000;

function formLeadDedupKey(formId: string | undefined): string {
  return `${FORM_LEAD_DEDUP_PREFIX}_${formId && SAFE_PARAM_VALUE.test(formId) ? formId : "form"}`;
}

export function shouldRecordFormLead(formId?: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const key = formLeadDedupKey(formId);
    const previous = window.sessionStorage.getItem(key);
    if (previous && Date.now() - Number(previous) < FORM_LEAD_DEDUP_TTL_MS) {
      return false;
    }

    window.sessionStorage.setItem(key, String(Date.now()));
    return true;
  } catch {
    return true;
  }
}

export function recordFormLead(params: GenerateLeadParams): void {
  if (!shouldRecordFormLead(params.form_id)) {
    return;
  }

  trackGenerateLead(params);
}
