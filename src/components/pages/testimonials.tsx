"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter, Quote, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { CONTACT_PATH } from "@/config/site";
import { testimonialPages } from "@/data/testimonials";

type SortMode = "newest" | "alpha";

const averageRating = (
  testimonialPages.reduce((total, item) => total + item.stars, 0) / testimonialPages.length
).toFixed(1);

const featuredTestimonials = [...testimonialPages]
  .sort((a, b) => b.excerpt.length - a.excerpt.length)
  .slice(0, 2);

export default function TestimonialsPage() {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [query, setQuery] = useState("");

  const filteredTestimonials = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = testimonialPages.filter((item) => item.author.toLowerCase().includes(q));

    if (sortMode === "alpha") {
      return [...base].sort((a, b) => a.author.localeCompare(b.author));
    }

    return base;
  }, [query, sortMode]);

  return (
    <>
      {/* Intro */}
      <Section spacing="none" className="pt-10 pb-10 sm:pt-14 sm:pb-12">
        <SectionHeading
          eyebrow="Testimonials"
          as="h1"
          title="Testimonials for Dr. Michael Njo"
          description="Real-world stories from dentists and healthcare professionals who partnered with Dr. Njo for transitions, growth, and leadership support."
        />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </span>
            {averageRating} average rating
          </span>
          <span>·</span>
          <span>{testimonialPages.length} client stories</span>
        </div>
      </Section>

      {/* Featured pull-quotes */}
      {!query ? (
        <Section tone="surface" spacing="compact" aria-label="Featured testimonials">
          <div className="grid gap-5 md:grid-cols-2">
            {featuredTestimonials.map((testimonial) => (
              <figure
                key={`featured-${testimonial.slug}`}
                className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-7 shadow-sm"
              >
                <Quote className="h-8 w-8 text-brand/25" aria-hidden="true" />
                <blockquote className="font-serif text-lg leading-relaxed text-foreground/90">
                  {testimonial.excerpt}
                </blockquote>
                <figcaption className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                    {testimonial.organization ? (
                      <p className="text-xs text-muted-foreground">{testimonial.organization}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/testimonials/${testimonial.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/70"
                  >
                    Read story
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Controls + grid */}
      <Section spacing="default">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="inline-flex w-full max-w-lg items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4 shrink-0" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by author"
                aria-label="Search testimonials by author"
              />
            </label>

            <div className="flex items-center gap-2" aria-label="Sort testimonials">
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Sort:
              </span>
              <Button size="sm" variant={sortMode === "newest" ? "default" : "outline"} onClick={() => setSortMode("newest")}>
                Newest
              </Button>
              <Button size="sm" variant={sortMode === "alpha" ? "default" : "outline"} onClick={() => setSortMode("alpha")}>
                A–Z
              </Button>
            </div>
          </div>

          {query ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTestimonials.length} of {testimonialPages.length} testimonials.
            </p>
          ) : null}
        </div>

        {filteredTestimonials.length > 0 ? (
          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialListCard
                key={`${testimonial.author}-${testimonial.slug}`}
                testimonial={testimonial}
                className="mb-5"
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
            <p className="font-serif text-lg font-semibold text-foreground">No matching testimonials</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different name or clear your search.</p>
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section tone="brand" spacing="compact">
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-white sm:text-3xl">
            Want results like these for your practice?
          </h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
