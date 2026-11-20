import { SITE_URL } from "@/config/site";

/**
 * Verified facts for Dr. Njo's handbook editions. Second Edition details were
 * read from the live Amazon Kindle listing on Nov 20, 2026. Keep this the
 * single source for page copy, Book JSON-LD and llms.txt so they cannot drift.
 *
 * Do not add a second-edition ISBN, publisher, print format availability or a
 * schema Offer until Dr. Njo confirms them: none appear on the listing.
 */
export const HANDBOOK_SUBTITLE =
  "A Blueprint for Buying and Selling Healthcare Practices in Different Economic Climates";

export const FIRST_EDITION = {
  id: `${SITE_URL}/books#first-edition`,
  name: "Dental Practice Transitions Handbook",
  isbn: "1627878718",
  amazonUrl: "https://www.amazon.com/Dental-Practice-Transitions-Handbook-Healthcare/dp/1627878718",
} as const;

export const SECOND_EDITION = {
  id: `${SITE_URL}/resources/second-book#book`,
  name: "Dental Practice Transitions Handbook, Second Edition",
  path: "/resources/second-book",
  /** Kindle listing sent by Dr. Njo on Nov 14, 2026; live since launch day. */
  kindleUrl: "https://www.amazon.com/dp/B0HRL1C1LZ",
  asin: "B0HRL1C1LZ",
  /** Launch-period Kindle price confirmed by Dr. Njo; no end date was set. */
  kindlePrice: "$2.99",
  datePublished: "2026-11-17",
  datePublishedDisplay: "November 17, 2026",
  pages: 273,
  editor: "Catrise Austin",
  forewordBy: "Dr. Glenn Vo",
  forewordByName: "Glenn Vo",
  /** Reached on Nov 18, 2026 (Nancy Coy's screenshot). Rankings move: never say it "is" #1. */
  bestsellerMilestone: "#1 Best Seller in Dentistry on Amazon",
  bestsellerAward: "#1 Best Seller in Dentistry on Amazon (November 2026)",
  bestsellerPostPath: "/blog/dental-practice-transitions-handbook-second-edition-bestseller",
} as const;

type SchemaNode = Record<string, unknown>;

export function buildFirstEditionBookNode(authorId: string, extra: SchemaNode = {}): SchemaNode {
  return {
    "@type": "Book",
    "@id": FIRST_EDITION.id,
    name: FIRST_EDITION.name,
    alternativeHeadline: HANDBOOK_SUBTITLE,
    bookEdition: "First edition",
    isbn: FIRST_EDITION.isbn,
    url: FIRST_EDITION.amazonUrl,
    inLanguage: "en",
    author: { "@id": authorId },
    ...extra,
  };
}

export function buildSecondEditionBookNode(authorId: string, extra: SchemaNode = {}): SchemaNode {
  return {
    "@type": "Book",
    "@id": SECOND_EDITION.id,
    name: SECOND_EDITION.name,
    alternativeHeadline: HANDBOOK_SUBTITLE,
    bookEdition: "Second edition",
    bookFormat: "https://schema.org/EBook",
    datePublished: SECOND_EDITION.datePublished,
    numberOfPages: SECOND_EDITION.pages,
    inLanguage: "en",
    url: `${SITE_URL}${SECOND_EDITION.path}`,
    sameAs: [SECOND_EDITION.kindleUrl],
    identifier: { "@type": "PropertyValue", propertyID: "ASIN", value: SECOND_EDITION.asin },
    author: { "@id": authorId },
    editor: { "@type": "Person", name: SECOND_EDITION.editor },
    contributor: { "@type": "Person", name: SECOND_EDITION.forewordByName, description: "Author of the foreword" },
    award: SECOND_EDITION.bestsellerAward,
    ...extra,
  };
}
