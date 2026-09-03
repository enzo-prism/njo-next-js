"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquareQuote,
} from "lucide-react";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { EventOccurrenceDetails } from "@/components/events/event-occurrence-details";
import { getUpcomingEventPrograms } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { EditorialMosaic } from "@/components/media/editorial-mosaic";
import { BookingButton } from "@/components/booking-button";
import { DsoPricingCallout } from "@/components/dso-pricing-callout";
import { CONTACT_PATH } from "@/config/site";
import {
  buildProfileTabPath,
  resolveProfileTab,
  type ProfileTab,
} from "@/lib/profile-tabs";

const panel =
  "rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-7";

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

function getTabFromLocation() {
  return resolveProfileTab(window.location.search, window.location.hash);
}

export default function MichaelNjoDDS({
  referenceDateIso,
  initialTab = "overview",
}: {
  referenceDateIso: string;
  initialTab?: ProfileTab;
}) {
  const featuredTestimonials = testimonialPages.slice(0, 6);
  const upcomingEventPrograms = getUpcomingEventPrograms(
    new Date(referenceDateIso),
  );
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [selectedImage, setSelectedImage] =
    useState<EditorialMediaAsset | null>(null);
  const [qaCaptions, setQaCaptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/photo-captions", {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as {
          photos?: { id: string; liveCaption: string | null }[];
        };
        const next: Record<string, string> = {};
        for (const photo of payload.photos ?? []) {
          if (photo.liveCaption?.trim()) {
            next[photo.id] = photo.liveCaption.trim();
          }
        }
        setQaCaptions(next);
      })
      .catch(() => {
        // Inventory captions stay hidden until a QA save is available.
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const syncTabFromLocation = () => setActiveTab(getTabFromLocation());
    syncTabFromLocation();
    window.addEventListener("popstate", syncTabFromLocation);
    window.addEventListener("hashchange", syncTabFromLocation);
    return () => {
      window.removeEventListener("popstate", syncTabFromLocation);
      window.removeEventListener("hashchange", syncTabFromLocation);
    };
  }, []);

  const handleTabChange = (nextTab: string) => {
    const tab: ProfileTab = nextTab === "news" ? "news" : "overview";
    setActiveTab(tab);
    window.history.pushState(
      {},
      "",
      buildProfileTabPath({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        tab,
      }),
    );
  };

  useEffect(() => {
    if (activeTab !== "news") return;
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const timer = window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [activeTab]);

  return (
    <>
      <Container className="space-y-12 py-10 sm:py-14">
        {/* Hero */}
        <section className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Consulting profile
          </p>
          <h1 className="text-balance font-serif text-4xl font-semibold sm:text-5xl">
            Dr. Michael Njo
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Founder of Dental Strategies, HealthcareStrategiesMD, Business
            Strategies, and Practice Transitions Institute — mentoring
            healthcare owners through ownership, growth, and transitions.
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

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-8"
        >
          <TabsList className="mx-auto grid h-11 min-h-11 w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview" className="min-h-11">
              Overview
            </TabsTrigger>
            <TabsTrigger value="news" className="min-h-11">
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className={`${panel} space-y-4`}>
                <h2 className="font-serif text-xl font-semibold">
                  About Dr. Michael Njo
                </h2>
                <Image
                  src={dugoniCollaborationImage.src}
                  sizes={dugoniCollaborationImage.sizes}
                  alt={dugoniCollaborationImage.alt}
                  width={dugoniCollaborationImage.width}
                  height={dugoniCollaborationImage.height}
                  className="mx-auto h-auto w-full max-w-64 rounded-2xl object-contain"
                />
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  A practitioner-turned-consultant with deep private practice
                  experience, Dr. Njo helps healthcare owners design resilient
                  systems for team execution, growth strategy, and transitions.
                </p>
              </div>

              <div className={`${panel} space-y-4`}>
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-semibold">
                    Core services
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Practice launches, management, and transition work
                  </p>
                </div>
                <div className="grid gap-3">
                  {services.map((service) => (
                    <div
                      key={service.name}
                      className="rounded-xl border border-border/70 bg-surface p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {service.name}
                        </p>
                        <Badge variant="secondary">Service</Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${panel} space-y-4`}>
              <h2 className="font-serif text-xl font-semibold">
                Organizations
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {organizations.map((org) => (
                  <div
                    key={org.title}
                    className="rounded-xl border border-border/70 bg-surface p-4"
                  >
                    <p className="font-medium text-foreground">{org.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {org.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <DsoPricingCallout />

            {/* Residency feature */}
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div className="relative aspect-[4/3] bg-surface">
                  <Image
                    src={gprResidencyPresentationImage.src}
                    alt={gprResidencyPresentationImage.alt}
                    sizes={gprResidencyPresentationImage.sizes}
                    fill
                    className="object-contain"
                    style={{
                      objectPosition:
                        gprResidencyPresentationImage.objectPosition ??
                        "center",
                    }}
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
                    Dr. Njo regularly brings practical ownership and transition
                    insight into academic and residency settings. In this
                    General Practice Residency (GPR) presentation, residents
                    held copies of <em>Dental Practice Transitions Handbook</em>{" "}
                    while discussing career pathways, partnership structures,
                    and long-term practice planning.
                  </p>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    That bridge between education and execution is central to
                    his impact. Dr. Njo helps early-career dentists understand
                    how leadership, valuation, operations, and exit planning
                    shape the future of a practice long before a transition is
                    on the calendar.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        title: "Guest lecturer",
                        body: "Dental residency and professional programs",
                      },
                      {
                        title: "Published author",
                        body: "Dental Practice Transitions Handbook",
                      },
                      {
                        title: "Career mentor",
                        body: "Ownership, growth, and transition guidance",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-border/70 bg-surface p-3"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
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
                      Dr. Njo&apos;s advisory work is reinforced by longstanding
                      relationships with peers, collaborators, and healthcare
                      leaders who continue to invite him into conversations
                      about growth, transitions, and professional stewardship.
                    </p>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      These moments show the caliber of network, trust, and
                      industry presence that surrounds Michael&apos;s work when
                      clients are looking for judgment as much as technical
                      guidance.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/70 bg-surface p-3">
                        <p className="text-sm font-semibold text-foreground">
                          Peer trust
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Relationships that outlast single deals.
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-surface p-3">
                        <p className="text-sm font-semibold text-foreground">
                          Visible credibility
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Settings where reputation and discretion matter.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface p-4 md:p-6">
                    <EditorialMosaic
                      assets={profileRelationshipImages}
                      qaCaptions={qaCaptions}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Gallery */}
            <div className={`${panel}`}>
              <div className="mb-6 space-y-1">
                <h2 className="font-serif text-xl font-semibold">
                  Expanded leadership gallery
                </h2>
                <p className="text-sm text-muted-foreground">
                  Teaching, speaking, peer relationships, and professional event
                  moments.
                </p>
              </div>
              <EditorialMosaic
                assets={profileGalleryImages}
                interactive
                layoutMode="columns"
                qaCaptions={qaCaptions}
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
                    <DialogTitle className="sr-only">
                      {selectedImage.alt}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      {qaCaptions[selectedImage.id] || selectedImage.alt}
                    </DialogDescription>
                    <div className="relative h-[70vh] w-full">
                      <Image
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        fill
                        sizes="100vw"
                        className="rounded-lg object-contain"
                        style={{
                          objectPosition:
                            selectedImage.objectPosition ?? "center",
                        }}
                      />
                    </div>
                    {qaCaptions[selectedImage.id] ? (
                      <p className="px-5 py-4 text-sm leading-6 text-white/85">
                        {qaCaptions[selectedImage.id]}
                      </p>
                    ) : null}
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
                  <TestimonialListCard
                    key={testimonial.slug}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <article
              id="diana-fat-board-of-regents"
              className={`${panel} scroll-mt-28 space-y-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                August 28, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                Dr. Diana Fat appointed to the University of the Pacific Board
                of Regents
              </h2>
              <Image
                src="/media/diana-fat-board-of-regents.webp"
                alt="Dr. Michael Njo and Dr. Diana Fat standing in her Sacramento dental office, with a graphic announcing her appointment to the University of the Pacific Board of Regents."
                width={1003}
                height={1568}
                className="h-auto w-full max-w-md rounded-xl bg-slate-50 object-contain"
                sizes="(min-width: 768px) 448px, 100vw"
                priority
              />
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                I am so proud to congratulate my longtime client of more than 20
                years, Dr. Diana Fat, a distinguished Sacramento prosthodontist,
                on her appointment to the University of the Pacific Board of
                Regents.
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Diana continues to make a meaningful difference in dentistry, in
                her community, and now for our alma mater. Congratulations,
                Diana—this honor is so well deserved!
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                #UniversityOfThePacific #BoardOfRegents #PacificProud
                #DentalLeadership
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/diana-fat-board-of-regents">
                    Read the full story
                  </Link>
                </Button>
              </div>
            </article>

            <article
              id="practice-blueprint-roseville-aug-2026"
              className={`${panel} scroll-mt-28 space-y-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                August 28, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                The Practice Blueprint dinner
              </h2>
              <Image
                src="/media/poe-roseville-aug-2026.webp"
                alt="The Practice Blueprint recap collage from an exclusive dinner with industry leaders, showing a restaurant table, a standing group, and black-and-white shots of the welcome sign, table setting, branded notebook, and gift bags."
                width={864}
                height={1821}
                className="h-auto w-full max-w-md rounded-xl bg-slate-50 object-contain"
                sizes="(min-width: 768px) 448px, 100vw"
                priority
              />
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Great night with great Dentists and referral partners! Thank you
                Provide, Patterson, Kohan, and Carr for including me at this
                vibrant event. It is so fun to enjoy an evening with Dentists
                who have dreams and a team that can realize those dreams!
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Thank you to my dear friend, colleague, and long time client Dr.
                Diana Fat for welcoming us to her family restaurant.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/practice-blueprint-roseville-aug-2026">
                    Read the full story
                  </Link>
                </Button>
              </div>
            </article>

            <article
              id="another-perfect-match"
              className={`${panel} scroll-mt-28 space-y-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                August 25, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                Another perfect match
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Image
                  src="/media/bill-mikki-porch.webp"
                  alt="Young woman and older man smiling on the brick porch of a house numbered 257."
                  width={1199}
                  height={1600}
                  className="h-auto w-full rounded-xl bg-slate-50 object-contain"
                  sizes="(min-width: 768px) 360px, 100vw"
                  priority
                />
                <Image
                  src="/media/bill-mikki-trio.webp"
                  alt="Three people smiling outdoors in front of a burgundy building."
                  width={1200}
                  height={1600}
                  className="h-auto w-full rounded-xl bg-slate-50 object-contain"
                  sizes="(min-width: 768px) 360px, 100vw"
                />
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Another perfect match! So excited to have both of my clients
                matched- with my former Dugoni Business Club Student with an
                accomplished practitioner!
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Bill and Mikki, thank you for your incredibly thoughtful words
                and for trusting me to help guide such an important transition.
                It was truly an honor to support you in finding the right
                successor for the practice, patients, team, and legacy you
                worked so hard to build.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/another-perfect-match">
                    Read the full story
                  </Link>
                </Button>
              </div>
            </article>

            <article
              id="beyond-the-chair-anaheim"
              className={`${panel} scroll-mt-28 space-y-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                September 25, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                The Dental Practice Beyond the Chair
              </h2>
              <Image
                src="/media/promotional-flyer-dental-strategies.webp"
                alt="Promotional flyer for The Dental Practice Beyond the Chair, a September 25, 2026 working session in Anaheim led by Michael A. Njo, DDS"
                width={1414}
                height={2000}
                className="h-auto w-full max-w-md rounded-xl bg-slate-50 object-contain"
                sizes="(min-width: 768px) 448px, 100vw"
                priority
              />
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                A 5-hour working session for dentists and practice owners.
                Building Enterprise Value, Intellectual Property, Wealth, and
                Legacy.
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                September 25, 2026, 8:30 AM – 1:30 PM at The Phillips Group,
                2300 E. Katella Ave, Suite 405, Anaheim, CA. Led by Michael A.
                Njo, DDS, Director, Dental Strategies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <a
                    href="https://practicetransitionsinstitute.com/events"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View current event details at PTI
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/beyond-the-chair-anaheim">
                    Read the full story
                  </Link>
                </Button>
              </div>
            </article>

            <article
              id="panel-of-experts-dinner"
              className={`${panel} scroll-mt-28 space-y-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                August 14, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                Panel of Experts dinner
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <Image
                  src="/media/IMG_4918.webp"
                  alt="Dr. Michael Njo with dentists and referral partners at the Panel of Experts dinner"
                  width={1600}
                  height={2133}
                  className="h-auto w-full rounded-xl bg-slate-50 object-contain"
                  sizes="(min-width: 768px) 240px, 100vw"
                />
                <Image
                  src="/media/IMG_4923.webp"
                  alt="Dr. Michael Njo autographing Dental Practice Transitions Handbook at the Panel of Experts dinner"
                  width={1600}
                  height={2133}
                  className="h-auto w-full rounded-xl bg-slate-50 object-contain"
                  sizes="(min-width: 768px) 240px, 100vw"
                />
                <Image
                  src="/media/IMG_3346.webp"
                  alt="Panel of Experts dinner table with dentists and referral partners"
                  width={1600}
                  height={2133}
                  className="h-auto w-full rounded-xl bg-slate-50 object-contain"
                  sizes="(min-width: 768px) 240px, 100vw"
                />
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Great night with great Dentists and referral partners! Thank you
                Provide, Patterson, Sarv Designs, and Carr for including me at
                this vibrant event. It is so fun to enjoy an evening with
                Dentists who have dreams and a team that can realize those
                dreams! The Practice Blueprint dinner followed on August 27 in
                Roseville.
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                It was also an honor to autograph the{" "}
                <em>Dental Practice Transitions Handbook</em> at the dinner. Dr.
                Njo&apos;s newest publishing collaboration,{" "}
                <em>The Dental Exit Blueprint</em>, was released July 15, 2026.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/blog/panel-of-experts-dinner-roseville">
                  Read the full story
                </Link>
              </Button>
            </article>

            <article
              id="industry-leaders"
              className={`${panel} scroll-mt-28 space-y-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                August 13, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                An Amazing 4 days with Industry leaders!!!
              </h2>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                An Amazing 4 days with Industry leaders!!!
              </p>
              <div className="mx-auto w-full max-w-[540px] overflow-hidden rounded-xl border border-border/70 bg-surface">
                <iframe
                  src="https://www.instagram.com/reel/Db9NKdHJAk2/embed"
                  title="Instagram reel: An Amazing 4 days with Industry leaders"
                  width="100%"
                  height="720"
                  allow="encrypted-media; clipboard-write"
                  loading="lazy"
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Video credit:{" "}
                <a
                  href="https://www.instagram.com/reel/Db9NKdHJAk2/"
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  @backstagedentistry
                </a>{" "}
                on Instagram.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/blog/amazing-4-days-with-industry-leaders">
                  Read the full story
                </Link>
              </Button>
            </article>

            <div id="upcoming-events" className={`${panel} scroll-mt-28`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    Upcoming events
                  </p>
                  <h2 className="font-serif text-xl font-semibold">
                    Don&apos;t miss our latest educational opportunities
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://practicetransitionsinstitute.com/events"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full schedule at PTI
                  </a>
                </Button>
              </div>
            </div>

            {profileNewsImages.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="grid gap-0 xl:grid-cols-[0.86fr_1.14fr]">
                  <div className="space-y-4 p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                      Speaking proof
                    </p>
                    <h2 className="text-balance font-serif text-2xl font-semibold">
                      Educational events that keep transition strategy practical
                    </h2>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      Dr. Njo&apos;s event work spans society presentations,
                      small-group seminars, and transition-focused educational
                      programming — the public-facing side of the same advisory
                      work clients hire him for privately.
                    </p>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      The emphasis stays practical: helping dentists understand
                      ownership timing, deal structure, practice value, and the
                      people-side realities that sit underneath every
                      transition.
                    </p>
                  </div>
                  <div className="bg-surface p-4 md:p-6">
                    <EditorialMosaic
                      assets={profileNewsImages}
                      qaCaptions={qaCaptions}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {upcomingEventPrograms.map((program) => (
              <div key={program.slug} className={`${panel} space-y-4`}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {program.category}
                  </Badge>
                  <Badge>{program.registrationStatus}</Badge>
                  {program.scheduleLabel ? (
                    <Badge variant="outline">{program.scheduleLabel}</Badge>
                  ) : null}
                </div>
                <h3 className="font-serif text-xl font-semibold">
                  {program.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Next: {program.nextDateLabel}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {program.timeLabel}
                  </span>
                  <span className="inline-flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {program.nextOccurrence.location}
                  </span>
                </div>

                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>

                {program.highlights?.length ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">
                      At this seminar, you&apos;ll discover how to:
                    </p>
                    <ul className="space-y-2">
                      {program.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {program.upcomingDates?.length ? (
                  <div className="space-y-3 rounded-xl border border-border/70 bg-surface p-4">
                    <p className="text-sm font-semibold">
                      Available dates &amp; locations
                    </p>
                    <div className="grid gap-3 md:grid-cols-3">
                      {program.upcomingDates.map((date) => (
                        <article
                          key={`${program.slug}-${date.startDateTime}`}
                          id={date.id}
                          className={`scroll-mt-28 space-y-3 rounded-lg border border-border/70 bg-card p-3 ${
                            date.flyerImage ? "md:col-span-2" : ""
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {date.dateLabel}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {date.timeLabel}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {date.location}
                          </p>
                          <EventOccurrenceDetails
                            occurrence={date}
                            referenceDate={new Date(referenceDateIso)}
                          />
                          {date.registrationPhoneDisplay &&
                          date.registrationPhone ? (
                            <p className="text-sm text-muted-foreground">
                              Register by phone{" "}
                              <a
                                href={`tel:${date.registrationPhone}`}
                                className="font-medium text-brand underline-offset-2 hover:underline"
                              >
                                {date.registrationPhoneDisplay}
                              </a>
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                    {program.completedEventsLabel ? (
                      <p className="text-sm text-muted-foreground">
                        {program.completedEventsLabel}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {program.registrationUrl ? (
                  <Button asChild size="sm">
                    <a
                      href={program.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current event details at PTI
                    </a>
                  </Button>
                ) : (
                  <Button asChild size="sm">
                    <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
                  </Button>
                )}
              </div>
            ))}

            {upcomingEventPrograms.length === 0 ? (
              <div className={`${panel} space-y-3`}>
                <h3 className="font-serif text-lg font-semibold">
                  No upcoming dates are currently published
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visit Practice Transitions Institute for the latest seminar
                  and education schedule.
                </p>
                <Button asChild variant="outline">
                  <a
                    href="https://practicetransitionsinstitute.com/events"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PTI events
                  </a>
                </Button>
              </div>
            ) : null}

            <div className={`${panel} space-y-3`}>
              <h3 className="font-serif text-lg font-semibold">
                Media &amp; speaking
              </h3>
              <p className="text-sm text-muted-foreground">
                Dr. Njo is frequently asked to provide transition guidance for
                dental professionals.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <BookingButton />
                <Button asChild variant="outline">
                  <Link
                    href={CONTACT_PATH}
                    className="inline-flex items-center gap-2"
                  >
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
