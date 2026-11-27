// DealHound's local preview server: serves app/ as static files so the
// site can be opened in a browser exactly as a static host would serve it.
//   node serve.ts            -> http://localhost:8080
//   node serve.ts --port 8091
// Standard library only; never used by the hand-in program.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.argv.find((a) => a.startsWith("--port="))?.split("=")[1] ?? 8080);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(here, "app", path === "/" ? "index.html" : path);
  if (!file.startsWith(join(here, "app"))) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(port, () => console.log(`DealHound preview at http://localhost:${port}`));
