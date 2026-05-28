"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Mail, MapPin, MessageSquareQuote, PhoneCall } from "lucide-react";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/seo/structured-data";
import { testimonialPages } from "@/data/testimonials";
import {
  dugoniCollaborationImage,
  gprResidencyPresentationImage,
  profileGalleryImages,
  profileNewsImages,
  profileRelationshipImages,
  type EditorialMediaAsset,
} from "@/data/media";
import { eventPrograms } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { EditorialMosaic } from "@/components/media/editorial-mosaic";
import { BookingButton } from "@/components/booking-button";
import { DsoPricingCallout } from "@/components/dso-pricing-callout";
import { CONTACT_PATH } from "@/config/site";

const panel = "rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-7";

const organizations = [
  {
    title: "Dental Strategies",
    body: "Primary consulting practice focused on practice launches, growth, and transitions.",
  },
  {
    title: "Practice Transitions Institute",
    body: "Education and transition strategy for dentists navigating ownership and partner dynamics.",
  },
  {
    title: "HealthcareStrategiesMD",
    body: "Broader operational and growth strategy for healthcare practice owners.",
  },
  {
    title: "Business Strategies",
    body: "Leadership, systems, and sustainable workflow support for growing teams.",
  },
];

export default function MichaelNjoDDS() {
  const featuredTestimonials = testimonialPages.slice(0, 6);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState<EditorialMediaAsset | null>(null);

  useEffect(() => {
    const shouldShowNews = new URLSearchParams(window.location.search).get("tab") === "news";
    if (shouldShowNews) {
      setActiveTab("news");
    }
  }, []);

  return (
    <>
      <Container className="space-y-12 py-10 sm:py-14">
        {/* Hero */}
        <section className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Consulting profile</p>
          <h1 className="text-balance font-serif text-4xl font-semibold sm:text-5xl">Dr. Michael Njo</h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Founder of Dental Strategies, HealthcareStrategiesMD, Business Strategies, and Practice Transitions Institute —
            mentoring healthcare owners through ownership, growth, and transitions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <BookingButton size="lg" />
            <Button asChild variant="outline" size="lg">
              <Link href={CONTACT_PATH}>
                <MessageSquareQuote className="h-4 w-4" />
                Contact Dr. Njo
              </Link>
            </Button>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className={`${panel} space-y-4`}>
                <h2 className="font-serif text-xl font-semibold">About Dr. Michael Njo</h2>
                <Image
                  src={dugoniCollaborationImage.src}
                  sizes={dugoniCollaborationImage.sizes}
                  alt={dugoniCollaborationImage.alt}
                  width={dugoniCollaborationImage.width}
                  height={dugoniCollaborationImage.height}
                  className="mx-auto h-64 w-64 rounded-2xl object-cover object-center"
                />
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  A practitioner-turned-consultant with deep private practice experience, Dr. Njo helps healthcare owners
                  design resilient systems for team execution, growth strategy, and transitions.
                </p>
              </div>

              <div className={`${panel} space-y-4`}>
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-semibold">Core services</h2>
                  <p className="text-sm text-muted-foreground">Practice launches, management, and transition work</p>
                </div>
                <div className="grid gap-3">
                  {services.map((service) => (
                    <div key={service.name} className="rounded-xl border border-border/70 bg-surface p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{service.name}</p>
                        <Badge variant="secondary">Service</Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${panel} space-y-4`}>
              <h2 className="font-serif text-xl font-semibold">Organizations</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {organizations.map((org) => (
                  <div key={org.title} className="rounded-xl border border-border/70 bg-surface p-4">
                    <p className="font-medium text-foreground">{org.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{org.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <DsoPricingCallout />

            {/* Residency feature */}
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-surface">
                  <Image
                    src={gprResidencyPresentationImage.src}
                    alt={gprResidencyPresentationImage.alt}
                    sizes={gprResidencyPresentationImage.sizes}
                    width={gprResidencyPresentationImage.width}
                    height={gprResidencyPresentationImage.height}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    Residency education and speaking
                  </p>
                  <h2 className="text-balance font-serif text-2xl font-semibold">
                    Guiding GPR residents through real-world transition strategy
                  </h2>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    Dr. Njo regularly brings practical ownership and transition insight into academic and residency
                    settings. In this General Practice Residency (GPR) presentation, residents held copies of{" "}
                    <em>Dental Practice Transitions Handbook</em> while discussing career pathways, partnership structures,
                    and long-term practice planning.
                  </p>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    That bridge between education and execution is central to his impact. Dr. Njo helps early-career
                    dentists understand how leadership, valuation, operations, and exit planning shape the future of a
                    practice long before a transition is on the calendar.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { title: "Guest lecturer", body: "Dental residency and professional programs" },
                      { title: "Published author", body: "Dental Practice Transitions Handbook" },
                      { title: "Career mentor", body: "Ownership, growth, and transition guidance" },
                    ].map((item) => (
                      <div key={item.title} className="rounded-xl border border-border/70 bg-surface p-3">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{gprResidencyPresentationImage.caption}</p>
                  <Button asChild variant="outline">
                    <Link href="/resources">Explore resources</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Relationships */}
            {profileRelationshipImages.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="grid gap-0 xl:grid-cols-[0.88fr_1.12fr]">
                  <div className="space-y-4 p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                      Relationships, recognition, and leadership
                    </p>
                    <h2 className="text-balance font-serif text-2xl font-semibold">
                      Trust that shows up in rooms where reputation matters
                    </h2>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      Dr. Njo&apos;s advisory work is reinforced by longstanding relationships with peers, collaborators,
                      and healthcare leaders who continue to invite him into conversations about growth, transitions, and
                      professional stewardship.
                    </p>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      These moments show the caliber of network, trust, and industry presence that surrounds Michael&apos;s
                      work when clients are looking for judgment as much as technical guidance.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/70 bg-surface p-3">
                        <p className="text-sm font-semibold text-foreground">Peer trust</p>
                        <p className="mt-1 text-sm text-muted-foreground">Relationships that outlast single deals.</p>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-surface p-3">
                        <p className="text-sm font-semibold text-foreground">Visible credibility</p>
                        <p className="mt-1 text-sm text-muted-foreground">Settings where reputation and discretion matter.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface p-4 md:p-6">
                    <EditorialMosaic assets={profileRelationshipImages} captionMode="below" />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Gallery */}
            <div className={`${panel}`}>
              <div className="mb-6 space-y-1">
                <h2 className="font-serif text-xl font-semibold">Expanded leadership gallery</h2>
                <p className="text-sm text-muted-foreground">
                  Teaching, speaking, peer relationships, and professional event moments.
                </p>
              </div>
              <EditorialMosaic
                assets={profileGalleryImages}
                captionMode="hidden"
                interactive
                layoutMode="columns"
                onSelect={(image) => setSelectedImage(image)}
              />
            </div>

            <Dialog
              open={Boolean(selectedImage)}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedImage(null);
                }
              }}
            >
              <DialogContent className="max-w-5xl border-none bg-black/90 p-0 text-white">
                {selectedImage ? (
                  <>
                    <DialogTitle className="sr-only">{selectedImage.alt}</DialogTitle>
                    <DialogDescription className="sr-only">{selectedImage.alt}</DialogDescription>
                    <div className="relative h-[70vh] w-full">
                      <Image
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        fill
                        sizes="100vw"
                        className="rounded-t-lg object-contain"
                        style={{ objectPosition: selectedImage.objectPosition ?? "center" }}
                      />
                    </div>
                    <div className="space-y-2 px-6 pb-6">
                      <p className="text-base font-semibold">{selectedImage.alt}</p>
                      {selectedImage.caption ? (
                        <p className="text-sm leading-relaxed text-white/80">{selectedImage.caption}</p>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </DialogContent>
            </Dialog>

            {/* Testimonials */}
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Client outcomes"
                title="What clients say"
                action={
                  <Button asChild variant="outline">
                    <Link href="/testimonials">View all stories</Link>
                  </Button>
                }
              />
              <div className="grid gap-5 md:grid-cols-2">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialListCard key={testimonial.slug} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className={`${panel}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Upcoming events</p>
                  <h2 className="font-serif text-xl font-semibold">Don&apos;t miss our latest educational opportunities</h2>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href="#past-events">View past events</a>
                </Button>
              </div>
            </div>

            {profileNewsImages.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="grid gap-0 xl:grid-cols-[0.86fr_1.14fr]">
                  <div className="space-y-4 p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Speaking proof</p>
                    <h2 className="text-balance font-serif text-2xl font-semibold">
                      Educational events that keep transition strategy practical
                    </h2>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      Dr. Njo&apos;s event work spans society presentations, small-group seminars, and transition-focused
                      educational programming — the public-facing side of the same advisory work clients hire him for
                      privately.
                    </p>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      The emphasis stays practical: helping dentists understand ownership timing, deal structure, practice
                      value, and the people-side realities that sit underneath every transition.
                    </p>
                  </div>
                  <div className="bg-surface p-4 md:p-6">
                    <EditorialMosaic assets={profileNewsImages} captionMode="below" />
                  </div>
                </div>
              </div>
            ) : null}

            {eventPrograms.map((program) => (
              <div key={program.slug} className={`${panel} space-y-4`}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {program.category}
                  </Badge>
                  <Badge>{program.registrationStatus}</Badge>
                  {program.scheduleLabel ? <Badge variant="outline">{program.scheduleLabel}</Badge> : null}
                </div>
                <h3 className="font-serif text-xl font-semibold">{program.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Next: {program.nextDateLabel}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {program.timeLabel}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {program.locationLabel}
                  </span>
                </div>

                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{program.description}</p>

                {program.highlights?.length ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">At this seminar, you&apos;ll discover how to:</p>
                    <ul className="space-y-2">
                      {program.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {program.upcomingDates?.length ? (
                  <div className="space-y-3 rounded-xl border border-border/70 bg-surface p-4">
                    <p className="text-sm font-semibold">Available dates &amp; locations</p>
                    <div className="grid gap-3 md:grid-cols-3">
                      {program.upcomingDates.map((date) => (
                        <article key={`${program.slug}-${date.startDateTime}`} className="rounded-lg border border-border/70 bg-card p-3">
                          <p className="text-sm font-medium">{date.dateLabel}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{date.timeLabel}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{date.location}</p>
                        </article>
                      ))}
                    </div>
                    {program.completedEventsLabel ? (
                      <p id="past-events" className="text-sm text-muted-foreground">
                        {program.completedEventsLabel}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {program.callToAction ? (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <a href={`tel:${program.callToAction.phone}`} className="inline-flex items-center gap-2">
                        <PhoneCall className="h-4 w-4" />
                        Call or text to register
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`mailto:${program.callToAction.email}`} className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email us to register
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}

            <div className={`${panel} space-y-3`}>
              <h3 className="font-serif text-lg font-semibold">Media &amp; speaking</h3>
              <p className="text-sm text-muted-foreground">
                Dr. Njo is frequently asked to provide transition guidance for dental professionals.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <BookingButton />
                <Button asChild variant="outline">
                  <Link href={CONTACT_PATH} className="inline-flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4" />
                    Contact Dr. Njo
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>

      {/* Final CTA */}
      <Section tone="brand" spacing="compact">
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-white sm:text-3xl">
            Let&apos;s talk about your practice
          </h2>
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
