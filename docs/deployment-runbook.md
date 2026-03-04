# Deployment Runbook

This runbook covers preview validation, production deployment, and domain cutover for `njo-next-js` on Vercel.

## 1. Prerequisites

- Vercel project linked (`vercel link` completed in repo).
- GitHub repository connected in Vercel (`enzo-prism/njo-next-js`).
- Required environment variables present in both `Preview` and `Production`:
  - `NEXT_PUBLIC_SITE_URL`
  - `PREFERRED_HOSTNAME`
  - `CANONICAL_PROTOCOL`
  - `NEXT_PUBLIC_GA_ID`
  - `NEXT_PUBLIC_HOTJAR_ID`
  - `NEXT_PUBLIC_HOTJAR_SV`

Check envs:

```bash
vercel env ls
```

## 2. Pre-Deploy Verification (Local)

Run full parity suite before shipping:

```bash
npm run check:parity
```

Expected result:

- All checks pass.
- Lint may show non-blocking `@next/next/no-img-element` warnings.

## 3. Preview Deployment

Create a preview deployment:

```bash
vercel deploy --yes
```

Validate on preview URL:

- Main routes return expected content.
- Unknown route returns custom 404.
- Legacy redirects resolve correctly.
- `robots.txt`, `sitemap.xml`, and `llms.txt` are accessible.
- Contact + event forms submit and show expected success/error states.
- Canonical tags and JSON-LD are present.

## 4. Production Deployment

Production can be triggered either:

1. By pushing `main` (recommended), or
2. Manually:

```bash
vercel deploy --prod --yes
```

Verify deployment state:

```bash
vercel list --yes
vercel inspect <deployment-url> --format=json
```

## 5. Domain Cutover Checklist

If custom domain cutover has not been completed yet:

1. Add domains in Vercel project:
   - `michaelnjodds.com`
   - `www.michaelnjodds.com`
2. Configure DNS records to Vercel targets.
3. Confirm certificate issuance and HTTPS availability.
4. Confirm redirect behavior:
   - `www` -> apex (`michaelnjodds.com`)
   - `http` -> `https`
5. Run post-cutover smoke tests on canonical domain:
   - Route rendering
   - Redirects
   - Forms
   - SEO endpoints
   - Analytics script load

## 6. Operational Commands

Useful commands for ongoing operations:

```bash
# Local verification
npm run check:parity

# Preview deploy
vercel deploy --yes

# Production deploy
vercel deploy --prod --yes

# Recent deploy list
vercel list --yes

# Inspect one deploy deeply
vercel inspect <deployment-url> --format=json
```

