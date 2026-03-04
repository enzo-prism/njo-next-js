import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|webp|gif|ico|txt|xml|json|js|css|map)$/i;
const PREFERRED_HOSTNAME = "michaelnjodds.com";
const CANONICAL_PROTOCOL = "https";

function normalizePathname(pathname: string): string {
  if (!pathname.startsWith("/")) return "/";
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

function getCanonicalRedirectLocation({
  host,
  protocol,
  originalUrl,
}: {
  host: string | undefined;
  protocol: string | undefined;
  originalUrl: string;
}): string | null {
  const currentHost = (host || "").toLowerCase();
  const hostWithoutPort = currentHost.split(":")[0];

  const shouldNormalizeHost =
    hostWithoutPort === PREFERRED_HOSTNAME || hostWithoutPort === `www.${PREFERRED_HOSTNAME}`;

  const needsHostRedirect = shouldNormalizeHost && hostWithoutPort === `www.${PREFERRED_HOSTNAME}`;

  const currentProtocol = (protocol || "http").toLowerCase();
  const shouldNormalizeProtocol = CANONICAL_PROTOCOL === "https" || CANONICAL_PROTOCOL === "http";
  const needsProtocolRedirect =
    shouldNormalizeHost && shouldNormalizeProtocol && currentProtocol !== CANONICAL_PROTOCOL;

  const parsed = new URL(originalUrl, `${CANONICAL_PROTOCOL}://${PREFERRED_HOSTNAME}`);
  const normalizedPath = normalizePathname(parsed.pathname);
  const needsSlashRedirect = normalizedPath !== parsed.pathname;

  if (!needsHostRedirect && !needsProtocolRedirect && !needsSlashRedirect) {
    return null;
  }

  const targetProtocol = shouldNormalizeProtocol ? CANONICAL_PROTOCOL : currentProtocol || "https";
  return `${targetProtocol}://${PREFERRED_HOSTNAME}${normalizedPath}${parsed.search}`;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const redirectLocation = getCanonicalRedirectLocation({
    host: request.headers.get("host") || undefined,
    protocol: request.nextUrl.protocol.replace(":", "") || undefined,
    originalUrl: `${pathname}${search}`,
  });

  if (!redirectLocation) {
    return NextResponse.next();
  }

  return NextResponse.redirect(redirectLocation, 301);
}

export const config = {
  matcher: ["/:path*"],
};
