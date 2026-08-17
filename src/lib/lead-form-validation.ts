import { z } from "zod";
import { serviceInterestOptions } from "@/data/service-interest-options";

export const LEAD_FORM_LIMITS = {
  name: 100,
  email: 254,
  phone: 40,
  practiceCity: 120,
  practiceWebsite: 200,
  message: 5000,
  notes: 2000,
} as const;

const serviceInterestSchema = z.enum(serviceInterestOptions);

export function normalizePracticeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const optionalPracticeWebsiteSchema = z
  .string()
  .trim()
  .max(LEAD_FORM_LIMITS.practiceWebsite, "Keep the website address under 200 characters.")
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(normalizePracticeWebsite(value));
      return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname.includes("."));
    } catch {
      return false;
    }
  }, "Enter a valid website, such as example.com.")
  .transform(normalizePracticeWebsite);

export const sharedLeadFormFields = {
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(LEAD_FORM_LIMITS.name, "Keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(LEAD_FORM_LIMITS.email, "Keep your email under 254 characters."),
  practiceCity: z
    .string()
    .trim()
    .min(2, "Please enter your practice city or location.")
    .max(LEAD_FORM_LIMITS.practiceCity, "Keep the location under 120 characters."),
  practiceWebsite: optionalPracticeWebsiteSchema,
  services: z
    .array(serviceInterestSchema)
    .min(1, "Please select at least one service of interest.")
    .max(serviceInterestOptions.length),
  privacyAcknowledged: z
    .boolean()
    .refine((value) => value, "Please acknowledge the Privacy Policy before submitting."),
  companyWebsite: z.string().max(0),
} as const;

const SUBMISSION_COOLDOWN_MS = 15_000;

export function isLeadFormRateLimited(formKey: string) {
  if (typeof window === "undefined") return false;
  try {
    const value = window.localStorage.getItem(`dental-strategies-form-success:${formKey}`);
    const lastSuccessAt = value ? Number(value) : 0;
    return Number.isFinite(lastSuccessAt) && Date.now() - lastSuccessAt < SUBMISSION_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function markLeadFormSubmitted(formKey: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`dental-strategies-form-success:${formKey}`, String(Date.now()));
  } catch {
    // Submission success should not fail because browser storage is unavailable.
  }
}
