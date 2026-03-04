import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TestimonialPage } from "@/data/testimonials";

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

export function TestimonialListCard({ testimonial, withLink = true }: TestimonialListCardProps) {
  return (
    <Card className="h-full border border-border/60 bg-white/95 shadow-sm">
      <CardContent className="space-y-4 p-6">
        <Rating value={testimonial.stars} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {testimonial.excerpt}
        </p>
        <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
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
