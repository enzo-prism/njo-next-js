import Image from "next/image";
import type { EditorialMediaAsset } from "@/data/media";
import { PhotoNameOverlay } from "@/components/media/photo-name-overlay";
import { cn } from "@/lib/utils";

type EditorialMosaicProps = {
  assets: readonly EditorialMediaAsset[];
  className?: string;
  captionMode?: "hidden" | "below";
  interactive?: boolean;
  onSelect?: (asset: EditorialMediaAsset) => void;
  layoutMode?: "grid" | "columns";
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
  captionMode = "below",
  interactive = false,
  onSelect,
  layoutMode = "grid",
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
            ? "mb-4 block w-full break-inside-avoid space-y-3"
            : cn("block w-full space-y-3", spanClasses);
        const useIntrinsicFrame = layoutMode === "columns";
        const content = (
          <>
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
              <PhotoNameOverlay names={asset.names} />
            </div>
            {captionMode === "below" && asset.caption ? (
              <div className="space-y-1 px-1">
                {asset.names?.length ? (
                  <p className="text-sm font-semibold text-foreground">
                    {asset.names.join(" · ")}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {asset.alt}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {asset.caption}
                </p>
              </div>
            ) : null}
          </>
        );

        if (interactive && onSelect) {
          return (
            <button
              key={asset.id}
              type="button"
              className={cn("group text-left", wrapperClasses)}
              onClick={() => onSelect(asset)}
              aria-label={asset.alt}
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
