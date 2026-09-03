# Photo caption QA

Reviewed captions for photos Dr. Njo emailed live at
`GET/PATCH /api/photo-captions`. The Njo dashboard Photos tab
(`https://njo-dashboard.vercel.app/photos`) is the editor.

The catalog is the editorial set in `src/data/media.ts` plus matching
`public/media` extras he emailed to post (Dental Lifestyles page 26, Beyond
the Chair flyer, Sacramento October 2026 flyer). Inventory `caption` fields
on `EditorialMediaAsset` stay hidden on the public site until a caption is
saved through this API. Saved captions render on the profile mosaic and
lightbox via `qaCaptions`.

Hero slides, community posts, resources, and the interview quote image still
do not show caption or eyebrow copy. Do not render inventory captions, name
bars, or `PhotoNameOverlay`. Keep accurate `alt` text.

Saves persist in Vercel Runtime Cache (one-year TTL) with an in-memory
fallback for local `next dev`.
