import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCanonicalRedirectLocation } from "./src/seo/canonical";

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|webp|gif|ico|txt|xml|json|js|css|map)$/i;

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
