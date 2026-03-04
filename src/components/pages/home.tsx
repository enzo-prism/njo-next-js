import { ArrowRight, CheckCircle2, PlayCircle, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { testimonialPages } from "@/data/testimonials";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems, bookReviews } from "@/seo/structured-data";

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
            <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[260px] bg-gradient-to-b from-slate-100 to-white p-8 md:p-12">
                <Image
                  src="/dr-njo-headshot.webp"
                  alt="Michael Njo, DDS - Professional headshot"
                  width={383}
                  height={460}
                  className="mx-auto h-56 w-56 rounded-full object-cover object-center shadow-2xl"
                  priority
                />
                <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                  {coreOrganizations.map((org) => (
                    <Badge key={org} variant="secondary">
                      {org}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-5 p-8 md:p-12">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl sm:text-4xl">Dr. Michael Njo</CardTitle>
                  <CardDescription className="max-w-xl">
                    Healthcare consultant and strategist helping dentists and physicians with clinic growth, transitions, and leadership.
                  </CardDescription>
                </CardHeader>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    More than two decades of hands-on experience shaping sustainable, values-first healthcare practices.
                  </p>
                  <p>
                    Need a trusted partner for launch, growth, acquisition, valuation, or sale support? We can help.
                  </p>
                  <a href="mailto:dentalstrategies@gmail.com" className="block font-medium text-foreground hover:underline">
                    dentalstrategies@gmail.com
                  </a>
                  <a href="tel:+16504362939" className="block font-medium text-foreground hover:underline">
                    (650) 436-2939
                  </a>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/contact">Book a Consultation</Link>
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  Featured Conversation
                  <PlayCircle className="h-4 w-4 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Follow Dr. Njo’s transition journey and the practical framework used across dental and healthcare ownership
                  decisions.
                </p>
                <Button asChild>
                  <Link href="/dr-michael-njo-interview" className="inline-flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Watch interview
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  What you can expect
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-foreground" />
                    Strategic transitions that protect patient care and team continuity.
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-foreground" />
                    Leadership coaching for long-term growth and operations.
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-foreground" />
                    Personalized advisory from launch planning through execution.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
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

        <section className="grid gap-4 md:grid-cols-2 section-reveal section-stagger">
          <Card>
            <CardHeader>
              <CardTitle>Latest Client Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookReviews.slice(0, 2).map((review) => (
                <article
                  key={`${review.author}-${review.datePublished}`}
                  className="rounded-lg border border-border bg-background px-4 py-3"
                >
                  <p className="text-sm text-muted-foreground">{review.title}</p>
                  <h3 className="mt-1 text-sm font-medium">{review.author}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
                </article>
              ))}
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
                  <Link href="/contact">Start a consultation</Link>
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
