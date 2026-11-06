import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import handbookCover from "@/assets/media/handbook-cover.jpg";
import { BookingButton } from "@/components/booking-button";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTACT_PATH } from "@/config/site";
import { secondEditionAnnouncementImage } from "@/data/media";
import { buildResourceArticlePath } from "@/data/resource-articles";

const FIRST_EDITION_AMAZON_URL =
  "https://www.amazon.com/Dental-Practice-Transitions-Handbook-Healthcare/dp/1627878718";
const EXIT_BLUEPRINT_AMAZON_URL = "https://www.amazon.com/dp/B0H8WL3F6H";
const UNLOCKED_PRACTICE_AMAZON_URL = "https://www.amazon.com/dp/B0HMM29ZMX";

// TODO(Second Edition Kindle link): the Second Edition purchase URL is not
// yet confirmed. When the live listing is confirmed, set this to the Second
// Edition Kindle URL so the purchase button renders. Do not substitute the
// first-edition Amazon URL above. Wording matches /resources/second-book.
const SECOND_EDITION_KINDLE_URL: string | null = null;

const secondEditionHighlights = [
  "A new foreword by Dr. Glenn Vo, founder of Nifty Thrifty Dentists and Editor-in-Chief of Dental Lifestyles Magazine.",
  "New advisor material from featured advisors who work alongside dentists on the financial, legal, and operational side of a transition.",
  "New appendices with practical checklists and reference material for the current market.",
  "A larger 6 x 9 format, substantially expanded and rewritten.",
];

export default function BooksPage() {
  return (
    <>
      {/* Author intro */}
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Books"
          title="Books by Dr. Michael Njo"
          description="Dr. Michael A. Njo, DDS is the author of the Dental Practice Transitions Handbook, the guide dentists use to plan, buy, sell, and structure practice transitions, and a contributing author to The Dental Exit Blueprint. His writing turns more than three decades of transition experience into clear, practical guidance for every stage of practice ownership."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/michael-njo-dds">About Dr. Njo</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/resources">Browse all resources</Link>
          </Button>
        </div>
      </Section>

      {/* Second Edition feature */}
      <Section spacing="compact">
        <section
          aria-labelledby="second-edition-title"
          className="relative isolate overflow-hidden rounded-3xl border border-amber-300/35 bg-ink text-white shadow-2xl shadow-ink/15"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]"
          />
          <div className="grid min-w-0 items-center gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="min-w-0 p-5 sm:p-7 lg:p-9">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/30 shadow-2xl shadow-black/30">
                <Image
                  src={secondEditionAnnouncementImage.src}
                  alt={secondEditionAnnouncementImage.alt}
                  width={secondEditionAnnouncementImage.width}
                  height={secondEditionAnnouncementImage.height}
                  sizes="(max-width: 1024px) calc(100vw - 4rem), 480px"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>

            <div className="min-w-0 space-y-5 px-6 pb-8 sm:px-10 sm:pb-10 lg:px-8 lg:py-12 lg:pr-12">
              <div className="inline-flex max-w-full items-center gap-2 whitespace-normal rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold uppercase leading-snug tracking-[0.16em] text-amber-200">
                <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Second Edition · Launching November 17, 2026
              </div>

              <div className="space-y-3">
                <h2
                  id="second-edition-title"
                  className="text-balance font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl"
                >
                  Dental Practice Transitions Handbook, Second Edition
                </h2>
                <p className="max-w-xl text-pretty font-serif text-xl leading-snug text-amber-100/90">
                  A Blueprint for Buying and Selling Healthcare Practices in Different Economic
                  Climates
                </p>
              </div>

              <p className="max-w-xl text-pretty leading-relaxed text-white/75">
                The expanded Second Edition keeps the same title and subtitle while substantially
                growing the content dentists already rely on to plan transitions with confidence.
              </p>

              <ul className="max-w-xl space-y-2 text-sm leading-relaxed text-white/75">
                {secondEditionHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <p className="max-w-xl text-pretty leading-relaxed text-white/75">
                The Kindle edition will be available for $2.99 at launch.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {SECOND_EDITION_KINDLE_URL ? (
                  <Button
                    asChild
                    className="h-auto w-full whitespace-normal bg-amber-300 py-2.5 text-center leading-snug text-ink hover:bg-amber-200 sm:w-auto"
                  >
                    <a href={SECOND_EDITION_KINDLE_URL} target="_blank" rel="noopener noreferrer">
                      Get the Second Edition on Kindle
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                ) : (
                  <p className="max-w-xl rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/75">
                    The Kindle purchase link will be added here when the new listing is confirmed.
                  </p>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="h-auto w-full whitespace-normal border-white/25 bg-white/5 py-2.5 text-center leading-snug text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Link href={buildResourceArticlePath("second-book")}>
                    Read more about the Second Edition
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* First edition */}
      <Section tone="surface">
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <Image
              src={handbookCover}
              alt="Cover of Dental Practice Transitions Handbook by Michael A. Njo, DDS."
              className="h-auto w-full"
              sizes="(max-width: 1024px) calc(100vw - 4rem), 384px"
            />
          </div>
          <div className="space-y-5">
            <div className="space-y-3">
              <Badge variant="outline">First Edition</Badge>
              <h2 className="text-balance font-serif text-3xl font-semibold leading-tight text-foreground">
                Dental Practice Transitions Handbook
              </h2>
              <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                The original edition of Dr. Njo&apos;s handbook: a published framework for
                high-stakes ownership decisions, guiding dentists through buying, selling, and
                structuring practice transitions with careful planning and educated
                decision-making at every stage of a career.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild>
                <a href={FIRST_EDITION_AMAZON_URL} target="_blank" rel="noopener noreferrer">
                  View the first edition on Amazon
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Contributing and recommended titles */}
      <Section>
        <SectionHeading
          eyebrow="More books"
          title="Contributing and recommended titles"
          description="Dr. Njo also contributes to multi-author guides for practice owners and recommends selected books from his professional network."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-20 shrink-0 overflow-hidden rounded-lg border border-border/70">
                <Image
                  src="/dental-exit-blueprint-cover.jpg"
                  alt="Cover of The Dental Exit Blueprint: The 13 EBITDA Levers That Drive Maximum Value"
                  width={1289}
                  height={881}
                  className="h-auto w-full"
                />
              </div>
              <div className="min-w-0 space-y-1">
                <Badge>Contributing Author</Badge>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  The Dental Exit Blueprint
                </h3>
                <p className="text-sm text-muted-foreground">
                  The 13 EBITDA Levers That Drive Maximum Value
                </p>
              </div>
            </div>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              A 29-author guide led by Elijah Desmond, released July 15, 2026. Dr. Njo wrote two
              chapters: &ldquo;Know Your Exit Options&rdquo; and &ldquo;Plan What Comes
              Next.&rdquo;
            </p>
            <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
              <Button asChild size="sm">
                <a href={EXIT_BLUEPRINT_AMAZON_URL} target="_blank" rel="noopener noreferrer">
                  Buy on Amazon
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={buildResourceArticlePath("dental-exit-blueprint")}>
                  About the book
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="outline">Recommended by Dr. Njo</Badge>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                The Unlocked Practice
              </h3>
              <p className="text-sm text-muted-foreground">
                By Monica Cappelli, Anthony Jurjevic, and Duane Tinker
              </p>
            </div>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              A recommendation from Dr. Njo&apos;s network on protecting a dental practice:
              HIPAA compliance, cybersecurity, data breaches, and embezzlement prevention for
              practice owners.
            </p>
            <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
              <Button asChild size="sm">
                <a href={UNLOCKED_PRACTICE_AMAZON_URL} target="_blank" rel="noopener noreferrer">
                  View on Amazon
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={buildResourceArticlePath("the-unlocked-practice")}>
                  Read Dr. Njo&apos;s recommendation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section tone="brand">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold text-white sm:text-4xl">
            Questions about the books or a transition of your own?
          </h2>
          <p className="text-pretty text-white/75">
            The handbook is the starting point. A short call is the simplest way to talk through
            what it means for your practice.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookingButton variant="secondary" size="lg" />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
