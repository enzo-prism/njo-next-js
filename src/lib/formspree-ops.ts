"use client";

const formspreeOpsUtmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function appendFormspreeOpsMetadata(payload: FormData, formKey: string, startedAt?: number) {
  payload.set("site", "njo-website");
  payload.set("form_key", formKey);
  payload.set("environment", process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? "production");
  payload.set("_codex_test", "false");
  payload.set("submitted_at", new Date().toISOString());
  if (startedAt) {
    payload.set("form_started_at", new Date(startedAt).toISOString());
    payload.set("completion_time_ms", String(Math.max(0, Date.now() - startedAt)));
  }

  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  payload.set("page_path", window.location.pathname);
  payload.set("referrer", document.referrer);
  for (const field of formspreeOpsUtmFields) {
    payload.set(field, params.get(field) ?? "");
  }
}
