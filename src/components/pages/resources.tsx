import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildResourceArticlePath, formatArticleDate, resourceArticles } from "@/data/resource-articles";
import { resources, bookReviews } from "@/seo/structured-data";

export default function ResourcesPage() {
  const book = resources.find((resource) => resource.type === "Book");
  const institute = resources.find((resource) => resource.type === "EducationalOrganization");

  return (
    <div className="space-y-8">
      <section className="space-y-3 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Resources</p>
        <h1 className="text-4xl font-semibold">Education &amp; growth resources</h1>
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground">
          Practical materials and learning pathways curated to support healthcare ownership, transitions, and operations leadership.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {book && (
          <Card className="overflow-hidden">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">{book.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed max-w-lg">{book.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="inline-flex w-full justify-center sm:w-auto">
                <a href={book.url} target="_blank" rel="noopener noreferrer">
                  View on Amazon
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {institute && (
          <Card className="overflow-hidden">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">{institute.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed max-w-lg">{institute.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="inline-flex w-full justify-center border-primary/30 text-primary sm:w-auto"
              >
                <a href={institute.url} target="_blank" rel="noopener noreferrer">
                  Visit institute
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Articles &amp; guidance</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Practical reads for dentists weighing ownership, transitions, and long-term strategy.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resourceArticles.map((article) => (
            <Card key={article.slug} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="uppercase tracking-wide">
                    Article
                  </Badge>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatArticleDate(article.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {article.readTimeMinutes} min read
                  </span>
                </div>
                <CardTitle className="text-2xl leading-snug">
                  <Link href={buildResourceArticlePath(article.slug)} className="transition-colors hover:text-primary">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed max-w-lg">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="inline-flex w-full justify-center sm:w-auto">
                  <Link href={buildResourceArticlePath(article.slug)}>
                    Read article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold">Reader reviews</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/testimonials">Explore testimonials</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {bookReviews.map((review) => (
            <Card key={`${review.author}-${review.datePublished}`}>
              <CardHeader className="space-y-1">
                <p className="text-sm text-muted-foreground">{review.datePublished}</p>
                <CardTitle className="text-lg">{review.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{review.author}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{review.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/contact">Start a strategy call</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/michael-njo-dds">Back to profile</Link>
        </Button>
      </div>
    </div>
  );
}
