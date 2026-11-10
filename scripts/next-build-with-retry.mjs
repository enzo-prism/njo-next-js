#!/usr/bin/env node
/**
 * Runs `next build` with one retry when the Google font loader flakes
 * during CI (`TypeError: Cannot read properties of null (reading '1')`
 * in next/font/google). Production `npm run build` is left unchanged.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const maxAttempts = 2;

function isGoogleFontLoaderFlake(output) {
  return (
    /Cannot read properties of null \(reading ['"]1['"]\)/.test(output) &&
    /next\/font|font\/google|@next\/font|loader\.js/.test(output)
  );
}

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const result = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) {
    console.error(result.error);
  }
  if (result.status === 0) {
    process.exit(0);
  }

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (attempt < maxAttempts && isGoogleFontLoaderFlake(output)) {
    console.error(
      `\nnext/font Google loader failed (attempt ${attempt}/${maxAttempts}); retrying next build...\n`,
    );
    continue;
  }

  process.exit(result.status ?? 1);
}
