import Image from "next/image";
import type { TestimonialPortrait as TestimonialPortraitData } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export const TESTIMONIAL_PORTRAIT_SIZES = {
  index: 56,
  story: 96,
} as const;

export type TestimonialPortraitSize = keyof typeof TESTIMONIAL_PORTRAIT_SIZES;

type TestimonialPortraitProps = {
  photo: TestimonialPortraitData;
  size: TestimonialPortraitSize;
  className?: string;
};

/**
 * Locked face treatment: 56px on the testimonials index, 96px on story pages.
 * Render only when a confirmed real portrait exists.
 */
export function TestimonialPortrait({ photo, size, className }: TestimonialPortraitProps) {
  const px = TESTIMONIAL_PORTRAIT_SIZES[size];

  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border border-border shadow-sm",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={`${px}px`}
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}

type TestimonialAuthorProps = {
  author: string;
  organization?: string;
  photo?: TestimonialPortraitData;
  size?: TestimonialPortraitSize;
  authorClassName?: string;
};

export function TestimonialAuthor({
  author,
  organization,
  photo,
  size = "index",
  authorClassName,
}: TestimonialAuthorProps) {
  return (
    <div className="flex items-center gap-3">
      {photo ? <TestimonialPortrait photo={photo} size={size} /> : null}
      <div className="min-w-0">
        <p className={cn("text-sm font-semibold text-foreground", authorClassName)}>{author}</p>
        {organization ? <p className="text-xs text-muted-foreground">{organization}</p> : null}
      </div>
    </div>
  );
}
