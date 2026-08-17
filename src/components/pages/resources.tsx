import { ArrowRight, Building2, CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import { BookLaunchFeature } from "@/components/book-launch-feature";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildResourceArticlePath, formatArticleDate, resourceArticles } from "@/data/resource-articles";
import { resourceBookFeatureImage, resourceBookInsetImage } from "@/data/media";
import { resources, bookReviews } from "@/seo/structured-data";
import { CONTACT_PATH } from "@/config/site";
import { Container } from "@/components/layout/container";

export default function ResourcesPage() {
  const book = resources.find((resource) => resource.type === "Book");
  const institute = resources.find((resource) => resource.type === "EducationalOrganization");
  const bookLaunchArticle = resourceArticles.find((article) => article.bookLaunch);
  const guidanceArticles = resourceArticles.filter((article) => !article.bookLaunch);

  return (
    <Container className="space-y-8 py-10 sm:py-14">
      <section className="space-y-3 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Resources</p>
        <h1 className="text-4xl font-semibold">Education &amp; growth resources</h1>
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground">
          Practical materials and learning pathways curated to support healthcare ownership, transitions, and operations leadership.
        </p>
      </section>

      {bookLaunchArticle ? <BookLaunchFeature article={bookLaunchArticle} priority /> : null}

      <section className="grid gap-4 md:grid-cols-2">
        {book && (
          <Card className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
              <div className="bg-slate-100/70 p-4">
                <figure className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm">
                  <Image
                    src={resourceBookFeatureImage.src}
                    alt={resourceBookFeatureImage.alt}
                    width={resourceBookFeatureImage.width}
                    height={resourceBookFeatureImage.height}
                    sizes={resourceBookFeatureImage.sizes}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </figure>
              </div>

              <div className="space-y-5 p-6">
                <CardHeader className="space-y-3 px-0 pt-0">
                  <CardTitle className="text-2xl">{book.name}</CardTitle>
                  <CardDescription className="max-w-lg text-sm leading-relaxed">{book.description}</CardDescription>
                </CardHeader>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A practical reference for dentists and healthcare owners navigating acquisitions, sales, partnerships, and
                  transition timing across different market conditions.
                </p>

                <figure className="overflow-hidden rounded-[1.5rem] border border-border bg-slate-50 shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={resourceBookInsetImage.src}
                      alt={resourceBookInsetImage.alt}
                      fill
                      sizes={resourceBookInsetImage.sizes}
                      className="object-contain p-3"
                      style={{ objectPosition: resourceBookInsetImage.objectPosition }}
                    />
                  </div>
                  <figcaption className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {resourceBookInsetImage.caption}
                  </figcaption>
                </figure>

                <Button asChild className="inline-flex w-full justify-center sm:w-auto">
                  <a href={book.url} target="_blank" rel="noopener noreferrer">
                    View on Amazon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {institute && (
          <Card className="overflow-hidden border-brand/20 bg-gradient-to-br from-slate-950 to-slate-800 text-white">
            <CardHeader className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  For dental practice transactions
                </p>
                <CardTitle className="mt-2 text-2xl text-white">{institute.name}</CardTitle>
              </div>
              <CardDescription className="max-w-lg text-sm leading-relaxed text-white/75">
                PTI is Dr. Njo&apos;s dedicated firm for dentists making an ownership or transaction decision.
                Use the institute when you need a team to guide the process, not only educational material.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ul className="grid gap-3 text-sm text-white/85 sm:grid-cols-2">
                {[
                  "Sell a dental practice",
                  "Buy and evaluate a practice",
                  "Review a DSO offer",
                  "Value a practice",
                  "Plan an associate buy-in",
                  "Structure a partnership",
                ].map((service) => (
                  <li key={service} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="secondary" className="inline-flex w-full justify-center sm:w-auto">
                <a
                  href="https://practicetransitionsinstitute.com/services"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore PTI Transition Services
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
          {guidanceArticles.map((article) => (
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
        <BookingButton />
        <Button asChild variant="outline">
          <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/michael-njo-dds">Back to profile</Link>
        </Button>
      </div>
    </Container>
  );
}
