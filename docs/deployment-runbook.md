# Deployment Runbook

This runbook covers preview validation, production deployment, and domain cutover for `njo-next-js` on Vercel.

## 1. Prerequisites

- Vercel project linked (`vercel link` completed in repo).
- GitHub repository connected in Vercel (`enzo-prism/njo-next-js`).
- Local/CI runtime pinned to Node 24 (`.nvmrc`, `package.json#engines`) to match the Vercel project runtime.
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
- Lint is clean (no warnings/errors).

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

Confirm aliases point to the new production deployment:

```bash
vercel inspect https://michaelnjodds.com
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

### Current DNS Baseline (Squarespace + Vercel)

Current authoritative records:

- `www` CNAME -> `397ac2fa17073cc9.vercel-dns-016.com`
- `@` A -> `76.76.21.21`

Important:

- TTL is `4 hrs` on current Squarespace records, so resolver propagation can lag.
- Keep one canonical host policy only (`www -> apex`) to avoid redirect loops.
- If apex appears to serve a stale origin from your current network, compare local resolver output against public authoritative resolvers before changing DNS:

```bash
# Local resolver
dscacheutil -q host -a name michaelnjodds.com

# Public recursive resolvers
dig +short A michaelnjodds.com @8.8.8.8
dig +short A michaelnjodds.com @1.1.1.1

# Authoritative nameserver
dig +short A michaelnjodds.com @ns-cloud-e1.googledomains.com
```

If local and authoritative answers differ, wait for propagation or flush local DNS cache.

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

# Verify authoritative DNS and compare with local resolver
dig +short A michaelnjodds.com @8.8.8.8
dscacheutil -q host -a name michaelnjodds.com
```
