import type { WorldProvider } from "../providers/provider.js";
import type { ProviderRegistry } from "../providers/registry.js";
import type { AgentMandate } from "../governance/authorization.js";
import type { WorldReceipt } from "../receipts/receipt.js";
import type { WorldState, WorldCapability } from "../types.js";

export interface AgentAuthorityRow {
  agentId: string;
  role: string;
  district: string;
  writeCapabilities: WorldCapability[];
  readOnly: boolean;
}

export interface MissionControlSnapshot {
  generatedAt: string;
  provider: { id: string; connected: boolean };
  worldState: WorldState | null;
  authority: AgentAuthorityRow[];
  activeEvents: { id: string; type: string; state: string }[];
  performance: { fps: number; frameTimeMs: number | undefined; gpuTimeMs: number | undefined; qualityTier: string | undefined };
  lastReceipt: WorldReceipt | null;
  receiptLog: WorldReceipt[];
}

const WRITE_CAPABILITIES = new Set<WorldCapability>([
  "weather.set",
  "camera.move",
  "camera.frame",
  "event.spawn",
  "event.cancel",
  "render.quality",
  "capture.frame",
  "capture.sequence",
]);

/**
 * MissionControl — assembles the human-readable audit model for the panel:
 * provider, current world state, per-agent authority, active events,
 * performance, and the receipt log. Pure and serializable so any renderer
 * (React, plain HTML, CLI) can display it.
 */
export class MissionControl {
  private readonly receipts: WorldReceipt[] = [];

  constructor(private readonly registry: ProviderRegistry, private readonly mandates: ReadonlyMap<string, AgentMandate>) {}

  record(receipt: WorldReceipt): void {
    this.receipts.push(receipt);
  }

  private async provider(): Promise<WorldProvider | null> {
    if (!this.registry.activeId) return null;
    try {
      return this.registry.resolve();
    } catch {
      return null;
    }
  }

  async snapshot(): Promise<MissionControlSnapshot> {
    const provider = await this.provider();
    const state = provider ? await provider.getState().catch(() => null) : null;

    const authority: AgentAuthorityRow[] = [...this.mandates.values()].map((m) => ({
      agentId: m.agentId,
      role: m.role,
      district: m.district,
      writeCapabilities: m.capabilities.filter((c) => WRITE_CAPABILITIES.has(c)),
      readOnly: !m.capabilities.some((c) => WRITE_CAPABILITIES.has(c)),
    }));

    return {
      generatedAt: new Date().toISOString(),
      provider: {
        id: this.registry.activeId ?? "none",
        connected: provider !== null,
      },
      worldState: state,
      authority,
      activeEvents: (state?.events ?? []).map((e) => ({ id: e.id, type: e.type, state: e.state })),
      performance: {
        fps: state?.render?.fps ?? 0,
        frameTimeMs: state?.render?.frameTimeMs,
        gpuTimeMs: state?.render?.gpuTimeMs,
        qualityTier: state?.render?.qualityTier,
      },
      lastReceipt: this.receipts[this.receipts.length - 1] ?? null,
      receiptLog: [...this.receipts],
    };
  }
}

/** Escape text for safe injection into the generated HTML panel. */
function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders a self-contained HTML Mission Control panel. No external assets —
 * open the file directly in a browser. Uses the challenge's motherboard design
 * grammar: black substrate, cyan traces, red denied, green allow, pink approval.
 */
export function renderMissionControlHTML(snap: MissionControlSnapshot): string {
  const rows = snap.authority
    .map(
      (a) => `
      <tr>
        <td class="mono">${esc(a.agentId)}</td>
        <td>${esc(a.role)}</td>
        <td>${esc(a.district)}</td>
        <td><span class="badge ${a.readOnly ? "b-read" : "b-write"}">${a.readOnly ? "READ" : "WRITE"}</span></td>
        <td class="mono">${esc(a.writeCapabilities.join(", ") || "—")}</td>
      </tr>`,
    )
    .join("");

  const events = snap.activeEvents.map((e) => `<li><span class="mono">${esc(e.id)}</span> · ${esc(e.type)} · <b>${esc(e.state)}</b></li>`).join("") || "<li>none</li>";

  const last = snap.lastReceipt;
  const receiptHTML = last
    ? `
      <div class="receipt r-${esc(last.result)}">
        <div class="row"><span>receipt_id</span><code>${esc(last.receiptId)}</code></div>
        <div class="row"><span>agent</span><code>${esc(last.agentId)}</code></div>
        <div class="row"><span>capability</span><code>${esc(last.capability)}</code></div>
        <div class="row"><span>result</span><code>${esc(last.result)}</code></div>
        ${last.reason ? `<div class="row"><span>reason</span><code>${esc(last.reason)}</code></div>` : ""}
        <div class="row"><span>duration</span><code>${esc(last.durationMs ?? 0)} ms</code></div>
      </div>`
    : "<p>No execution yet.</p>";

  const ws = snap.worldState;
  const weatherHTML = ws?.weather
    ? Object.entries(ws.weather)
        .map(([k, v]) => `<div class="row"><span>${esc(k)}</span><code>${esc(v)}</code></div>`)
        .join("")
    : "<p>—</p>";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>AGENTROPOLIS WORLD ENGINE · Mission Control</title>
<style>
  :root { --bg:#05070a; --panel:#0b0f14; --cy: #2fe0ff; --gr: #2bff7a; --rd: #ff3b4e; --pk: #ff6ad5; --tx: #d7e3ea; --dim:#6b7a85; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--tx); font-family:"Inter","Segoe UI",system-ui,sans-serif; padding:24px; }
  h1 { font-family:"Orbitron","Inter",sans-serif; letter-spacing:.14em; font-size:20px; color:var(--cy); text-transform:uppercase; }
  h2 { font-family:"Orbitron","Inter",sans-serif; font-size:13px; letter-spacing:.12em; color:var(--dim); text-transform:uppercase; border-bottom:1px solid #16212b; padding-bottom:6px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:16px; margin-top:16px; }
  .panel { background:var(--panel); border:1px solid #16212b; border-radius:10px; padding:16px; }
  .mono, code { font-family:"JetBrains Mono","Consolas",monospace; }
  code { color:var(--cy); font-size:12px; }
  .badge { padding:2px 8px; border-radius:20px; font-size:11px; font-weight:700; }
  .b-read { color:var(--cy); border:1px solid var(--cy); }
  .b-write { color:var(--gr); border:1px solid var(--gr); }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  td, th { text-align:left; padding:6px 8px; border-bottom:1px solid #16212b; vertical-align:top; }
  th { color:var(--dim); font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:.06em; }
  ul { list-style:none; padding:0; margin:0; }
  li { padding:4px 0; font-size:13px; }
  .receipt { border:1px solid #16212b; border-left:3px solid var(--cy); border-radius:6px; padding:10px; }
  .receipt.r-success { border-left-color:var(--gr); }
  .receipt.r-denied { border-left-color:var(--rd); }
  .receipt.r-failed { border-left-color:var(--rd); }
  .row { display:flex; justify-content:space-between; gap:12px; padding:3px 0; font-size:13px; }
  .row span { color:var(--dim); }
  .meta { color:var(--dim); font-size:12px; margin-top:14px; }
  .pill { display:inline-block; padding:2px 8px; border-radius:20px; font-size:11px; border:1px solid var(--cy); color:var(--cy); }
</style>
</head>
<body>
  <h1>AGENTROPOLIS World Engine · Mission Control</h1>
  <p class="meta">Generated ${esc(snap.generatedAt)} · Provider: <span class="pill">${esc(snap.provider.id)}</span> · ${snap.provider.connected ? "CONNECTED" : "OFFLINE"}</p>
  <div class="grid">
    <div class="panel">
      <h2>Agent Authority</h2>
      <table>
        <thead><tr><th>Agent</th><th>Role</th><th>District</th><th>Mode</th><th>Write Caps</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="panel">
      <h2>Active Events</h2>
      <ul>${events}</ul>
    </div>
    <div class="panel">
      <h2>World State · Weather</h2>
      ${weatherHTML}
      <h2 style="margin-top:14px">Performance</h2>
      <div class="row"><span>fps</span><code>${esc(snap.performance.fps)}</code></div>
      <div class="row"><span>frame time</span><code>${esc(snap.performance.frameTimeMs ?? "—")} ms</code></div>
      <div class="row"><span>gpu time</span><code>${esc(snap.performance.gpuTimeMs ?? "—")} ms</code></div>
      <div class="row"><span>quality</span><code>${esc(snap.performance.qualityTier ?? "—")}</code></div>
    </div>
    <div class="panel">
      <h2>Last Receipt</h2>
      ${receiptHTML}
    </div>
  </div>
  <p class="meta">Discovery is not authority. Connectivity is not permission. Execution requires governance.</p>
</body>
</html>`;
}
