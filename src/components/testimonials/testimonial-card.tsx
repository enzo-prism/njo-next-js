import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";
import type { TestimonialPage, TestimonialSource } from "@/data/testimonials";
import { cn } from "@/lib/utils";

type TestimonialListCardProps = {
  testimonial: TestimonialPage;
  withLink?: boolean;
  className?: string;
};

const Rating = ({ value, max = 5 }: { value: number; max?: number }) => (
  <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${value} out of ${max} stars`}>
    {Array.from({ length: max }).map((_, index) => (
      <Star
        key={index}
        className={cn("h-4 w-4", index < value ? "fill-current" : "text-slate-300")}
        aria-hidden="true"
      />
    ))}
  </div>
);

const sourceLabels: Record<TestimonialSource, string> = {
  alignable: "Alignable",
};

export function SourceBadge({ source }: { source: TestimonialSource }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700">
      via {sourceLabels[source]}
    </span>
  );
}

export function TestimonialListCard({ testimonial, withLink = true, className }: TestimonialListCardProps) {
  return (
    <figure
      className={cn(
        "group relative flex h-full break-inside-avoid flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Rating value={testimonial.stars} />
        {testimonial.source ? <SourceBadge source={testimonial.source} /> : null}
      </div>

      <Quote className="h-6 w-6 text-brand/25" aria-hidden="true" />

      <blockquote className="font-serif text-[15px] leading-relaxed text-foreground/90">
        {testimonial.excerpt}
      </blockquote>

      <figcaption className="mt-auto space-y-0.5 border-t border-border/60 pt-4">
        <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
        {testimonial.organization ? (
          <p className="text-xs text-muted-foreground">{testimonial.organization}</p>
        ) : null}
      </figcaption>

      {withLink ? (
        <Link
          href={`/testimonials/${testimonial.slug}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand/70"
        >
          Read full story
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </figure>
  );
}
