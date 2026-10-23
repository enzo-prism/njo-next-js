import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
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
const CHILD_TIMEOUT_MS = Math.max(1, Number(process.env.NEWS_POLISH_MUTANT_CHILD_TIMEOUT_MS) || 60_000);

type CheckResult = {
  status: number | null;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
};

type PidLiveness = "alive" | "dead" | "unknown";

function isPidAlive(pid: number): PidLiveness {
  if (!Number.isInteger(pid) || pid <= 0) {
    return "unknown";
  }
  try {
    process.kill(pid, 0);
    return "alive";
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EPERM" || code === "EACCES") {
      return "unknown";
    }
    return "dead";
  }
}

function writeOwnerLock(dir: string, pid = process.pid) {
  const target = path.join(dir, OWNER_FILE);
  const temp = path.join(dir, `${OWNER_FILE}.${pid}.${process.hrtime.bigint()}.tmp`);
  writeFileSync(temp, `${pid}\n`, "utf8");
  renameSync(temp, target);
}

function ownerAgeMs(dir: string, now: number) {
  return now - statSync(dir).mtimeMs;
}

function shouldSweepSandbox(dir: string, now: number) {
  try {
    const ageMs = ownerAgeMs(dir, now);
    const ownerPath = path.join(dir, OWNER_FILE);
    if (!existsSync(ownerPath)) {
      return ageMs > STALE_AGE_MS;
    }
    let raw = "";
    try {
      raw = readFileSync(ownerPath, "utf8").trim();
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "EPERM" || code === "EACCES") {
        return ageMs > STALE_AGE_MS;
      }
      throw error;
    }
    const pid = Number(raw);
    if (!raw || !Number.isInteger(pid) || pid <= 0) {
      return ageMs > STALE_AGE_MS;
    }
    const liveness = isPidAlive(pid);
    if (liveness === "dead") {
      return true;
    }
    return ageMs > STALE_AGE_MS;
  } catch {
    return false;
  }
}

function sweepStaleMutantSandboxes(keepDir?: string) {
  const tmp = os.tmpdir();
  const now = Date.now();
  for (const name of readdirSync(tmp)) {
    if (!name.startsWith(MUTANT_PREFIX)) continue;
    const dir = path.join(tmp, name);
    if (keepDir && path.resolve(dir) === path.resolve(keepDir)) continue;
    if (shouldSweepSandbox(dir, now)) {
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
  delete childEnv.NEWS_POLISH_MUTANT_CHILD_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--import", "tsx", "scripts/check-events.ts"], {
      cwd: tmpRoot,
      env: childEnv,
    });
    activeChild = child;
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    const timer = setTimeout(() => {
      timedOut = true;
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
      resolve({ status, signal, timedOut, stdout, stderr });
    });
  });
}

function describeAbnormalExit(name: string, result: CheckResult) {
  if (result.timedOut) {
    return `${name} timed out after ${CHILD_TIMEOUT_MS}ms (not a required mutant failure)`;
  }
  if (result.signal) {
    return `${name} was killed by signal ${result.signal} (not a required mutant failure)`;
  }
  if (result.status === null) {
    return `${name} exited with a null status (not a required mutant failure)`;
  }
  if (result.status >= 128) {
    return `${name} exited ${result.status} (signal-style; not a required mutant failure)`;
  }
  return null;
}

function assertRequiredFailure(name: string, result: CheckResult, expectedText: string) {
  const abnormal = describeAbnormalExit(name, result);
  if (abnormal) {
    throw new Error(`${abnormal}\n${result.stderr}\n${result.stdout}`);
  }
  assert.notEqual(result.status, 0, `${name} must fail check-events\n${result.stderr}\n${result.stdout}`);
  assert.ok(
    result.stderr.includes(expectedText),
    `${name} must mention ${JSON.stringify(expectedText)} in stderr\n${result.stderr}\n${result.stdout}`,
  );
  console.log(`Mutant ${name} failed as required (exit ${result.status}).`);
}

async function assertMutantFails(
  name: string,
  expectedText: string,
  apply: (files: ReturnType<typeof sandboxPaths>) => void,
) {
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
  assertRequiredFailure(name, result, expectedText);
}

function wait(ms: number) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    timer.unref?.();
  });
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
      `const fs=require("node:fs");const path=require("node:path");const dir=process.argv[1];const tmp=path.join(dir,"owner.pid."+process.pid+".tmp");fs.writeFileSync(tmp,process.pid+"\\n");fs.renameSync(tmp,path.join(dir,"owner.pid"));setInterval(()=>{},1000);`,
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

  const garbled = mkdtempSync(path.join(os.tmpdir(), MUTANT_PREFIX));
  writeFileSync(path.join(garbled, OWNER_FILE), "not-a-pid\n", "utf8");
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(garbled), true, "fresh garbled owner must be treated as alive");
  utimesSync(garbled, old, old);
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(garbled), false, "age-stale garbled owner must be swept");

  const emptyOwner = mkdtempSync(path.join(os.tmpdir(), MUTANT_PREFIX));
  writeFileSync(path.join(emptyOwner, OWNER_FILE), "\n", "utf8");
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(emptyOwner), true, "fresh empty owner must be treated as alive");
  utimesSync(emptyOwner, old, old);
  sweepStaleMutantSandboxes(tmpRoot);
  assert.equal(existsSync(emptyOwner), false, "age-stale empty owner must be swept");

  console.log("Overlap sweep kept a live sandbox and removed dead and age-stale sandboxes.");
}

async function main() {
  try {
    await assertOverlapSweepKeepsLiveSandbox();
    seedSandbox();
    const control = await runCheckEvents();
    assertRepoUnchanged();
    const controlAbnormal = describeAbnormalExit("No-op control", control);
    if (controlAbnormal) {
      throw new Error(`${controlAbnormal}\n${control.stderr}\n${control.stdout}`);
    }
    assert.equal(control.status, 0, `No-op control must pass check-events\n${control.stderr}\n${control.stdout}`);
    console.log("Mutant no-op control passed.");

    await assertMutantFails("P1 helper dropped on post body", "IrReplaceable body must contain the title markup once", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(paragraph)}", "{paragraph}"));
    });
    await assertMutantFails("P2 helper dropped on H1", "IrReplaceable H1 must contain the title markup once", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(post.title)}", "{post.title}"));
    });
    await assertMutantFails("P3 helper dropped on subtitle", "IrReplaceable subtitle must contain the title markup once", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replace("{withIrReplaceableTitle(post.description)}", "{post.description}"));
    });
    await assertMutantFails("C1 helper dropped on News card body", "News card body must contain the title markup once", (files) => {
      writeFileSync(files.newsCard, readFileSync(files.newsCard, "utf8").replace("{withIrReplaceableTitle(paragraph)}", "{paragraph}"));
    });
    await assertMutantFails("H2 partial hardcoded News card text", "News card body must contain the title markup once", (files) => {
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
    await assertMutantFails("M1 54ch removed", "Community post body paragraphs must default to the 54ch measure", (files) => {
      writeFileSync(files.detail, readFileSync(files.detail, "utf8").replaceAll("max-w-[54ch] ", ""));
    });
    await assertMutantFails("N1 News date back to text-xs", "Rendered News card date must stay 13px", (files) => {
      writeFileSync(files.newsCard, readFileSync(files.newsCard, "utf8").replace("text-[13px]", "text-xs"));
    });
  } finally {
    cleanupActiveSandbox();
    assertRepoUnchanged();
  }

  console.log("News polish mutant assertions passed.");
}

void main();
