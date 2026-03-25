# Michael Njo Website (Next.js)

Next.js parity rebuild of the legacy Replit site (`enzo-prism/DrNjo`) for Vercel deployment.

This codebase preserves production route behavior, legacy redirects, SEO metadata/JSON-LD behavior, analytics integrations, and Formspree form handling from the original site.

For future Codex sessions, start with `AGENTS.md` for the repo guardrails and `docs/implementation-map.md` for the codebase wiring and change playbooks.

## Current Status

- Route and content parity implemented.
- SEO parity implemented (metadata, JSON-LD, `robots.txt`, `sitemap.xml`, `llms.txt`).
- Form backends preserved and validated (`contact`, `phillips-event`).
- Vercel deployment pipeline connected to GitHub.
- Lint-clean image optimization using `next/image` on key routes/components.
- Dependabot security updates enabled (plus weekly grouped minor/patch dependency automation).
- Runtime pinned to Node.js 24.x (`package.json` engines + `.nvmrc`) to match the Vercel project runtime and keep local/CI behavior aligned.
- Node 24 runtime alignment validated end-to-end across local verification, protected preview deploys, and the current production deployment.
- Security response headers enabled globally via Next config (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Vercel Analytics enabled at the root layout for deployed page-view and visitor tracking.
- `main` branch protection enabled with required CI check (`Parity Checks`) and required PR review.
- Production aliases live:
  - `https://michaelnjodds.com`
  - `https://www.michaelnjodds.com`
  - `https://njo-next-js.vercel.app`
- GitHub Actions CI enforces parity checks on pushes and pull requests to `main`.

## Stack

- Next.js App Router (TypeScript)
- React 18
- Tailwind CSS
- shadcn/Radix UI
- React Hook Form + Zod

## Implementation Notes

- Static-first App Router site. Most pages are server-rendered wrappers around page components.
- Data-driven detail routes are prerendered with `dynamicParams = false`.
- Long-form content lives in TypeScript data files, not a CMS.
- SEO, canonical URL logic, and JSON-LD are centralized rather than assembled route-by-route.
- Future implementation workflow is documented in `docs/implementation-map.md`.

## Route Surface

- `/`
- `/michael-njo-dds`
- `/dr-michael-njo-interview`
- `/testimonials`
- `/testimonials/[slug]` (generated from testimonial data)
- `/resources`
- `/resources/[slug]` (generated from resource article data)
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

The contact form now captures practice city/location, practice website, and service-interest selections in addition to direct contact details.

See `docs/forms-and-backends.md` for implementation and QA details.

## SEO and Analytics

- Route metadata generated through `src/seo/metadata.ts`
- Route JSON-LD generated through `src/seo/route-structured-data.ts`
- `robots.txt` via `src/app/robots.ts`
- `sitemap.xml` via `src/app/sitemap.ts`
- `llms.txt` served from `public/llms.txt`
- Vercel Analytics mounted once in `src/app/layout.tsx`
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

Preferred local runtime workflow (if you use `fnm`):

```bash
fnm install
fnm use
node -v
```

Fallback workflow (if you use `nvm` instead):

```bash
nvm use
node -v
```

Expected result:

- `node -v` prints a `24.x` release.

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
- HTTP SEO smoke assertions
- Robots assertions
- Redirect assertions

Node version:

```bash
fnm use
# or: nvm use
node -v
```

Expected result:

- `node -v` prints a `24.x` release before running the parity suite.

## Deployment

GitHub merges/pushes to `main` trigger Vercel production deploys for the connected project.

Manual preview deploy:

```bash
vercel deploy --yes
```

Protected preview smoke check from CLI:

```bash
vercel curl / --deployment <preview-url>
vercel curl /robots.txt --deployment <preview-url>
vercel curl /dr-michael-neal-interview --deployment <preview-url> -- --include
```

Use `vercel curl` when a preview deployment is behind Vercel Deployment Protection and plain `curl` returns `Authentication Required`.

Manual production deploy:

```bash
vercel deploy --prod --yes
```

See `docs/deployment-runbook.md` for full deployment/cutover workflow.

## Domain Verification Notes

Authoritative DNS currently uses:

- `@` A -> `76.76.21.21`
- `www` CNAME -> `397ac2fa17073cc9.vercel-dns-016.com`

If your current network still resolves an older apex IP after DNS changes, verify against public/authoritative resolvers before making additional DNS edits.

## Repo Governance

- Branch protection on `main` requires:
  - 1 approving PR review
  - passing `Parity Checks` status check
  - linear history
  - conversation resolution
- Force push and branch deletion are blocked on `main`.
- Auto-merge is enabled and merged branches are auto-deleted.

## Docs Index

- `AGENTS.md` - repo-specific operating guide for future Codex sessions
- `docs/implementation-map.md` - rendering model, route wiring, content sources, form payloads, and safe change playbooks
- `docs/analytics-and-observability.md` - Vercel Analytics, GA, and Hotjar wiring plus validation workflow
- `docs/deployment-runbook.md` - preview/prod deployment and domain cutover checklist
- `docs/forms-and-backends.md` - form backend wiring and validation details
- `docs/release-readiness.md` - initial release-readiness report plus post-rollout operational addendum
- `.github/workflows/ci.yml` - CI parity gate for PR/push
- `docs/source-reference/*` - source snapshots from the original site (`robots`, `sitemap`)
