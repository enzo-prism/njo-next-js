# Release Readiness Report

Date: 2026-03-04

## Scope

Verified the Next.js rebuild is production-ready and behaviorally aligned with the source site.

## Completed Validation

1. Local quality gate:
   - `npm run check:parity` passed.
   - Includes typecheck, lint, build, metadata checks, schema checks, sitemap checks, robots checks, redirect checks.
2. Route behavior:
   - Core routes return expected content.
   - Unknown route returns custom 404.
   - Legacy redirects resolve to expected targets.
3. SEO behavior:
   - Route-level metadata and canonical tags present.
   - Route-level JSON-LD is present and valid.
   - `robots.txt`, `sitemap.xml`, and `llms.txt` available.
4. Form behavior:
   - Contact and event forms submit to Formspree endpoints.
   - Success and failure states validated.
5. Vercel deployment:
   - Preview deploy validated.
   - Production deploy validated.

## Fixes Applied During Final Readiness Pass

1. Removed local `favicon.ico` route conflict:
   - Deleted `src/app/favicon.ico` to avoid collision with `public/favicon.ico`.
2. Enforced protocol canonical redirect in runtime config:
   - Added apex host + `x-forwarded-proto=http` redirect rule in `next.config.ts`.
3. Strengthened redirect parity checks:
   - Added assertion for protocol canonical redirect in `scripts/check-redirects.ts`.

## Non-Blocking Items

ESLint reports warnings for raw `<img>` usage (`@next/next/no-img-element`) on selected components. This is currently accepted for parity preservation and does not block build or deployment.

