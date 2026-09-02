import { NextResponse } from "next/server";
import { googleSiteVerificationBody } from "@/lib/google-site-verification";

const verificationHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
} as const;

function verificationResponse(request: Request, includeBody: boolean) {
  const file = new URL(request.url).searchParams.get("file") ?? "";
  const body = googleSiteVerificationBody(file);

  if (!body) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(includeBody ? body : null, {
    status: 200,
    headers: verificationHeaders,
  });
}

export function GET(request: Request) {
  return verificationResponse(request, true);
}

export function HEAD(request: Request) {
  return verificationResponse(request, false);
}
