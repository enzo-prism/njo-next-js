import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const PHOTO_WIDTH = 504;
const PHOTO_HEIGHT = 630;
const PHOTO_LEFT = 348;
const PHOTO_RIGHT = PHOTO_LEFT + PHOTO_WIDTH;
const EDGE_SAMPLE_PX = 8;
const VERTICAL_BLUR_SIGMA = 15;
const COVER_PATH = "public/media/irreplaceable-leah-roling-dr-njo.webp";
const OUTPUT_PATH = "public/media/irreplaceable-leah-roling-og.jpg";
const MAX_EDGE_STEP = 2;

function gaussianKernel(sigma: number) {
  const radius = Math.ceil(sigma * 3);
  const denom = 2 * sigma * sigma;
  const kernel: number[] = [];
  let sum = 0;
  for (let offset = -radius; offset <= radius; offset += 1) {
    const weight = Math.exp(-(offset * offset) / denom);
    kernel.push(weight);
    sum += weight;
  }
  return kernel.map((weight) => weight / sum);
}

function blurRows(rows: Array<[number, number, number]>, kernel: number[]) {
  const radius = (kernel.length - 1) / 2;
  return rows.map((_, rowIndex) => {
    const mixed: [number, number, number] = [0, 0, 0];
    for (let offset = -radius; offset <= radius; offset += 1) {
      const sampleIndex = Math.min(rows.length - 1, Math.max(0, rowIndex + offset));
      const weight = kernel[offset + radius] ?? 0;
      const sample = rows[sampleIndex];
      if (!sample) continue;
      mixed[0] += sample[0] * weight;
      mixed[1] += sample[1] * weight;
      mixed[2] += sample[2] * weight;
    }
    return mixed;
  });
}

function meanRgb(pixels: Buffer, width: number, channels: number, x0: number, y: number, count: number) {
  let red = 0;
  let green = 0;
  let blue = 0;
  for (let x = x0; x < x0 + count; x += 1) {
    const index = (y * width + x) * channels;
    red += pixels[index] ?? 0;
    green += pixels[index + 1] ?? 0;
    blue += pixels[index + 2] ?? 0;
  }
  return [red / count, green / count, blue / count] as [number, number, number];
}

function pixelRgb(pixels: Buffer, width: number, channels: number, x: number, y: number) {
  const index = (y * width + x) * channels;
  return [pixels[index] ?? 0, pixels[index + 1] ?? 0, pixels[index + 2] ?? 0] as [number, number, number];
}

function writePixel(pixels: Buffer, width: number, x: number, y: number, rgb: [number, number, number]) {
  const index = (y * width + x) * 3;
  pixels[index] = Math.round(rgb[0]);
  pixels[index + 1] = Math.round(rgb[1]);
  pixels[index + 2] = Math.round(rgb[2]);
}

function channelStep(left: [number, number, number], right: [number, number, number]) {
  return Math.max(
    Math.abs(left[0] - right[0]),
    Math.abs(left[1] - right[1]),
    Math.abs(left[2] - right[2]),
  );
}

function measureSeams(pixels: Buffer, width: number, height: number, channels: number) {
  let leftMax = 0;
  let rightMax = 0;
  let leftRow = 0;
  let rightRow = 0;
  for (let y = 0; y < height; y += 1) {
    const left = channelStep(
      pixelRgb(pixels, width, channels, PHOTO_LEFT - 1, y),
      pixelRgb(pixels, width, channels, PHOTO_LEFT, y),
    );
    const right = channelStep(
      pixelRgb(pixels, width, channels, PHOTO_RIGHT - 1, y),
      pixelRgb(pixels, width, channels, PHOTO_RIGHT, y),
    );
    if (left > leftMax) {
      leftMax = left;
      leftRow = y;
    }
    if (right > rightMax) {
      rightMax = right;
      rightRow = y;
    }
  }
  return { leftMax, leftRow, rightMax, rightRow };
}

async function main() {
  const cover = await sharp(path.join(process.cwd(), COVER_PATH))
    .resize(PHOTO_WIDTH, PHOTO_HEIGHT, {
      fit: "fill",
      kernel: "lanczos3",
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  assert.equal(cover.info.width, PHOTO_WIDTH);
  assert.equal(cover.info.height, PHOTO_HEIGHT);

  const leftSamples: Array<[number, number, number]> = [];
  const rightSamples: Array<[number, number, number]> = [];
  for (let y = 0; y < PHOTO_HEIGHT; y += 1) {
    leftSamples.push(meanRgb(cover.data, cover.info.width, cover.info.channels, 0, y, EDGE_SAMPLE_PX));
    rightSamples.push(
      meanRgb(
        cover.data,
        cover.info.width,
        cover.info.channels,
        PHOTO_WIDTH - EDGE_SAMPLE_PX,
        y,
        EDGE_SAMPLE_PX,
      ),
    );
  }

  const kernel = gaussianKernel(VERTICAL_BLUR_SIGMA);
  const leftFill = blurRows(leftSamples, kernel);
  const rightFill = blurRows(rightSamples, kernel);

  const canvas = Buffer.alloc(CANVAS_WIDTH * CANVAS_HEIGHT * 3);
  for (let y = 0; y < CANVAS_HEIGHT; y += 1) {
    const left = leftFill[y] ?? [0, 0, 0];
    const right = rightFill[y] ?? [0, 0, 0];
    const leftEdge = pixelRgb(cover.data, cover.info.width, cover.info.channels, 0, y);
    const rightEdge = pixelRgb(cover.data, cover.info.width, cover.info.channels, PHOTO_WIDTH - 1, y);

    for (let x = 0; x < PHOTO_LEFT; x += 1) {
      const distance = PHOTO_LEFT - 1 - x;
      const blend = Math.min(1, distance / EDGE_SAMPLE_PX);
      writePixel(canvas, CANVAS_WIDTH, x, y, [
        leftEdge[0] + (left[0] - leftEdge[0]) * blend,
        leftEdge[1] + (left[1] - leftEdge[1]) * blend,
        leftEdge[2] + (left[2] - leftEdge[2]) * blend,
      ]);
    }
    for (let x = PHOTO_RIGHT; x < CANVAS_WIDTH; x += 1) {
      const distance = x - PHOTO_RIGHT;
      const blend = Math.min(1, distance / EDGE_SAMPLE_PX);
      writePixel(canvas, CANVAS_WIDTH, x, y, [
        rightEdge[0] + (right[0] - rightEdge[0]) * blend,
        rightEdge[1] + (right[1] - rightEdge[1]) * blend,
        rightEdge[2] + (right[2] - rightEdge[2]) * blend,
      ]);
    }
    for (let x = 0; x < PHOTO_WIDTH; x += 1) {
      writePixel(
        canvas,
        CANVAS_WIDTH,
        PHOTO_LEFT + x,
        y,
        pixelRgb(cover.data, cover.info.width, cover.info.channels, x, y),
      );
    }
  }

  const jpeg = await sharp(canvas, {
    raw: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, channels: 3 },
  })
    .jpeg({
      quality: 85,
      chromaSubsampling: "4:2:0",
      mozjpeg: false,
      optimizeCoding: false,
    })
    .toBuffer();

  const rawSeams = measureSeams(canvas, CANVAS_WIDTH, CANVAS_HEIGHT, 3);
  const encoded = await sharp(jpeg).raw().toBuffer({ resolveWithObject: true });
  const seams = measureSeams(encoded.data, encoded.info.width, encoded.info.height, encoded.info.channels);
  assert.ok(
    seams.leftMax <= MAX_EDGE_STEP,
    `Left seam step ${seams.leftMax} at y=${seams.leftRow} must be <= ${MAX_EDGE_STEP}`,
  );
  assert.ok(
    seams.rightMax <= MAX_EDGE_STEP,
    `Right seam step ${seams.rightMax} at y=${seams.rightRow} must be <= ${MAX_EDGE_STEP}`,
  );

  const outputPath = path.join(process.cwd(), OUTPUT_PATH);
  writeFileSync(outputPath, jpeg);
  const hash = createHash("sha256").update(readFileSync(outputPath)).digest("hex");

  console.log(
    JSON.stringify(
      {
        output: OUTPUT_PATH,
        bytes: jpeg.length,
        sha256: hash,
        photo: { width: PHOTO_WIDTH, height: PHOTO_HEIGHT, left: PHOTO_LEFT },
        fill: { edgeSamplePx: EDGE_SAMPLE_PX, verticalBlurSigma: VERTICAL_BLUR_SIGMA },
        edgeStep: {
          beforeJpeg: {
            left: { max: rawSeams.leftMax, row: rawSeams.leftRow, x: PHOTO_LEFT },
            right: { max: rawSeams.rightMax, row: rawSeams.rightRow, x: PHOTO_RIGHT - 1 },
          },
          jpeg: {
            left: { max: seams.leftMax, row: seams.leftRow, x: PHOTO_LEFT },
            right: { max: seams.rightMax, row: seams.rightRow, x: PHOTO_RIGHT - 1 },
          },
        },
      },
      null,
      2,
    ),
  );
}

void main();
