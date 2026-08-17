import { LegalPolicy } from "@/components/pages/legal-policy";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata = buildRouteMetadata("/terms");

const sections = [
  {
    title: "Informational use only",
    paragraphs: [
      "The website provides general educational information about practice strategy, operations, valuation, ownership, and transitions. It is not legal, tax, accounting, investment, medical, or other regulated professional advice. Consult your own qualified advisers before acting on information from this site.",
    ],
  },
  {
    title: "No advisory relationship or guaranteed outcome",
    paragraphs: [
      "Using the site, sending a form, or scheduling an introductory call does not by itself create a client, fiduciary, broker, attorney-client, or other professional relationship. Any engagement requires a separate written agreement. Examples, testimonials, and past results are illustrative and do not guarantee a particular result.",
    ],
  },
  {
    title: "Acceptable use",
    items: [
      "Use the site only for lawful purposes and do not attempt to disrupt, probe, scrape at unreasonable volume, or gain unauthorized access to it.",
      "Do not submit patient records, protected health information, payment-card data, credentials, malicious code, or content that violates another person's rights.",
      "Provide accurate information when requesting a response and do not impersonate another person or organization.",
    ],
  },
  {
    title: "Intellectual property and links",
    paragraphs: [
      "Site text, design, graphics, and original materials are owned by Dental Strategies or used with permission and are protected by applicable law. You may link to public pages and print reasonable excerpts for personal, noncommercial use with attribution, but may not republish substantial content or imply endorsement without written permission.",
      "Links to external services and third-party websites are provided for convenience. We do not control their availability, content, security, terms, or privacy practices.",
    ],
  },
  {
    title: "Disclaimers and limitation of liability",
    paragraphs: [
      "The site is provided on an as-available basis. To the extent permitted by law, Dental Strategies disclaims implied warranties and is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the site. Nothing here limits liability that cannot legally be limited.",
    ],
  },
  {
    title: "Changes and governing law",
    paragraphs: [
      "We may update the site and these terms from time to time. Continued use after an update means the revised terms apply to later use. These terms are governed by the laws of California, without regard to conflict-of-law rules, except where applicable law requires otherwise.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPolicy
      eyebrow="Legal"
      title="Terms of Use"
      summary="These terms govern use of michaelnjodds.com and clarify the limits of the educational information and contact tools provided here."
      effectiveDate="August 17, 2026"
      sections={sections}
    />
  );
}
