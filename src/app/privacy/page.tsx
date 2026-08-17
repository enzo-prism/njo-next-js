import { LegalPolicy } from "@/components/pages/legal-policy";
import { buildRouteMetadata } from "@/seo/metadata";

export const metadata = buildRouteMetadata("/privacy");

const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "We collect information you choose to provide when you send an inquiry, request a follow-up, email, call, or schedule through an external booking link.",
    ],
    items: [
      "Contact details, including your name, email address, phone number, and practice location.",
      "Professional information, including your practice website, services of interest, goals, timeline, and the message you submit.",
      "Basic technical and usage information, such as page path, referring page, campaign parameters, browser/device information, and interaction data, only when optional analytics are allowed.",
    ],
  },
  {
    title: "How we use information",
    items: [
      "Respond to your request and provide the consultation, educational, or advisory information you asked for.",
      "Operate, secure, troubleshoot, and improve the website and its forms.",
      "Measure site usage and conversions when you have allowed optional analytics.",
      "Comply with legal obligations, prevent abuse, and protect our rights and users.",
    ],
  },
  {
    title: "Forms, scheduling, and service providers",
    paragraphs: [
      "Contact and event forms are processed by Formspree. Scheduling links open Calendly. The website is hosted by Vercel. These providers process information under their own terms and privacy notices and may store it in the United States or other locations where they operate.",
      "We do not sell your personal information. We disclose information only to service providers needed to operate the site, professional advisers when necessary, authorities when legally required, or a successor in a legitimate business transaction.",
    ],
  },
  {
    title: "Optional analytics and session insights",
    paragraphs: [
      "Google Analytics, Vercel Web Analytics, and Hotjar load only after you select Allow analytics. These tools help us understand visits, conversions, and usability. Hotjar may capture interaction and session information, but form fields are not intended to be recorded. You can decline optional analytics and can reopen Privacy choices from the footer at any time.",
    ],
  },
  {
    title: "Retention and security",
    paragraphs: [
      "We retain inquiries only as long as reasonably necessary to respond, maintain business records, resolve disputes, and meet legal obligations. Ordinary inquiries are reviewed for deletion after three years unless an active client relationship, legal requirement, or documented business need calls for longer retention. Analytics retention is controlled in each provider's settings.",
      "We use reasonable administrative and technical safeguards, but no internet transmission or storage system can be guaranteed completely secure. Please do not submit medical records, patient information, payment-card data, passwords, or other highly sensitive information through these forms.",
    ],
  },
  {
    title: "Your choices and rights",
    paragraphs: [
      "You may ask to access, correct, or delete personal information we hold about you, subject to identity verification and applicable exceptions. Depending on where you live, additional privacy rights may apply. You may also decline optional analytics without affecting your ability to use the site or contact Dr. Njo.",
    ],
  },
  {
    title: "Children and policy updates",
    paragraphs: [
      "This professional-services website is not directed to children under 13, and we do not knowingly collect their personal information. We may update this policy as our practices or providers change. The effective date above identifies the current version.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPolicy
      eyebrow="Legal"
      title="Privacy Policy"
      summary="This policy explains what Dental Strategies collects through michaelnjodds.com, why it is used, which providers help operate the site, and the choices available to you."
      effectiveDate="August 17, 2026"
      sections={sections}
    />
  );
}
