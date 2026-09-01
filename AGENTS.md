# AGENTS.md

This file gives future Codex sessions a fast, repo-specific operating map for `michaelnjodds.com`.

For implementation workflow details, also read `docs/implementation-map.md`. `AGENTS.md` is the high-level guardrail doc; `docs/implementation-map.md` is the “how this codebase is actually wired” doc.

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
  - one consent manager is mounted in the root layout
  - Google Analytics, Hotjar, and Vercel Analytics load only after consent on the canonical production host
  - conversion events must never include submitted form values or other personal data

## Runtime and Tooling

- Package manager: `npm`
- Required Node runtime: `24.x`
- Use `.nvmrc` or the `engines` field in `package.json` to align local work with Vercel/CI.
- Main quality gate: `npm run check:parity`

## Repo Map

- `src/app/layout.tsx`
  - Root layout
  - Mounts the single global analytics consent manager
- `src/components/analytics-consent.tsx`
  - Consent-gated, production-host-only Vercel Analytics, Google Analytics, and Hotjar loading
- `src/lib/analytics-events.ts`
  - Shared non-sensitive conversion-event interface
- `src/config/site.ts`
  - Canonical site URL and runtime analytics IDs
  - `BOOKING_URL`: single source of truth for the general Calendly intro-call link
  - `DSO_PRICING_BOOKING_URL`: single source of truth for the DSO pricing-call link
  - Calendly popup widget URLs, postMessage origins, and `CALENDLY_ASSETS_ORIGIN` (the only files allowed to contain `calendly.com` as a string are `src/config/site.ts`; `next.config.ts` imports those constants into CSP)
  - Environment variable parsing trims whitespace, which is intentional
- `src/lib/ga4.ts`
  - Allowlisted, consent-gated `generate_lead` helper and sessionStorage dedupe
- `src/components/booking-button.tsx`
  - Reusable primary "Book a call" CTA used site-wide; renders `<a href={BOOKING_URL}>` (or a passed `href`)
- `src/components/analytics/calendly-lead-tracker.tsx`
  - Root-layout client island: warms the official widget only on booking intent, opens the popup when ready, otherwise leaves the new-tab link alone, and records `generate_lead` only on `event_scheduled`
- `src/components/analytics/contact-success-lead-tracker.tsx`
  - Thank-you-page safety net for the contact-form `generate_lead` (same `form_id=contact` dedupe key)
- `src/components/dso-pricing-callout.tsx`
  - Scoped DSO pricing CTA card (home, contact, and `/michael-njo-dds` only); opens `DSO_PRICING_BOOKING_URL`
- `next.config.ts`
  - canonical redirects
  - legacy redirects
  - global security headers, including a Content Security Policy that allows official Calendly popup widget assets via the `src/config/site.ts` constants
- `src/config/routes.ts`
  - static route inventory and redirect metadata used by checks
- `src/seo/*`
  - metadata, robots, sitemap, structured data generation
  - Book-launch resources use route-specific social images plus separate `Book` and `NewsArticle` schema nodes
- `src/data/resource-articles.ts`
  - source of truth for `/resources/[slug]` content, SEO fields, article slugs, and optional book-launch data
- `src/data/media.ts`
  - editorial photo inventory, display dimensions, `layoutVariant`, and Cloudinary/local dimensions for the profile mosaic and gallery
  - display dimensions must reflect EXIF orientation, not only the JPEG pixel matrix; `three-person-event.jpg` is a 3:4 portrait stored as a rotated 4:3 JPEG
  - mosaic media defaults to preserving the full image; use `objectFit: "cover"` only for a deliberate, reviewed crop
- `src/components/media/editorial-mosaic.tsx`
  - grid tiles derive their aspect ratio from each asset's display dimensions and preserve the full image by default; `layoutMode="columns"` uses intrinsic width/height
- `src/components/media/hero-slideshow.tsx`
  - mobile frame is `aspect-[4/3]`; slides preserve the complete image by default and do not zoom-crop during transitions
- `src/data/interview-video.ts`
  - Cloudinary playback and poster URLs for `/dr-michael-njo-interview`
- `src/components/pages/michael-njo-dds.tsx`
  - News tab copy, the Diana Fat Board of Regents congratulations (`public/media/diana-fat-board-of-regents.webp`), The Practice Blueprint dinner recap (`public/media/poe-roseville-aug-2026.webp`), Another perfect match photos (`public/media/bill-mikki-porch.webp`, `bill-mikki-trio.webp`), Beyond the Chair flyer (`public/media/promotional-flyer-dental-strategies.webp`), and dinner photos (`public/media/IMG_4918.webp`, `IMG_4923.webp`, `IMG_3346.webp`)
- `src/data/events.ts`
  - Editorial event records plus date-aware upcoming/current derivation
  - Home/profile routes refresh event state hourly and completed events are excluded from current Event schema
  - Current programs that PTI hosts (including Beyond the Chair) set `registrationUrl` so home, news, and community posts hand off to PTI instead of a generic contact CTA
  - The October 2, 2026 Sacramento date stays on Mastering Your Dental Transition (no duplicate date, no news post); occurrence-only flyer, TDIC venue, speakers, and date-gated early-bird pricing live on that date
- `src/lib/profile-tabs.ts`
  - Keeps profile tabs, `?tab=news`, news hashes, browser history, and campaign parameters synchronized
- `src/components/book-launch-feature.tsx`
  - Reusable featured-book UI for the home page, resources hub, and book-launch detail pages
- `src/components/pages/resources.tsx`
  - Resources hub, including featured article links
- `src/components/pages/resource-article-detail.tsx`
  - Reusable long-form article layout for resource posts
- `src/app/resources/[slug]/page.tsx`
  - Static resource article route generation
- `src/components/pages/contact.tsx`
  - Contact Formspree integration
  - Captures phone, practice city/location, practice website, service interest, and message
- `src/components/pages/phillips-event.tsx`
  - Phillips event Formspree integration
- `src/lib/lead-form-validation.ts`
  - Shared trimming, maximum lengths, HTTP(S) URL normalization, privacy acknowledgment, honeypot, and repeat-submit safeguards
- `scripts/*`
  - parity and SEO validation scripts
  - `check-media.ts` rejects EXIF-rotated editorial imports unless their displayed dimensions are declared explicitly, blocks unmanaged `object-cover`, and checks that galleries and slides cannot re-crop during interaction
- `docs/implementation-map.md`
  - rendering model, route wiring, content sources, form payloads, and change playbooks
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
  - `src/data/resource-articles.ts`
- SEO:
  - `src/seo/metadata.ts`
  - `src/seo/route-structured-data.ts`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
- Analytics:
  - `src/app/layout.tsx`
  - `src/components/analytics-consent.tsx`
  - `src/lib/analytics-events.ts`
  - `src/config/site.ts`
  - `docs/analytics-and-observability.md`
- Forms:
  - `src/components/pages/contact.tsx`
  - `src/components/pages/phillips-event.tsx`
  - `docs/forms-and-backends.md`

## Safe Working Pattern for Codex

1. Confirm Node `24.x`.
2. Read `docs/implementation-map.md` before touching routing, content, forms, or SEO behavior.
3. Read the relevant specialized docs before touching SEO, routing, analytics, or forms.
4. Prefer small, centralized changes over duplicating logic in individual routes.
5. If changing analytics, keep the root-layout single-mount pattern.
6. If changing canonical or route behavior, run the full parity suite before finishing.

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
  - component: `Analytics` from `@vercel/analytics/react`
  - consent-gated by the manager mounted once in `src/app/layout.tsx`
  - no project env variable is required in this repo
- Google Analytics and Hotjar:
  - configured through `src/config/site.ts`
  - loaded by `src/components/analytics-consent.tsx`
  - guarded by explicit visitor consent and the canonical production hostname
- `generate_lead`:
  - contact Formspree success (`form_id=contact`) plus a `/contact/success` safety net
  - Calendly popup `event_scheduled` only (`form_id=calendly`); opening the widget does not count
  - dispatched through the same consent-gated analytics event path
  - never send names, emails, phones, or message bodies

## Common Pitfalls

- Do not hardcode Calendly booking links. Import `BOOKING_URL` / `DSO_PRICING_BOOKING_URL` and use `BookingButton`; `check:contact-ctas` blocks hardcoded booking links and missing booking CTAs in the header, footer, and contact page.
- Do not add per-page analytics mounts. The `/contact/success` lead-tracker island is the only allowed exception, and it must keep using `form_id=contact` so it dedupes with the form submit.
- Do not move form submissions into API routes unless the migration is intentional and fully documented.
- Do not add redirect-only or thank-you pages to the sitemap.
- Do not change canonical host/protocol logic casually; multiple docs and checks depend on it.
- Do not switch package managers unless the repo is intentionally migrated end-to-end.
- Do not change testimonial author names casually without checking whether the generated slug changes.
- Do not add a new static public route without checking whether `src/config/routes.ts` should be updated too.

## If You Need To Update Docs

Update these together when behavior changes:

- `README.md` for top-level developer context
- `AGENTS.md` for future Codex sessions
- `docs/implementation-map.md` for implementation workflow and change playbooks
- the specific runbook in `docs/`
