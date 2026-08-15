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
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <article id="industry-leaders" className={`${panel} space-y-4`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">August 13, 2026</p>
              <h2 className="font-serif text-xl font-semibold">An Amazing 4 days with Industry leaders!!!</h2>
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
            </article>

            <article id="panel-of-experts-dinner" className={`${panel} space-y-4`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">August 14, 2026</p>
              <h2 className="font-serif text-xl font-semibold">Panel of Experts dinner</h2>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Great night with great Dentists and referral partners! Thank you Provide, Patterson, Sarv Designs, and Carr for including me at this vibrant event. It is so fun to enjoy an evening with Dentists who have dreams and a team that can realize those dreams! Looking forward to the next event in Roseville August 27th!
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                It is a honor to autograph my book at the Panel of Experts dinner- Practice Transitions Handbook. Stay tuned for my release of my second book this Month!!!
              </p>
            </article>

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
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
}
