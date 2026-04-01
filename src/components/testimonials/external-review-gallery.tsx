"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { externalReviewGallery } from "@/data/external-review-gallery";
import { cn } from "@/lib/utils";

export function ExternalReviewGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = externalReviewGallery.screenshots.length;
  const activeScreenshot = externalReviewGallery.screenshots[activeIndex];
  const screenshotPositionLabel = `Screenshot ${activeIndex + 1} of ${total}`;

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? total - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === total - 1 ? 0 : current + 1));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;

    touchStartX.current = null;

    if (startX === null || endX === null) return;

    const swipeDistance = startX - endX;
    if (Math.abs(swipeDistance) < 40) return;

    if (swipeDistance > 0) {
      showNext();
      return;
    }

    showPrevious();
  };

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => (current === 0 ? total - 1 : current - 1));
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => (current === total - 1 ? 0 : current + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, total]);

  return (
    <section aria-labelledby="external-review-gallery-title">
      <Card className="overflow-hidden border border-primary/10 bg-gradient-to-br from-amber-50 via-white to-sky-50 shadow-sm">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                External recommendations
              </p>
              <h2 id="external-review-gallery-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {externalReviewGallery.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {externalReviewGallery.description}
              </p>
            </div>

            <Button asChild className="w-full sm:w-auto">
              <Link href={externalReviewGallery.platformUrl} target="_blank" rel="noreferrer">
                Read on {externalReviewGallery.platformName}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-2 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
              <div className="flex flex-col gap-3 border-b border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Small-screen friendly</p>
                  <p className="text-sm text-muted-foreground">
                    Open a larger reading view when you want to inspect the screenshot more closely.
                  </p>
                </div>

                <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setIsExpanded(true)}>
                  <Maximize2 className="h-4 w-4" />
                  Larger view
                </Button>
              </div>

              <div
                className="relative aspect-[16/10] touch-pan-y overflow-hidden rounded-[1.25rem] bg-slate-100"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  key={activeScreenshot.src}
                  src={activeScreenshot.src}
                  alt={activeScreenshot.alt}
                  fill
                  priority={activeIndex === 0}
                  sizes="(min-width: 1024px) 72rem, (min-width: 768px) 90vw, 100vw"
                  className="object-contain"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-4"
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                    {screenshotPositionLabel}
                  </span>
                  <span className="hidden rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur sm:inline-flex">
                    Tap the button above to enlarge
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{activeScreenshot.title}</p>
                <p className="text-sm text-muted-foreground">
                  Swipe through the captured reviews, then open a larger view for easier reading on smaller screens.
                </p>
                <Link
                  href={activeScreenshot.src}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open the current image in a new tab
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" aria-label="Show previous screenshot" onClick={showPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2" aria-label="Select review screenshot">
                  {externalReviewGallery.screenshots.map((screenshot, index) => (
                    <button
                      key={screenshot.src}
                      type="button"
                      aria-label={`Show ${screenshot.title}`}
                      aria-pressed={index === activeIndex}
                      className={cn(
                        "h-2.5 w-8 rounded-full transition-colors",
                        index === activeIndex ? "bg-primary" : "bg-primary/20 hover:bg-primary/40",
                      )}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>

                <Button type="button" variant="outline" size="icon" aria-label="Show next screenshot" onClick={showNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="w-[min(100vw-1rem,1180px)] max-w-6xl border-none bg-black/95 p-0 text-white sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:rounded-full [&>button]:border [&>button]:border-white/15 [&>button]:bg-black/50 [&>button]:text-white [&>button]:opacity-100 [&>button]:ring-offset-black hover:[&>button]:bg-black/70">
          <DialogTitle className="sr-only">{activeScreenshot.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Expanded reading view of an external review screenshot from {externalReviewGallery.platformName}.
          </DialogDescription>

          <div className="flex flex-col">
            <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 pr-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pr-16">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                  Expanded review {activeIndex + 1} of {total}
                </p>
                <p className="text-base font-medium text-white sm:text-lg">{activeScreenshot.title}</p>
                <p className="text-sm text-white/70">
                  Use the arrows, dots, or your device zoom controls for the most comfortable reading view.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                className="shrink-0 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={externalReviewGallery.platformUrl} target="_blank" rel="noreferrer">
                  Open on {externalReviewGallery.platformName}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="px-3 pb-3 pt-4 sm:px-6 sm:pb-6">
              <div
                className="relative h-[72vh] overflow-hidden rounded-2xl bg-black sm:h-[78vh]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={activeScreenshot.src}
                  alt={activeScreenshot.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-white/70">{screenshotPositionLabel}. Press the left and right arrow keys to move faster.</p>

              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Show previous screenshot"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={showPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2" aria-label="Select review screenshot">
                  {externalReviewGallery.screenshots.map((screenshot, index) => (
                    <button
                      key={`${screenshot.src}-expanded`}
                      type="button"
                      aria-label={`Show ${screenshot.title}`}
                      aria-pressed={index === activeIndex}
                      className={cn(
                        "h-2.5 w-8 rounded-full transition-colors",
                        index === activeIndex ? "bg-white" : "bg-white/25 hover:bg-white/45",
                      )}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Show next screenshot"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={showNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
