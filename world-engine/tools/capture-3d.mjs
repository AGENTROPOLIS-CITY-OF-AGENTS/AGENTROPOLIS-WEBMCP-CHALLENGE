/**
 * Deterministic 3D Mission Control capture (tasks B + C evidence).
 *
 * Serves the world-engine package statically, opens assets/mission-control-3d.html
 * with the real mission-control-snapshot.json (emitted by the two-agent demo),
 * and captures a deterministic screenshot of the 3D governance-corridor world.
 *
 *   node tools/capture-3d.mjs [outDir]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WE_DIR = path.resolve(__dirname, "..");
const PORT = 4390;
const outDir = path.resolve(process.argv[2] || path.join(WE_DIR, "tools", "shots"));
fs.mkdirSync(outDir, { recursive: true });

const MIME = { ".js":"text/javascript", ".json":"application/json", ".html":"text/html", ".css":"text/css", ".png":"image/png", ".md":"text/plain" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${PORT}`).pathname);
  if (p === "/") p = "/assets/mission-control-3d.html";
  const file = path.join(WE_DIR, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found: " + p); return; }
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
console.log(`> serving ${WE_DIR} at http://127.0.0.1:${PORT}`);

const browser = await puppeteer.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1280,800"],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
const logs = [];
page.on("console", (m) => logs.push({ type: m.type(), text: m.text() }));
page.on("pageerror", (e) => logs.push({ type: "pageerror", text: String(e.stack || e) }));
// Track HTTP error responses (404 etc.) by URL so we can classify them.
const httpErrors = [];
page.on("response", (r) => { if (r.status() >= 400) httpErrors.push({ url: r.url(), status: r.status() }); });

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2500)); // let three.js load + render frames

const shot = path.join(outDir, "mission-control-3d.png");
await page.screenshot({ path: shot });
console.log(`> screenshot ${shot}`);

// Report what the world rendered (state panel + presence of 3D canvas).
const state = await page.evaluate(() => ({
  canvasCount: document.querySelectorAll("canvas").length,
  stateHTML: document.getElementById("state")?.textContent || "",
  meta: document.getElementById("meta")?.textContent || "",
  receipts: document.getElementById("receipts")?.textContent || "",
}));

console.log("\n=== 3D WORLD STATE ===");
console.log(JSON.stringify(state, null, 2));

// Only favicon 404s are acceptable; any other HTTP error or page error fails.
const benign = httpErrors.filter((h) => /favicon/i.test(h.url));
const badHttp = httpErrors.filter((h) => !/favicon/i.test(h.url));
const pageErrors = logs.filter((l) => l.type === "pageerror");
if (benign.length) console.log(`\n(note: ${benign.length} benign favicon 404 ignored)`);
if (badHttp.length) { console.log("\n--- non-favicon HTTP errors ---"); badHttp.forEach((h) => console.log(`[${h.status}] ${h.url}`)); }
if (pageErrors.length) { console.log("\n--- page errors ---"); pageErrors.forEach((e) => console.log(`[${e.type}] ${e.text.slice(0,300)}`)); }

const pass = state.canvasCount >= 1 && badHttp.length === 0 && pageErrors.length === 0;
console.log("\n3D_CAPTURE: " + (pass ? "PASS" : "FAIL"));
server.close();
await browser.close();
process.exit(pass ? 0 : 1);
