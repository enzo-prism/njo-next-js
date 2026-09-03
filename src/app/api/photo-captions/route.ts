import { NextResponse } from "next/server";

import {
  isKnownPhotoId,
  listWebsitePhotos,
  saveLiveCaption,
} from "@/lib/photo-captions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CAPTION_LENGTH = 500;

const ALLOWED_ORIGINS = new Set([
  "https://michaelnjodds.com",
  "https://www.michaelnjodds.com",
  "https://njo-dashboard.vercel.app",
]);

type PatchBody = {
  id?: unknown;
  caption?: unknown;
};

function isAllowedOrigin(origin: string) {
  if (!origin) {
    return false;
  }
  if (ALLOWED_ORIGINS.has(origin)) {
    return true;
  }
  if (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:")
  ) {
    return true;
  }
  return /^https:\/\/njo-dashboard[a-z0-9-]*\.vercel\.app$/.test(origin);
}

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowOrigin = isAllowedOrigin(origin)
    ? origin
    : "https://njo-dashboard.vercel.app";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function errorResponse(request: Request, message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: corsHeaders(request),
    },
  );
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function GET(request: Request) {
  try {
    const photos = await listWebsitePhotos();
    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        photos,
      },
      { headers: corsHeaders(request) },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to load photo captions.";
    return errorResponse(request, message, 500);
  }
}

export async function PATCH(request: Request) {
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return errorResponse(request, "Caption save requires a JSON body.", 400);
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const caption = typeof body.caption === "string" ? body.caption : "";

  if (!id || !isKnownPhotoId(id)) {
    return errorResponse(request, "Unknown photo id.", 404);
  }

  if (caption.length > MAX_CAPTION_LENGTH) {
    return errorResponse(
      request,
      `Caption must be ${MAX_CAPTION_LENGTH} characters or fewer.`,
      400,
    );
  }

  try {
    const saved = await saveLiveCaption(id, caption);
    const photos = await listWebsitePhotos();
    const photo = photos.find((item) => item.id === id);
    return NextResponse.json(
      {
        saved: saved ?? { caption: "", savedAt: null },
        photo,
      },
      { headers: corsHeaders(request) },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to save caption.";
    return errorResponse(request, message, 500);
  }
}
