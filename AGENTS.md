# AGENTS.md

This file gives future Codex sessions a fast, repo-specific operating map for `michaelnjodds.com`.

## What This Project Is

- Public marketing site for Michael Njo, DDS.
- Next.js App Router rebuild of a legacy site with parity expectations.
- Production host is `https://michaelnjodds.com`.
- The goal is not “make it nicer at any cost”; it is “ship safely without breaking route, SEO, analytics, redirect, or form behavior”.

## Non-Negotiable Invariants

- Preserve canonical host behavior: `www` redirects to apex and `http` redirects to `https`.
- Preserve route parity for all public pages and legacy redirects.
- Preserve SEO parity:
  - metadata generation stays centralized
  - JSON-LD stays route-aware
  - `robots.txt`, `sitemap.xml`, and `llms.txt` remain accessible
  - `/contact/success` must not become indexable
- Preserve form behavior:
  - forms submit directly to Formspree
  - there are no internal API routes for form submission
- Preserve analytics behavior:
  - Google Analytics and Hotjar are bootstrapped in the root layout
  - Vercel Analytics is mounted once in the root layout

## Runtime and Tooling

- Package manager: `npm`
- Required Node runtime: `24.x`
- Use `.nvmrc` or the `engines` field in `package.json` to align local work with Vercel/CI.
- Main quality gate: `npm run check:parity`

## Repo Map

- `src/app/layout.tsx`
  - Root layout
  - Global analytics wiring lives here:
    - `@vercel/analytics/next`
    - Google Analytics bootstrap script
    - Hotjar bootstrap script
- `src/config/site.ts`
  - Canonical site URL and runtime analytics IDs
  - Environment variable parsing trims whitespace, which is intentional
- `next.config.ts`
  - canonical redirects
  - legacy redirects
  - global security headers
- `src/config/routes.ts`
  - static route inventory and redirect metadata used by checks
- `src/seo/*`
  - metadata, robots, sitemap, structured data generation
- `src/components/pages/contact.tsx`
  - Contact Formspree integration
- `src/components/pages/phillips-event.tsx`
  - Phillips event Formspree integration
- `scripts/*`
  - parity and SEO validation scripts
- `docs/deployment-runbook.md`
  - deploy and smoke-test workflow
- `docs/forms-and-backends.md`
  - form backend source of truth
- `docs/analytics-and-observability.md`
  - analytics integration and validation guide

## Before Changing Anything Important

Check these hotspots first when your work touches:

- Routing or domains:
  - `next.config.ts`
  - `src/config/routes.ts`
  - `src/config/site.ts`
- SEO:
  - `src/seo/metadata.ts`
  - `src/seo/route-structured-data.ts`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
- Analytics:
  - `src/app/layout.tsx`
  - `src/config/site.ts`
  - `docs/analytics-and-observability.md`
- Forms:
  - `src/components/pages/contact.tsx`
  - `src/components/pages/phillips-event.tsx`
  - `docs/forms-and-backends.md`

## Safe Working Pattern for Codex

1. Confirm Node `24.x`.
2. Read the relevant docs before touching SEO, routing, analytics, or forms.
3. Prefer small, centralized changes over duplicating logic in individual routes.
4. If changing analytics, keep the root-layout single-mount pattern.
5. If changing canonical or route behavior, run the full parity suite before finishing.

## Verification Matrix

- Small UI/content-only change:
  - `npm run typecheck`
  - `npm run lint`
- Routing, SEO, metadata, forms, analytics, or config change:
  - `npm run check:parity`
- Deployment-sensitive change:
  - use the preview workflow in `docs/deployment-runbook.md`

## Analytics Notes

- Vercel Analytics:
  - package: `@vercel/analytics`
  - component: `Analytics` from `@vercel/analytics/next`
  - mounted once in `src/app/layout.tsx`
  - no project env variable is required in this repo
- Google Analytics and Hotjar:
  - configured through `src/config/site.ts`
  - bootstrapped by inline script in `src/app/layout.tsx`
  - guarded to avoid localhost/headless noise

## Common Pitfalls

- Do not add per-page analytics mounts.
- Do not move form submissions into API routes unless the migration is intentional and fully documented.
- Do not add redirect-only or thank-you pages to the sitemap.
- Do not change canonical host/protocol logic casually; multiple docs and checks depend on it.
- Do not switch package managers unless the repo is intentionally migrated end-to-end.

## If You Need To Update Docs

Update these together when behavior changes:

- `README.md` for top-level developer context
- `AGENTS.md` for future Codex sessions
- the specific runbook in `docs/`
