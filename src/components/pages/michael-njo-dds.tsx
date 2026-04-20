"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Mail, MapPin, MessageSquareQuote, PhoneCall } from "lucide-react";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contactDetails, services } from "@/seo/structured-data";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditorialMosaic } from "@/components/media/editorial-mosaic";

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

  return (
    <>
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <p className="sr-only">Background</p>
          <p className="text-sm font-medium text-muted-foreground">Consulting Profile</p>
          <h1 className="text-4xl font-semibold">Dr. Michael Njo</h1>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            Founder of Dental Strategies, HealthcareStrategiesMD, Business Strategies, and Practice Transitions Institute, mentoring
            healthcare owners through ownership, growth, and transitions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href={`mailto:${contactDetails.email}`}>Send an email</a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Request Consultation</Link>
            </Button>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card>
                <CardHeader>
                  <CardTitle>About Dr. Michael Njo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Image
                    src={dugoniCollaborationImage.src}
                    sizes={dugoniCollaborationImage.sizes}
                    alt={dugoniCollaborationImage.alt}
                    width={dugoniCollaborationImage.width}
                    height={dugoniCollaborationImage.height}
                    className="mx-auto h-64 w-64 rounded-2xl object-cover object-center"
                  />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A practitioner-turned-consultant with deep private practice experience, Dr. Njo helps healthcare owners design
                    resilient systems for team execution, growth strategy, and transitions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <p className="sr-only">Services</p>
                  <CardTitle>Core services</CardTitle>
                  <CardDescription>Practice launches, management, and transition work</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {services.map((service) => (
                    <div key={service.name} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{service.name}</p>
                        <Badge variant="secondary">Service</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {organizations.map((org) => (
                  <div key={org.title} className="rounded-lg border border-border p-4">
                    <p className="font-medium">{org.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{org.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
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

                <div className="space-y-4 p-6 md:p-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Residency education and speaking</p>
                    <h2 className="text-2xl font-semibold">Guiding GPR residents through real-world transition strategy</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Dr. Njo regularly brings practical ownership and transition insight into academic and residency settings. In this
                    General Practice Residency (GPR) presentation, residents held copies of <em>Dental Practice Transitions
                    Handbook</em> while discussing career pathways, partnership structures, and long-term practice planning.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    That bridge between education and execution is central to his impact. Dr. Njo helps early-career dentists
                    understand how leadership, valuation, operations, and exit planning shape the future of a practice long before a
                    transition is on the calendar.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold">Guest lecturer</p>
                      <p className="mt-1 text-sm text-muted-foreground">Dental residency and professional programs</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold">Published author</p>
                      <p className="mt-1 text-sm text-muted-foreground">Dental Practice Transitions Handbook</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold">Career mentor</p>
                      <p className="mt-1 text-sm text-muted-foreground">Ownership, growth, and transition guidance</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{gprResidencyPresentationImage.caption}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                      <Link href="/resources">Explore resources</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="grid gap-0 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-4 p-6 md:p-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Relationships, recognition, and leadership</p>
                    <h2 className="text-2xl font-semibold">Trust that shows up in rooms where reputation matters</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Dr. Njo&apos;s advisory work is not built on abstract positioning alone. It is reinforced by longstanding
                    relationships with peers, collaborators, and healthcare leaders who continue to invite him into conversations
                    about growth, transitions, and professional stewardship.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    These moments are not presented as lifestyle filler. They show the caliber of network, trust, and industry
                    presence that surrounds Michael&apos;s work when clients are looking for judgment as much as technical guidance.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold">Peer trust</p>
                      <p className="mt-1 text-sm text-muted-foreground">Relationships that outlast single deals and one-time projects.</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold">Visible credibility</p>
                      <p className="mt-1 text-sm text-muted-foreground">Professional settings where reputation and discretion matter.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100/70 p-4 md:p-6">
                  <EditorialMosaic assets={profileRelationshipImages} captionMode="below" />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expanded Leadership Gallery</CardTitle>
                <CardDescription>
                  A metadata-driven gallery of teaching, speaking, peer relationships, and professional event moments.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <div className="px-4 pb-4">
                  <EditorialMosaic
                    assets={profileGalleryImages}
                    captionMode="hidden"
                    interactive
                    layoutMode="columns"
                    onSelect={(image) => setSelectedImage(image)}
                  />
                </div>
              </CardContent>
            </Card>

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

            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialListCard key={testimonial.slug} testimonial={testimonial} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Upcoming Events</p>
                    <CardTitle>Don&apos;t miss our latest educational opportunities</CardTitle>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href="#past-events">View Past Events</a>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden">
              <div className="grid gap-0 xl:grid-cols-[0.86fr_1.14fr]">
                <div className="space-y-4 p-6 md:p-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Speaking proof</p>
                    <h2 className="text-2xl font-semibold">Educational events that keep transition strategy practical</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Dr. Njo&apos;s event work spans society presentations, small-group seminars, and transition-focused educational
                    programming. These materials show the public-facing side of the same advisory work clients hire him for
                    privately.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The emphasis stays practical: helping dentists understand ownership timing, deal structure, practice value, and
                    the people-side realities that sit underneath every transition.
                  </p>
                </div>

                <div className="bg-slate-100/70 p-4 md:p-6">
                  <EditorialMosaic assets={profileNewsImages} captionMode="below" />
                </div>
              </div>
            </Card>

            {eventPrograms.map((program) => (
              <Card key={program.slug}>
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {program.category}
                    </Badge>
                    <Badge>{program.registrationStatus}</Badge>
                    {program.scheduleLabel ? (
                      <Badge variant="outline">{program.scheduleLabel}</Badge>
                    ) : null}
                  </div>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Next: {program.nextDateLabel}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5" />
                      {program.timeLabel}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {program.locationLabel}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{program.description}</p>

                  {program.highlights?.length ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">At this seminar, you&apos;ll discover how to:</p>
                      <ul className="space-y-2">
                        {program.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {program.upcomingDates?.length ? (
                    <div className="space-y-3 rounded-lg border border-border p-4">
                      <p className="text-sm font-semibold">Available Dates &amp; Locations</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        {program.upcomingDates.map((date) => (
                          <article key={`${program.slug}-${date.startDateTime}`} className="rounded-md border border-border/80 p-3">
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
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>Media & Speaking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Media & Speaking</p>
                  <p className="mt-1">Dr. Njo is frequently asked to provide transition guidance for dental professionals.</p>
                  <Separator className="my-3" />
                  <Button asChild>
                    <Link href="/contact" className="inline-flex items-center gap-2">
                      <MessageSquareQuote className="h-4 w-4" />
                      Request booking details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
