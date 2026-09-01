import type { SpatialObject, WorldGraph } from './world-graph';

const esc = (value: string) => value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] ?? ch));

function project(object: SpatialObject) {
  const x = 400 + object.position[0] * 110;
  const y = 310 - object.position[2] * 45 - object.position[1] * 25;
  return { x, y };
}

export function renderSceneSvg(graph: WorldGraph, width = 800, height = 450): string {
  const objects = graph.objects.map((object) => {
    const { x, y } = project(object);
    const label = esc(object.label);
    const signal = object.type === 'light' ? '#19e6e6' : object.type === 'camera' ? '#ff2a48' : '#eef7f8';
    const intensity = object.intensity == null ? '' : ` ${Math.round(object.intensity)}%`;
    return `<g data-object-id="${esc(object.id)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="#05070a" stroke="${signal}" stroke-width="2"/><text x="${x.toFixed(1)}" y="${(y + 34).toFixed(1)}" fill="#eef7f8" font-family="monospace" font-size="12" text-anchor="middle">${label}${intensity}</text></g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#020304"/><path d="M0 340 H800" stroke="#19e6e6" stroke-opacity=".25"/><text x="28" y="38" fill="#19e6e6" font-family="monospace" font-size="18">SPATIAL WEBMCP // ${esc(graph.sceneId)} // v${graph.version}</text>${objects}</svg>`;
}

export async function captureSceneAsDataUri(graph: WorldGraph): Promise<string> {
  const svg = renderSceneSvg(graph);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
