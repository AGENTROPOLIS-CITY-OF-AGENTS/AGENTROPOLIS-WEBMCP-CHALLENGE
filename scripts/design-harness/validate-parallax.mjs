import { readFile, access, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const mediaEntries = await readdir(new URL('public/assets/parallax/', root));
const videoFiles = mediaEntries.filter((name) => /^parallax-world-motion-.*\.mp4$/.test(name)).map((name) => `public/assets/parallax/${name}`);
const mustExist = ['docs/PARALLAX-VISUAL-CANON.md', 'docs/PARALLAX-MOTION-CONTRACT.md', 'docs/PARALLAX-PRODUCTION-PARITY.md', 'public/assets/parallax/parallax-world-hero.png', 'public/assets/parallax/parallax-world-establishing.png', ...videoFiles];
const missing = [];
for (const path of mustExist) { try { await access(new URL(path, root), constants.F_OK); } catch { missing.push(path); } }
const app = await read('src/App.tsx');
const studio = await read('src/demo/studio/SpatialStudioDemo.tsx');
const css = await read('src/styles.css');
const vault = await read('src/media/parallaxVideoVault.ts');
const required = [
  ['PARALLAX hero', app.includes('PARALLAX') && app.includes('Spatial MCP for autonomous agents')],
  ['live demo CTA', app.includes('RUN LIVE DEMO')],
  ['governance corridor', studio.includes('inline-corridor')],
  ['transparent WebGL', css.includes('background: rgba(3,6,7,.12)')],
  ['semantic media manifest', app.includes('parallaxMedia') && studio.includes('parallaxMedia')],
  ['video vault', vault.includes('PARALLAX_VIDEO_VAULT') && vault.includes('getParallaxMedia')],
  ['screensaver fallback', vault.includes('idle-screensaver') && vault.includes('reducedMotionFallback')],
  ['reduced motion', app.includes('reducedMotion') && studio.includes('reducedMotion')],
  ['fail closed', studio.includes('TEST DENIAL')],
];
const failed = [...missing, ...required.filter(([, ok]) => !ok).map(([name]) => name)];
if (failed.length) { console.error('PARALLAX construction gate failed:'); failed.forEach((entry) => console.error(`- ${entry}`)); process.exit(1); }
console.log(`PARALLAX construction gate valid: ${mustExist.length} assets/docs and ${required.length} implementation markers.`);
console.log('PRODUCTION_PARITY: DEFERRED_WITH_REASON (requires deployed screenshots)');
