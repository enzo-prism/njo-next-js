import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const mediaDirectory = path.join(process.cwd(), "src/assets/media");
const publicDirectory = path.join(process.cwd(), "public");
const sourceDirectory = path.join(process.cwd(), "src");
const mediaSourcePath = path.join(process.cwd(), "src/data/media.ts");
const mosaicSourcePath = path.join(
  process.cwd(),
  "src/components/media/editorial-mosaic.tsx",
);
const heroSourcePath = path.join(
  process.cwd(),
  "src/components/media/hero-slideshow.tsx",
);

async function filesWithin(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesWithin(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

async function main() {
  const mediaSource = await readFile(mediaSourcePath, "utf8");
  const mosaicSource = await readFile(mosaicSourcePath, "utf8");
  const heroSource = await readFile(heroSourcePath, "utf8");
  const localImports = new Map<string, string>();

  for (const match of mediaSource.matchAll(
    /import\s+(\w+)\s+from\s+"@\/assets\/media\/([^"\n]+)";/g,
  )) {
    localImports.set(match[2], match[1]);
  }

  const errors: string[] = [];
  const files = await readdir(mediaDirectory);

  for (const fileName of files) {
    const importName = localImports.get(fileName);
    if (!importName) continue;

    const metadata = await sharp(
      path.join(mediaDirectory, fileName),
    ).metadata();
    const orientation = metadata.orientation ?? 1;
    if (orientation === 1) continue;

    const width = metadata.width;
    const height = metadata.height;
    if (!width || !height) {
      errors.push(`${fileName}: Sharp could not read image dimensions.`);
      continue;
    }

    const swapsAxes = orientation >= 5 && orientation <= 8;
    const displayWidth = swapsAxes ? height : width;
    const displayHeight = swapsAxes ? width : height;
    const sourceMarker = `src: ${importName},`;
    const sourceIndex = mediaSource.indexOf(sourceMarker);

    if (sourceIndex === -1) {
      errors.push(
        `${fileName}: imported asset is not registered with createLocalAsset.`,
      );
      continue;
    }

    const blockStart = mediaSource.lastIndexOf(
      "createLocalAsset({",
      sourceIndex,
    );
    const blockEnd = mediaSource.indexOf("}),", sourceIndex);
    const assetBlock =
      blockStart >= 0 && blockEnd >= 0
        ? mediaSource.slice(blockStart, blockEnd)
        : "";

    if (
      !assetBlock.includes(`displayWidth: ${displayWidth},`) ||
      !assetBlock.includes(`displayHeight: ${displayHeight},`)
    ) {
      errors.push(
        `${fileName}: EXIF orientation ${orientation} displays at ${displayWidth}x${displayHeight}; ` +
          "declare matching displayWidth/displayHeight in src/data/media.ts.",
      );
    }

    const expectedVariant =
      displayWidth < displayHeight ? "portrait" : "landscape";
    if (!assetBlock.includes(`layoutVariant: "${expectedVariant}"`)) {
      errors.push(
        `${fileName}: displayed orientation requires layoutVariant: "${expectedVariant}".`,
      );
    }
  }

  if (!mosaicSource.includes("aspectRatio: `${asset.width} / ${asset.height}`")) {
    errors.push(
      "Editorial mosaics must derive their frame ratio from each asset's display dimensions.",
    );
  }

  if (
    mosaicSource.includes("group-hover:scale") ||
    mosaicSource.includes("group-focus-visible:scale")
  ) {
    errors.push(
      "Editorial mosaics must not re-crop images with hover or focus zooms.",
    );
  }

  if (!/slide\.objectFit === "cover"[\s\S]*\? "object-cover"[\s\S]*: "object-contain"/.test(heroSource)) {
    errors.push(
      "Hero slides must default to full-frame rendering unless cover is explicit.",
    );
  }
  if (
    heroSource.includes("scale-[1.06]") ||
    heroSource.includes("transition-transform")
  ) {
    errors.push("Hero slides must not re-crop images during transitions.");
  }

  const sourceFiles = (await filesWithin(sourceDirectory)).filter((fileName) =>
    /\.(ts|tsx)$/.test(fileName),
  );
  const allowedCoverFiles = new Set([
    path.join(sourceDirectory, "components/media/editorial-mosaic.tsx"),
    path.join(sourceDirectory, "components/media/hero-slideshow.tsx"),
    path.join(sourceDirectory, "components/pages/home.tsx"),
  ]);

  for (const sourceFile of sourceFiles) {
    const sourceText = await readFile(sourceFile, "utf8");
    if (
      sourceText.includes("object-cover") &&
      !allowedCoverFiles.has(sourceFile)
    ) {
      errors.push(
        `${path.relative(process.cwd(), sourceFile)}: unmanaged object-cover usage.`,
      );
    }
  }

  const homeSource = await readFile(
    path.join(sourceDirectory, "components/pages/home.tsx"),
    "utf8",
  );
  if (!homeSource.includes('className="object-cover object-top"')) {
    errors.push(
      "The circular Dr. Njo headshot requires its reviewed top focal position.",
    );
  }

  const publicRasterFiles = (await filesWithin(publicDirectory)).filter(
    (fileName) => /\.(jpe?g|png|webp)$/i.test(fileName),
  );
  for (const publicFile of publicRasterFiles) {
    const metadata = await sharp(publicFile).metadata();
    if ((metadata.orientation ?? 1) !== 1) {
      errors.push(
        `${path.relative(process.cwd(), publicFile)}: normalize EXIF orientation before using a public image.`,
      );
    }
  }

  if (!mediaSource.includes("Dr. Allen Budenz")) {
    errors.push("The tuxedo-and-medallion portrait must name Dr. Allen Budenz.");
  }
  if (mediaSource.includes("Allan Budenz") || mediaSource.includes("Alan Budenz")) {
    errors.push("Do not misspell Dr. Allen Budenz.");
  }
  if (
    !mediaSource.includes(
      "On the board of an AI startup (in stealth mode): with the founder and board of directors, notably former Dean of University of the Pacific School of Dentistry, Nader Nadershahi, and Interim Dean Dr. Chavez.",
    )
  ) {
    errors.push(
      "The office leadership photo must use Mike's AI-startup caption and name Nader Nadershahi and Interim Dean Dr. Chavez.",
    );
  }
  if (/\bNader Shahi\b/.test(mediaSource)) {
    errors.push("Spell the former Pacific dean as Nader Nadershahi, not Nader Shahi.");
  }
  if (mediaSource.toLowerCase().includes("openai")) {
    errors.push("Do not name the AI startup.");
  }
  if (!mediaSource.includes("Los Angeles Panel of Experts dinner")) {
    errors.push("Recent LA Panel of Experts dinner photos belong in the editorial gallery.");
  }
  if (!mediaSource.includes("The Practice Blueprint dinner in Roseville, August 2026.")) {
    errors.push("The Roseville Practice Blueprint dinner collage belongs in the editorial gallery.");
  }

  if (errors.length > 0) {
    console.error("Media framing checks failed:\n");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Media framing checks passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
