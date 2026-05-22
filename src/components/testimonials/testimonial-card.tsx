import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TestimonialPage, TestimonialSource } from "@/data/testimonials";

type TestimonialListCardProps = {
  testimonial: TestimonialPage;
  withLink?: boolean;
};

const Rating = ({ value, max = 5 }: { value: number; max?: number }) => (
  <div className="flex items-center gap-1 text-amber-500" aria-label={`${value} out of ${max} stars`}>
    {Array.from({ length: max }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < value ? "fill-current" : "text-slate-300"}`}
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

export function TestimonialListCard({ testimonial, withLink = true }: TestimonialListCardProps) {
  return (
    <Card className="h-full border border-border/60 bg-white/95 shadow-sm">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-2">
          <Rating value={testimonial.stars} />
          {testimonial.source ? <SourceBadge source={testimonial.source} /> : null}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.excerpt}</p>
        <div className="mt-auto space-y-0.5">
          <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
          {testimonial.organization ? (
            <p className="text-xs text-muted-foreground">{testimonial.organization}</p>
          ) : null}
        </div>
        {withLink ? (
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href={`/testimonials/${testimonial.slug}`}>
              Read full story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
