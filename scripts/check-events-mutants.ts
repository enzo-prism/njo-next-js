import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

const MUTANT_PREFIX = "news-polish-mutants-";
const OWNER_FILE = "owner.pid";
const STALE_AGE_MS = 30 * 60 * 1000;
const CHILD_TIMEOUT_MS = 60_000;
const HOLD_MS = 20_000;

type CheckResult = {
  status: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};

function isPidAlive(pid: number) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function writeOwnerLock(dir: string, pid = process.pid) {
  writeFileSync(path.join(dir, OWNER_FILE), `${pid}\n`, "utf8");
}

function sweepStaleMutantSandboxes(keepDir?: string) {
  const tmp = os.tmpdir();
  const now = Date.now();
  for (const name of readdirSync(tmp)) {
    if (!name.startsWith(MUTANT_PREFIX)) continue;
    const dir = path.join(tmp, name);
    if (keepDir && path.resolve(dir) === path.resolve(keepDir)) continue;
    let shouldRemove = false;
    try {
      const info = statSync(dir);
      const ageMs = now - info.mtimeMs;
      const ownerPath = path.join(dir, OWNER_FILE);
      if (!existsSync(ownerPath)) {
        shouldRemove = ageMs > STALE_AGE_MS;
      } else {
        const pid = Number(readFileSync(ownerPath, "utf8").trim());
        shouldRemove = !isPidAlive(pid) || ageMs > STALE_AGE_MS;
      }
    } catch {
      shouldRemove = true;
    }
    if (shouldRemove) {
      rmSync(dir, { recursive: true, force: true });
    }
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
writeOwnerLock(tmpRoot);
let activeSandbox: string | undefined = tmpRoot;
let activeChild: ChildProcess | undefined;

function cleanupActiveSandbox() {
  removeSandbox(activeSandbox);
  activeSandbox = undefined;
}

function interruptCleanup(code: number) {
  if (activeChild?.pid) {
    activeChild.kill("SIGTERM");
  }
  cleanupActiveSandbox();
  process.exit(code);
}

process.on("SIGINT", () => interruptCleanup(130));
process.on("SIGTERM", () => interruptCleanup(143));
process.on("SIGHUP", () => interruptCleanup(129));
process.on("uncaughtException", (error) => {
  console.error(error);
  interruptCleanup(1);
});
process.on("unhandledRejection", (reason) => {
  console.error(reason);
  interruptCleanup(1);
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
  writeOwnerLock(tmpRoot);
}

function sandboxPaths() {
  return {
    detail: path.join(tmpRoot, "src/components/pages/community-post-detail.tsx"),
    newsCard: path.join(tmpRoot, "src/components/irreplaceable-news-card.tsx"),
    profile: path.join(tmpRoot, "src/components/pages/michael-njo-dds.tsx"),
  };
}

function runCheckEvents(): Promise<CheckResult> {
  const childEnv = { ...process.env };
  delete childEnv.NEWS_POLISH_MUTANTS;
  delete childEnv.NEWS_POLISH_MUTANT_HOLD;
  delete childEnv.NEWS_POLISH_MUTANT_PROOF;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsxCli, "scripts/check-events.ts"], {
      cwd: tmpRoot,
      env: childEnv,
    });
    activeChild = child;
    let stdout = "";
    let stderr = "";
    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
    }, CHILD_TIMEOUT_MS);
    child.on("error", (error) => {
      clearTimeout(timer);
      activeChild = undefined;
      reject(error);
    });
    child.on("close", (status, signal) => {
      clearTimeout(timer);
      activeChild = undefined;
      resolve({ status, signal, stdout, stderr });
    });
  });
}

function assertRequiredFailure(name: string, result: CheckResult) {
  if (result.signal || result.status === null) {
    throw new Error(
      `${name} was killed by signal ${result.signal ?? "unknown"} (not a required mutant failure)\n${result.stderr}\n${result.stdout}`,
    );
  }
  assert.notEqual(result.status, 0, `${name} must fail check-events\n${result.stderr}\n${result.stdout}`);
  console.log(`Mutant ${name} failed as required (exit ${result.status}).`);
}

async function assertMutantFails(name: string, apply: (files: ReturnType<typeof sandboxPaths>) => void) {
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
  const result = await runCheckEvents();
  assertRepoUnchanged();
  assertRequiredFailure(name, result);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForExit(child: ChildProcess) {
  return new Promise<void>((resolve) => {
    if (child.exitCode !== null || child.signalCode) {
      resolve();
      return;
    }
    child.once("close", () => resolve());
  });
}

async function assertOverlapSweepKeepsLiveSandbox() {
  const other = mkdtempSync(path.join(os.tmpdir(), MUTANT_PREFIX));
  const holder = spawn(
    process.execPath,
    [
      "-e",
      `const fs=require("node:fs");const path=require("node:path");fs.writeFileSync(path.join(process.argv[1],"owner.pid"),process.pid+"\\n");setInterval(()=>{},1000);`,
      other,
    ],
    { stdio: "ignore" },
  );
  const deadline = Date.now() + 2000;
  while (!existsSync(path.join(other, OWNER_FILE)) && Date.now() < deadline) {
    await wait(25);
  }
  assert.equal(existsSync(path.join(other, OWNER_FILE)), true, "overlap holder must write owner.pid");
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(other), true, "live overlapping sandbox must survive sweep");
  holder.kill("SIGTERM");
  await waitForExit(holder);
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(other), false, "dead overlapping sandbox must be swept");

  const stale = mkdtempSync(path.join(os.tmpdir(), MUTANT_PREFIX));
  writeOwnerLock(stale, process.pid);
  const old = new Date(Date.now() - STALE_AGE_MS - 1000);
  utimesSync(stale, old, old);
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(stale), false, "age-stale sandbox must be swept even if the owner is alive");
  console.log("Overlap sweep kept a live sandbox and removed dead and age-stale sandboxes.");
}

function spawnHoldRun() {
  return spawn(process.execPath, [tsxCli, "scripts/check-events-mutants.ts"], {
    cwd: repoRoot,
    env: { ...process.env, NEWS_POLISH_MUTANT_HOLD: "1" },
    detached: true,
    stdio: "ignore",
  });
}

async function waitForHoldSandbox(child: ChildProcess) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const owned = readdirSync(os.tmpdir())
      .filter((name) => name.startsWith(MUTANT_PREFIX))
      .map((name) => path.join(os.tmpdir(), name))
      .filter((dir) => {
        try {
          return Number(readFileSync(path.join(dir, OWNER_FILE), "utf8").trim()) === child.pid;
        } catch {
          return false;
        }
      });
    if (owned.length > 0) {
      return owned[0];
    }
    await wait(50);
  }
  throw new Error(`hold run ${child.pid} did not create an owned sandbox`);
}

async function assertInterruptCleansSandbox() {
  const cases: Array<{ signal: NodeJS.Signals; delayMs: number; group: boolean }> = [
    { signal: "SIGINT", delayMs: 300, group: false },
    { signal: "SIGTERM", delayMs: 300, group: false },
    { signal: "SIGINT", delayMs: 800, group: false },
    { signal: "SIGTERM", delayMs: 800, group: false },
    { signal: "SIGINT", delayMs: 800, group: true },
    { signal: "SIGTERM", delayMs: 800, group: true },
    { signal: "SIGINT", delayMs: 1500, group: false },
    { signal: "SIGTERM", delayMs: 1500, group: false },
  ];
  for (const testCase of cases) {
    const child = spawnHoldRun();
    if (!child.pid) {
      throw new Error("hold run did not start");
    }
    const sandbox = await waitForHoldSandbox(child);
    await wait(testCase.delayMs);
    if (testCase.group) {
      process.kill(-child.pid, testCase.signal);
    } else {
      child.kill(testCase.signal);
    }
    await Promise.race([waitForExit(child), wait(3000)]);
    if (child.exitCode === null && !child.signalCode) {
      child.kill("SIGKILL");
      await waitForExit(child);
    }
    assert.equal(
      existsSync(sandbox),
      false,
      `${testCase.signal} ${testCase.group ? "group" : "parent"} at ${testCase.delayMs}ms must remove ${sandbox}`,
    );
  }
  console.log(`Interrupt cleanup removed the sandbox in ${cases.length} repeated SIGINT/SIGTERM runs.`);
}

async function holdUntilInterrupted() {
  seedSandbox();
  await wait(HOLD_MS);
}

async function main() {
  if (process.env.NEWS_POLISH_MUTANT_HOLD === "1") {
    await holdUntilInterrupted();
    return;
  }

  try {
    await assertOverlapSweepKeepsLiveSandbox();
    seedSandbox();
    const control = await runCheckEvents();
    assertRepoUnchanged();
    if (control.signal || control.status === null) {
      throw new Error(
        `No-op control was killed by signal ${control.signal ?? "unknown"}\n${control.stderr}\n${control.stdout}`,
      );
    }
    assert.equal(control.status, 0, `No-op control must pass check-events\n${control.stderr}\n${control.stdout}`);
    console.log("Mutant no-op control passed.");

    await assertMutantFails("P1 helper dropped on post body", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(paragraph)}", "{paragraph}"));
    });
    await assertMutantFails("P2 helper dropped on H1", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(post.title)}", "{post.title}"));
    });
    await assertMutantFails("P3 helper dropped on subtitle", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(post.description)}", "{post.description}"));
    });
    await assertMutantFails("C1 helper dropped on News card body", (files) => {
      writeFileSync(files.newsCard, readFileSync(files.newsCard, "utf8").replace("{withIrReplaceableTitle(paragraph)}", "{paragraph}"));
    });
    await assertMutantFails("H2 partial hardcoded News card text", (files) => {
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
    await assertMutantFails("M1 54ch removed", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replaceAll("max-w-[54ch] ", ""));
    });
    await assertMutantFails("N1 News date back to text-xs", (files) => {
      writeFileSync(files.newsCard, readFileSync(files.newsCard, "utf8").replace("text-[13px]", "text-xs"));
    });
    await assertMutantFails("N2 another News card date set to text-xs", (files) => {
      writeFileSync(
        files.profile,
        readFileSync(files.profile, "utf8").replace(
          "<p className={newsCardDateClass}>",
          '<p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">',
        ),
      );
    });
    await assertMutantFails("N2inner text-xs span inside the date paragraph", (files) => {
      writeFileSync(
        files.profile,
        readFileSync(files.profile, "utf8").replace(
          /<p className=\{newsCardDateClass\}>(\s*)([^<{]+)/,
          `<p className={newsCardDateClass}>$1<span className="text-xs">$2</span>`,
        ),
      );
    });
    await assertMutantFails("N2div News card built as a div", (files) => {
      writeFileSync(
        files.profile,
        readFileSync(files.profile, "utf8").replace(
          `            <div id="upcoming-events"`,
          `            <div
              id="synthetic-div-card"
              className={\`\${panel} scroll-mt-28 space-y-4\`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                October 23, 2026
              </p>
              <h2 className="font-serif text-xl font-semibold">
                Synthetic div card
              </h2>
            </div>
            <div id="upcoming-events"`,
        ),
      );
    });

    if (process.env.NEWS_POLISH_MUTANT_PROOF !== "0") {
      await assertInterruptCleansSandbox();
    }
  } finally {
    cleanupActiveSandbox();
    assertRepoUnchanged();
  }

  console.log("News polish mutant assertions passed.");
}

void main();
