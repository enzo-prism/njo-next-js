import { ArrowRight, Mail, MessageSquareText, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dinnerStrategyGroup from "@/assets/media/dinner-strategy-group.jpg";
import handbookCover from "@/assets/media/handbook-cover.jpg";
import officeStrategyGroup from "@/assets/media/office-strategy-group.jpg";
import { testimonialPages } from "@/data/testimonials";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { HeroSlideshow, type HeroSlide } from "@/components/media/hero-slideshow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems, bookReviews } from "@/seo/structured-data";
import { dugoniCollaborationImage, gprResidencyPresentationImage } from "@/data/media";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";

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

const coreOrganizations = [
  "Dental Strategies",
  "HealthcareStrategiesMD",
  "Business Strategies",
  "Practice Transitions Institute",
];

export default function Home() {
  return (
    <>
      <div className="space-y-10">
        <h1 className="sr-only">Dr. Michael Njo | Dental Strategies Consulting</h1>
        <section className="section-shell section-reveal">
          <p className="sr-only">Founder of Dental Strategies, HealthcareStrategiesMD, Business Strategies, and Practice Transitions Institute.</p>
          <Card className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <HeroSlideshow slides={heroSlides} />

              <div className="flex flex-col gap-6 p-7 sm:p-10 md:p-12">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
                    <Image
                      src="/dr-njo-headshot.webp"
                      alt="Michael Njo, DDS - Professional headshot"
                      fill
                      sizes="64px"
                      className="object-cover object-center"
                      priority
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Founder · Advisor · Educator
                    </p>
                    <p className="text-sm font-medium text-foreground">Michael Njo, DDS</p>
                  </div>
                </div>

                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl sm:text-4xl">Dr. Michael Njo</CardTitle>
                  <CardDescription className="max-w-xl">
                    Healthcare consultant and strategist helping dentists and physicians with clinic growth, transitions, and leadership.
                  </CardDescription>
                </CardHeader>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  More than two decades of hands-on experience shaping sustainable, values-first healthcare practices.
                </p>

                <div className="flex flex-wrap gap-2">
                  {coreOrganizations.map((org) => (
                    <Badge key={org} variant="secondary">
                      {org}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Need a trusted partner for launch, growth, acquisition, valuation, or sale support? We can help.
                  </p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 font-medium text-foreground hover:underline">
                    <Mail className="h-4 w-4" />
                    {CONTACT_EMAIL}
                  </a>
                  <a href={`tel:${CONTACT_PHONE}`} className="block font-medium text-foreground hover:underline">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={CONTACT_PATH}>
                      <MessageSquareText className="h-4 w-4" />
                      Contact Dr. Njo
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/michael-njo-dds">Read Full Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4 section-reveal section-stagger">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Client outcomes</p>
              <h2 className="text-2xl font-semibold">Testimonials ({testimonialPages.length})</h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/testimonials" className="inline-flex items-center gap-2">
                View full archive
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonialPages.slice(0, 6).map((testimonial) => (
              <TestimonialListCard key={testimonial.slug} testimonial={testimonial} />
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-gradient-to-r from-slate-100 via-transparent to-transparent p-6 text-center">
            <p className="text-lg font-semibold">Trusted by dentists and healthcare leaders.</p>
            <p className="text-sm text-muted-foreground">
              Read more full stories in the testimonials section to see what has worked in real transitions.
            </p>
          </div>
        </section>

        <section className="section-reveal section-stagger" aria-labelledby="residency-impact-title">
          <Card className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-slate-100/70">
                <Image
                  src={gprResidencyPresentationImage.src}
                  alt={gprResidencyPresentationImage.alt}
                  sizes={gprResidencyPresentationImage.sizes}
                  width={gprResidencyPresentationImage.width}
                  height={gprResidencyPresentationImage.height}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 p-8 md:p-10">
                <p className="text-sm font-medium text-muted-foreground">Dental education and mentorship</p>
                <h2 id="residency-impact-title" className="text-2xl font-semibold">
                  Dr. Njo teaches the next generation of dental leaders
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Dr. Michael Njo, DDS recently presented to residents in a General Practice Residency (GPR) program, where
                  attendees held copies of his book, <em>Dental Practice Transitions Handbook</em>, while discussing practice
                  ownership, leadership, and transition planning.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This kind of residency education reinforces Dr. Njo&apos;s real-world impact beyond consulting. He helps dentists
                  connect clinical training with long-term decisions about acquisitions, partnerships, valuations, and building
                  durable practices.
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
          </Card>
        </section>

        <section className="space-y-4 section-reveal section-stagger" aria-labelledby="faq-title">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground" id="faq-title">
                Most asked
              </p>
              <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/resources" className="inline-flex items-center gap-2">
                View resources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="py-4">
              <Accordion type="single" collapsible className="w-full text-left">
                {faqItems.map((faq, index) => (
                  <AccordionItem key={`${faq.question}-${index}`} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-left">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 section-reveal section-stagger">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Book Reviews</CardTitle>
              <p className="text-sm text-muted-foreground">
                Independent reviews of <em>Dental Practice Transitions Handbook</em>.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion type="single" collapsible className="w-full">
                {bookReviews.slice(0, 2).map((review, index) => (
                  <AccordionItem
                    key={`${review.author}-${review.datePublished}`}
                    value={`book-review-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex flex-1 flex-col items-start gap-1.5 pr-3 text-left">
                        <div
                          className="flex items-center gap-1 text-amber-500"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating ? "fill-current" : "text-slate-300"
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-foreground">{review.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.author}
                          {review.context ? <span> · {review.context}</span> : null}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                        {review.body
                          .split(/\n+/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean)
                          .map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        {review.meta ? (
                          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                            {review.meta}
                          </p>
                        ) : null}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need a quick path forward?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Star className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                <p>
                  Start with a short conversation to determine whether your goals are best served through launch support, ownership
                  transition, or team leadership work.
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Users className="mt-1 h-5 w-5 flex-shrink-0" />
                <p>Learn from direct client experiences and transition stories across dentistry and healthcare.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={CONTACT_PATH}>
                    <MessageSquareText className="h-4 w-4" />
                    Contact Dr. Njo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 section-reveal section-stagger">
          <Card>
            <CardHeader>
              <CardTitle>Community milestones</CardTitle>
              <p className="text-sm text-muted-foreground">
                Behind-the-scenes moments from recent leadership and professional events.
              </p>
            </CardHeader>
            <CardContent>
              <Image
                src="https://res.cloudinary.com/dhqpqfw6w/image/upload/v1762786458/dugoni-business-club-donation-ceremony_plth4r.webp"
                sizes="(max-width: 768px) 100vw, 768px"
                width={1645}
                height={1095}
                alt="Dr. Michael Njo, DDS at the Dugoni Business Club donation ceremony"
                className="w-full rounded-md border border-border object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client workshop</CardTitle>
              <p className="text-sm text-muted-foreground">Trusted peers and clinic teams in strategic workshops.</p>
            </CardHeader>
            <CardContent>
              <Image
                src="/dr-njo-clients-1280.webp"
                sizes="(max-width: 768px) 100vw, 1024px"
                width={1920}
                height={1279}
                alt="Michael Njo, DDS with dental professionals at a consulting workshop"
                className="w-full rounded-md border border-border object-cover"
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
