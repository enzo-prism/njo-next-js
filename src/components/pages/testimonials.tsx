"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalReviewGallery } from "@/components/testimonials/external-review-gallery";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { testimonialPages } from "@/data/testimonials";

type SortMode = "newest" | "alpha";

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
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Testimonials</p>
        <h1 className="text-4xl font-semibold">Testimonials for Dr. Michael Njo</h1>
        <p className="text-muted-foreground max-w-3xl">
          Real-world stories from dentists and healthcare professionals who partnered with Dr. Michael Njo for transitions,
          growth, and leadership support.
        </p>
      </section>

      <section>
        <ExternalReviewGallery />
      </section>

      <section>
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="inline-flex w-full max-w-lg items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
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
                  A-Z
                </Button>
              </div>
            </div>

            {query ? (
              <p className="text-sm text-muted-foreground">
                Showing {filteredTestimonials.length} of {testimonialPages.length} testimonials.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </section>

      {filteredTestimonials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialListCard key={`${testimonial.author}-${testimonial.slug}`} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No matching testimonials</CardTitle>
            <CardDescription>Try a different name or clear your search.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/contact">Work with Michael Njo, DDS</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
