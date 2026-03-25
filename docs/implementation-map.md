# Implementation Map

This document is the practical operating guide for changing `michaelnjodds.com`.

Use it when you need to answer:

- Where does this behavior live?
- Is this route static, data-driven, or client-heavy?
- What else must be updated if I add or rename a page?
- Which check will catch a regression?

Read this together with `AGENTS.md`. `AGENTS.md` defines invariants; this file explains how the implementation currently satisfies them.

## Architecture At A Glance

- Framework: Next.js App Router with TypeScript
- Delivery model: static-first marketing site
- Content model:
  - long-form resources come from `src/data/resource-articles.ts`
  - testimonials come from `src/data/testimonials.ts`
  - speaking/event listings come from `src/data/events.ts`
  - shared service-interest labels come from `src/data/service-interest-options.ts`
- SEO model:
  - metadata is centralized in `src/seo/metadata.ts`
  - canonical URL logic is centralized in `src/seo/canonical.ts`
  - route JSON-LD is centralized in `src/seo/route-structured-data.ts`
  - `robots.txt` and `sitemap.xml` are generated from helpers, not handwritten files
- Form model:
  - browser submits directly to Formspree
  - there are no internal API routes for lead capture
- Analytics model:
  - Vercel Analytics, Google Analytics, and Hotjar are mounted once from `src/app/layout.tsx`

## Rendering Model

Most routes are server-rendered wrappers around page components. Interactive behavior is isolated to a small set of client components.

### Static server route wrappers

Most `src/app/**/page.tsx` files follow this pattern:

1. export `metadata` via `buildRouteMetadata(pathname)`
2. optionally render `<StructuredDataScript />`
3. render a page component from `src/components/pages/*`

Examples:

- `src/app/page.tsx`
- `src/app/resources/page.tsx`
- `src/app/contact/page.tsx`

### Fully static detail routes

The dynamic detail pages are not runtime-dynamic. They are prerendered at build time and unknown params should 404.

Current detail routes:

- `src/app/resources/[slug]/page.tsx`
- `src/app/testimonials/[slug]/page.tsx`

Key behaviors:

- both use `dynamicParams = false`
- both define `generateStaticParams()`
- both define `generateMetadata()`
- both resolve content from local data files

If you add a new data-driven detail route, keep this same pattern unless there is a deliberate product reason not to.

### Current client components

These are the main interactive islands and why they are client-side:

| File | Why it is client-side |
| --- | --- |
| `src/components/layout/site-header.tsx` | `usePathname()` active nav state and mobile sheet menu |
| `src/components/pages/contact.tsx` | React Hook Form, validation, Formspree submission |
| `src/components/pages/phillips-event.tsx` | React Hook Form, checkbox state, Formspree submission |
| `src/components/pages/testimonials.tsx` | client-side search and sort |
| `src/components/pages/dr-michael-njo-interview.tsx` | share/copy interactions |
| `src/components/pages/michael-njo-dds.tsx` | tab state, gallery modal, query-param-driven tab selection |

If a route seems heavier than expected in the build output, start with this list.

## Route Inventory And Ownership

### Static indexable routes

`src/config/routes.ts` owns `STATIC_SITE_PATHS`, which is the source of truth for static indexable routes used by sitemap and parity checks.

Today that list includes:

- `/`
- `/michael-njo-dds`
- `/dr-michael-njo-interview`
- `/testimonials`
- `/resources`
- `/dentalflix`
- `/phillips-event`
- `/contact`

Important:

- `/contact/success` is intentionally not in `STATIC_SITE_PATHS`
- redirect-only routes do not belong in `STATIC_SITE_PATHS`

### Legacy route handling

There are two legacy-route mechanisms:

1. full redirect mappings in `next.config.ts`
2. legacy testimonial slug aliases in `src/config/routes.ts`

The testimonial slug aliases are consumed by:

- `src/seo/metadata.ts`
- `src/seo/route-structured-data.ts`
- `src/components/pages/testimonial-detail.tsx`

If you rename a testimonial author and the generated slug changes, you may need both:

- a redirect in `next.config.ts`
- an alias in `src/config/routes.ts`

## Content Sources

### Resources

`src/data/resource-articles.ts` is the source of truth for:

- resource article slugs
- page titles and meta titles
- descriptions and keywords
- article body content
- FAQ content
- related links
- resource article ordering

The file also exports helpers used elsewhere:

- `buildResourceArticlePath(slug)`
- `getResourceArticleBySlug(slug)`
- `getResourceArticleByPath(pathname)`

Changing a resource article here automatically affects:

- `/resources/[slug]` route generation
- route metadata
- JSON-LD for resource articles
- sitemap entries for resource articles

If you change a resource slug, add a redirect if the old URL has ever been public.

### Testimonials

`src/data/testimonials.ts` is the source of truth for testimonial content.

Important behaviors:

- `testimonials` is the raw source list
- `testimonialPages` is derived data
- testimonials are sorted newest-first by `publishedAt`
- ties fall back to original array order
- slugs are generated from author names, with numeric suffixes for duplicates
- excerpts are generated automatically from quote text

This means author edits can change slugs. If you rename an author on an already-public testimonial:

1. inspect the old slug
2. preserve it via redirect and alias if needed
3. confirm metadata and structured data still resolve correctly

### Events

`src/data/events.ts` drives the event/news content on the Michael Njo profile page and also feeds event-related structured data through `src/seo/structured-data.ts`.

If event details change, check both:

- `src/components/pages/michael-njo-dds.tsx`
- `src/seo/structured-data.ts`

### Shared lead-intake options

`src/data/service-interest-options.ts` is shared by:

- `src/components/pages/contact.tsx`
- `src/components/pages/phillips-event.tsx`

If service-interest labels change, update them here instead of editing both forms separately.

## SEO System

### Metadata

`src/seo/metadata.ts` is the canonical source for route-level metadata.

Key functions:

- `buildPageTitle(pathname)`
- `buildPageDescription(pathname)`
- `buildOpenGraphType(pathname)`
- `buildPageKeywords(pathname)`
- `buildRouteMetadata(pathname)`

Most route files should call `buildRouteMetadata()` rather than assembling metadata inline.
The shared Open Graph and Twitter image is configured once in `src/config/site.ts` via `SOCIAL_SHARE_IMAGE`, then reused by both metadata and structured-data helpers.

### Canonical URLs

`src/seo/canonical.ts` owns:

- pathname normalization
- canonical URL generation
- redirect-location computation for canonical host/protocol/slash behavior

If canonical behavior changes, inspect these together:

- `src/seo/canonical.ts`
- `src/config/site.ts`
- `next.config.ts`
- `scripts/check-redirects.ts`

### Structured data

Route JSON-LD is emitted through `src/components/structured-data-script.tsx` and assembled in `src/seo/route-structured-data.ts`.

Current route categories with JSON-LD:

- home
- Michael Njo profile page
- interview page
- resources index
- resource detail pages
- testimonials index
- testimonial detail pages
- contact
- contact success

Current metadata-only routes:

- `/dentalflix`
- `/phillips-event`

That is intentional in the current implementation. If those routes become more SEO-critical, extend `buildPageStructuredData()` rather than adding ad hoc inline schema in page files.

### Robots and sitemap

These are generated code paths, not static files:

- `src/app/robots.ts` -> `src/seo/robots-data.ts`
- `src/app/sitemap.ts` -> `src/seo/sitemap-data.ts`

If you add an indexable static route, update `STATIC_SITE_PATHS` so sitemap and checks stay aligned.

## Forms And Payloads

There are exactly two submission forms:

- `src/components/pages/contact.tsx`
- `src/components/pages/phillips-event.tsx`

Both submit directly to Formspree with `Accept: application/json`.

### Contact form payload

Backend endpoint: `https://formspree.io/f/manaywyw`

Fields sent:

- `name`
- `email`
- `phone`
- `practice_city`
- `practice_website` when present
- `services_interested`
- `message`
- `_subject`
- `_replyto`

Success behavior:

- redirect to `/contact/success`

### Phillips event form payload

Backend endpoint: `https://formspree.io/f/mdalbpae`

Fields sent:

- `name`
- `email`
- `practice_city`
- `practice_website` when present
- `services_interested`
- `additional_notes` when present
- `_subject`
- `_replyto`

Success behavior:

- in-page success state

### Form rules

- Keep submissions browser-to-Formspree unless there is an intentional backend migration
- If you change payload field names, update `docs/forms-and-backends.md`
- `/contact/success` must remain noindex and must not enter the sitemap

## Analytics And Runtime Config

### Runtime config

`src/config/site.ts` owns:

- `SITE_URL`
- `PREFERRED_HOSTNAME`
- `CANONICAL_PROTOCOL`
- `CANONICAL_ORIGIN`
- `siteRuntime.gaId`
- `siteRuntime.hotjarId`
- `siteRuntime.hotjarSv`

The env helper intentionally trims whitespace. Do not remove that behavior without understanding the production-history reason for it.

### Analytics

`src/app/layout.tsx` owns:

- `metadataBase`
- favicon metadata
- Vercel Analytics mount
- GA bootstrap
- Hotjar bootstrap

Future changes should preserve the single-mount model.

## Verification And What Each Check Catches

`npm run check:parity` runs all of the following:

- `typecheck`
  - catches TypeScript regressions
- `lint`
  - catches ESLint and Next lint issues
- `build`
  - catches App Router, prerender, and build-time failures
- `check:route-head-snapshots`
  - validates important route titles, descriptions, canonical URLs, and OG types
- `check:schema`
  - validates JSON-LD exists on expected routes and blocks forbidden review/rating types
- `check:sitemap`
  - validates sitemap coverage and ensures `/contact/success` is excluded
- `check:seo-http`
  - runs `next start`, fetches live `robots.txt` and `sitemap.xml`, and validates served SEO output
- `check:robots`
  - validates robots rule shape and sitemap reference
- `check:redirects`
  - validates canonical and legacy redirect behavior

If your change touches routing, SEO, forms, analytics, or config, run the full parity suite.

## Change Playbooks

### Add a new static public page

1. Create `src/app/<route>/page.tsx`
2. Create or reuse a page component in `src/components/pages/`
3. Add metadata support through `buildRouteMetadata()`
4. Add structured data support if the route should emit JSON-LD
5. Add the route to `STATIC_SITE_PATHS` if it should be indexable
6. Update route documentation in `README.md` if public route surface changed
7. Run `npm run check:parity`

### Add a new resource article

1. Add the article object in `src/data/resource-articles.ts`
2. Confirm slug, meta title, description, FAQ, and related links are complete
3. Run `npm run check:parity`

No route file changes are needed if the article follows the existing schema.

### Add or rename a testimonial

1. Update `src/data/testimonials.ts`
2. Check whether the slug changes
3. If the old slug was public, add redirect and alias coverage
4. Run `npm run check:parity`

### Change a form

1. Update the form schema and UI
2. Update Formspree payload mapping
3. Update `docs/forms-and-backends.md`
4. If shared intake labels changed, update `src/data/service-interest-options.ts`
5. Run `npm run check:parity`

## Known Sharp Edges

- `/about` is still recognized in metadata helpers for historical parity, but the public route is `/michael-njo-dds`
- only `https://res.cloudinary.com` is whitelisted for remote `next/image` usage in `next.config.ts`
- dynamic detail routes are static-only; unknown params should stay 404s
- metadata and structured data are centralized on purpose; avoid per-page bespoke logic unless the route genuinely breaks the shared pattern
