import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
  Rocket,
  Scale,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dinnerStrategyGroup from "@/assets/media/dinner-strategy-group.jpg";
import handbookCover from "@/assets/media/handbook-cover.jpg";
import officeStrategyGroup from "@/assets/media/office-strategy-group.jpg";
import { getLatestFiveStarTestimonial, testimonialPages } from "@/data/testimonials";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { LatestReviewCard } from "@/components/testimonials/latest-review-card";
import { HeroSlideshow, type HeroSlide } from "@/components/media/hero-slideshow";
import { BookingButton } from "@/components/booking-button";
import { DsoPricingCallout } from "@/components/dso-pricing-callout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { faqItems, bookReviews, services, resources } from "@/seo/structured-data";
import { dugoniCollaborationImage, gprResidencyPresentationImage } from "@/data/media";
import { eventPrograms } from "@/data/events";
import { CONTACT_PATH } from "@/config/site";

const heroSlides: HeroSlide[] = [
  {
    id: "office-strategy",
    src: officeStrategyGroup,
    alt: "Dr. Michael Njo with healthcare and dental leaders in an office strategy setting.",
    eyebrow: "Strategy in the room",
    caption: "Cross-functional strategy conversations connecting ownership, leadership, and operational clarity.",
    objectPosition: "center center",
  },
  {
    id: "residency-teaching",
    src: gprResidencyPresentationImage.src,
    alt: gprResidencyPresentationImage.alt,
    eyebrow: "Teaching the next generation",
    caption: "Presenting to General Practice Residents holding copies of the Dental Practice Transitions Handbook.",
    objectPosition: "center center",
  },
  {
    id: "handbook-author",
    src: handbookCover,
    alt: "Cover of Dental Practice Transitions Handbook by Michael A. Njo, DDS.",
    eyebrow: "Published author",
    caption: "Author of the Dental Practice Transitions Handbook — the practical playbook for buying, selling, and structuring transitions.",
    objectPosition: "center center",
  },
  {
    id: "university-collaboration",
    src: dugoniCollaborationImage.src,
    alt: dugoniCollaborationImage.alt,
    eyebrow: "University collaboration",
    caption: "Working closely with the University of the Pacific Arthur A. Dugoni School of Dentistry.",
    objectPosition: "center top",
  },
  {
    id: "peer-dinner",
    src: dinnerStrategyGroup,
    alt: "Dr. Michael Njo with peers at an evening strategy dinner.",
    eyebrow: "Peer dinner conversations",
    caption: "Decades of trusted peer relationships — the network behind every recommendation.",
    objectPosition: "center center",
  },
  {
    id: "leadership-retreat",
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/Leadership-retreat_peohe1.webp",
    alt: "Leadership retreat with Dr. Njo and peers.",
    eyebrow: "Leadership retreat",
    caption: "On the ground with peers from across the profession — the leadership side of the consulting work.",
    objectPosition: "center center",
  },
];

const stats = [
  { value: "20+", label: "Years advising practice owners" },
  { value: `${testimonialPages.length}`, label: "Client stories shared" },
  { value: "4", label: "Firms & institutes founded" },
  { value: "Author", label: "Dental Practice Transitions Handbook" },
];

const serviceIcons = [Rocket, TrendingUp, Scale, ShieldCheck];

const processSteps = [
  {
    step: "01",
    title: "Discovery call",
    body: "A short, no-pressure conversation to understand your goals, timeline, and where your practice is today.",
  },
  {
    step: "02",
    title: "Assessment & valuation",
    body: "A clear-eyed read on what your practice is worth, your realistic options, and the dynamics of your local market.",
  },
  {
    step: "03",
    title: "Strategy & plan",
    body: "A tailored road map for launch, growth, partnership, or transition — sequenced around your priorities.",
  },
  {
    step: "04",
    title: "Execution & support",
    body: "Hands-on guidance through the deal, the people side, and everything that happens after the signature.",
  },
];

export default function Home() {
  const latestReview = getLatestFiveStarTestimonial();
  // Skip the hero's latest review so the same quote does not appear twice.
  const featuredTestimonials = testimonialPages
    .filter((testimonial) => testimonial.slug !== latestReview?.slug)
    .slice(0, 3);
  const book = resources.find((resource) => resource.type === "Book");
  const shortReview = bookReviews.find((review) => review.body.length < 220) ?? bookReviews[0];

  return (
    <>
      {/* Hero */}
      <Section spacing="none" className="section-reveal pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
                <Image
                  src="/dr-njo-headshot.webp"
                  alt="Michael Njo, DDS — professional headshot"
                  fill
                  sizes="48px"
                  className="object-cover object-center"
                  priority
                />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Michael Njo, DDS · Dental Strategies
              </p>
            </div>

            <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Launch, grow, value, and transition your dental practice with confidence.
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              For more than two decades, Dr. Michael Njo has guided dentists and healthcare owners through the
              highest-stakes decisions of practice ownership — from first acquisition to final sale.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <BookingButton size="lg" />
              <Button asChild variant="outline" size="lg">
                <Link href={CONTACT_PATH}>Talk to Dr. Njo</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Author of the <span className="font-medium text-foreground">Dental Practice Transitions Handbook</span> ·
              University of the Pacific Dugoni faculty · Founder, Practice Transitions Institute
            </p>

            {latestReview ? <LatestReviewCard testimonial={latestReview} /> : null}
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-2xl shadow-ink/10">
            <HeroSlideshow slides={heroSlides} />
          </div>
        </div>
      </Section>

      {/* Stats band */}
      <Section tone="ink" spacing="compact" aria-label="Practice highlights">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-serif text-4xl font-semibold text-amber-300 sm:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-white/70">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Services */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="What we do"
          title="How Dr. Njo helps practice owners"
          description="Bespoke advisory across the full arc of practice ownership — combining clinical experience with sharp business strategy."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIcons[index] ?? Rocket;
            return (
              <div
                key={service.name}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground">{service.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <p className="mt-auto pt-1 text-xs font-medium uppercase tracking-wide text-brand/80">
                  For {service.audience}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="A clear path from first call to final signature"
          description="No jargon, no pressure — just a structured way to move from uncertainty to a confident decision."
        />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item) => (
            <li key={item.step} className="space-y-3">
              <span className="block font-serif text-4xl font-semibold text-brand/25">{item.step}</span>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Testimonials preview */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Client outcomes"
          title="What dentists say about working with Dr. Njo"
          description={`Drawn from ${testimonialPages.length} client stories across dentistry and healthcare.`}
          action={
            <Button asChild variant="outline">
              <Link href="/testimonials" className="inline-flex items-center gap-2">
                View all stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredTestimonials.map((testimonial) => (
            <TestimonialListCard key={testimonial.slug} testimonial={testimonial} />
          ))}
        </div>
      </Section>

      {/* Book feature */}
      {book ? (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="mx-auto w-full max-w-xs">
              <Image
                src={handbookCover}
                alt="Cover of Dental Practice Transitions Handbook by Michael A. Njo, DDS."
                sizes="(max-width: 1024px) 60vw, 320px"
                className="h-auto w-full rounded-2xl border border-border shadow-2xl shadow-ink/10"
              />
            </div>
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                <BookOpen className="h-3.5 w-3.5" />
                Published author
              </div>
              <h2 className="text-balance font-serif text-3xl font-semibold text-foreground">{book.name}</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-0.5 text-amber-500" aria-label="Rated 5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </span>
                <span className="text-sm text-muted-foreground">Rated 5.0 by readers on Amazon</span>
              </div>
              <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{book.description}</p>
              <blockquote className="border-l-2 border-amber-400 pl-4 font-serif text-[15px] italic leading-relaxed text-foreground/80">
                “{shortReview.body}”
                <span className="mt-1 block text-sm not-italic text-muted-foreground">— {shortReview.author}</span>
              </blockquote>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href={book.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    View on Amazon
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/resources">Explore resources</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Education & mentorship */}
      <Section tone="surface" aria-labelledby="education-title">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-xl shadow-ink/5">
            <Image
              src={gprResidencyPresentationImage.src}
              alt={gprResidencyPresentationImage.alt}
              sizes={gprResidencyPresentationImage.sizes}
              width={gprResidencyPresentationImage.width}
              height={gprResidencyPresentationImage.height}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Education & mentorship</p>
            <h2 id="education-title" className="text-balance font-serif text-3xl font-semibold text-foreground">
              Teaching the next generation of dental leaders
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Dr. Njo regularly presents to General Practice Residency programs, where residents hold copies of his book
              while discussing practice ownership, leadership, and transition planning.
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              That bridge between education and execution is central to his impact — helping dentists connect clinical
              training with long-term decisions about acquisitions, partnerships, valuations, and durable practices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/michael-njo-dds">See full profile</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/resources">Explore resources</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Upcoming events */}
      {eventPrograms.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Speaking & events"
            title="Upcoming educational events"
            description="Seminars and society presentations that keep transition strategy practical."
            action={
              <Button asChild variant="outline">
                <Link href="/michael-njo-dds?tab=news">View all events</Link>
              </Button>
            }
          />
          <div className="mt-10 flex flex-wrap gap-5">
            {eventPrograms.map((program) => (
              <div
                key={program.slug}
                className="flex min-w-[280px] flex-1 flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{program.registrationStatus}</Badge>
                  {program.scheduleLabel ? <Badge variant="outline">{program.scheduleLabel}</Badge> : null}
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">{program.title}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Next: {program.nextDateLabel}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {program.timeLabel}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {program.locationLabel}
                  </p>
                </div>
                <Link
                  href="/michael-njo-dds?tab=news"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-medium text-brand hover:text-brand/70"
                >
                  View details &amp; register
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* FAQ */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked questions"
          action={
            <Button asChild variant="ghost">
              <Link href="/resources" className="inline-flex items-center gap-2">
                View resources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8 rounded-2xl border border-border/70 bg-card px-2 shadow-sm sm:px-4">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={`${faq.question}-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* DSO pricing */}
      <Section spacing="compact">
        <DsoPricingCallout />
      </Section>

      {/* Final CTA */}
      <Section tone="brand">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold text-white sm:text-4xl">
            Ready to talk through your next move?
          </h2>
          <p className="text-pretty text-white/75">
            Whether you&apos;re years from a transition or weighing an offer today, a short call is the simplest place to
            start.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookingButton variant="secondary" size="lg" />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
