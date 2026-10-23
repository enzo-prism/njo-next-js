import { createHash, timingSafeEqual } from "node:crypto";

export const CAPTION_ADMIN_TOKEN_ENV = "CAPTION_ADMIN_TOKEN";
export const MIN_CAPTION_ADMIN_TOKEN_LENGTH = 32;

export type CaptionAdminAuthResult = "authorized" | "unauthorized" | "unconfigured";

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function readBearerToken(authorizationHeader: string | null): string {
  const match = /^Bearer\s+(\S+)$/i.exec(authorizationHeader?.trim() ?? "");
  return match ? match[1] : "";
}

export function readCaptionAdminToken(): string {
  return process.env[CAPTION_ADMIN_TOKEN_ENV]?.trim() ?? "";
}

// Fails closed: without a long enough configured token, nobody can write captions.
export function checkCaptionAdminAuth(
  authorizationHeader: string | null,
  expectedToken: string = readCaptionAdminToken(),
): CaptionAdminAuthResult {
  if (expectedToken.length < MIN_CAPTION_ADMIN_TOKEN_LENGTH) {
    return "unconfigured";
  }

  const providedToken = readBearerToken(authorizationHeader);
  if (!providedToken) {
    return "unauthorized";
  }

  // Compare fixed-length digests so neither length nor content leaks through timing.
  return timingSafeEqual(digest(providedToken), digest(expectedToken))
    ? "authorized"
    : "unauthorized";
}
