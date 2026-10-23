import { once } from "node:events";
import { createServer } from "node:net";
import { spawn } from "node:child_process";

async function getAvailablePort(): Promise<number> {
  return await new Promise((resolve, reject) => {
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

async function waitForServer(baseUrl: string, child: ReturnType<typeof spawn>) {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`next start exited early with code ${child.exitCode}.`);
    }

    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) {
        return;
      }
    } catch {
      // The server may still be starting; keep polling until the deadline.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Timed out waiting for next start to become ready.");
}

/**
 * Runs `next start` against the existing production build, passes its base URL
 * to `run`, and always stops the server. Failures include the server logs.
 */
export async function withNextServer<T>(
  run: (baseUrl: string) => Promise<T>,
  options: { env?: Record<string, string> } = {},
): Promise<T> {
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const stdout: string[] = [];
  const stderr: string[] = [];
  const nextBin = `${process.cwd()}/node_modules/.bin/next`;

  const child = spawn(nextBin, ["start", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, ...options.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => stdout.push(chunk));
  child.stderr.on("data", (chunk) => stderr.push(chunk));

  try {
    await waitForServer(baseUrl, child);
    return await run(baseUrl);
  } catch (error) {
    const details = [
      `next start stdout:\n${stdout.join("").trim() || "(empty)"}`,
      `next start stderr:\n${stderr.join("").trim() || "(empty)"}`,
    ].join("\n\n");

    if (error instanceof Error) {
      error.message = `${error.message}\n\n${details}`;
    }
    throw error;
  } finally {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
      await once(child, "exit");
    }
  }
}
