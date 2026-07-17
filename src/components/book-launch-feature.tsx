import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildResourceArticlePath, type ResourceArticle } from "@/data/resource-articles";
import { cn } from "@/lib/utils";

const BOOK_COVER_ALT =
  "Cover of The Dental Exit Blueprint: The 13 EBITDA Levers That Drive Maximum Value";

type BookLaunchFeatureProps = {
  article: ResourceArticle;
  detail?: boolean;
  priority?: boolean;
  className?: string;
};

export function BookLaunchFeature({ article, detail = false, priority = false, className }: BookLaunchFeatureProps) {
  const launch = article.bookLaunch;

  if (!launch) return null;

  const Heading = detail ? "h1" : "h2";

  return (
    <section
      aria-labelledby={`book-launch-${detail ? "detail" : "feature"}-title`}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-amber-300/35 bg-ink text-white shadow-2xl shadow-ink/15",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]"
      />
      <div className="grid items-center gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-5 sm:p-7 lg:p-9">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/30 shadow-2xl shadow-black/30">
            <Image
              src={launch.coverImagePath}
              alt={BOOK_COVER_ALT}
              width={1289}
              height={881}
              sizes="(max-width: 1024px) calc(100vw - 4rem), 560px"
              className="h-auto w-full"
              priority={priority}
            />
          </div>
        </div>

        <div className="space-y-5 px-6 pb-8 sm:px-10 sm:pb-10 lg:px-8 lg:py-12 lg:pr-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            New book · Released July 15, 2026
          </div>

          <div className="space-y-3">
            <Heading
              id={`book-launch-${detail ? "detail" : "feature"}-title`}
              className="text-balance font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl"
            >
              {launch.title}
            </Heading>
            <p className="max-w-xl text-pretty font-serif text-xl leading-snug text-amber-100/90">
              {launch.subtitle}
            </p>
          </div>

          <p className="max-w-xl text-pretty leading-relaxed text-white/75">
            Dr. Michael A. Njo is a contributing author to this 29-author guide led by Elijah Desmond, created for
            dental owners who want to understand the decisions that shape practice value before an exit.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="bg-amber-300 text-ink hover:bg-amber-200">
              <a href={launch.amazonUrl} target="_blank" rel="noopener noreferrer">
                Buy The Dental Exit Blueprint on Amazon
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            {!detail ? (
              <Button asChild variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link href={buildResourceArticlePath(article.slug)}>
                  Explore the book
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" className="text-white/85 hover:bg-white/10 hover:text-white">
              <a href={launch.syndicatedPressReleaseUrl} target="_blank" rel="noopener noreferrer">
                Read the launch announcement
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
