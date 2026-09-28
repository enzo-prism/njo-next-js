# Photo caption QA

Reviewed captions for photos Dr. Njo emailed live at
`GET/PATCH /api/photo-captions`. The Njo dashboard Photos tab
(`https://njo-dashboard.vercel.app/photos`) is the editor.

This is a caption overlay, not a CMS and not a Gmail binary dump. The catalog
is photos already published on `michaelnjodds.com`. Inventory `caption` fields
on `EditorialMediaAsset` stay hidden on the public site until a caption is
saved through this API. Saved captions render on the profile mosaic and
lightbox via `qaCaptions`.

Hero slides, community posts, resources, and the interview quote image still
do not show caption or eyebrow copy. Do not render inventory captions, name
bars, or `PhotoNameOverlay`. Keep accurate `alt` text.

## Catalog

`src/lib/photo-captions.ts` lists:

- every id in `allEditorialImages` (`src/data/media.ts`)
- matching `public/media` extras he emailed to post that are not in that
  array: `backstage-business-spotlight-michael-njo`,
  `dental-lifestyles-feature-p26`, `promotional-flyer-dental-strategies`,
  `sacramento-seminar-oct-2026`

Unpublished email attachments, signature PNGs, PDFs, Calendly screenshots, and
unrelated practice photos are not in this catalog. PTI (`enzo-prism/pti`)
shares the same photo files; caption QA lives only on this site. Mirror photo
files to PTI. Do not duplicate this API there.

Each `WebsitePhoto` is:

```ts
{
  id, imageUrl, alt, inventoryCaption, liveCaption, savedAt,
  onWebsite, featuredRoutes, emailNote, names
}
```

`imageUrl` is a public URL. Imported `StaticImageData` resolves to
`https://michaelnjodds.com/_next/static/media/...`. Paths under `public/`
resolve to `https://michaelnjodds.com/media/...`.

## Persistence

`src/lib/photo-caption-store.ts` is the store.

Saves live in Vercel Runtime Cache:

- namespace: `njo-photo-captions`
- key: `njo-photo-captions`
- TTL: one year

`loadLiveCaptionMap()` **replaces** the in-memory map from cache
(`replaceMemory`). Do not merge cache into memory with `Object.assign` —
unpublished keys can resurrect on another instance.

When Runtime Cache is unavailable (local `next dev`), the store keeps a
`globalThis` map. `saveLiveCaption` writes memory first, then cache.

Empty or whitespace captions unpublish: `applyLiveCaptionEdit` deletes that id
from the map. The PATCH response then returns
`{ saved: { caption: "", savedAt: null }, photo }` with `liveCaption: null`.

Test hooks `setPhotoCaptionCacheForTests` and `resetPhotoCaptionMemoryForTests`
exist only for `scripts/check-photo-captions.ts`.

## API

`src/app/api/photo-captions/route.ts` is `force-dynamic` on the Node runtime.

| Method | Auth | Body | Result |
| --- | --- | --- | --- |
| `GET` | public | — | `{ generatedAt, photos }` |
| `PATCH` | `Authorization: Bearer $CAPTION_ADMIN_TOKEN` | `{ id, caption }` | `{ saved, photo }` |
| `OPTIONS` | public | — | CORS preflight |

`PATCH` checks the token before reading the body (`src/lib/caption-admin-auth.ts`
compares SHA-256 digests with `timingSafeEqual`). A missing or wrong token is
`401` with `WWW-Authenticate: Bearer`. If `CAPTION_ADMIN_TOKEN` is unset or
shorter than 32 characters, `PATCH` is `503` for everyone, so editing fails
closed. The token is server-only: set it in the Vercel project env for this
site, never as `NEXT_PUBLIC_*`, and never ship it in the dashboard bundle.
Dashboard editors paste it into the Photos tab "Editor token" field, which
keeps it in that browser's `localStorage` and sends it on Save.

Generate a token with `openssl rand -base64 32`. Rotating it means updating
the Vercel env var, redeploying, and pasting the new token into the dashboard.

Unknown ids are `404`. Captions longer than 500 characters are `400`. CORS
allows `https://michaelnjodds.com`, `https://www.michaelnjodds.com`,
`https://njo-dashboard.vercel.app`, `https://njo-dashboard*.vercel.app`
previews, and `http://localhost` / `http://127.0.0.1`, and allows the
`Authorization` header. CORS is not access control; the bearer token is.

The dashboard never talks to this origin from the browser in production. It
calls `/api/photos`, which Vercel rewrites to this route before the SPA
catch-all. Local Vite proxies the same path.

## Editor semantics (dashboard)

Prefill is `liveCaption ?? inventoryCaption`. Dirty state compares the draft to
**liveCaption only**, so unpublished inventory text is already dirty and Save
can publish it without editing. After save, `applyCaptionSaveResponse` replaces
that row and the draft from the API photo so a reload matches.

## Public surfaces

`src/components/pages/michael-njo-dds.tsx` fetches `/api/photo-captions` and
passes `qaCaptions` into the mosaic and lightbox. Only `liveCaption` values
render. Do not use `asset.caption` or `selectedImage.caption` on those
surfaces.

`scripts/check-media.ts` fails if inventory captions, name bars, or
`PhotoNameOverlay` return, and if the store no longer replaces memory from
cache on load.

## Tests

`npm run check:photo-captions` (`scripts/check-photo-captions.ts`) proves that
an edit survives save, a fresh load (memory cleared, cache kept), a second
edit, a second photo, and unpublish without losing other saved captions. It is
part of `npm run check:parity`.

Dashboard `pnpm test` covers the same owner path in `src/lib/photos.test.ts`:
prefill, dirty-vs-live, save then fresh load, and editing an already-live
caption.

## Production smoke

Do not leave test captions live. After a save/reload check, restore the
previous caption or unpublish the test id.

```bash
curl -sS https://michaelnjodds.com/api/photo-captions
# Anonymous PATCH must be rejected (401):
curl -sS -X PATCH https://michaelnjodds.com/api/photo-captions \
  -H 'Content-Type: application/json' -d '{"id":"not-a-real-photo","caption":""}'
# With the token, PATCH a known id, GET again from the site and from
# https://njo-dashboard.vercel.app/api/photos, then restore:
#   -H "Authorization: Bearer $CAPTION_ADMIN_TOKEN"
```

Dashboard: open `/photos`, edit, Save, hard reload. The same caption must
still be in the box and, if published, on `/michael-njo-dds` mosaic/lightbox
only.

## Files

| Path | Role |
| --- | --- |
| `src/lib/photo-caption-store.ts` | Runtime Cache + memory, apply/save/load |
| `src/lib/photo-captions.ts` | Catalog, `listWebsitePhotos`, public URLs |
| `src/app/api/photo-captions/route.ts` | GET / PATCH / OPTIONS |
| `src/lib/caption-admin-auth.ts` | Bearer token check for `PATCH` |
| `scripts/check-api-security.ts` | `PATCH` auth over HTTP (`next start`) |
| `src/components/media/editorial-mosaic.tsx` | Optional `qaCaptions` figcaption |
| `src/components/pages/michael-njo-dds.tsx` | Fetches overlay; lightbox uses qa map |
| `scripts/check-photo-captions.ts` | Persistence assertions |
| `scripts/check-media.ts` | Overlay wiring + no inventory captions |
