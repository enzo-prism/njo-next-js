import { ArrowRight, BookOpen, ExternalLink, PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookingButton } from "@/components/booking-button";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTACT_PATH } from "@/config/site";
import { buildResourceArticlePath, formatArticleDate } from "@/data/resource-articles";
import { resourceBookFeatureImage, secondEditionAnnouncementImage } from "@/data/media";
import { bookReviews } from "@/seo/structured-data";

const FIRST_EDITION_AMAZON_URL =
  "https://www.amazon.com/Dental-Practice-Transitions-Handbook-Healthcare/dp/1627878718";
const DENTAL_EXIT_BLUEPRINT_AMAZON_URL = "https://www.amazon.com/dp/B0H8WL3F6H";

const authorFacts = [
  { title: "Author", body: "Dental Practice Transitions Handbook" },
  { title: "Contributing author", body: "The Dental Exit Blueprint" },
  { title: "Founder", body: "Dental Strategies and Practice Transitions Institute" },
];

export default function BooksPage() {
  return (
    <Container className="space-y-12 py-10 sm:space-y-16 sm:py-14">
      <section className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Books by Dr. Michael Njo</p>
        <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          Author of the Dental Practice Transitions Handbook
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Dr. Michael A. Njo has been a dentist, practice owner, practice-management consultant, transition
          specialist, educator, and author. His books put that experience in writing for dentists who are buying,
          selling, growing, or planning what comes next.
        </p>
        <ul className="grid gap-3 pt-2 text-left sm:grid-cols-3">
          {authorFacts.map((fact) => (
            <li key={fact.title} className="rounded-xl border border-border/70 bg-surface p-4">
              <p className="text-sm font-semibold text-foreground">{fact.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{fact.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="authored-books-heading" className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Written by Dr. Njo</p>
          <h2 id="authored-books-heading" className="font-serif text-3xl font-semibold tracking-tight">
            Dental Practice Transitions Handbook
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            A Blueprint for Buying and Selling Healthcare Practices in Different Economic Climates.
          </p>
        </div>

        <article
          aria-labelledby="second-edition-title"
          className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm"
        >
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="bg-slate-100/70 p-4 sm:p-6">
              <figure className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm">
                <Image
                  src={secondEditionAnnouncementImage.src}
                  alt={secondEditionAnnouncementImage.alt}
                  width={secondEditionAnnouncementImage.width}
                  height={secondEditionAnnouncementImage.height}
                  sizes={secondEditionAnnouncementImage.sizes}
                  className="h-auto w-full object-contain"
                  priority
                />
              </figure>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <Badge variant="secondary" className="w-fit uppercase tracking-wide">
                Second Edition · Launching November 17, 2026
              </Badge>
              <h3 id="second-edition-title" className="font-serif text-2xl font-semibold leading-snug">
                Dental Practice Transitions Handbook, Second Edition
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                A substantially expanded and rewritten 6 x 9 edition of the handbook. The title and subtitle stay the
                same, with a new foreword by Dr. Glenn Vo, new advisor material, and new appendices.
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                The Second Edition launches on <time dateTime="2026-11-17">November 17, 2026</time>. Purchase details
                will be added here when the new listing is confirmed.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild>
                  <Link href={buildResourceArticlePath("second-book")}>
                    Preview the second edition
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={CONTACT_PATH}>Ask about the second edition</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>

        <article
          aria-labelledby="first-edition-title"
          className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm"
        >
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="bg-slate-100/70 p-4 sm:p-6">
              <figure className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm">
                <Image
                  src={resourceBookFeatureImage.src}
                  alt={resourceBookFeatureImage.alt}
                  width={resourceBookFeatureImage.width}
                  height={resourceBookFeatureImage.height}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="h-auto w-full object-contain"
                />
              </figure>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <Badge variant="outline" className="w-fit uppercase tracking-wide">
                First Edition · Available on Amazon
              </Badge>
              <h3 id="first-edition-title" className="font-serif text-2xl font-semibold leading-snug">
                Dental Practice Transitions Handbook
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                The original handbook prepares dentists to evaluate associate roles, partnerships, and purchase options
                with a global understanding of how sellers and buyers think, the mistakes to avoid, and the questions
                to ask before any transition.
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                Dr. Njo wrote it after decades in dentistry and transition consulting, carrying forward what he learned
                working alongside his mentor, Hy Smith.
              </p>
              <Button asChild variant="outline">
                <a href={FIRST_EDITION_AMAZON_URL} target="_blank" rel="noopener noreferrer">
                  View the first edition on Amazon
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </article>
      </section>

      <section aria-labelledby="contributed-books-heading" className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Contributing author</p>
          <h2 id="contributed-books-heading" className="font-serif text-3xl font-semibold tracking-tight">
            Books Dr. Njo has written for
          </h2>
        </div>

        <article
          aria-labelledby="dental-exit-blueprint-title"
          className="overflow-hidden rounded-3xl border border-amber-300/35 bg-ink text-white shadow-xl shadow-ink/10"
        >
          <div className="grid items-center gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-5 sm:p-7">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/30">
                <Image
                  src="/dental-exit-blueprint-cover.jpg"
                  alt="Cover of The Dental Exit Blueprint: The 13 EBITDA Levers That Drive Maximum Value"
                  width={1289}
                  height={881}
                  sizes="(max-width: 1024px) calc(100vw - 4rem), 560px"
                  className="h-auto w-full"
                />
              </div>
            </div>
            <div className="space-y-5 px-6 pb-8 sm:px-10 lg:py-10 lg:pr-12">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Released July 15, 2026
              </div>
              <h3
                id="dental-exit-blueprint-title"
                className="text-balance font-serif text-2xl font-semibold leading-tight sm:text-3xl"
              >
                The Dental Exit Blueprint
              </h3>
              <p className="font-serif text-lg leading-snug text-amber-100/90">
                The 13 EBITDA Levers That Drive Maximum Value
              </p>
              <p className="text-pretty text-sm leading-relaxed text-white/75">
                A 29-author guide led by Elijah Desmond for dental owners who want to understand the decisions that
                shape practice value before an exit. Dr. Njo wrote two chapters: &ldquo;Know Your Exit Options&rdquo;
                and &ldquo;Plan What Comes Next.&rdquo;
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="bg-amber-300 text-ink hover:bg-amber-200">
                  <a href={DENTAL_EXIT_BLUEPRINT_AMAZON_URL} target="_blank" rel="noopener noreferrer">
                    Find The Dental Exit Blueprint on Amazon
                    <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={buildResourceArticlePath("dental-exit-blueprint")}>
                    Explore the book
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </section>

      {bookReviews.length > 0 ? (
        <section aria-labelledby="reader-reviews-heading" className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">From readers</p>
            <h2 id="reader-reviews-heading" className="font-serif text-3xl font-semibold tracking-tight">
              What readers say about the handbook
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {bookReviews.slice(0, 4).map((review) => (
              <figure
                key={`${review.author}-${review.datePublished}`}
                className="space-y-3 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <p className="text-sm text-muted-foreground">{formatArticleDate(review.datePublished)}</p>
                <p className="text-lg font-semibold">{review.title}</p>
                <blockquote className="text-sm leading-relaxed text-muted-foreground">{review.body}</blockquote>
                <figcaption className="text-sm font-medium text-foreground">{review.author}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5 rounded-3xl border border-border/70 bg-surface p-6 text-center sm:p-10">
        <PenLine className="mx-auto h-6 w-6 text-brand" aria-hidden="true" />
        <h2 className="font-serif text-2xl font-semibold">Talk with the author</h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Planning a purchase, sale, partnership, or next chapter? Dr. Njo works with dentists one on one through
          Dental Strategies and Practice Transitions Institute.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <BookingButton />
          <Button asChild variant="outline">
            <Link href="/michael-njo-dds">About Dr. Njo</Link>
          </Button>
        </div>
      </section>
    </Container>
  );
}
