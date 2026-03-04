# Forms and Backend Integrations

This document tracks every form in the site and how each one reaches its backend destination.

## Form Inventory

There are exactly two submission forms in this codebase.

| Route | Component | Backend Endpoint | Success Behavior | Failure Behavior |
| --- | --- | --- | --- | --- |
| `/contact` | `src/components/pages/contact.tsx` | `https://formspree.io/f/manaywyw` | Redirects to `/contact/success` | Inline error message shown on page |
| `/phillips-event` | `src/components/pages/phillips-event.tsx` | `https://formspree.io/f/mdalbpae` | Shows in-page success state | Inline error message shown on page |

## Contact Form Details

Component: `src/components/pages/contact.tsx`

Submission payload:

- `name`
- `email`
- `phone`
- `organization` (optional)
- `message`
- `_subject` = `New inquiry for Michael Njo, DDS`
- `_replyto` = submitted email

Request:

- Method: `POST`
- Headers: `Accept: application/json`
- Body: `FormData`

## Phillips Event Form Details

Component: `src/components/pages/phillips-event.tsx`

Submission payload:

- `name`
- `email`
- `practice_city`
- `practice_website` (optional)
- `services_interested` (comma-joined selected services)
- `additional_notes` (optional)
- `_subject` = `Phillips Event - New contact from <name>`
- `_replyto` = submitted email

Request:

- Method: `POST`
- Headers: `Accept: application/json`
- Body: `FormData`

## Validation

Both forms use client-side schema validation via React Hook Form + Zod:

- Contact schema in `contact.tsx`
- Event schema in `phillips-event.tsx`

## Backend/CORS Notes

Both Formspree endpoints respond with valid preflight behavior for browser-origin POST requests and allow cross-origin submission from:

- Localhost development origin (for local QA)
- Production domain origin (`https://michaelnjodds.com`)

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

