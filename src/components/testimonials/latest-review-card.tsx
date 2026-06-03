import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { TestimonialPage } from "@/data/testimonials";
import { cn } from "@/lib/utils";

type LatestReviewCardProps = {
  testimonial: TestimonialPage;
  className?: string;
};

/**
 * Compact social-proof card for the homepage hero. Surfaces the most recent
 * 5-star client review: the rating plus the opening of the written review
 * (the date is intentionally omitted), linking out to the full testimonial.
 */
export function LatestReviewCard({ testimonial, className }: LatestReviewCardProps) {
  return (
    <figure
      className={cn(
        "rounded-2xl border border-border/70 bg-surface p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="flex items-center gap-0.5 text-amber-500"
          aria-label={`Rated ${testimonial.stars} out of 5 stars`}
        >
          {Array.from({ length: testimonial.stars }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
          ))}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Latest client review
        </span>
      </div>

      <blockquote className="mt-3 text-pretty font-serif text-[15px] leading-relaxed text-foreground/90">
        “{testimonial.excerpt}”
      </blockquote>

      <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-sm">
        <span className="font-semibold text-foreground">{testimonial.author}</span>
        <Link
          href={`/testimonials/${testimonial.slug}`}
          className="inline-flex shrink-0 items-center gap-1 font-medium text-brand transition-colors hover:text-brand/70"
        >
          Read full review
          <ArrowRight className="h-4 w-4" />
        </Link>
      </figcaption>
    </figure>
  );
}
