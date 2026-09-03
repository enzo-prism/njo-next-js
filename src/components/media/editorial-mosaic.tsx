import Image from "next/image";
import type { EditorialMediaAsset } from "@/data/media";
import { cn } from "@/lib/utils";

type EditorialMosaicProps = {
  assets: readonly EditorialMediaAsset[];
  className?: string;
  interactive?: boolean;
  onSelect?: (asset: EditorialMediaAsset) => void;
  layoutMode?: "grid" | "columns";
  qaCaptions?: Record<string, string>;
};

const tileSpanClasses: Record<
  EditorialMediaAsset["layoutVariant"],
  { base: string; featured: string }
> = {
  landscape: {
    base: "sm:col-span-6 xl:col-span-6",
    featured: "sm:col-span-6 xl:col-span-8",
  },
  portrait: {
    base: "sm:col-span-3 xl:col-span-4",
    featured: "sm:col-span-6 xl:col-span-5",
  },
  poster: {
    base: "sm:col-span-3 xl:col-span-3",
    featured: "sm:col-span-6 xl:col-span-4",
  },
  square: {
    base: "sm:col-span-3 xl:col-span-4",
    featured: "sm:col-span-6 xl:col-span-5",
  },
};

export function EditorialMosaic({
  assets,
  className,
  interactive = false,
  onSelect,
  layoutMode = "grid",
  qaCaptions,
}: EditorialMosaicProps) {
  return (
    <div
      className={cn(
        layoutMode === "columns"
          ? "columns-1 gap-4 sm:columns-2 xl:columns-3"
          : "grid grid-cols-1 gap-4 sm:grid-cols-6 xl:grid-cols-12",
        className,
      )}
    >
      {assets.map((asset) => {
        const spanClasses =
          asset.gridSpan === "full"
            ? "sm:col-span-6 xl:col-span-12"
            : asset.gridSpan === "wide"
              ? "sm:col-span-3 xl:col-span-8"
              : asset.priority
                ? tileSpanClasses[asset.layoutVariant].featured
                : tileSpanClasses[asset.layoutVariant].base;
        const wrapperClasses =
          layoutMode === "columns"
            ? "mb-4 block w-full break-inside-avoid"
            : cn("block w-full", spanClasses);
        const useIntrinsicFrame = layoutMode === "columns";
        const qaCaption = qaCaptions?.[asset.id]?.trim() ?? "";
        const content = (
          <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-slate-100/70 shadow-sm">
            <div
              className="relative"
              style={
                !useIntrinsicFrame
                  ? { aspectRatio: `${asset.width} / ${asset.height}` }
                  : undefined
              }
            >
              {useIntrinsicFrame ? (
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  width={asset.width}
                  height={asset.height}
                  sizes={asset.sizes}
                  className={cn(
                    "h-auto w-full object-contain transition-opacity duration-300",
                  )}
                />
              ) : (
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes={asset.sizes}
                  className={cn(
                    asset.objectFit === "cover"
                      ? "object-cover"
                      : "object-contain",
                    "transition-opacity duration-300",
                  )}
                  style={{ objectPosition: asset.objectPosition ?? "center" }}
                />
              )}
              {interactive ? (
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Open
                </span>
              ) : null}
            </div>
            {qaCaption ? (
              <figcaption className="border-t border-border/70 bg-white/90 px-4 py-3 text-sm leading-5 text-muted-foreground">
                {qaCaption}
              </figcaption>
            ) : null}
          </div>
        );

        if (interactive && onSelect) {
          return (
            <button
              key={asset.id}
              type="button"
              className={cn("group text-left", wrapperClasses)}
              onClick={() => onSelect(asset)}
              aria-label={qaCaption || asset.alt}
            >
              {content}
            </button>
          );
        }

        return (
          <figure key={asset.id} className={wrapperClasses}>
            {content}
          </figure>
        );
      })}
    </div>
  );
}
