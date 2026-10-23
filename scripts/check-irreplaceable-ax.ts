import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { buildCommunityPostPath } from "@/data/community-posts";

const EXPECTED_H1_NAME = "Dr. Njo recommends IrReplaceable by Leah Roling";
const NEWS_DATE_PX = "13px";
const RETRY_SLEEP_MS = 50;
const CDP_TIMEOUT_MS = 8_000;
const PROFILE_RM_TIMEOUT_MS = 3_000;
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

type SessionSend = (method: string, params?: object) => Promise<unknown>;

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

async function removeProfileDir(dir: string) {
  const deadline = Date.now() + PROFILE_RM_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      rmSync(dir, { recursive: true, force: true });
      if (!existsSync(dir)) return;
    } catch {
      // Chrome may still hold files
    }
    await wait(100);
  }
  rmSync(dir, { recursive: true, force: true });
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
      const timer = setTimeout(() => {
        pending.delete(nextId);
        reject(new Error(`CDP ${method} timed out after ${CDP_TIMEOUT_MS}ms`));
      }, CDP_TIMEOUT_MS);
      pending.set(nextId, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      try {
        ws.send(JSON.stringify({ id: nextId, method, params, sessionId }));
      } catch (error) {
        clearTimeout(timer);
        pending.delete(nextId);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
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
  const DATE_ONLY = /^(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{1,2},\\s+\\d{4}$/;
  const upcoming = document.querySelector("#upcoming-events");
  if (!upcoming || !upcoming.parentElement) {
    throw new Error("News tab must include #upcoming-events");
  }
  const root = upcoming.parentElement;
  function normalize(text) {
    return (text || "").replace(/\\s+/g, " ").trim();
  }
  function cards() {
    const found = [];
    for (const child of root.children) {
      if (child === upcoming || child.id === "upcoming-events") break;
      if (child.nodeType === 1) found.push(child);
    }
    return found;
  }
  function isTransparentColor(color) {
    if (color === "transparent") return true;
    const match = color.match(/^rgba?\\((.+)\\)$/);
    if (!match) return false;
    const parts = match[1].split(",").map((part) => parseFloat(part));
    return parts.length >= 4 && parts[3] === 0;
  }
  function visibilityIssue(el) {
    if (el.hasAttribute("hidden") || el.getAttribute("aria-hidden") === "true") {
      return "date must be visible with a non-zero box";
    }
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") {
      return "date must be visible with a non-zero box";
    }
    const rect = el.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) {
      return "date must be visible with a non-zero box";
    }
    if (parseFloat(style.opacity) === 0) {
      return "date opacity is 0";
    }
    if (isTransparentColor(style.color)) {
      return "date color is transparent";
    }
    if (style.transform && style.transform !== "none") {
      const matrix = new DOMMatrix(style.transform);
      if (Math.abs(matrix.a) < 1 - 1e-6 || Math.abs(matrix.d) < 1 - 1e-6) {
        return "date scale is less than 1";
      }
    }
    return null;
  }
  function dateIssues() {
    const issues = [];
    for (const card of cards()) {
      const id = card.id || "anonymous-card";
      const first = card.children[0];
      if (!first) {
        issues.push(id + " is missing a date");
        continue;
      }
      const text = normalize(first.textContent);
      if (!DATE_ONLY.test(text)) {
        issues.push(id + " is missing a date");
        continue;
      }
      if (first.tagName !== "P") {
        issues.push(id + " date must be a <p>, found <" + first.tagName.toLowerCase() + ">");
        continue;
      }
      const measured = [first, ...first.querySelectorAll("*")];
      for (const el of measured) {
        const hidden = visibilityIssue(el);
        if (hidden) issues.push(id + " " + hidden);
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
      const first = card.children[0];
      if (first && first.tagName === "P" && DATE_ONLY.test(normalize(first.textContent))) {
        return first;
      }
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
    apply("N2sronly", () => {
      firstDateP().classList.add("sr-only");
    }),
    apply("N2hidden", () => {
      firstDateP().classList.add("hidden");
    }),
    apply("N2responsive", () => {
      const dateP = firstDateP();
      dateP.classList.remove("text-[13px]");
      dateP.classList.add("text-xs", "sm:text-[13px]");
    }),
    apply("N2section", () => {
      const liveUpcoming = root.querySelector("#upcoming-events");
      const section = document.createElement("section");
      section.id = "synthetic-section-card";
      section.innerHTML = '<p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand">October 23, 2026</p><h2>Synthetic section card</h2>';
      liveUpcoming.before(section);
    }),
    apply("N2opacity", () => {
      firstDateP().style.opacity = "0";
    }),
    apply("N2transparent", () => {
      firstDateP().style.color = "transparent";
    }),
    apply("N2scale", () => {
      firstDateP().style.transform = "scale(0.75)";
    }),
    apply("N2tablet", () => {
      const dateP = firstDateP();
      dateP.classList.add("sm:max-lg:text-xs");
      if (matchMedia("(min-width: 640px) and (max-width: 1023.98px)").matches) {
        if (getComputedStyle(dateP).fontSize === "${NEWS_DATE_PX}") {
          dateP.style.fontSize = "0.75rem";
        }
      }
    }),
    apply("N2partial11", () => {
      const dateP = firstDateP();
      const text = dateP.textContent || "";
      const span = document.createElement("span");
      span.style.fontSize = "11px";
      span.textContent = text.slice(-4);
      dateP.textContent = text.slice(0, -4);
      dateP.append(span);
    }),
  ];
  return { control, mutants };
})()`;

async function evaluateValue(session: SessionSend, expression: string) {
  const evaluated = (await session("Runtime.evaluate", {
    expression,
    returnByValue: true,
  })) as EvaluateResult;
  if (evaluated.exceptionDetails) {
    throw new Error(
      evaluated.exceptionDetails.exception?.description ??
        evaluated.exceptionDetails.text ??
        "Runtime.evaluate failed",
    );
  }
  return evaluated.result?.value;
}

async function waitForReadySelector(session: SessionSend, selector: string, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  const expression = `document.readyState === "complete" && !!document.querySelector(${JSON.stringify(selector)})`;
  while (Date.now() < deadline) {
    try {
      if ((await evaluateValue(session, expression)) === true) {
        return;
      }
    } catch {
      // document may be mid-navigation
    }
    await wait(RETRY_SLEEP_MS);
  }
  throw new Error(`Timed out waiting for document.readyState complete and ${selector}`);
}

async function withChrome<T>(fn: (session: SessionSend) => Promise<T>) {
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
        await wait(RETRY_SLEEP_MS);
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
    await session("Runtime.enable");
    await session("Accessibility.enable");
    return await fn(session);
  } finally {
    browserWs?.close();
    chrome.kill("SIGTERM");
    await waitForExit(chrome, 2000);
    if (chrome.exitCode === null && !chrome.signalCode) {
      chrome.kill("SIGKILL");
      await waitForExit(chrome, 1000);
    }
    await removeProfileDir(userData);
  }
}

async function navigate(session: SessionSend, pageUrl: string, selector: string) {
  await session("Page.navigate", { url: pageUrl });
  await waitForReadySelector(session, selector);
}

async function headingNameFromH1(session: SessionSend) {
  await waitForReadySelector(session, "h1");
  const tree = (await session("Accessibility.getFullAXTree")) as { nodes: AxNode[] };
  const heading = tree.nodes.find((node) => {
    if (node.role?.value !== "heading" || !node.name?.value) return false;
    const level = node.properties?.find((property) => property.name === "level")?.value?.value;
    return level === 1;
  });
  return heading?.name?.value ?? "";
}

async function evaluateNewsDates(session: SessionSend) {
  return (await evaluateValue(session, NEWS_DATE_CHECK)) as NewsDateReport;
}

async function setViewport(session: SessionSend, width: number, height: number, mobile: boolean) {
  await session("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await wait(RETRY_SLEEP_MS);
}

async function assertNewsDatesAtViewport(session: SessionSend, width: number, mobile: boolean) {
  await setViewport(session, width, mobile ? 844 : 800, mobile);
  const deadline = Date.now() + 8000;
  let report: NewsDateReport | undefined;
  while (Date.now() < deadline) {
    try {
      report = await evaluateNewsDates(session);
      if (report?.control) break;
    } catch {
      // News tab may still be hydrating
    }
    await wait(RETRY_SLEEP_MS);
  }
  assert.ok(report, `News tab date check did not run at ${width}px`);
  assert.deepEqual(
    report.control,
    [],
    `Live News card dates must be visible ${NEWS_DATE_PX} paragraphs at ${width}px\n${report.control.join("\n")}`,
  );
  const required = report.mutants.filter((mutant) => {
    if (mutant.name === "N2responsive") return width < 640;
    if (mutant.name === "N2tablet") return width >= 640 && width < 1024;
    return true;
  });
  console.log(`Chromium News card dates are ${NEWS_DATE_PX} at ${width}px on ${required.length} synthetic checks.`);
  for (const mutant of required) {
    assert.equal(
      mutant.killed,
      true,
      `${mutant.name} must fail the 13px News date check at ${width}px\n${mutant.issues.join("\n")}`,
    );
    console.log(`News date mutant ${mutant.name} failed as required at ${width}px.`);
  }
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
      await assertNewsDatesAtViewport(session, 1280, false);
      await assertNewsDatesAtViewport(session, 768, false);
      await assertNewsDatesAtViewport(session, 390, true);
    });
  } finally {
    child.kill("SIGTERM");
    await waitForExit(child, 2000);
  }
}

void main();
