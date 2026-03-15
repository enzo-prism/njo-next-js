import { ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type ResourceArticle, formatArticleDate } from "@/data/resource-articles";

type ResourceArticleDetailPageProps = {
  article: ResourceArticle;
};

export default function ResourceArticleDetailPage({ article }: ResourceArticleDetailPageProps) {
  const publishedLabel = formatArticleDate(article.publishedAt);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-border/80 bg-background">
        <CardHeader className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-3">
            <Badge variant="secondary" className="w-fit uppercase tracking-wide">
              {article.category}
            </Badge>
            <CardTitle className="max-w-4xl text-3xl leading-tight md:text-4xl">{article.title}</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-relaxed">
              {article.description}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Published {publishedLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {article.readTimeMinutes} min read
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {article.keyTakeaways.map((takeaway) => (
              <div
                key={takeaway}
                className="rounded-xl border border-border/80 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {takeaway}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <Card className="border-border/80 bg-background">
            <CardContent className="p-6 md:p-8">
              <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900 prose-a:text-primary hover:prose-a:text-primary/80">
                {article.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={`${section.id}-${paragraph}`}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={`${section.id}-${bullet}`}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}

                {article.closing.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-background">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Frequently asked questions</CardTitle>
              <CardDescription>
                Short answers to the questions first-time buyers ask most often.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {article.faq.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-slate-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-blue-50 via-background to-background">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Want a clearer answer for your own situation?</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-relaxed">
                A strong acquisition plan starts with honest fit, not guesswork. If you want help sorting
                through timing, readiness, and opportunity quality, the next step is a direct conversation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/contact">
                  Start a conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/testimonials">See how others approached transitions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border/80 bg-background">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">On this page</CardTitle>
              <CardDescription>Jump to the readiness signal or section you need.</CardDescription>
            </CardHeader>
            <CardContent>
              <nav aria-label="Article sections">
                <ul className="space-y-2 text-sm">
                  {article.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-background">
            <CardHeader className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                <BookOpen className="h-4 w-4 text-primary" />
                Keep exploring
              </div>
              <CardDescription>
                Related pages that support the same ownership and transition journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.relatedLinks.map((link) => (
                <div key={link.href} className="space-y-1">
                  <Link href={link.href} className="font-medium text-slate-900 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                  <p className="text-sm leading-relaxed text-muted-foreground">{link.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
