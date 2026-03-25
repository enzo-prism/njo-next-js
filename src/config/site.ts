const DEFAULT_SITE_URL = "https://michaelnjodds.com";
const DEFAULT_GA_ID = "G-6HWEE040EH";
const DEFAULT_HOTJAR_ID = "6575522";
const DEFAULT_HOTJAR_SV = "6";

function readEnv(key: string, fallback: string) {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  const value = raw.trim();
  return value.length > 0 ? value : fallback;
}

export const SITE_URL = readEnv("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL).replace(/\/+$/, "");

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
