import { eventPrograms } from "@/data/events";
import { SITE_URL } from "@/config/site";

export type FAQItem = {
  question: string;
  answer: string;
};

export type ServiceDetail = {
  name: string;
  description: string;
  audience: string;
};

export type ResourceHighlight = {
  name: string;
  description: string;
  url: string;
  type: "Book" | "EducationalOrganization";
  editorialReview?: string;
};

export type BookReview = {
  author: string;
  title: string;
  rating: number;
  body: string;
  datePublished: string;
  context: string;
  meta: string;
};

export const siteMetadata = {
  siteUrl: SITE_URL,
  name: "Michael Njo, DDS",
  alternateName: "Michael Njo DDS",
  description:
    "Dr. Michael Njo mentors dentists, physicians, and entrepreneurs through Dental Strategies, HealthcareStrategiesMD, Business Strategies, and Practice Transitions Institute.",
  sameAs: [
    "https://practicetransitionsinstitute.com/",
    "https://www.amazon.com/Dental-Practice-Transitions-Handbook-Healthcare/dp/1627878718",
  ],
  logo: "https://michaelnjodds.com/og-image.svg",
};

export const contactDetails = {
  email: "dentalstrategies@gmail.com",
};

export const personProfile = {
  id: `${siteMetadata.siteUrl}/#person`,
  name: "Michael Njo, DDS",
  alternateName: "Michael Njo DDS",
  jobTitle: "Founder & Strategy Consultant",
  description:
    "Dr. Michael Njo leads Dental Strategies, HealthcareStrategiesMD, Business Strategies, and Practice Transitions Institute to mentor healthcare owners through practice launches, growth, and transitions.",
};

export const organizationProfile = {
  id: `${siteMetadata.siteUrl}/#organization`,
  name: "Dental Strategies",
  legalName: "Dental Strategies Consulting",
  url: siteMetadata.siteUrl,
  logo: siteMetadata.logo,
};

export const faqItems: FAQItem[] = [
  {
    question: "Who is Dr. Michael Njo?",
    answer:
      "Dr. Michael Njo, also known as Michael Njo, DDS, is a University of the Pacific alum and the founder of Dental Strategies, HealthcareStrategiesMD, Business Strategies, and Practice Transitions Institute. He mentors dentists, physicians, and entrepreneurs through every phase of practice ownership.",
  },
  {
    question: "What services does Michael Njo, DDS provide?",
    answer:
      "Michael Njo, DDS delivers bespoke consulting across practice startups, acquisitions, valuations, transitions, leadership development, and team training. His playbooks combine clinical experience with business strategy to elevate growth while protecting patient care standards.",
  },
  {
    question: "How can I work with Dr. Michael Njo?",
    answer:
      "You can email dentalstrategies@gmail.com to schedule a complimentary consultation with Dr. Michael Njo. He begins with an assessment of your goals, timeline, and financial targets before crafting a road map tailored to your practice.",
  },
];

export const services: ServiceDetail[] = [
  {
    name: "Practice launches and acquisitions",
    description:
      "Coaching for dentists planning a start-up or purchase, including diligence, deal structure, and operational onboarding.",
    audience: "Dentists planning a new practice or expanding to a second location",
  },
  {
    name: "Growth planning and leadership",
    description:
      "Strategic planning, technology integration, and team development frameworks to scale patient experience and profitability.",
    audience: "Owners focused on scaling multi-doctor or multi-location practices",
  },
  {
    name: "Practice valuations and transitions",
    description:
      "Comprehensive valuations, partnership design, retirement roadmaps, and seller/buyer alignment to protect legacy and staff.",
    audience: "Doctors preparing for retirement, partnership changes, or chart sales",
  },
  {
    name: "Conflict resolution and compliance",
    description:
      "Support navigating malpractice, regulatory issues, and sensitive team alignment to keep practices stable during change.",
    audience: "Healthcare owners facing complex legal, regulatory, or personnel challenges",
  },
];

export const resources: ResourceHighlight[] = [
  {
    type: "Book",
    name: "Dental Practice Transitions Handbook",
    description:
      "Dental Practice Transitions Handbook prepares you to evaluate associate roles, partnerships, and purchase options with a global understanding of how sellers and buyers think, the mistakes to avoid, and the questions to ask before any transition.",
    url: "https://www.amazon.com/Dental-Practice-Transitions-Handbook-Healthcare/dp/1627878718",
    editorialReview:
      "Dr. Michael Njo has three-plus decades of experience in the dental industry and two decades of experience in the healthcare transition business. After being injured, he joined Pride Transitions and worked with Hy Smith his mentor. He left Pride to develop his own consulting companies, Dental Strategies, Healthcare Strategies, and Your Business Strategies. He has been on faculty at the UOP, School of Dentistry, lectured for many venues and residency programs including, USDTA, UCSF Orthodontic program, UMC, and many other general residency programs. He has consulted for lenders such as Bank of San Francisco and is a guest lecturer for the Dugoni Business Club. Dr. Njo was a founding member of a development company for startup healthcare professionals, Western Professional Buildings. He is the recipient of the Faculty award given by second-year students at UOP, School of Dentistry, and the recipient of the Distinguished Service Award presented by the San Mateo County Dental Society, where he served as editor of \"The Mouthpiece,\" board member, and as secretary. Dr. Njo's successful consulting business has been built all by word of mouth. Dr. Njo has been passed the baton by Hy Smith. Not until now has Dr. Njo publicly shared his knowledge, insight, and guidance. Thanks to Hy Smith for facilitating the passing of the baton in the creation of this Dental Practice Transitions Handbook.",
  },
  {
    type: "EducationalOrganization",
    name: "Practice Transitions Institute",
    description:
      "Specialized education and training for dental professionals on practice transitions and growth strategies.",
    url: "https://practicetransitionsinstitute.com/",
  },
];

export const bookReviews: BookReview[] = [
  {
    author: "Dr. A. Jaraha",
    title: "Very insightful!",
    rating: 5,
    datePublished: "2023-06-18",
    context: "Reviewed in the United States on June 18, 2023",
    meta: "Format: Paperback • Verified Purchase",
    body:
      "Very insightful book! I found the chapters in this book extremely informative. It covers topics that every Dentist should know, but are rarely talked about in dental school or dental circles. It was a great read coming right out of dental school. I highly recommend.",
  },
  {
    author: "Technoguru",
    title: "Exceptional Value and Advice",
    rating: 5,
    datePublished: "2024-01-11",
    context: "Reviewed in the United States on January 11, 2024",
    meta: "Format: Paperback",
    body:
      "In Dental Practice Transitions Handbook, Dr. Michael A. Njo deftly navigates the ever-changing landscape of dental practice transitions, providing insightful advice and guidance to dental professionals at any stage of their career. Dr. Njo's approach emphasizes the importance of careful planning and educated decision-making to ensure long-term success in a field that has seen significant changes in recent years.\n\nOne of the shining aspects of Dental Practice Transitions Handbook is the pacing, which moves smoothly from one topic to another. Each chapter builds upon previous concepts, gradually introducing more nuanced aspects of dental practice transitions while maintaining reader engagement. Dr. Njo's writing style is clear and accessible, reflecting his experience in both dentistry and practice management.\n\nComparatively, Dental Practice Transitions Handbook stands out from similar books in its genre, such as Transitioning from Dental School to Private Dental Practice by Brian G. Hallisey, DDS, by its focus on specific transition options and the impact of varying economic climates. Dr. Njo skillfully delves into each scenario, providing readers with actionable advice and guidance that can be personalized to their individual situations.\n\nThe ideal audience for Dental Practice Transitions Handbook is dental professionals at any stage of their career, particularly those who are considering a transition, such as a partnership, acquisition, or sale of a practice. Whether you are a new graduate or an experienced dentist, Dr. Njo's book will provide valuable insights to help you navigate the complexities of the dental practice transition process.\n\nI wholeheartedly recommend Dental Practice Transitions Handbook by Dr. Michael A. Njo. The author's expertise, engaging writing style, and nuanced discussion of practical topics make this book a valuable addition to any dental professional's library.",
  },
  {
    author: "Amazon Customer",
    title: "Worth its weight in gold!",
    rating: 5,
    datePublished: "2024-02-02",
    context: "Reviewed in the United States on February 2, 2024",
    meta: "Format: Paperback",
    body:
      "Dr. Njo is very knowledgable on all aspects of private practice dentistry. Reading this book will give you a lot of valuable insight to what decisions you should and shouldn't make in order to maximize your success in your dental career.",
  },
  {
    author: "Sloane",
    title: "Great read!",
    rating: 5,
    datePublished: "2024-01-11",
    context: "Reviewed in the United States on January 11, 2024",
    meta: "Format: Paperback",
    body:
      "I listened to the author lecture about this book and the topic. I have started reading it and am so thankful that I have the resource at my fingertips!",
  },
];

export const heroImage = {
  url: `${siteMetadata.siteUrl}/og-image.svg`,
  width: 1200,
  height: 630,
  type: "image/svg+xml",
};

export const bookEditorialReview = {
  heading: "Editorial Reviews • About the Author",
  body:
    resources.find((resource) => resource.type === "Book")?.editorialReview ||
    "Dr. Michael Njo has three-plus decades of experience in the dental industry and two decades of experience in the healthcare transition business.",
};

type SchemaNode = Record<string, unknown>;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const getServiceNodes = (): SchemaNode[] =>
  services.map((service) => ({
    "@type": "Service",
    "@id": `${siteMetadata.siteUrl}#service-${slugify(service.name)}`,
    name: service.name,
    description: service.description,
    serviceType: service.name,
    provider: {
      "@id": organizationProfile.id,
    },
    audience: {
      "@type": "Audience",
      audienceType: service.audience,
    },
  }));

const getFAQEntity = (): SchemaNode => ({
  "@type": "FAQPage",
  "@id": `${siteMetadata.siteUrl}#faq`,
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

const getUpcomingEventNodes = (): SchemaNode[] =>
  eventPrograms.flatMap((program) => {
    const eventType = program.category === "conference" ? "Event" : "EducationEvent";
    const pageUrl = `${siteMetadata.siteUrl}/michael-njo-dds?tab=news`;
    const occurrences = program.upcomingDates?.length
      ? program.upcomingDates
      : [{ location: program.locationLabel, startDateTime: program.nextDateTime, endDateTime: undefined }];

    return occurrences.map((occurrence, index) => ({
      "@type": eventType,
      "@id": `${siteMetadata.siteUrl}/michael-njo-dds#event-${program.slug}-${index + 1}`,
      name: program.title,
      description: program.description,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      startDate: occurrence.startDateTime,
      endDate: occurrence.endDateTime || undefined,
      location: {
        "@type": "Place",
        name: occurrence.location,
      },
      organizer: {
        "@id": `${siteMetadata.siteUrl}#pti`,
      },
      performer: {
        "@id": personProfile.id,
      },
      inLanguage: "en",
      url: pageUrl,
    }));
  });

const getResourceNodes = (): SchemaNode[] =>
  resources.map((resource) => {
    if (resource.type === "Book") {
      const bookId = `${siteMetadata.siteUrl}#book`;

      const bookNode: SchemaNode = {
        "@type": "Book",
        "@id": bookId,
        name: resource.name,
        description: resource.description,
        isbn: "1627878718",
        url: resource.url,
        author: {
          "@id": personProfile.id,
        },
        publisher: {
          "@id": organizationProfile.id,
        },
      };
      return bookNode;
    }

    return {
      "@type": "EducationalOrganization",
      "@id": `${siteMetadata.siteUrl}#pti`,
      name: resource.name,
      description: resource.description,
      url: resource.url,
      founder: {
        "@id": personProfile.id,
      },
    };
  });

const getCoreGraphNodes = (): SchemaNode[] => {
  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "Consultation",
    email: contactDetails.email,
    availableLanguage: ["English"],
  };

  const organization = {
    "@type": "Organization",
    "@id": organizationProfile.id,
    name: organizationProfile.name,
    legalName: organizationProfile.legalName,
    url: organizationProfile.url,
    logo: organizationProfile.logo,
    sameAs: siteMetadata.sameAs,
    contactPoint,
    founder: {
      "@id": personProfile.id,
    },
  };

  const person = {
    "@type": "Person",
    "@id": personProfile.id,
    name: personProfile.name,
    alternateName: personProfile.alternateName,
    jobTitle: personProfile.jobTitle,
    description: personProfile.description,
    url: siteMetadata.siteUrl,
    image: heroImage.url,
    sameAs: siteMetadata.sameAs,
    worksFor: {
      "@id": organizationProfile.id,
    },
    knowsAbout: [
      "Dental practice transitions",
      "Healthcare consulting",
      "Business strategy",
      "Practice valuations",
      "Leadership development",
    ],
  };

  const webSite = {
    "@type": "WebSite",
    "@id": `${siteMetadata.siteUrl}#website`,
    url: siteMetadata.siteUrl,
    name: siteMetadata.name,
    alternateName: siteMetadata.alternateName,
    description: siteMetadata.description,
    publisher: {
      "@id": organizationProfile.id,
    },
  };

  const heroImageNode = {
    "@type": "ImageObject",
    "@id": `${siteMetadata.siteUrl}#hero-image`,
    url: heroImage.url,
    width: heroImage.width,
    height: heroImage.height,
    encodingFormat: heroImage.type,
  };

  return [webSite, organization, person, heroImageNode];
};

const buildBreadcrumb = (items: { name: string; item: string }[]): SchemaNode => ({
  "@type": "BreadcrumbList",
  "@id": `${siteMetadata.siteUrl}#breadcrumb-${slugify(items[items.length - 1]?.name || "home")}`,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.item,
  })),
});

const buildWebPage = ({
  id,
  name,
  description,
  url,
  breadcrumbId,
}: {
  id: string;
  name: string;
  description: string;
  url: string;
  breadcrumbId: string;
}): SchemaNode => ({
  "@type": "WebPage",
  "@id": id,
  name,
  url,
  description,
  inLanguage: "en",
  isPartOf: {
    "@id": `${siteMetadata.siteUrl}#website`,
  },
  breadcrumb: {
    "@id": breadcrumbId,
  },
  about: {
    "@id": personProfile.id,
  },
  primaryImageOfPage: {
    "@id": `${siteMetadata.siteUrl}#hero-image`,
  },
});

export const getMichaelNjoInterviewStructuredData = () => {
  const interviewUrl = `${siteMetadata.siteUrl}/dr-michael-njo-interview`;
  const breadcrumb = buildBreadcrumb([
    { name: "Home", item: siteMetadata.siteUrl },
    { name: "Featured Interview", item: interviewUrl },
  ]);

  const interviewVideo = {
    "@type": "VideoObject",
    "@id": `${interviewUrl}#video`,
    name: "Dr. Michael Njo Interview | Michael Njo, DDS",
    description:
      "An in-depth conversation on career transitions, management consulting, and legal guidance for dentists, hosted on Dr. Michael Njo, DDS and interviewed by Dr. Farokh Jiveh.",
    contentUrl: "https://res.cloudinary.com/dhqpqfw6w/video/upload/v1771798426/drnjo_avytsr.mp4",
    embedUrl: "https://res.cloudinary.com/dhqpqfw6w/video/upload/v1771798426/drnjo_avytsr.mp4",
    url: interviewUrl,
    inLanguage: "en",
    creator: {
      "@id": personProfile.id,
    },
  };

  const interviewPage: SchemaNode = {
    ...buildWebPage({
      id: `${interviewUrl}#webpage`,
      name: "Dr. Michael Njo Interview",
      description:
        "Watch Dr. Michael Njo discuss moving from private dentistry to building Dental Strategies through practice transitions, management consulting, and legal support. Interviewed by Dr. Farokh Jiveh.",
      url: interviewUrl,
      breadcrumbId: breadcrumb["@id"] as string,
    }),
    "@type": ["WebPage", "WebPageElement"],
    mainEntity: {
      "@id": interviewVideo["@id"] as string,
    },
    about: {
      "@id": personProfile.id,
    },
    primaryImageOfPage: {
      "@id": `${siteMetadata.siteUrl}#hero-image`,
    },
  };

  const graph = [
    ...getCoreGraphNodes(),
    interviewPage,
    interviewVideo,
    breadcrumb,
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};

export const getHomeStructuredData = () => {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", item: siteMetadata.siteUrl },
  ]);

  const homePage: SchemaNode = {
    ...buildWebPage({
      id: `${siteMetadata.siteUrl}#home`,
      name: siteMetadata.name,
      description: siteMetadata.description,
      url: siteMetadata.siteUrl,
      breadcrumbId: breadcrumb["@id"] as string,
    }),
    "@type": ["WebPage", "ProfilePage"],
    mainEntity: {
      "@id": personProfile.id,
    },
  };

  const faqEntity = getFAQEntity();

  const graph = [
    ...getCoreGraphNodes(),
    ...getResourceNodes(),
    homePage,
    faqEntity,
    breadcrumb,
  ];
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};

export const getMichaelNjoStructuredData = () => {
  const profileUrl = `${siteMetadata.siteUrl}/michael-njo-dds`;
  const breadcrumb = buildBreadcrumb([
    { name: "Home", item: siteMetadata.siteUrl },
    { name: "Michael Njo DDS", item: profileUrl },
  ]);

  const profilePage: SchemaNode = {
    ...buildWebPage({
      id: `${profileUrl}#webpage`,
      name: "Michael Njo DDS",
      description:
        "Learn about Michael Njo DDS, founder of Dental Strategies Consulting and Practice Transitions Institute, specializing in dental practice transitions and growth strategy.",
      url: profileUrl,
      breadcrumbId: breadcrumb["@id"] as string,
    }),
    "@type": ["WebPage", "ProfilePage"],
    mainEntity: {
      "@id": personProfile.id,
    },
  };

  const graph = [
    ...getCoreGraphNodes(),
    ...getServiceNodes(),
    ...getResourceNodes(),
    ...getUpcomingEventNodes(),
    profilePage,
    breadcrumb,
  ];
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};

export const getContactStructuredData = () => {
  const contactUrl = `${siteMetadata.siteUrl}/contact`;
  const breadcrumb = buildBreadcrumb([
    { name: "Home", item: siteMetadata.siteUrl },
    { name: "Contact", item: contactUrl },
  ]);

  const contactPage: SchemaNode = {
    ...buildWebPage({
      id: `${contactUrl}#webpage`,
      name: "Contact Dr. Michael Njo",
      description: "Send a direct message to Dr. Michael Njo for consulting inquiries or speaking engagements.",
      url: contactUrl,
      breadcrumbId: breadcrumb["@id"] as string,
    }),
    "@type": ["WebPage", "ContactPage"],
    potentialAction: {
      "@type": "ContactAction",
      name: "Submit consultation inquiry",
      target: contactUrl,
      result: {
        "@type": "Thing",
        name: "Confirmation message",
      },
    },
  };

  const graph = [...getCoreGraphNodes(), contactPage, breadcrumb];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};

export const getContactSuccessStructuredData = () => {
  const successUrl = `${siteMetadata.siteUrl}/contact/success`;
  const breadcrumb = buildBreadcrumb([
    { name: "Home", item: siteMetadata.siteUrl },
    { name: "Contact", item: `${siteMetadata.siteUrl}/contact` },
    { name: "Thank you", item: successUrl },
  ]);

  const webPage = buildWebPage({
    id: `${successUrl}#webpage`,
    name: "Message received by Dr. Michael Njo",
    description: "Confirmation that your message has been sent to Dr. Michael Njo at Dental Strategies.",
    url: successUrl,
    breadcrumbId: breadcrumb["@id"] as string,
  });

  const graph = [...getCoreGraphNodes(), webPage, breadcrumb];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};
