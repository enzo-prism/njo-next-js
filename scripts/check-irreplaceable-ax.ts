import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { buildCommunityPostPath } from "@/data/community-posts";

const EXPECTED_H1_NAME = "Dr. Njo recommends IrReplaceable by Leah Roling";
const NEWS_DATE_PX = "13px";
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "google-chrome",
  "chromium",
  "chromium-browser",
].filter((value): value is string => Boolean(value));

type AxNode = {
  role?: { value?: string };
  name?: { value?: string };
  properties?: Array<{ name?: string; value?: { value?: number | string } }>;
};

type EvaluateResult = {
  result?: { value?: unknown };
  exceptionDetails?: { text?: string; exception?: { description?: string } };
};

type NewsDateReport = {
  control: string[];
  mutants: Array<{ name: string; killed: boolean; issues: string[] }>;
};

async function getAvailablePort() {
  return await new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not determine an available port."));
        return;
      }
      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });
}

function resolveChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate.includes(path.sep) && existsSync(candidate)) {
      return candidate;
    }
  }
  return CHROME_CANDIDATES.find((candidate) => !candidate.includes(path.sep)) ?? "google-chrome";
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    timer.unref?.();
  });
}

function waitForExit(child: ChildProcess, timeoutMs: number) {
  return new Promise<void>((resolve) => {
    if (child.exitCode !== null || child.signalCode) {
      resolve();
      return;
    }
    const timer = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        // already gone
      }
      resolve();
    }, timeoutMs);
    child.once("close", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

function createSender(ws: WebSocket, sessionId?: string) {
  let id = sessionId ? 1000 : 0;
  const pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data)) as {
      id?: number;
      sessionId?: string;
      error?: { message?: string };
      result?: unknown;
    };
    if (sessionId && message.sessionId !== sessionId) return;
    if (message.id && pending.has(message.id)) {
      const next = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        next?.reject(new Error(message.error.message ?? JSON.stringify(message.error)));
      } else {
        next?.resolve(message.result);
      }
    }
  });
  return (method: string, params?: object) =>
    new Promise((resolve, reject) => {
      const nextId = ++id;
      pending.set(nextId, { resolve, reject });
      ws.send(JSON.stringify({ id: nextId, method, params, sessionId }));
    });
}

async function waitForServer(baseUrl: string, child: ChildProcess) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`next start exited early with code ${child.exitCode}.`);
    }
    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
    } catch {
      // still starting
    }
    await wait(250);
  }
  throw new Error("Timed out waiting for next start to become ready.");
}

const NEWS_DATE_CHECK = `(() => {
  const DATE_RE = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{1,2},\\s+\\d{4}/;
  const upcoming = document.querySelector("#upcoming-events");
  if (!upcoming || !upcoming.parentElement) {
    throw new Error("News tab must include #upcoming-events");
  }
  const root = upcoming.parentElement;
  function cards() {
    const found = [];
    for (const child of root.children) {
      if (child === upcoming || child.id === "upcoming-events") break;
      if (child.matches("article, div")) found.push(child);
    }
    return found;
  }
  function dateIssues() {
    const issues = [];
    for (const card of cards()) {
      const id = card.id || "anonymous-card";
      const dateP = [...card.querySelectorAll(":scope > p")].find((p) => DATE_RE.test(p.textContent || ""));
      if (!dateP) {
        const other = [...card.querySelectorAll("span, time, p")].find((el) => DATE_RE.test(el.textContent || ""));
        issues.push(other
          ? id + " date must be a <p>, found <" + other.tagName.toLowerCase() + ">"
          : id + " is missing a date");
        continue;
      }
      const textEls = [dateP, ...dateP.querySelectorAll("*")].filter((el) => DATE_RE.test(el.textContent || ""));
      for (const el of textEls) {
        const size = getComputedStyle(el).fontSize;
        if (size !== "${NEWS_DATE_PX}") {
          issues.push(id + " date font-size is " + size + ", expected ${NEWS_DATE_PX}");
        }
      }
    }
    return issues;
  }
  function firstDateP() {
    for (const card of cards()) {
      const dateP = [...card.querySelectorAll(":scope > p")].find((p) => DATE_RE.test(p.textContent || ""));
      if (dateP) return dateP;
    }
    throw new Error("News tab has no date paragraph to mutate");
  }
  function apply(name, mutate) {
    const html = root.innerHTML;
    try {
      mutate();
      const issues = dateIssues();
      return { name, killed: issues.length > 0, issues };
    } finally {
      root.innerHTML = html;
    }
  }
  const control = dateIssues();
  const mutants = [
    apply("N2cn", () => {
      firstDateP().classList.add("text-xs");
    }),
    apply("N2cls", () => {
      firstDateP().style.fontSize = "11px";
    }),
    apply("N2inner11", () => {
      const dateP = firstDateP();
      const span = document.createElement("span");
      span.style.fontSize = "11px";
      span.textContent = dateP.textContent;
      dateP.textContent = "";
      dateP.append(span);
    }),
    apply("N2span", () => {
      const dateP = firstDateP();
      const span = document.createElement("span");
      span.className = dateP.className;
      span.textContent = dateP.textContent;
      dateP.replaceWith(span);
    }),
    apply("N2time", () => {
      const dateP = firstDateP();
      const time = document.createElement("time");
      time.className = dateP.className;
      time.textContent = dateP.textContent;
      dateP.replaceWith(time);
    }),
    apply("N2drop", () => {
      firstDateP().remove();
    }),
  ];
  return { control, mutants };
})()`;

async function withChrome<T>(fn: (session: (method: string, params?: object) => Promise<unknown>) => Promise<T>) {
  const userData = mkdtempSync(path.join(os.tmpdir(), "irreplaceable-ax-"));
  const port = await getAvailablePort();
  const chrome = spawn(
    resolveChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--remote-debugging-address=127.0.0.1",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userData}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  let browserWs: WebSocket | undefined;
  try {
    const deadline = Date.now() + 8000;
    let version: { webSocketDebuggerUrl?: string } | undefined;
    while (Date.now() < deadline) {
      try {
        version = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()) as {
          webSocketDebuggerUrl?: string;
        };
        break;
      } catch {
        await wait(50);
      }
    }
    if (!version?.webSocketDebuggerUrl) {
      throw new Error("Chrome remote debugging did not start. ubuntu-latest provides /usr/bin/google-chrome.");
    }
    browserWs = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      browserWs?.addEventListener("open", () => resolve());
      browserWs?.addEventListener("error", () => reject(new Error("Chrome WebSocket failed")));
    });
    const send = createSender(browserWs);
    const created = (await send("Target.createTarget", { url: "about:blank" })) as { targetId: string };
    const attached = (await send("Target.attachToTarget", {
      targetId: created.targetId,
      flatten: true,
    })) as { sessionId: string };
    const session = createSender(browserWs, attached.sessionId);
    await session("Page.enable");
    await session("DOM.enable");
    await session("Runtime.enable");
    await session("Accessibility.enable");
    return await fn(session);
  } finally {
    browserWs?.close();
    chrome.kill("SIGTERM");
    await waitForExit(chrome, 1000);
    rmSync(userData, { recursive: true, force: true });
  }
}

async function waitForSelector(
  session: (method: string, params?: object) => Promise<unknown>,
  selector: string,
  timeoutMs = 8000,
) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const doc = (await session("DOM.getDocument", { depth: 0 })) as { root: { nodeId: number } };
    const { nodeId } = (await session("DOM.querySelector", {
      nodeId: doc.root.nodeId,
      selector,
    })) as { nodeId: number };
    if (nodeId) return;
    await wait(100);
  }
  throw new Error(`Timed out waiting for ${selector}`);
}

async function navigate(
  session: (method: string, params?: object) => Promise<unknown>,
  pageUrl: string,
  selector: string,
) {
  await session("Page.navigate", { url: pageUrl });
  await waitForSelector(session, selector);
}

async function headingNameFromH1(session: (method: string, params?: object) => Promise<unknown>) {
  const doc = (await session("DOM.getDocument", { depth: 0 })) as { root: { nodeId: number } };
  const { nodeId } = (await session("DOM.querySelector", {
    nodeId: doc.root.nodeId,
    selector: "h1",
  })) as { nodeId: number };
  assert.ok(nodeId, "IrReplaceable page must render an h1");
  const partial = (await session("Accessibility.getPartialAXTree", {
    nodeId,
    fetchRelatives: false,
  })) as { nodes: AxNode[] };
  const heading =
    partial.nodes.find((node) => node.role?.value === "heading" && node.name?.value) ??
    partial.nodes.find((node) => node.name?.value);
  return heading?.name?.value ?? "";
}

async function evaluateNewsDates(session: (method: string, params?: object) => Promise<unknown>) {
  const evaluated = (await session("Runtime.evaluate", {
    expression: NEWS_DATE_CHECK,
    returnByValue: true,
  })) as EvaluateResult;
  if (evaluated.exceptionDetails) {
    throw new Error(
      evaluated.exceptionDetails.exception?.description ??
        evaluated.exceptionDetails.text ??
        "News date check threw",
    );
  }
  return evaluated.result?.value as NewsDateReport;
}

async function main() {
  if (!existsSync(path.join(process.cwd(), ".next"))) {
    throw new Error("check:irreplaceable-ax requires a production build. Run npm run build first.");
  }
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const nextBin = `${process.cwd()}/node_modules/.bin/next`;
  const child = spawn(nextBin, ["start", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    await waitForServer(baseUrl, child);
    await withChrome(async (session) => {
      await navigate(
        session,
        `${baseUrl}${buildCommunityPostPath("irreplaceable-leah-roling")}`,
        "h1",
      );
      const name = await headingNameFromH1(session);
      assert.equal(name, EXPECTED_H1_NAME, `Chromium H1 accessible name must stay ${EXPECTED_H1_NAME}`);
      console.log(`Chromium H1 accessible name is ${JSON.stringify(name)}.`);

      await navigate(session, `${baseUrl}/michael-njo-dds?tab=news`, "#upcoming-events");
      const deadline = Date.now() + 8000;
      let report: NewsDateReport | undefined;
      while (Date.now() < deadline) {
        try {
          report = await evaluateNewsDates(session);
          if (report.control) break;
        } catch {
          await wait(200);
        }
      }
      assert.ok(report, "News tab date check did not run");
      assert.deepEqual(report.control, [], `Live News card dates must be ${NEWS_DATE_PX} paragraphs\n${report.control.join("\n")}`);
      console.log(`Chromium News card dates are ${NEWS_DATE_PX} on ${report.mutants.length} synthetic checks.`);
      for (const mutant of report.mutants) {
        assert.equal(mutant.killed, true, `${mutant.name} must fail the 13px News date check\n${mutant.issues.join("\n")}`);
        console.log(`News date mutant ${mutant.name} failed as required.`);
      }
    });
  } finally {
    child.kill("SIGTERM");
    await waitForExit(child, 2000);
  }
}

void main();
