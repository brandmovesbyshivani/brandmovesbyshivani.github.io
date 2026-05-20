import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = 5173;
const clients = new Set();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const liveReloadScript = `
<script>
  new EventSource("/__live-reload").addEventListener("reload", () => location.reload());
</script>`;

const sendReload = () => {
  for (const client of clients) {
    client.write("event: reload\\ndata: now\\n\\n");
  }
};

watch(root, { recursive: true }, (_, fileName) => {
  if (!fileName || fileName.includes("node_modules")) return;
  sendReload();
});

createServer(async (request, response) => {
  if (request.url === "/__live-reload") {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    response.write("\\n");
    clients.add(response);
    request.on("close", () => clients.delete(response));
    return;
  }

  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const safePath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(root, safePath === "/" ? "index.html" : safePath);

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, "index.html");
    let body = await readFile(filePath);
    const ext = extname(filePath);
    response.setHeader("Content-Type", types[ext] ?? "application/octet-stream");
    if (ext === ".html") {
      body = Buffer.from(body.toString("utf8").replace("</body>", `${liveReloadScript}</body>`));
    }
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Portfolio live preview: http://127.0.0.1:${port}`);
});
