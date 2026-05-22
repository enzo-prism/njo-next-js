"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  src: StaticImageData | string;
  alt: string;
  eyebrow: string;
  caption: string;
  objectPosition?: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  autoPlayMs?: number;
  className?: string;
};

export function HeroSlideshow({ slides, autoPlayMs = 5600, className }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const liveRegionRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const total = slides.length;
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [slides.length],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const isPaused = isUserPaused || isHoverPaused || reducedMotion;

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = window.setTimeout(goNext, autoPlayMs);
    return () => window.clearTimeout(timer);
  }, [index, isPaused, autoPlayMs, goNext, slides.length]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  const active = slides[index];
  if (!active) return null;

  const progressStyle: CSSProperties = {
    animationDuration: `${autoPlayMs}ms`,
  };

  return (
    <div
      className={cn(
        "group relative isolate flex h-full w-full flex-col overflow-hidden bg-slate-950",
        "aspect-[5/6] md:aspect-auto md:min-h-[560px]",
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Dr. Michael Njo professional gallery"
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onFocus={() => setIsHoverPaused(true)}
      onBlur={() => setIsHoverPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="absolute inset-0">
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity ease-out [transition-duration:900ms]",
                isActive ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px"
                className={cn(
                  "object-cover transition-transform ease-out will-change-transform [transition-duration:8000ms]",
                  isActive && !reducedMotion ? "scale-100" : "scale-[1.06]",
                )}
                style={{ objectPosition: slide.objectPosition ?? "center center" }}
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] bg-white/15">
        {!isPaused && slides.length > 1 ? (
          <div
            key={`progress-${index}`}
            className="hero-progress-bar h-full bg-white/85"
            style={progressStyle}
          />
        ) : null}
      </div>

      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
          <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span className="mx-1 text-white/40">/</span>
          <span className="tabular-nums text-white/60">{String(slides.length).padStart(2, "0")}</span>
        </div>
        {slides.length > 1 && !reducedMotion ? (
          <button
            type="button"
            onClick={() => setIsUserPaused((prev) => !prev)}
            aria-label={isUserPaused ? "Resume gallery" : "Pause gallery"}
            aria-pressed={isUserPaused}
            className="rounded-full border border-white/20 bg-black/40 p-1.5 text-white/90 backdrop-blur transition-colors duration-200 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {isUserPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur transition-all duration-200 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur transition-all duration-200 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      ) : null}

      <div className="relative z-10 mt-auto p-5 sm:p-7 md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
          {active.eyebrow}
        </p>
        <p
          ref={liveRegionRef}
          className="mt-2 max-w-md text-sm leading-relaxed text-white sm:text-[15px]"
          aria-live="polite"
        >
          {active.caption}
        </p>

        {slides.length > 1 ? (
          <div className="mt-5 flex items-center gap-2" role="tablist" aria-label="Select slide">
            {slides.map((slide, i) => {
              const isActive = i === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show slide ${i + 1}: ${slide.eyebrow}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                    isActive ? "w-8 bg-white" : "w-1.5 bg-white/45 hover:bg-white/80",
                  )}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
