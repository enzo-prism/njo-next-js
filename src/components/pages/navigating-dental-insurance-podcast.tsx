import { ExternalLink, Headphones } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { CONTACT_PATH } from "@/config/site";
import { boomCloudPodcastEpisode } from "@/data/podcast-episode";

export default function NavigatingDentalInsurancePodcastPage() {
  const episode = boomCloudPodcastEpisode;

  return (
    <Container className="space-y-10 py-10 sm:py-14">
      <section className="mx-auto max-w-3xl space-y-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Guest conversation
        </p>
        <h1 className="text-balance font-serif text-4xl font-semibold sm:text-5xl">
          {episode.title}
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Dr. Michael Njo as guest on {episode.showTitle} with{" "}
          {episode.hosts[0]} and {episode.hosts[1]}, published July 24, 2026 (
          {episode.durationLabel}).
        </p>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Official player
          </p>
          <CardTitle className="font-serif text-2xl">
            Listen on Apple Podcasts
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-relaxed">
            Canonical episode listing from Apple Podcasts. Castbox carries the
            same July 24, 2026 episode if you prefer that player.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <iframe
            title={`${episode.title} on Apple Podcasts`}
            src={episode.appleEmbedUrl}
            height="175"
            className="w-full max-w-xl overflow-hidden rounded-[10px] border-0"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={episode.appleEpisodeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Headphones className="h-4 w-4" />
                Open in Apple Podcasts
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href={episode.castboxUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen on Castbox
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">
              From Dr. Njo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="border-l-2 border-brand/40 pl-4 font-serif text-lg leading-relaxed text-foreground/90">
              {episode.quote}
            </blockquote>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is a separate conversation from the featured interview with
              Dr. Farokh Jiveh. Jordon Comstock is CEO of{" "}
              <a
                href={episode.boomCloudUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-4 hover:underline"
              >
                BoomCloud
              </a>
              , the company behind the show&apos;s membership-plan work.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continue the conversation</CardTitle>
            <CardDescription>
              Book a call or send a note if this episode raises a transition or
              insurance-planning question.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <BookingButton />
            <Button asChild variant="outline">
              <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dr-michael-njo-interview">
                Watch the Farokh Jiveh interview
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
