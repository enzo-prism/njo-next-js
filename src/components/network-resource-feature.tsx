import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildResourceArticlePath, formatArticleDate, type ResourceArticle } from "@/data/resource-articles";

type NetworkResourceFeatureProps = {
  article: ResourceArticle;
  detail?: boolean;
};

export function NetworkResourceFeature({ article, detail = false }: NetworkResourceFeatureProps) {
  const resource = article.networkResource;
  if (!resource) return null;
  const Title = detail ? "h1" : "h3";
  const QuoteTitle = detail ? "h2" : "h4";

  return (
    <div className="overflow-hidden rounded-2xl border border-brand/20 bg-background shadow-sm">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start bg-ink p-6 text-white sm:p-9">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {resource.kind} <span aria-hidden="true">/</span> {article.category}
          </p>
          <Title className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">
            {detail ? resource.title : (
              <Link href={buildResourceArticlePath(article.slug)} className="transition-colors hover:text-amber-200">
                {resource.title}
              </Link>
            )}
          </Title>
          <p className="mt-4 text-sm leading-7 text-white/80">
            By {new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(resource.authors)}
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/80">{article.excerpt}</p>
          <div className="mt-6 border-t border-white/15 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Who it’s for</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{resource.audience}</p>
          </div>
          {detail ? (
            <ul aria-label="Topics covered" className="mt-5 flex flex-wrap gap-2">
              {resource.topics.map((topic) => (
                <li key={topic} className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90">{topic}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8 flex w-full flex-col gap-3">
            {detail ? (
              <Button asChild className="h-auto min-h-11 w-full whitespace-normal bg-amber-300 px-5 py-3 text-center text-slate-950 hover:bg-amber-200 sm:w-fit">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  View the book on Amazon
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            ) : (
              <Button asChild className="h-auto min-h-11 w-full whitespace-normal bg-amber-300 px-5 py-3 text-center text-slate-950 hover:bg-amber-200 sm:w-fit">
                <Link href={buildResourceArticlePath(article.slug)}>
                  Read Dr. Njo’s recommendation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center bg-surface p-6 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Why Dr. Njo recommends it</p>
          <QuoteTitle className="mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
            {resource.recommendation.heading}
          </QuoteTitle>
          <blockquote className="mt-6 border-l-2 border-brand/30 pl-5">
            <div className="space-y-4 text-base leading-8 text-muted-foreground">
              {(detail ? resource.recommendation.paragraphs : resource.recommendation.paragraphs.slice(0, 1)).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <footer className="mt-6 text-sm">
              <p className="font-semibold text-foreground">Dr. Michael Njo</p>
              <p className="mt-1 text-muted-foreground">
                Recommended <time dateTime={resource.recommendedAt}>{formatArticleDate(resource.recommendedAt)}</time>
              </p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
