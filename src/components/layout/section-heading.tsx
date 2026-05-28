import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: TitleTag = "h2",
  action,
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        action && "sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className={cn("space-y-3", align === "center" && "max-w-2xl")}>
        {eyebrow ? (
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              isDark ? "text-amber-300" : "text-brand",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <TitleTag
          id={id}
          className={cn(
            "text-balance text-3xl font-semibold leading-tight sm:text-4xl",
            isDark ? "text-white" : "text-foreground",
            titleClassName,
          )}
        >
          {title}
        </TitleTag>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed",
              isDark ? "text-white/75" : "text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
