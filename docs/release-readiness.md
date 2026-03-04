# Release Readiness Report

Date: 2026-03-04

## Scope

Verified the Next.js rebuild is production-ready and behaviorally aligned with the source site.

Latest production deployment:

- Alias set:
  - `https://michaelnjodds.com`
  - `https://www.michaelnjodds.com`
  - `https://njo-next-js.vercel.app`
- Inspect URL: `https://vercel.com/enzo-design-prisms-projects/njo-next-js/6r2QFZ9fWeBsXgBZgjwD47mF4nEp`
- Git commit: `1846f219df1b4f52e2f6e9cbe4a3726865351f90`

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
6. Production smoke checks:
   - Core route status codes: expected `200` for public routes and `404` for unknown paths.
   - Legacy redirects: expected `308` + expected destination locations.
   - `robots.txt` sitemap line and `sitemap.xml` canonical URLs validated.
   - Formspree backend endpoints validated with schema-triggering submissions (`HTTP 400`/`422` expected for invalid payloads).

## Infrastructure Hardening Updates (2026-03-04)

1. Redirect-loop risk removed:
   - Cleared Vercel apex-domain redirect to prevent apex <-> `www` conflict with app-level canonical redirect rules.
2. Vercel project framework preset standardized:
   - Project API setting updated to `framework: nextjs`.
3. DNS posture verified:
   - `www` CNAME correctly points to Vercel DNS target.
   - Apex A record is valid and serving (`76.76.21.21`), but Vercel marks it as `optional-change` with a preferred pair available.
4. CI protection added:
   - Added `.github/workflows/ci.yml` to run `npm run check:parity` on push/PR to `main`.
5. Image delivery optimization completed:
   - Replaced all warning-triggering `<img>` usage with `next/image` in core pages/layout.
   - Lint now runs cleanly with no `@next/next/no-img-element` warnings.
6. Production env hygiene improved:
   - Removed accidental trailing newline characters from Vercel Production env vars (`NEXT_PUBLIC_*`, canonical host/protocol vars).
7. Branch governance enabled:
   - `main` now protected with required status check (`Parity Checks`), required PR review (1), linear history, and conversation resolution.
   - Force pushes and branch deletions are disallowed on `main`.
8. Repository safety defaults tightened:
   - Auto-merge enabled.
   - Delete branch on merge enabled.
   - Wiki disabled.
9. Runtime stability pinned:
   - Node.js pinned to `20.x` via `package.json` engines and `.nvmrc`.
10. HTTP response hardening:
   - Added security headers in Next config (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
11. SEO crawl optimization:
   - Removed redirect-only path (`/dr-michael-neal-interview`) from sitemap static URL set.

## Remaining Manual Optimization (Non-Blocking)

1. Optional apex DNS upgrade in Squarespace:
   - Replace apex A with Vercel rank-1 pair `216.150.1.1` and `216.150.16.1` to clear Vercel's "DNS Change Recommended".
2. Network-local resolver cache drift:
   - Some local networks can temporarily resolve stale apex IP (`34.111.179.208`) even when authoritative DNS correctly returns Vercel (`76.76.21.21`).
   - Validate with public/authoritative resolvers before changing registrar records.

## Fixes Applied During Final Readiness Pass

1. Removed local `favicon.ico` route conflict:
   - Deleted `src/app/favicon.ico` to avoid collision with `public/favicon.ico`.
2. Enforced protocol canonical redirect in runtime config:
   - Added apex host + `x-forwarded-proto=http` redirect rule in `next.config.ts`.
3. Strengthened redirect parity checks:
   - Added assertion for protocol canonical redirect in `scripts/check-redirects.ts`.
4. Hardened environment parsing for canonical/SEO outputs:
   - Trimmed env var values in `src/config/site.ts` to prevent malformed canonical, robots, and sitemap URLs when env values include trailing whitespace/newlines.

## Non-Blocking Items

1. Some networks can temporarily resolve stale apex DNS after registrar changes due TTL (`4 hrs` currently).
2. Vercel still labels apex DNS as "DNS Change Recommended" despite working authoritative resolution; optional improvement is adopting the recommended A-record pair.
