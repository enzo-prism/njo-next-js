# SEO/AEO pass — 2026-11-20

Follow-up to `seo-aeo-release-2026-11-06.md`, after the Second Edition launch.

## What changed

- **Second Edition is published.** Every prelaunch string ("Launching November 17", "pre-order", "purchase link will be added", "Upcoming book", "coming soon") now reflects the live Kindle edition: published November 17, 2026, 273 pages, editor Catrise Austin, foreword by Dr. Glenn Vo, ASIN B0HRL1C1LZ, and the #1 Best Seller in Dentistry milestone. Facts were read from the Amazon listing on Nov 20 and live in `src/data/books.ts`, the single source for copy and JSON-LD.
- **Book JSON-LD** for both editions comes from `buildFirstEditionBookNode` / `buildSecondEditionBookNode`, so the homepage, `/books` and `/resources/second-book` share one `@id` per edition (the homepage previously used a different first-edition `@id`). The Second Edition adds `datePublished`, `bookFormat` EBook, `numberOfPages`, ASIN `identifier`, `editor`, foreword `contributor` and the bestseller `award`. No ISBN, publisher or Offer: none is confirmed.
- **FAQ answers are now in the HTML.** Radix Accordion 1.x does not render a closed item's content, so homepage, resource-guide and interview accordion text existed only in JSON-LD and was invisible to crawlers that do not run JavaScript (GPTBot, ClaudeBot, PerplexityBot) and to FAQ-markup validation. `src/components/ui/accordion.tsx` now uses native `<details>/<summary>` with the same exports; items in one accordion share a `name`, so only one stays open.
- Homepage FAQ adds "What is the Dental Practice Transitions Handbook?".
- Titles: home `Michael Njo, DDS | Dental Practice Transition Consulting`; `/resources` `Dental Practice Transition Resources | Michael Njo, DDS`. Home and `/books` descriptions rewritten (≤160 chars).
- `public/llms.txt` rewritten with a Key facts section, every guide, interviews/news and related sites.
- Sitemap `lastModified` for `/`, `/books`, `/resources` is 2026-11-20; `/resources/second-book` uses its `updatedAt`.
- IndexNow key and `npm run indexnow` (see README).

## Rules

- The bestseller is a milestone it **reached** ("shortly after launch"); its rank moves (it was #2 in Dentistry (Kindle Store) on Nov 20). Never write that it "is" #1, and don't claim the exact day.
- Don't claim a paperback, ISBN, publisher or price end date until Dr. Njo confirms one.

## Still needed from the client

- Final Second Edition cover art: `/books`, `/resources` and `/resources/second-book` still show the "Coming soon" announcement graphic.
- Print edition, ISBN and publisher, if any.
- Confirmation of Dr. Njo's canonical LinkedIn profile before adding it to `Person.sameAs`.
