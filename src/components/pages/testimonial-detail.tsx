import Link from "next/link";
import { CalendarDays, ArrowLeft, ArrowRight, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialListCard } from "@/components/testimonials/testimonial-card";
import { LEGACY_TESTIMONIAL_SLUGS } from "@/config/routes";
import { type TestimonialPage, testimonialPages } from "@/data/testimonials";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type TestimonialDetailProps = {
  slug: string;
};

type StarCountProps = {
  count: number;
  total?: number;
};

const StarCount = ({ count, total = 5 }: StarCountProps) => (
  <div className="mt-2 flex items-center gap-1" aria-label={`${count} out of ${total} stars`}>
    {Array.from({ length: total }).map((_, index) => (
      <Star
        key={`${index}-${count}`}
        className={`h-4 w-4 ${index < count ? "fill-current text-amber-500" : "text-slate-300"}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

export default function TestimonialDetailPage({ slug: requestedSlug }: TestimonialDetailProps) {
  const slug = LEGACY_TESTIMONIAL_SLUGS[requestedSlug] || requestedSlug;
  const index = testimonialPages.findIndex((item) => item.slug === slug);
  const testimonial = index >= 0 ? testimonialPages[index] : null;

  const previous = index > 0 ? testimonialPages[index - 1] : null;
  const next = index >= 0 && index < testimonialPages.length - 1 ? testimonialPages[index + 1] : null;

  const related = (() => {
    if (!testimonial) return [];

    const seen = new Set<string>([testimonial.slug]);
    return testimonialPages
      .filter((item) => !seen.has(item.slug))
      .slice(0, 4)
      .map((item) => ({ ...item }));
  })();

  if (!testimonial) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Testimonial not found</CardTitle>
            <CardDescription>The story you requested is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/testimonials">Back to testimonials</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

    return (
      <div className="space-y-8">
        <h1 className="sr-only">Testimonial from {testimonial.author}</h1>
        <Card>
        <CardHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/testimonials">Testimonials</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{testimonial.author}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <CardTitle className="text-3xl">Testimonial from {testimonial.author}</CardTitle>
          <CardDescription>Primary quote and outcome</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-slate-700">{testimonial.quote}</p>
          <StarCount count={testimonial.stars} />
          <p className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Verified client story
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Related testimonials</h2>
          <Button asChild size="sm" variant="outline">
            <Link href="/testimonials">See all stories</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {previous ? <TestimonialListCard testimonial={previous} /> : null}
          {next ? <TestimonialListCard testimonial={next} /> : null}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">More from the collection</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item: TestimonialPage) => (
              <TestimonialListCard key={item.slug} testimonial={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/contact" className="inline-flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Start a consultation
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/testimonials" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to testimonials
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
