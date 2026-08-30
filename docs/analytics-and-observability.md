# Analytics and Observability

This document explains how traffic and behavior instrumentation is wired in `michaelnjodds.com`, where it lives in the codebase, and how to validate it safely.

## Current Analytics Stack And Consent

The site currently uses three analytics/behavior tools:

- Vercel Analytics for page views and visitor counts
- Google Analytics for broader traffic reporting
- Hotjar for behavior/session insight

All three are optional and consent-gated. No analytics provider is mounted or downloaded until a
visitor selects **Allow analytics**. Declining does not remove site functionality. **Privacy choices**
in the footer clears the saved choice and reloads the page so previously loaded analytics are removed
before the visitor chooses again.

## Source of Truth in Code

### Root integration point

All analytics wiring is centralized through `AnalyticsConsentManager`, mounted once in
`src/app/layout.tsx`.

Current responsibilities:

- Read and update the versioned browser consent preference
- Mount Vercel Analytics only after consent
- Load Google Analytics and Hotjar only after consent
- Keep all providers disabled outside the canonical production hostname
- Forward approved conversion events to Vercel Analytics and Google Analytics

This is intentional. Future changes should keep analytics mounted once at the root layout instead of duplicating instrumentation across routes.

### Runtime config

`src/config/site.ts` owns analytics-related runtime values for:

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_HOTJAR_ID`
- `NEXT_PUBLIC_HOTJAR_SV`

Important details:

- The helper trims env var whitespace before use.
- Defaults are present for the production site.
- Vercel Analytics does not use a repo-managed runtime env var here.

## Vercel Analytics

### Implementation

- Package: `@vercel/analytics`
- Import: `@vercel/analytics/react`
- Mount point: `src/components/analytics-consent.tsx`, rendered once by `src/app/layout.tsx`

### Operational behavior

- Vercel Analytics starts showing data only after a deployed environment receives real traffic.
- Local dev does not meaningfully validate dashboard ingestion.
- Some browser content blockers can suppress Vercel Analytics requests.

### What not to do

- Do not mount `Analytics` in individual route files.
- Do not create conditional per-page tracking unless there is a deliberate product requirement.
- Do not assume “no data” means the integration is broken before a deployment has received visits.

## Google Analytics and Hotjar

### Implementation

GA and Hotjar are loaded from `src/components/analytics-consent.tsx` after consent.

The manager intentionally skips provider loading when:

- the visitor has not allowed analytics
- the hostname is not exactly `michaelnjodds.com`

This prevents local, preview, and automated audit traffic from polluting production analytics.

## Conversion Events

`src/lib/analytics-events.ts` is the shared client event interface. Current events are:

- `booking_click`
- `contact_click`
- `form_start`
- `form_submit`
- `form_success`
- `form_error`
- `form_validation_error`

Events are discarded unless the visitor allowed analytics. Never include names, emails, phone
numbers, message text, or other submitted form values in event properties.

### `generate_lead` conversion events

Allowlisted lead events live in `src/lib/ga4.ts`. They send only sanitized params (`form_id`, `form_name`, `lead_source`, `location`, `method`, `contact_method`) that match `^[A-Za-z0-9._-]{1,80}$`. Names, emails, phones, message bodies, and other PII are never sent.

`recordFormLead` dedupes in `sessionStorage` for about 10 minutes per `form_id`, so submit-success plus the thank-you page do not double-count.

| Source | When it fires | Params |
| --- | --- | --- |
| Contact Formspree form | After `res.ok` in `src/components/pages/contact.tsx`, before the `/contact/success` redirect | `form_id=contact`, `form_name=contact`, `lead_source=website_contact_form`, `location=contact`, `method=form`, `contact_method=form` |
| `/contact/success` safety net | Once per dedupe window via `ContactSuccessLeadTracker` | Same `form_id=contact` params as the form |
| Calendly popup | Only on `calendly.event_scheduled` postMessage, never on "Book a call" click | `form_id=calendly`, `form_name=calendly`, `lead_source=website_calendly`, `location` from the current pathname slug, `method=calendly`, `contact_method=calendly` |

Booking CTAs still render `<a href={BOOKING_URL}>` / `<a href={DSO_PRICING_BOOKING_URL}>` for no-JS and for `check:contact-ctas`. `CalendlyLeadTracker` (mounted once from the root layout) warms the official popup widget only after pointer, keyboard, or touch intent on a booking link, and intercepts a primary click only when `window.Calendly` is already available. If the widget is missing or blocked, the native new-tab link proceeds. New-tab bookings do not fire `generate_lead` because the scheduled-event message never reaches this page. Widget script/CSS URLs and postMessage origins live in `src/config/site.ts`. The global Content Security Policy must allow `CALENDLY_ASSETS_ORIGIN` (scripts, styles, fonts, images, connect) and `CALENDLY_MESSAGE_ORIGINS` (frames and connect) or the popup is blocked and every booking click opens a new tab.

`recordFormLead` checks canonical production host and accepted analytics consent before setting its dedupe marker or dispatching. The event then uses the same consent-gated event path as other analytics events, so a pre-consent form submission cannot queue a lead for later transmission.

Phillips event form, click-to-call, and email links do not fire `generate_lead`.

### Environment variables

These values come from `src/config/site.ts`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | `G-6HWEE040EH` |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar site ID | `6575522` |
| `NEXT_PUBLIC_HOTJAR_SV` | Hotjar script version | `6` |

## Validation Workflow

### Code-level validation

After changing analytics code:

```bash
npm run typecheck
npm run lint
```

If the change touches layout/config/SEO/deployment behavior, run:

```bash
npm run check:parity
```

### Preview validation

1. Deploy a preview and confirm no analytics-provider requests load; previews are intentionally disabled.
2. On production, clear the saved privacy choice and confirm no provider requests load before a choice.
3. Select **Decline** and confirm provider requests remain absent.
4. Reset through the footer, select **Allow analytics**, and confirm all enabled providers load.
5. Trigger a booking click and a non-submitting form interaction, then confirm only non-sensitive event properties are emitted.

If the preview is protected, use the workflow in `docs/deployment-runbook.md` for CLI smoke checks, then validate browser-side analytics manually.

### Production validation

After production deploy:

1. Visit `https://michaelnjodds.com`.
2. Navigate to at least 2 to 3 pages.
3. Wait about 30 to 60 seconds.
4. Check:
   - Vercel Analytics dashboard
   - GA real-time/reporting views
   - Hotjar dashboard if relevant

If Vercel Analytics still shows no data:

- check for content blockers
- verify the deployment actually includes the new code
- verify traffic is going to the production deployment

## Change Guidance for Future Codex Sessions

When a task mentions analytics, start here:

1. Read `src/app/layout.tsx`.
2. Read `src/config/site.ts`.
3. Read this file.
4. If deployment is involved, read `docs/deployment-runbook.md`.

If the request is specifically about:

- dashboard numbers not moving:
  - suspect deployment/traffic/ad blockers first
- tracking IDs or behavior tools:
  - inspect `src/config/site.ts`
- duplicate events or overcounting:
  - confirm nothing else mounted analytics outside the root layout

## Related Docs

- `README.md`
- `AGENTS.md`
- `docs/deployment-runbook.md`
