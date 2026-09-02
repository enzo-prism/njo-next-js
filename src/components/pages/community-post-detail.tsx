import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_PATH } from "@/config/site";
import type { CommunityPost } from "@/data/community-posts";
import { eventPrograms } from "@/data/events";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export default function CommunityPostDetailPage({ post }: { post: CommunityPost }) {
  const matchingEvent = eventPrograms.find((program) => program.slug === post.slug);

  return (
    <Container className="py-10 sm:py-14">
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-5">
          <Badge variant="secondary" className="uppercase tracking-wide">Community</Badge>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{post.description}</p>
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> Published {formatDate(post.publishedAt)}
          </p>
        </header>

        {post.images?.length ? (
          <div
            className={`grid items-start gap-4 ${post.images.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
          >
            {post.images.map((image, index) => (
              <figure key={image.src} className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="h-auto w-full object-contain"
                />
              </figure>
            ))}
          </div>
        ) : post.image ? (
          <figure className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="h-auto w-full object-contain"
            />
          </figure>
        ) : null}

        {post.embedUrl ? (
          <div className="mx-auto w-full max-w-[540px] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <iframe
              src={post.embedUrl}
              title={post.embedTitle}
              width="100%"
              height="720"
              allow="encrypted-media; clipboard-write"
              loading="lazy"
              className="w-full"
            />
          </div>
        ) : null}

        <Card className="border-border/80 bg-background">
          <CardContent className="space-y-5 p-6 text-lg leading-relaxed text-slate-700 md:p-8">
            {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          {matchingEvent?.registrationUrl ? (
            <Button asChild>
              <a href={matchingEvent.registrationUrl} target="_blank" rel="noopener noreferrer">
                View current event details at PTI
              </a>
            </Button>
          ) : (
            <Button asChild>
              <Link href={CONTACT_PATH}>Talk to Dr. Njo</Link>
            </Button>
          )}
          <Button asChild variant="outline"><Link href="/michael-njo-dds">About Dr. Njo</Link></Button>
        </div>
      </article>
    </Container>
  );
}
