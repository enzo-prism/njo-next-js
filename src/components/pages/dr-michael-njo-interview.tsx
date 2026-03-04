"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Copy, Link2, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const videoUrl = "https://res.cloudinary.com/dhqpqfw6w/video/upload/v1771798426/drnjo_avytsr.mp4";
const sharePageUrl = "https://michaelnjodds.com/dr-michael-njo-interview";
const shareHeadline = "Helping Dentists Thrive Through Every Stage of Their Career";
const shareText = `Watch this featured conversation with Dr. Michael Njo on practice transitions, management, and legal guidance for dentists.`;

const corePrinciples = [
  {
    title: "Pro Quality of Life",
    description: "Success should elevate life balance, not replace it.",
  },
  {
    title: "Pro Work-Life Balance",
    description: "Practice systems should protect leadership bandwidth, relationships, and health.",
  },
  {
    title: "Pro Family",
    description: "Family stability and well-being are design requirements, not afterthoughts.",
  },
];

const expertiseAreas = [
  {
    title: "Practice Transitions",
    bullets: ["Buy practices", "Sell practices", "Partnership restructuring", "Practice expansion"],
  },
  {
    title: "Management Consulting",
    bullets: ["Culture building", "Team alignment", "Leadership development", "Operational clarity"],
  },
  {
    title: "Legal Navigation",
    bullets: ["Partner disputes", "Labor and compliance", "Risk management", "Transition contracts"],
  },
];

const audiencePoints = [
  "Dentists navigating major career decisions",
  "Owners focused on long-term transition planning",
  "Leaders committed to sustainable team culture",
  "Professionals balancing growth with personal health",
];

export default function DrMichaelNjoInterview() {
  const [copied, setCopied] = useState(false);

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(sharePageUrl);
    const encodedHeadline = encodeURIComponent(shareHeadline);
    const encodedText = encodeURIComponent(`${shareText} ${sharePageUrl}`);
    const encodedMailSubject = encodeURIComponent("Dr. Michael Njo Interview");

    return [
      {
        label: "Share on X",
        href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      },
      {
        label: "Share on LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      },
      {
        label: "Share on Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
        label: "Email",
        href: `mailto:?subject=${encodedMailSubject}&body=${encodedHeadline}%0A${encodedUrl}`,
      },
    ];
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(sharePageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1700);
    } catch {
      window.prompt("Copy this link:", sharePageUrl);
    }
  };

  return (
    <>
      <div className="space-y-10">
        <h1 className="sr-only">Dr. Michael Njo Interview | Dental Practice Transitions &amp; Consulting</h1>
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Featured Conversation</p>
              <p className="sr-only">Full Interview</p>
              <CardTitle className="text-3xl md:text-4xl">Helping Dentists Thrive Through Every Stage of Their Career</CardTitle>
              <CardDescription>
                Learn how Dr. Njo applies practical transition principles in long-cycle ownership, growth, and legal transitions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interviewed by Dr. Farokh Jiveh, Dr. Michael Njo shares the framework he used moving from clinical dentistry
                to building a high-trust consulting practice.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#interview-video" className="inline-flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Watch interview
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Schedule consultation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share this interview</CardTitle>
              <CardDescription>Quick actions for your team and workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button type="button" onClick={copyLink} variant="outline" className="inline-flex items-center gap-2">
                <Copy className="h-4 w-4" />
                {copied ? "Link copied" : "Copy interview link"}
              </Button>
              {shareLinks.map((share) => (
                <Button key={share.label} asChild variant="secondary" size="sm">
                  <a href={share.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    {share.label}
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card id="interview-video">
          <CardHeader>
            <CardTitle>Full conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border bg-black">
              <video controls className="h-auto w-full bg-black" preload="metadata" playsInline>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Direct link: {sharePageUrl}</p>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
          {corePrinciples.map((principle) => (
            <Card key={principle.title}>
              <CardHeader>
                <CardTitle className="text-lg">{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {expertiseAreas.map((area) => (
            <Card key={area.title}>
              <CardHeader>
                <CardTitle>{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {area.bullets.map((bullet) => (
                    <li key={bullet} className="ml-4 list-disc">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Detailed interview notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="audience">
                <AccordionTrigger>Who this is for</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {audiencePoints.map((point) => (
                      <li key={point} className="ml-4 list-disc">
                        {point}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="summary">
                <AccordionTrigger>Core summary</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    This conversation balances practical legal preparedness with operational execution, with a strong emphasis on
                    communication rhythm, team alignment, and values-driven growth.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <section className="text-center">
          <Button asChild>
            <Link href="/contact" className="inline-flex items-center gap-2">
              Final step: book a consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
