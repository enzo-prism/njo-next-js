# Forms and Backend Integrations

This document tracks every form in the site and how each one reaches its backend destination.

## Form Inventory

There are exactly two submission forms in this codebase.

| Route | Component | Backend Endpoint | Success Behavior | Failure Behavior |
| --- | --- | --- | --- | --- |
| `/contact` | `src/components/pages/contact.tsx` | `https://formspree.io/f/manaywyw` | Redirects to `/contact/success` | Inline error message shown on page |
| `/phillips-event` | `src/components/pages/phillips-event.tsx` | `https://formspree.io/f/mdalbpae` | Shows in-page success state | Inline error message shown on page |

Endpoint constants live in `src/config/form-backends.ts`. `npm run check:forms` guards these backend URLs and is included in `npm run check:parity`.

`GET/PATCH /api/photo-captions` is not a form. It is the caption QA overlay for the Njo dashboard Photos tab. It does not use Formspree, does not capture leads, and must not be treated as a form backend migration. See `docs/photo-caption-qa.md`.

## Contact Form Details

Component: `src/components/pages/contact.tsx`
Endpoint source: `FORMSPREE_ENDPOINTS.contact`

Submission payload:

- `name`
- `email`
- `phone`
- `practice_city`
- `practice_website` (optional)
- `services_interested` (comma-joined selected services)
- `message`
- `_subject` = `New inquiry for Michael Njo, DDS`
- `_replyto` = submitted email
- `privacy_acknowledged` = `yes` after the required acknowledgment
- `_gotcha` = invisible honeypot value (normally empty)
- operational metadata for path, referrer, campaign parameters, and completion time

Request:

- Method: `POST`
- Headers: `Accept: application/json`
- Body: `FormData`

## Phillips Event Form Details

Component: `src/components/pages/phillips-event.tsx`
Endpoint source: `FORMSPREE_ENDPOINTS.phillipsEvent`

Submission payload:

- `name`
- `email`
- `practice_city`
- `practice_website` (optional)
- `services_interested` (comma-joined selected services)
- `additional_notes` (optional)
- `_subject` = `Phillips Event - New contact from <name>`
- `_replyto` = submitted email
- `privacy_acknowledged` = `yes` after the required acknowledgment
- `_gotcha` = invisible honeypot value (normally empty)
- operational metadata for path, referrer, campaign parameters, and completion time

Request:

- Method: `POST`
- Headers: `Accept: application/json`
- Body: `FormData`

## Validation

Both forms use client-side schema validation via React Hook Form + Zod:

- Contact schema in `contact.tsx`
- Event schema in `phillips-event.tsx`

The contact and Phillips event forms now share the same service-interest option set so their intake categories stay aligned.

Shared safeguards live in `src/lib/lead-form-validation.ts`: trimmed input, maximum lengths,
HTTP(S) website validation and normalization, a required privacy acknowledgment, a honeypot, and
a short browser-side cooldown after a successful submission. These improve normal-user feedback
and prevent accidental duplicates. They do not replace Formspree's provider-side validation,
abuse controls, and rate limiting; direct Formspree submission remains an intentional architecture
invariant.

The forms warn users not to submit patient records or other highly sensitive information and link
to `/privacy` before submission.

## Backend/CORS Notes

Both Formspree endpoints respond with valid preflight behavior for browser-origin POST requests and allow cross-origin submission from:

- Localhost development origin (for local QA)
- Production domain origin (`https://michaelnjodds.com`)

There are no internal API handlers for these forms in this project. The site submits directly from the browser to Formspree.

## Live Backend Verification (2026-03-04)

Formspree endpoint health was verified from CLI without sending production inbox spam:

- Empty payload checks:
  - `POST https://formspree.io/f/manaywyw` -> `HTTP 400` with `BAD_FORM_POST_REQUEST`
  - `POST https://formspree.io/f/mdalbpae` -> `HTTP 400` with `BAD_FORM_POST_REQUEST`
- Validation checks with intentionally invalid email:
  - `POST https://formspree.io/f/manaywyw` -> `HTTP 422` with `TYPE_EMAIL`
  - `POST https://formspree.io/f/mdalbpae` -> `HTTP 422` with `TYPE_EMAIL`

Interpretation: both backend endpoints are active and enforcing expected schema validation.

## Latest Contact Backend Verification (2026-05-19)

The contact endpoint was re-verified without sending a real lead:

- Empty payload check:
  - `POST https://formspree.io/f/manaywyw` -> `HTTP 400` with `BAD_FORM_POST_REQUEST`

Interpretation: the `manaywyw` backend is reachable and recognizes the request path.

## QA Checklist

For each form:

1. Submit valid values -> confirm success behavior.
2. Simulate backend `500` -> confirm inline error message.
3. Confirm button loading/disabled state during submit.
4. Confirm endpoint path is unchanged from source parity requirements.

## Source Parity Confirmation

Endpoints in this Next.js migration match the original Replit app:

- `manaywyw` for contact
- `mdalbpae` for Phillips event
