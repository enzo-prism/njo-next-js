import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceArticleDetailPage from "@/components/pages/resource-article-detail";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildResourceArticlePath, getResourceArticleBySlug, resourceArticles } from "@/data/resource-articles";
import { buildRouteMetadata } from "@/seo/metadata";
import { buildPageStructuredData } from "@/seo/route-structured-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return resourceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildRouteMetadata(buildResourceArticlePath(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getResourceArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const pathname = buildResourceArticlePath(article.slug);

  return (
    <>
      <StructuredDataScript data={buildPageStructuredData(pathname)} id="route-structured-data" />
      <ResourceArticleDetailPage article={article} />
    </>
  );
}
