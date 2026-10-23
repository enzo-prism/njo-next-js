import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { buildCommunityPostPath } from "@/data/community-posts";

const EXPECTED_H1_NAME = "Dr. Njo recommends IrReplaceable by Leah Roling";
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
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Timed out waiting for next start to become ready.");
}

async function chromiumHeadingName(pageUrl: string) {
  const userData = path.join(os.tmpdir(), `irreplaceable-ax-${process.pid}`);
  const port = 9335 + (process.pid % 100);
  const chrome = spawn(
    resolveChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userData}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
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
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    if (!version?.webSocketDebuggerUrl) {
      throw new Error("Chrome remote debugging did not start. ubuntu-latest provides /usr/bin/google-chrome.");
    }
    const browserWs = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      browserWs.addEventListener("open", () => resolve());
      browserWs.addEventListener("error", () => reject(new Error("Chrome WebSocket failed")));
    });
    const send = createSender(browserWs);
    const created = (await send("Target.createTarget", { url: "about:blank" })) as { targetId: string };
    const attached = (await send("Target.attachToTarget", {
      targetId: created.targetId,
      flatten: true,
    })) as { sessionId: string };
    const session = createSender(browserWs, attached.sessionId);
    const loaded = new Promise<void>((resolve) => {
      const onMessage = (event: MessageEvent) => {
        const message = JSON.parse(String(event.data)) as { method?: string; sessionId?: string };
        if (message.method === "Page.loadEventFired" && message.sessionId === attached.sessionId) {
          browserWs.removeEventListener("message", onMessage);
          resolve();
        }
      };
      browserWs.addEventListener("message", onMessage);
    });
    await session("Page.enable");
    await session("Accessibility.enable");
    await session("Page.navigate", { url: pageUrl });
    await Promise.race([loaded, new Promise((resolve) => setTimeout(resolve, 4000))]);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tree = (await session("Accessibility.getFullAXTree")) as { nodes: AxNode[] };
    const heading = tree.nodes.find((node) => node.role?.value === "heading" && node.name?.value);
    browserWs.close();
    return heading?.name?.value ?? "";
  } finally {
    chrome.kill("SIGTERM");
    setTimeout(() => {
      try {
        chrome.kill("SIGKILL");
      } catch {
        // already gone
      }
    }, 300);
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
    const name = await chromiumHeadingName(`${baseUrl}${buildCommunityPostPath("irreplaceable-leah-roling")}`);
    assert.equal(name, EXPECTED_H1_NAME, `Chromium H1 accessible name must stay ${EXPECTED_H1_NAME}`);
    console.log(`Chromium H1 accessible name is ${JSON.stringify(name)}.`);
  } finally {
    child.kill("SIGTERM");
  }
}

void main();
