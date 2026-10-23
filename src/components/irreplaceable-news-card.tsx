import Image from "next/image";
import Link from "next/link";
import { withIrReplaceableTitle } from "@/components/irreplaceable-book-title";
import { Button } from "@/components/ui/button";
import { CONTACT_PATH } from "@/config/site";
import { communityPosts } from "@/data/community-posts";

const panel =
  "rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-7";

export const newsCardDateClass =
  "text-[13px] font-semibold uppercase tracking-[0.2em] text-brand";

const irreplaceableCommunityPost = communityPosts.find(
  (post) => post.slug === "irreplaceable-leah-roling",
);

function formatCommunityPostDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function IrreplaceableNewsCard() {
  if (!irreplaceableCommunityPost) {
    return null;
  }

  return (
    <article
      id={irreplaceableCommunityPost.slug}
      className={`${panel} scroll-mt-28 space-y-4`}
    >
      <p className={newsCardDateClass}>
        {formatCommunityPostDate(irreplaceableCommunityPost.publishedAt)}
      </p>
      <h2 className="font-serif text-xl font-semibold">
        {withIrReplaceableTitle(irreplaceableCommunityPost.title)}
      </h2>
      {irreplaceableCommunityPost.image ? (
        <Image
          src={irreplaceableCommunityPost.image.src}
          alt={irreplaceableCommunityPost.image.alt}
          width={irreplaceableCommunityPost.image.width}
          height={irreplaceableCommunityPost.image.height}
          className="h-auto w-full max-w-md rounded-xl bg-slate-50 object-contain"
          sizes="(min-width: 768px) 448px, 100vw"
          priority
        />
      ) : null}
      {irreplaceableCommunityPost.body.map((paragraph) => (
        <p
          key={paragraph}
          className="text-pretty text-sm leading-relaxed text-muted-foreground"
        >
          {withIrReplaceableTitle(paragraph)}
        </p>
      ))}
      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/blog/${irreplaceableCommunityPost.slug}`}>
            Read the full story
          </Link>
        </Button>
      </div>
    </article>
  );
}
