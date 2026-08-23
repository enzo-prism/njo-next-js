import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityPostDetailPage from "@/components/pages/community-post-detail";
import { buildCommunityPostPath, communityPosts, getCommunityPostBySlug } from "@/data/community-posts";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return communityPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildRouteMetadata(buildCommunityPostPath(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getCommunityPostBySlug(slug);
  if (!post) notFound();

  const pathname = buildCommunityPostPath(post.slug);
  return (
    <>
      <StructuredDataScript data={buildPageStructuredData(pathname)} id="route-structured-data" />
      <CommunityPostDetailPage post={post} />
    </>
  );
}
