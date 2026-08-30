/**
 * LIVE INTEGRATION PROOF — WORLD ENGINE bridge against a REAL running ABYSSAL App.
 *
 * Boots the actual procedural ocean in a real Chromium WebGL2 context (SwiftShader
 * software rendering — no physical GPU required), then wires the compiled WORLD
 * ENGINE `AbyssalProvider` to the live `window.__app` (passed as `AbyssalHost`).
 * Governed operations — Director `weather.set` and `event.spawn` — drive the REAL
 * upstream `Weather#set` / `Director#spawn*` methods, and the world consequence is
 * read back from the live sim.
 *
 * Requirements:
 *   - A running ABYSSAL dev server serving `http://localhost:5173/`.
 *     (cd ../natural-disasters && npx vite --host 127.0.0.1 --port 5173)
 *   - The compiled world-engine dist present at world-engine/dist (npm run build)
 *     and symlinked into the ABYSSAL vite public dir as public/we-dist so the page
 *     can import it same-origin.
 *   - puppeteer installed (npm i -D puppeteer@25.8.0).
 *
 * Run:
 *   node tools/live-integration.mjs
 *
 * This is a MANUAL / headed proof, intentionally NOT part of CI. CI runs only the
 * deterministic lane (typecheck, lint, test, build).
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WE_DIR = path.resolve(__dirname, "..");
const outDir = path.join(WE_DIR, "tools", "shots");
fs.mkdirSync(outDir, { recursive: true });

const URL = process.env.ABYSSAL_URL || "http://localhost:5173/";

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader",
    "--no-sandbox", "--disable-dev-shm-usage",
    "--autoplay-policy=no-user-gesture-required",
    "--window-size=1280,720",
  ],
  defaultViewport: { width: 1280, height: 720 },
});

const page = await browser.newPage();
const logs = [];
page.on("console", (m) => logs.push({ type: m.type(), text: m.text() }));
page.on("pageerror", (e) => logs.push({ type: "pageerror", text: String(e.stack || e) }));

console.log(`> navigating to ${URL}`);
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });

let booted = false;
for (let i = 0; i < 90; i++) {
  await new Promise((r) => setTimeout(r, 500));
  const s = await page.evaluate(() => !!window.__app && window.__app.running).catch(() => false);
  if (s) { booted = true; console.log(`> live ABYSSAL app booted after ${(i + 1) * 0.5}s`); break; }
}
if (!booted) { console.error("FAIL: live app did not boot (is the ABYSSAL dev server running?)"); await browser.close(); process.exit(1); }

// Inject WORLD ENGINE, wire bridge to the live host, run governed ops.
const result = await page.evaluate(async () => {
  const app = window.__app;
  const base = `/we-dist/`;
  const { AbyssalProvider } = await import(`${base}providers/abyssal/abyssal-provider.js`);
  const { ProviderRegistry } = await import(`${base}providers/registry.js`);
  const { WorldEngine } = await import(`${base}governance/executor.js`);
  const { DIRECTOR_MANDATE, RESEARCH_MANDATE } = await import(`${base}governance/mandates.js`);
  const { MissionControl } = await import(`${base}mission-control/mission-control.js`);

  const provider = new AbyssalProvider(app);
  await provider.connect();
  const registry = new ProviderRegistry();
  registry.register("abyssal", provider, { active: true });
  const mandates = new Map([
    [DIRECTOR_MANDATE.agentId, DIRECTOR_MANDATE],
    [RESEARCH_MANDATE.agentId, RESEARCH_MANDATE],
  ]);
  const engine = new WorldEngine(registry, mandates);
  const control = new MissionControl(registry, mandates);

  const rid = (p) => `${p}-live-${Date.now()}`;
  const out = {};

  const read = await engine.execute({ requestId: rid("r"), agentId: DIRECTOR_MANDATE.agentId, tool: "world.get_state", arguments: {}, mandate: DIRECTOR_MANDATE });
  control.record(read.receipt);
  out.readReceipt = read.receipt.result;
  out.weatherBefore = read.state?.weather?.windSpeed;

  const weather = await engine.execute({ requestId: rid("w"), agentId: DIRECTOR_MANDATE.agentId, tool: "weather.set", arguments: { windSpeed: 32, stormIntensity: 0.9 }, mandate: DIRECTOR_MANDATE });
  control.record(weather.receipt);
  out.weatherReceipt = weather.receipt.result;
  out.weatherLiveWindSpeed = weather.state?.windSpeed;

  const spawn = await engine.execute({ requestId: rid("s"), agentId: DIRECTOR_MANDATE.agentId, tool: "event.spawn", arguments: { type: "hurricane", position: { x: 0, z: -260 }, intensity: 26 }, mandate: DIRECTOR_MANDATE });
  control.record(spawn.receipt);
  out.spawnReceipt = spawn.receipt.result;
  out.spawnType = spawn.state?.type;

  const deny = await engine.execute({ requestId: rid("d"), agentId: RESEARCH_MANDATE.agentId, tool: "event.spawn", arguments: { type: "tsunami" }, mandate: RESEARCH_MANDATE });
  control.record(deny.receipt);
  out.denyReceipt = deny.receipt.result;
  out.denyReason = deny.receipt.reason;

  // Prove the LIVE upstream world actually changed:
  out.liveAppWeatherTarget = app.weather?.target?.windSpeed;
  out.liveAppHurricane = !!app.director?._hurricane;
  out.liveBridgeFlag = provider.capabilities ? (await provider.capabilities()).includes("event.spawn") : false;

  const snap = await control.snapshot();
  out.snapshotReceipts = snap.receiptLog.length;
  out.snapshotLast = snap.lastReceipt?.result;

  await new Promise((r) => setTimeout(r, 2500));
  out.frame = app.frame;
  return out;
});

const shotPath = path.join(outDir, "abyssal-live-governed.png");
await page.screenshot({ path: shotPath });
console.log(`> screenshot ${shotPath}`);

console.log("\n=========== LIVE INTEGRATION RESULT ===========");
console.log(JSON.stringify(result, null, 2));

const pageErrors = logs.filter((l) => l.type === "pageerror" || l.type === "error");
if (pageErrors.length) {
  console.log("\n--- page errors ---");
  for (const e of pageErrors) console.log(`[${e.type}] ${e.text.slice(0, 400)}`);
}

const pass =
  result.readReceipt === "success" &&
  result.weatherReceipt === "success" &&
  result.spawnReceipt === "success" &&
  result.spawnType === "hurricane" &&
  result.denyReceipt === "denied" &&
  result.liveBridgeFlag === true &&
  result.liveAppHurricane === true &&
  result.liveAppWeatherTarget === 32;

console.log("\nLIVE_INTEGRATION: " + (pass ? "PASS" : "FAIL"));
await browser.close();
process.exit(pass ? 0 : 1);
