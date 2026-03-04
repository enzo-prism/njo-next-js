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
import { dugoniCollaborationImage, njoLifeGalleryImages } from "@/data/media";
import { eventPrograms } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type GalleryImage = (typeof njoLifeGalleryImages)[number];

export default function MichaelNjoDDS() {
  const featuredTestimonials = testimonialPages.slice(0, 6);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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

            <Card>
              <CardHeader>
                <CardTitle>Life & Leadership in Media</CardTitle>
                <CardDescription>A visual timeline of speaking, mentoring, and leadership moments.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                  {njoLifeGalleryImages.slice(0, 9).map((image) => (
                    <button
                      key={image.src}
                      type="button"
                      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-card text-left"
                      aria-label={image.alt}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={image.sizes}
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/15"
                        aria-hidden="true"
                      />
                      <span
                        className="pointer-events-none absolute right-2 bottom-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      >
                        Open
                      </span>
                    </button>
                  ))}
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
                    <div className="relative h-[80vh] w-full">
                      <Image
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        fill
                        sizes="100vw"
                        className="rounded-t-lg object-contain"
                        priority
                      />
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
