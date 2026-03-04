const DEFAULT_SITE_URL = "https://michaelnjodds.com";
const DEFAULT_GA_ID = "G-6HWEE040EH";
const DEFAULT_HOTJAR_ID = "6575522";
const DEFAULT_HOTJAR_SV = "6";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

export const siteRuntime = {
  gaId: process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID,
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || DEFAULT_HOTJAR_ID,
  hotjarSv: process.env.NEXT_PUBLIC_HOTJAR_SV || DEFAULT_HOTJAR_SV,
} as const;

export const PREFERRED_HOSTNAME =
  (process.env.PREFERRED_HOSTNAME || new URL(SITE_URL).hostname).toLowerCase();

export const CANONICAL_PROTOCOL =
  (process.env.CANONICAL_PROTOCOL || new URL(SITE_URL).protocol.replace(":", "")).toLowerCase();

export const CANONICAL_ORIGIN = `${CANONICAL_PROTOCOL}://${PREFERRED_HOSTNAME}`;
