# SEO/AEO release — November 6, 2026

## Purpose and evidence
Implement the [GA4/GSC audit](https://app.notion.com/p/4103429581eb8135a82ed4a1f0afba40). Prioritize accurate lead measurement, the handbook discovery path, explicit author/business identity, and useful answers that connect to relevant services. Search rankings and AI citations remain outcomes to measure, not deployment guarantees.

## Measurement
GA4 `generate_lead` was verified as a key event in both properties on November 6. Report confirmed leads separately from CTA clicks. The consent change creates a measurement discontinuity: compare GSC clicks alongside GA4 sessions and do not present increased coverage as organic growth. Google AI-feature traffic is included in ordinary GSC Web reporting; do not treat branded or AI-related keyword filters as a complete AI-citation measure.

## Editorial and external dependencies
Do not invent a second-edition ISBN, confirmed purchase URL, professional review, client outcome, or market-supported valuation range. The November 17 launch needs its verified purchase destination before an Offer is added. Obtain rights-cleared excerpts/transcripts and actual practitioner-reviewed case material through the owner. External editorial links require outreach and publisher agreement. Indexing requests do not guarantee indexing. Continue to review the existing GSC exclusion cohorts and prioritize useful pages rather than publishing overlapping location or keyword variants.

## Follow-up readout
Use the first complete post-release 28-day period and the preceding 28 days, separating branded/nonbranded queries, device, landing page and query intent. Track handbook impressions/clicks, service-intent clicks, qualified enquiries, confirmed leads, and landing-page engagement. Validate professional review and link acquisition with dated evidence in the audit workspace. Do not fabricate retrospective attribution or equate impressions with appointments.

## Personal site implementation
- Merge the pending opt-out analytics implementation; preserve regional Consent Mode defaults and opt-in session recording.
- Redirect dental-strategies.com aliases permanently to the same path on michaelnjodds.com.
- Promote `/books` from home and handbook CTAs; distinguish both editions in JSON-LD without inventing second-edition commerce data.
- Connect the author profile to the PTI person profile; use affiliation for the business relationship. Keep the home page a WebPage and the actual biography a ProfilePage.
- Expose verified interview/podcast/DSO resources and relevant PTI acquisition/valuation links in crawlable HTML.
- Require a recent successful Formspree submission before the thank-you lead fallback can run.

## Validation
Run `npm run check:parity` with Node 24 and `CHROME_PATH` pointing to Chrome. The schema checks assert two book editions, safe second-edition metadata, correct home type and person identity links. Form checks cover missing, valid and expired success markers. Review `/books`, profile and contact on desktop/mobile; never submit an unsolicited live lead. Verify production aliases, sitemap/canonical tags, negative 404 controls and the deployed Git SHA.
