const DEFAULT_SITE_URL = "https://michaelnjodds.com";
const DEFAULT_GA_ID = "G-6HWEE040EH";
const DEFAULT_HOTJAR_ID = "6575522";
const DEFAULT_HOTJAR_SV = "6";
const DEFAULT_CONTACT_EMAIL = "michael@dental-strategies.com";
const DEFAULT_CONTACT_PHONE = "+16504362939";
const DEFAULT_CONTACT_PHONE_DISPLAY = "(650) 436-2939";

function readEnv(key: string, fallback: string) {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  const value = raw.trim();
  return value.length > 0 ? value : fallback;
}

export const SITE_URL = readEnv("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL).replace(/\/+$/, "");
export const PRODUCTION_HOSTNAME = new URL(DEFAULT_SITE_URL).hostname;
export const CONTACT_PATH = "/contact";
export const CONTACT_URL = `${SITE_URL}${CONTACT_PATH}`;
export const CONTACT_EMAIL = DEFAULT_CONTACT_EMAIL;
export const CONTACT_PHONE = DEFAULT_CONTACT_PHONE;
export const CONTACT_PHONE_DISPLAY = DEFAULT_CONTACT_PHONE_DISPLAY;

// Single source of truth for the Calendly scheduling links. Every booking CTA
// must reference these constants rather than hardcoding a URL (enforced by
// scripts/check-contact-ctas.ts).
// - BOOKING_URL: general 30-minute intro call (primary CTA site-wide).
// - DSO_PRICING_BOOKING_URL: focused DSO pricing discussion call.
export const BOOKING_URL = "https://calendly.com/michael-dental-strategies/30min";
export const DSO_PRICING_BOOKING_URL =
  "https://calendly.com/michael-dental-strategies/dso-pricing-dental-strategies-intro-call";

// Official popup-widget assets and postMessage origins. Keep every booking-host
// substring here so scripts/check-contact-ctas.ts can keep scanning the rest of
// the repo. Import these constants instead of hardcoding the host elsewhere.
export const CALENDLY_WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";
export const CALENDLY_WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";
export const CALENDLY_MESSAGE_ORIGINS = ["https://calendly.com", "https://www.calendly.com"] as const;
export const CALENDLY_ASSETS_ORIGIN = new URL(CALENDLY_WIDGET_JS).origin;

export const siteRuntime = {
  gaId: readEnv("NEXT_PUBLIC_GA_ID", DEFAULT_GA_ID),
  hotjarId: readEnv("NEXT_PUBLIC_HOTJAR_ID", DEFAULT_HOTJAR_ID),
  hotjarSv: readEnv("NEXT_PUBLIC_HOTJAR_SV", DEFAULT_HOTJAR_SV),
} as const;

export const PREFERRED_HOSTNAME =
  readEnv("PREFERRED_HOSTNAME", new URL(SITE_URL).hostname).toLowerCase();

export const CANONICAL_PROTOCOL =
  readEnv("CANONICAL_PROTOCOL", new URL(SITE_URL).protocol.replace(":", "")).toLowerCase();

export const CANONICAL_ORIGIN = `${CANONICAL_PROTOCOL}://${PREFERRED_HOSTNAME}`;

export const SOCIAL_SHARE_IMAGE = {
  url: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770777615/Opengraph_co7uhi.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Michael Njo, DDS | Dental Strategies",
} as const;
