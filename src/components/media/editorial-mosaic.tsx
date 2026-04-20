import Image from "next/image";
import type { EditorialMediaAsset } from "@/data/media";
import { cn } from "@/lib/utils";

type EditorialMosaicProps = {
  assets: readonly EditorialMediaAsset[];
  className?: string;
  captionMode?: "hidden" | "below";
  interactive?: boolean;
  onSelect?: (asset: EditorialMediaAsset) => void;
  layoutMode?: "grid" | "columns";
};

const tileSpanClasses: Record<EditorialMediaAsset["layoutVariant"], { base: string; featured: string }> = {
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

const tileAspectClasses: Record<EditorialMediaAsset["layoutVariant"], string> = {
  landscape: "aspect-[4/3] xl:aspect-[16/10]",
  portrait: "aspect-[4/5]",
  poster: "aspect-[9/14]",
  square: "aspect-square",
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
        const spanClasses = asset.priority
          ? tileSpanClasses[asset.layoutVariant].featured
          : tileSpanClasses[asset.layoutVariant].base;
        const wrapperClasses =
          layoutMode === "columns"
            ? "mb-4 block w-full break-inside-avoid space-y-3"
            : cn("block w-full space-y-3", spanClasses);
        const content = (
          <>
            <div
              className={cn(
                "relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-slate-100/70 shadow-sm",
                tileAspectClasses[asset.layoutVariant],
              )}
            >
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                sizes={asset.sizes}
                className={cn(
                  "object-cover transition duration-300",
                  interactive && "group-hover:scale-[1.03] group-focus-visible:scale-[1.03]",
                )}
                style={{ objectPosition: asset.objectPosition ?? "center" }}
              />
              {interactive ? (
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Open
                </span>
              ) : null}
            </div>
            {captionMode === "below" && asset.caption ? (
              <div className="space-y-1 px-1">
                <p className="text-sm font-medium text-foreground">{asset.alt}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{asset.caption}</p>
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
