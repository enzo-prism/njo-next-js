import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type SectionTone = "default" | "surface" | "ink" | "brand";
type SectionSpacing = "default" | "compact" | "none";
type SectionWidth = "default" | "narrow" | "prose";

const toneClasses: Record<SectionTone, string> = {
  default: "",
  surface: "bg-surface",
  ink: "bg-ink text-white",
  brand: "bg-brand text-brand-foreground",
};

const spacingClasses: Record<SectionSpacing, string> = {
  default: "py-14 sm:py-20",
  compact: "py-10 sm:py-14",
  none: "",
};

type SectionProps = {
  children: ReactNode;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  width?: SectionWidth;
  id?: string;
  className?: string;
  containerClassName?: string;
  contained?: boolean;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

/**
 * Full-bleed band whose background spans the viewport while its content stays
 * within a centered Container. The tone prop drives the editorial rhythm
 * (alternating light/surface bands plus dark `ink`/`brand` feature bands).
 */
export function Section({
  children,
  tone = "default",
  spacing = "default",
  width = "default",
  id,
  className,
  containerClassName,
  contained = true,
  "aria-labelledby": ariaLabelledby,
  "aria-label": ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      className={cn(toneClasses[tone], spacingClasses[spacing], className)}
    >
      {contained ? (
        <Container width={width} className={containerClassName}>
          {children}
        </Container>
      ) : (
        children
      )}
    </section>
  );
}
