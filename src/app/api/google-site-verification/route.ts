import { NextResponse } from "next/server";
import { googleSiteVerificationBody } from "@/lib/google-site-verification";

export function GET(request: Request) {
  const file = new URL(request.url).searchParams.get("file") ?? "";
  const body = googleSiteVerificationBody(file);

  if (!body) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
