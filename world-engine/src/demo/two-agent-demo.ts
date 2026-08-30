/**
 * Two-Agent Proof — Hermes Director (WRITE) vs World Researcher (READ).
 *
 * Proves the governed corridor end to end:
 *   - Director reads shared world state, is authorized for weather.set and
 *     event.spawn, and produces SUCCESS receipts.
 *   - Researcher reads the same state, attempts event.spawn, and is DENIED by
 *     runtime policy (Identity + Mandate + Capability), producing a DENIED
 *     receipt.
 *   - Both receipts land in Mission Control alongside world state and
 *     authority, and a self-contained HTML panel is emitted.
 *
 * Run with:  npm run demo   (node --experimental-strip-types)
 */
import { ProviderRegistry } from "../providers/registry.js";
import { AbyssalProvider } from "../providers/abyssal/abyssal-provider.js";
import { WorldEngine } from "../governance/executor.js";
import { DIRECTOR_MANDATE, RESEARCH_MANDATE } from "../governance/mandates.js";
import { MissionControl, renderMissionControlHTML } from "../mission-control/mission-control.js";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const requestId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

async function main(): Promise<void> {
  // --- Wire the governed system -------------------------------
  const registry = new ProviderRegistry();
  const provider = new AbyssalProvider(); // deterministic bridge (no GPU needed)
  await provider.connect();
  registry.register("abyssal", provider, { active: true });

  const mandates = new Map([
    [DIRECTOR_MANDATE.agentId, DIRECTOR_MANDATE],
    [RESEARCH_MANDATE.agentId, RESEARCH_MANDATE],
  ]);
  const engine = new WorldEngine(registry, mandates);
  const control = new MissionControl(registry, mandates);

  const lines: string[] = [];
  const log = (s = "") => {
    lines.push(s);
    console.log(s);
  };

  log("=== AGENTROPOLIS WORLD ENGINE — Two-Agent Proof ===");
  log(`Provider: ${registry.activeId} (ABYSSAL, deterministic bridge)`);
  log();

  // --- 1. Hermes Director reads shared state ------------------
  const dirRead = await engine.execute({
    requestId: requestId("dir-read"),
    agentId: DIRECTOR_MANDATE.agentId,
    tool: "world.get_state",
    arguments: {},
    mandate: DIRECTOR_MANDATE,
  });
  control.record(dirRead.receipt);
  log(`[Director] world.get_state  -> ${dirRead.receipt.result} (${dirRead.receipt.durationMs}ms)`);
  log(`           state.weather.windSpeed = ${(dirRead.state as { weather?: { windSpeed?: number } }).weather?.windSpeed}`);

  // --- 2. Director changes weather (WRITE, allowed) ------------
  const dirWeather = await engine.execute({
    requestId: requestId("dir-weather"),
    agentId: DIRECTOR_MANDATE.agentId,
    tool: "weather.set",
    arguments: { windSpeed: 32, stormIntensity: 0.9, rainIntensity: 0.8 },
    mandate: DIRECTOR_MANDATE,
  });
  control.record(dirWeather.receipt);
  log(`[Director] weather.set      -> ${dirWeather.receipt.result} (${dirWeather.receipt.durationMs}ms)`);

  // --- 3. Director spawns an event (WRITE, allowed) ------------
  const dirSpawn = await engine.execute({
    requestId: requestId("dir-spawn"),
    agentId: DIRECTOR_MANDATE.agentId,
    tool: "event.spawn",
    arguments: { type: "hurricane", position: { x: 0, z: -260 }, intensity: 26 },
    mandate: DIRECTOR_MANDATE,
  });
  control.record(dirSpawn.receipt);
  log(`[Director] event.spawn      -> ${dirSpawn.receipt.result} · event ${(dirSpawn.state as { id?: string }).id}`);

  // --- 4. Researcher reads the SAME state ----------------------
  const resRead = await engine.execute({
    requestId: requestId("res-read"),
    agentId: RESEARCH_MANDATE.agentId,
    tool: "world.get_state",
    arguments: {},
    mandate: RESEARCH_MANDATE,
  });
  control.record(resRead.receipt);
  const events = (resRead.state as { events?: { type: string; state: string }[] }).events ?? [];
  log(`[Researcher] world.get_state -> ${resRead.receipt.result} · sees ${events.length} event(s): ${events.map((e) => e.type).join(", ") || "none"}`);

  // --- 5. Researcher attempts event.spawn -> DENIED ------------
  const resSpawn = await engine.execute({
    requestId: requestId("res-spawn"),
    agentId: RESEARCH_MANDATE.agentId,
    tool: "event.spawn",
    arguments: { type: "tsunami" },
    mandate: RESEARCH_MANDATE,
  });
  control.record(resSpawn.receipt);
  log(`[Researcher] event.spawn     -> ${resSpawn.receipt.result} (${resSpawn.receipt.reason}) — runtime DENY`);
  log();

  // --- 6. Mission Control snapshot -----------------------------
  const snap = await control.snapshot();
  log("=== Mission Control ===");
  log(`provider   : ${snap.provider.id} (${snap.provider.connected ? "connected" : "offline"})`);
  log(`authority  : ${snap.authority.map((a) => `${a.agentId}=${a.readOnly ? "READ" : "WRITE"}`).join(" | ")}`);
  log(`active evt : ${snap.activeEvents.map((e) => e.type).join(", ") || "none"}`);
  log(`last rcpt  : ${snap.lastReceipt ? `${snap.lastReceipt.receiptId} ${snap.lastReceipt.result} ${snap.lastReceipt.capability}` : "—"}`);
  log(`receipt log: ${snap.receiptLog.length} receipt(s)`);

  const html = renderMissionControlHTML(snap);
  const out = join(process.cwd(), "mission-control.html");
  writeFileSync(out, html, "utf8");
  // Emit the raw snapshot for the embedded 3D Mission Control world.
  writeFileSync(join(process.cwd(), "mission-control-snapshot.json"), JSON.stringify(snap, null, 2), "utf8");
  log();
  log(`Mission Control panel written to: ${out}`);
  log(`Mission Control snapshot (3D world input) written to: ${join(process.cwd(), "mission-control-snapshot.json")}`);

  // --- Assert the proof holds ----------------------------------
  const success = [dirRead, dirWeather, dirSpawn].every((r) => r.receipt.result === "success");
  const denied = resSpawn.receipt.result === "denied" && resSpawn.receipt.reason === "CAPABILITY_DENIED";
  log();
  log(success && denied ? "PROOF: PASS" : "PROOF: FAIL");
  process.exit(success && denied ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
