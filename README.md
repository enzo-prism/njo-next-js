# Michael Njo Website (Next.js)

Next.js parity rebuild of the legacy Replit site (`enzo-prism/DrNjo`) for Vercel deployment.

This codebase preserves production route behavior, legacy redirects, SEO metadata/JSON-LD behavior, analytics integrations, and Formspree form handling from the original site.

## Current Status

- Route and content parity implemented.
- SEO parity implemented (metadata, JSON-LD, `robots.txt`, `sitemap.xml`, `llms.txt`).
- Form backends preserved and validated (`contact`, `phillips-event`).
- Vercel deployment pipeline connected to GitHub.

## Stack

- Next.js App Router (TypeScript)
- React 18
- Tailwind CSS
- shadcn/Radix UI
- React Hook Form + Zod

## Route Surface

- `/`
- `/michael-njo-dds`
- `/dr-michael-njo-interview`
- `/testimonials`
- `/testimonials/[slug]` (generated from testimonial data)
- `/resources`
- `/dentalflix`
- `/phillips-event`
- `/contact`
- `/contact/success`
- custom 404

### Legacy Redirects

- `/dr-michael-neal-interview` -> `/dr-michael-njo-interview`
- `/testimonials/dr-fat` -> `/testimonials/diana-fat-dds`
- `/testimonials/richard-and-kimberly-crum` -> `/testimonials/kimberly-crum`
- `/testimonials/team-member-2` -> `/testimonials/team-member`
- `www.michaelnjodds.com/*` -> `https://michaelnjodds.com/*`

Redirect config lives in `next.config.ts`.

## Forms

Two client-side forms submit to Formspree:

- Contact form: `https://formspree.io/f/manaywyw`
- Phillips event form: `https://formspree.io/f/mdalbpae`

See `docs/forms-and-backends.md` for implementation and QA details.

## SEO and Analytics

- Route metadata generated through `src/seo/metadata.ts`
- Route JSON-LD generated through `src/seo/route-structured-data.ts`
- `robots.txt` via `src/app/robots.ts`
- `sitemap.xml` via `src/app/sitemap.ts`
- `llms.txt` served from `public/llms.txt`
- Google Analytics + Hotjar injected in `src/app/layout.tsx`

## Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for metadata/sitemap | `https://michaelnjodds.com` |
| `PREFERRED_HOSTNAME` | Canonical host enforcement logic | `michaelnjodds.com` |
| `CANONICAL_PROTOCOL` | Canonical protocol enforcement logic | `https` |
| `NEXT_PUBLIC_GA_ID` | GA tracking ID | `G-6HWEE040EH` |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar site ID | `6575522` |
| `NEXT_PUBLIC_HOTJAR_SV` | Hotjar version | `6` |

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Run production build locally:

```bash
npm run build
npm run start
```

## Verification and Quality Gates

Full parity gate:

```bash
npm run check:parity
```

This runs:

- Typecheck
- Lint
- Next build
- Route metadata snapshots
- Structured data assertions
- Sitemap assertions
- Robots assertions
- Redirect assertions

## Deployment

GitHub pushes to `main` trigger Vercel production deploys for the connected project.

Manual preview deploy:

```bash
vercel deploy --yes
```

Manual production deploy:

```bash
vercel deploy --prod --yes
```

See `docs/deployment-runbook.md` for full deployment/cutover workflow.

## Docs Index

- `docs/deployment-runbook.md` - preview/prod deployment and domain cutover checklist
- `docs/forms-and-backends.md` - form backend wiring and validation details
- `docs/source-reference/*` - source snapshots from the original site (`robots`, `sitemap`)
