import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

const MUTANT_PREFIX = "news-polish-mutants-";

function sweepStaleMutantSandboxes() {
  const tmp = os.tmpdir();
  for (const name of readdirSync(tmp)) {
    if (!name.startsWith(MUTANT_PREFIX)) continue;
    rmSync(path.join(tmp, name), { recursive: true, force: true });
  }
}

function removeSandbox(dir: string | undefined) {
  if (!dir) return;
  rmSync(dir, { recursive: true, force: true });
}

const repoRoot = process.cwd();
const repoDetail = path.join(repoRoot, "src/components/pages/community-post-detail.tsx");
const repoNewsCard = path.join(repoRoot, "src/components/irreplaceable-news-card.tsx");
const repoProfile = path.join(repoRoot, "src/components/pages/michael-njo-dds.tsx");
const repoDetailOriginal = readFileSync(repoDetail, "utf8");
const repoNewsCardOriginal = readFileSync(repoNewsCard, "utf8");
const repoProfileOriginal = readFileSync(repoProfile, "utf8");
const tsxCli = path.join(repoRoot, "node_modules/tsx/dist/cli.mjs");

sweepStaleMutantSandboxes();

const tmpRoot = mkdtempSync(path.join(os.tmpdir(), MUTANT_PREFIX));
let activeSandbox: string | undefined = tmpRoot;

function cleanupActiveSandbox() {
  removeSandbox(activeSandbox);
  activeSandbox = undefined;
}

function exitWithCleanup(code: number) {
  cleanupActiveSandbox();
  process.exit(code);
}

process.on("SIGINT", () => exitWithCleanup(130));
process.on("SIGTERM", () => exitWithCleanup(143));
process.on("SIGHUP", () => exitWithCleanup(129));
process.on("uncaughtException", (error) => {
  console.error(error);
  exitWithCleanup(1);
});
process.on("unhandledRejection", (reason) => {
  console.error(reason);
  exitWithCleanup(1);
});

function assertRepoUnchanged() {
  assert.equal(readFileSync(repoDetail, "utf8"), repoDetailOriginal, "mutants must not rewrite community-post-detail.tsx");
  assert.equal(readFileSync(repoNewsCard, "utf8"), repoNewsCardOriginal, "mutants must not rewrite irreplaceable-news-card.tsx");
  assert.equal(readFileSync(repoProfile, "utf8"), repoProfileOriginal, "mutants must not rewrite michael-njo-dds.tsx");
}

function seedSandbox() {
  rmSync(path.join(tmpRoot, "src"), { recursive: true, force: true });
  rmSync(path.join(tmpRoot, "scripts"), { recursive: true, force: true });
  cpSync(path.join(repoRoot, "src"), path.join(tmpRoot, "src"), { recursive: true });
  mkdirSync(path.join(tmpRoot, "scripts"), { recursive: true });
  cpSync(path.join(repoRoot, "scripts/check-events.ts"), path.join(tmpRoot, "scripts/check-events.ts"));
  cpSync(path.join(repoRoot, "tsconfig.json"), path.join(tmpRoot, "tsconfig.json"));
  const nextEnv = path.join(repoRoot, "next-env.d.ts");
  if (existsSync(nextEnv)) {
    cpSync(nextEnv, path.join(tmpRoot, "next-env.d.ts"));
  }
  const modulesLink = path.join(tmpRoot, "node_modules");
  if (!existsSync(modulesLink)) {
    symlinkSync(path.join(repoRoot, "node_modules"), modulesLink);
  }
  const publicLink = path.join(tmpRoot, "public");
  if (!existsSync(publicLink)) {
    symlinkSync(path.join(repoRoot, "public"), publicLink);
  }
}

function sandboxPaths() {
  return {
    detail: path.join(tmpRoot, "src/components/pages/community-post-detail.tsx"),
    newsCard: path.join(tmpRoot, "src/components/irreplaceable-news-card.tsx"),
    profile: path.join(tmpRoot, "src/components/pages/michael-njo-dds.tsx"),
  };
}

function runCheckEvents() {
  const childEnv = { ...process.env };
  delete childEnv.NEWS_POLISH_MUTANTS;
  return spawnSync(process.execPath, [tsxCli, "scripts/check-events.ts"], {
    cwd: tmpRoot,
    env: childEnv,
    encoding: "utf8",
  });
}

function assertMutantFails(name: string, apply: (files: ReturnType<typeof sandboxPaths>) => void) {
  seedSandbox();
  const files = sandboxPaths();
  const before = {
    detail: readFileSync(files.detail, "utf8"),
    newsCard: readFileSync(files.newsCard, "utf8"),
    profile: readFileSync(files.profile, "utf8"),
  };
  apply(files);
  const changed =
    readFileSync(files.detail, "utf8") !== before.detail ||
    readFileSync(files.newsCard, "utf8") !== before.newsCard ||
    readFileSync(files.profile, "utf8") !== before.profile;
  assert.equal(changed, true, `${name} mutant must change a sandbox file`);
  assertRepoUnchanged();
  const result = runCheckEvents();
  assertRepoUnchanged();
  assert.notEqual(result.status, 0, `${name} must fail check-events\n${result.stderr}\n${result.stdout}`);
  console.log(`Mutant ${name} failed as required (exit ${result.status}).`);
}

try {
  seedSandbox();
  const control = runCheckEvents();
  assertRepoUnchanged();
  assert.equal(control.status, 0, `No-op control must pass check-events\n${control.stderr}\n${control.stdout}`);
  console.log("Mutant no-op control passed.");

  assertMutantFails("P1 helper dropped on post body", (files) => {
    writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(paragraph)}", "{paragraph}"));
  });
  assertMutantFails("P2 helper dropped on H1", (files) => {
    writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(post.title)}", "{post.title}"));
  });
  assertMutantFails("P3 helper dropped on subtitle", (files) => {
    writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(post.description)}", "{post.description}"));
  });
  assertMutantFails("C1 helper dropped on News card body", (files) => {
    writeFileSync(files.newsCard, readFileSync(files.newsCard, "utf8").replace("{withIrReplaceableTitle(paragraph)}", "{paragraph}"));
  });
  assertMutantFails("H2 partial hardcoded News card text", (files) => {
    writeFileSync(
      files.newsCard,
      readFileSync(files.newsCard, "utf8").replace(
        `      {irreplaceableCommunityPost.body.map((paragraph) => (
        <p
          key={paragraph}
          className="text-pretty text-sm leading-relaxed text-muted-foreground"
        >
          {withIrReplaceableTitle(paragraph)}
        </p>
      ))}`,
        `      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        Role clarity, ownership, and strong leadership are essential.
      </p>`,
      ),
    );
  });
  assertMutantFails("M1 54ch removed", (files) => {
    writeFileSync(files.detail, readFileSync(files.detail, "utf8").replaceAll("max-w-[54ch] ", ""));
  });
  assertMutantFails("N1 News date back to text-xs", (files) => {
    writeFileSync(files.newsCard, readFileSync(files.newsCard, "utf8").replace("text-[13px]", "text-xs"));
  });
  assertMutantFails("N2 another News card date set to text-xs", (files) => {
    writeFileSync(
      files.profile,
      readFileSync(files.profile, "utf8").replace(
        "<p className={newsCardDateClass}>",
        '<p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">',
      ),
    );
  });
} finally {
  cleanupActiveSandbox();
  assertRepoUnchanged();
}

console.log("News polish mutant assertions passed.");
