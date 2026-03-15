export type ResourceArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ResourceArticleFaq = {
  question: string;
  answer: string;
};

export type ResourceArticleLink = {
  href: string;
  label: string;
  description: string;
};

export type ResourceArticle = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  primaryKeyword: string;
  secondaryKeywords: string[];
  keyTakeaways: string[];
  intro: string[];
  sections: ResourceArticleSection[];
  faq: ResourceArticleFaq[];
  closing: string[];
  relatedLinks: ResourceArticleLink[];
};

const RESOURCE_ARTICLES_BASE_PATH = "/resources";

function normalizePath(pathname: string) {
  if (!pathname.startsWith("/")) return "/";
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

export function buildResourceArticlePath(slug: string) {
  return `${RESOURCE_ARTICLES_BASE_PATH}/${slug}`;
}

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export const resourceArticles: ResourceArticle[] = [
  {
    slug: "are-you-ready-to-buy-your-first-dental-practice",
    title: "Are You Ready to Buy Your First Dental Practice? A Straight Answer for Associates",
    metaTitle: "Are You Ready to Buy Your First Dental Practice? | Michael Njo, DDS",
    description:
      "Thinking about your first dental practice acquisition? Learn the financial, clinical, and leadership signs that tell associates when they may be ready for ownership.",
    excerpt:
      "Buying a first practice is more than a financing event. This guide helps associates assess clinical confidence, financial readiness, leadership appetite, and practice fit before stepping into ownership.",
    category: "Ownership readiness",
    publishedAt: "2026-03-14T00:00:00Z",
    updatedAt: "2026-03-14T00:00:00Z",
    readTimeMinutes: 8,
    primaryKeyword: "buy your first dental practice",
    secondaryKeywords: [
      "first dental practice acquisition",
      "when to buy a dental practice",
      "associate to owner dentist",
      "dental practice ownership readiness",
      "dental practice acquisition checklist",
    ],
    keyTakeaways: [
      "Ownership readiness is broader than financing alone.",
      "Steady clinical confidence makes the transition far less risky.",
      "Financial clarity matters more than optimism or peer pressure.",
      "A real owner mindset shows up as appetite for responsibility.",
      "Fit matters: the wrong practice can punish even a capable buyer.",
      "Experienced advisors protect first-time buyers from blind spots.",
    ],
    intro: [
      'A lot of associates ask the wrong first question.',
      'They ask, "Can I afford to buy a practice?" That matters, but it is not the only thing that matters. The better question is this: am I actually ready to own one?',
      "Buying your first dental practice is not just a financing event. It is a leadership decision, a systems decision, and a life decision. The right timing is different for every dentist, but there are clear signals that tell you when ownership is becoming realistic and when you still need more runway.",
      "Dr. Michael Njo's work consistently speaks to that bigger picture. Across his consulting site, interview notes, testimonials, and book reviews, the message is steady: transitions go better when they are planned with clarity, values, and long-term sustainability in mind.",
    ],
    sections: [
      {
        id: "owning-a-practice-is-different",
        title: "Owning a practice is different from being a strong associate",
        paragraphs: [
          "A strong associate can diagnose well, communicate well, and produce consistently. A strong owner has to do all of that while also making decisions about systems, people, cash flow, risk, and long-term direction.",
          "That does not mean you need to know everything before you buy. It does mean you should be honest about what ownership will ask from you.",
          "Buyer guidance across the dental transition space keeps returning to the same themes: clinical readiness, financial readiness, due diligence, and clear support from experienced advisors. Those are not buzzwords. They are the actual foundation.",
        ],
      },
      {
        id: "sign-1-clinical-confidence",
        title: "Sign 1: Your clinical confidence is steady, not fragile",
        paragraphs: [
          "You do not need to know every procedure in dentistry before becoming an owner. But you should have enough experience to run a day confidently, communicate treatment clearly, and recognize where your strengths and limitations are.",
          "Many lenders and advisors will look closely at your clinical experience, production history, and overall readiness. It is not a hard universal rule. It is a practical truth: ownership feels very different when you are still second-guessing your dentistry every hour.",
          "Ask yourself:",
        ],
        bullets: [
          "Can I manage a productive schedule without constant stress?",
          "Do I understand my clinical strengths and referral boundaries?",
          "Can I lead patient conversations with confidence?",
          "Am I still learning, but no longer in survival mode?",
        ],
      },
      {
        id: "sign-2-financial-readiness",
        title: "Sign 2: Your finances are organized enough for ownership",
        paragraphs: [
          "Buying a practice is not the same as buying a house, but financial readiness still matters.",
          "You should understand your personal burn rate, debt load, credit profile, and how ownership would affect your lifestyle. You do not need to be rich. You do need enough discipline to look at numbers without panic or avoidance.",
          "That includes knowing:",
        ],
        bullets: [
          "Your monthly personal expenses",
          "Your student loan obligations",
          "Your credit standing",
          "How much cash reserve you have",
          "What kind of practice size and market are realistic for you",
        ],
      },
      {
        id: "sign-3-responsibility",
        title: "Sign 3: You want responsibility, not just income",
        paragraphs: [
          "Ownership can improve income, equity, and autonomy. But those benefits come with responsibility.",
          "If what you really want is a simpler schedule, fewer decisions, and less management stress, ownership may not be the right next step yet. And that is fine.",
          "On the other hand, if you find yourself wanting more control over systems, team culture, treatment philosophy, and growth strategy, that is often a real ownership signal. Dr. Njo's site repeatedly highlights leadership bandwidth, family stability, operational clarity, and values-first practice building. Those are owner concerns, not associate concerns.",
        ],
      },
      {
        id: "sign-4-operator-mindset",
        title: "Sign 4: You are beginning to think like an operator",
        paragraphs: [
          "Owners do not only look at production. They look at process.",
          "You may be moving into owner mode if you naturally pay attention to things like:",
        ],
        bullets: [
          "Scheduling bottlenecks",
          "Team communication gaps",
          "Patient retention patterns",
          "Hygiene reappointment behavior",
          "Case acceptance friction",
          "How the practice reputation is built and protected",
        ],
      },
      {
        id: "sign-5-practice-fit",
        title: "Sign 5: You know what kind of practice actually fits you",
        paragraphs: [
          "Not every opportunity is your opportunity.",
          'A first-time buyer needs more than a vague goal of "owning something someday." You should have at least a working idea of what fits your life and style:',
        ],
        bullets: [
          "Geographic area",
          "Solo or partnership structure",
          "Bread-and-butter family practice versus niche model",
          "Desired pace of growth",
          "Team size and management appetite",
          "Whether you want a turnaround, stable cash flow, or expansion play",
        ],
      },
      {
        id: "sign-6-ask-for-help",
        title: "Sign 6: You are willing to ask for help early",
        paragraphs: [
          "First-time buyers get in trouble when they try to prove they can do everything alone.",
          "A smart buyer builds a team early. That usually includes a lender, an accountant, an attorney, and an advisor who understands dental transitions. Testimonials across Dr. Njo's site repeatedly describe the same experience: guidance, calm decision-making, and protection from costly blind spots.",
          "That is not weakness. That is maturity.",
        ],
      },
      {
        id: "signs-you-are-not-ready",
        title: "Common signs you are not ready yet",
        paragraphs: [
          "Sometimes the clearest answer is not yet.",
          "You may need more time if:",
        ],
        bullets: [
          "Your personal finances are chaotic",
          "You are still unsure whether you even want to live in the area you are considering",
          "You are buying mainly because you feel behind compared with peers",
          "You have no appetite for team leadership",
          "You have not reviewed real practice financials before",
          "You are hoping ownership will magically solve burnout",
        ],
      },
      {
        id: "a-better-question",
        title: 'A better question than "When should I buy?"',
        paragraphs: [
          'Instead of asking for a universal timeline, ask this: what would need to be true for me to become a strong first-time owner?',
          "That question leads to better preparation. Maybe you need another year of clinical growth. Maybe you need to improve your credit, save reserves, or clarify your leadership style. Maybe you are ready now, but only with the right acquisition support.",
        ],
      },
      {
        id: "ownership-should-support-life",
        title: "Ownership should support your life, not swallow it",
        paragraphs: [
          "One of the strongest themes on Dr. Njo's site is that success should improve quality of life, not replace it. That is worth paying attention to.",
          "The right first practice should move you toward better alignment between work, family, finances, and long-term goals. If the opportunity only looks good on paper but would wreck your health, relationships, or peace of mind, it is not the right fit.",
        ],
      },
    ],
    faq: [
      {
        question: "How many years should I work before buying a dental practice?",
        answer:
          "There is no single rule, but many first-time buyers benefit from getting enough experience to build clinical confidence and stronger financial footing.",
      },
      {
        question: "Can a recent graduate buy a practice?",
        answer:
          "Sometimes, yes, but the risks are usually higher. Many dentists benefit from a period of associate experience before ownership.",
      },
      {
        question: "Do I need a large down payment?",
        answer:
          "Not always. Dental acquisition financing can be favorable, but financial readiness still matters.",
      },
      {
        question: "What is the biggest mistake first-time buyers make?",
        answer:
          "Buying based on emotion before doing real due diligence on finances, fit, and support.",
      },
    ],
    closing: [
      "If you are thinking about whether to buy your first dental practice, do not let the decision turn into guesswork. With the right guidance, you can assess readiness honestly, avoid expensive mistakes, and move into ownership with a plan that fits both your career and your life.",
    ],
    relatedLinks: [
      {
        href: "/resources",
        label: "Browse all resources",
        description: "See the broader resource hub for books, programs, and future guidance posts.",
      },
      {
        href: "/dr-michael-njo-interview",
        label: "Watch Dr. Njo's interview",
        description: "Get more context on Michael Njo's approach to ownership, transitions, and long-term practice strategy.",
      },
      {
        href: "/testimonials",
        label: "Read client testimonials",
        description: "See how dentists describe the guidance, calm, and clarity they received during transition decisions.",
      },
      {
        href: "/contact",
        label: "Talk through your readiness",
        description: "Start a conversation if you want help evaluating fit, timing, or next steps toward ownership.",
      },
    ],
  },
].sort((left, right) => {
  const leftValue = new Date(left.publishedAt).getTime();
  const rightValue = new Date(right.publishedAt).getTime();
  return rightValue - leftValue;
});

const resourceArticleLookup = new Map(resourceArticles.map((article) => [article.slug, article]));

export function getResourceArticleBySlug(slug: string) {
  return resourceArticleLookup.get(slug);
}

export function getResourceArticleByPath(pathname: string) {
  const normalized = normalizePath(pathname);
  if (!normalized.startsWith(`${RESOURCE_ARTICLES_BASE_PATH}/`)) {
    return undefined;
  }

  const slug = normalized.slice(RESOURCE_ARTICLES_BASE_PATH.length + 1);
  if (!slug) return undefined;
  return getResourceArticleBySlug(slug);
}
