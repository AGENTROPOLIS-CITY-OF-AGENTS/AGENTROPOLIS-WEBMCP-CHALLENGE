import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import http from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const baselineName = 'agentropolis-loop-baseline.js'
const expectedBlob = '15254b442f33e009f4c78a1c19568e75ea2121b2'
const expectedSha256 = 'df28604ae9462594df48aa6fa05d9a77a3ca02e2f74c29aa3ba264da6e4d7224'
const pagesBase = '/AGENTROPOLIS-WEBMCP-CHALLENGE'
const designSystemMark = 'AGENTROPOLIS-DESIGN-SYSTEM'
const sourceExts = new Set(['.html', '.htm', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx'])
const skipDirs = new Set(['node_modules', 'dist', '.git', '.vite'])
const verifierPath = fileURLToPath(import.meta.url)

const failures = []

function fail(message) {
  failures.push(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function git(args) {
  return spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' })
}

function sha256File(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function isRemoteUrl(value) {
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value.trim())
}

function isForbiddenScriptUrl(value) {
  const url = value.trim()
  if (!isRemoteUrl(url)) return false
  return url.includes('loop-baseline') || url.includes(designSystemMark)
}

function scriptSrcs(text) {
  const found = []
  const pattern = /<script\b[^>]*?\bsrc\s*=\s*(['"])([\s\S]*?)\1/gi
  for (const match of text.matchAll(pattern)) found.push(match[2].trim())
  return found
}

function forbiddenScriptRefs(text) {
  const hits = []
  for (const src of scriptSrcs(text)) {
    if (isForbiddenScriptUrl(src)) hits.push(src)
  }
  const quoted = /(['"`])([^'"`\r\n]+)\1/g
  for (const match of text.matchAll(quoted)) {
    const url = match[2].trim()
    if (!isRemoteUrl(url) || !url.includes('loop-baseline')) continue
    hits.push(url)
  }
  return hits
}

function walkSource(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      walkSource(path.join(dir, entry.name), results)
      continue
    }
    const full = path.join(dir, entry.name)
    if (full === verifierPath) continue
    if (!sourceExts.has(path.extname(entry.name).toLowerCase())) continue
    results.push(full)
  }
  return results
}

function checkDetector() {
  const remote = [
    'https://agentropolis-city-of-agents.github.io',
    designSystemMark,
    'js/loop-baseline.js',
  ].join('/')
  const script = `<script src="${remote}" defer></script>`
  const anchor = `<a href="${['https://agentropolis-city-of-agents.github.io', designSystemMark, ''].join('/')}">Design system</a>`
  assert(forbiddenScriptRefs(script).length > 0, 'detector missed a remote design-system loop-baseline script src')
  assert(forbiddenScriptRefs(anchor).length === 0, 'detector flagged the design-system anchor href')
  assert(forbiddenScriptRefs(`<script src="./${baselineName}" defer></script>`).length === 0, 'detector flagged the local baseline script')
}

function scanFiles(files, label) {
  const hits = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const hit of forbiddenScriptRefs(text)) {
      hits.push(`${path.relative(repoRoot, file)} -> ${hit}`)
    }
  }
  assert(hits.length === 0, `${label} references a remote loop-baseline or design-system script:\n${hits.join('\n')}`)
  return hits.length
}

function runBuild() {
  console.log('> npm run build')
  const result = spawnSync('npm', ['run', 'build'], { cwd: repoRoot, stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(`real build failed with status ${result.status ?? 'null'}`)
    process.exit(result.status || 1)
  }
}

function verifyDist() {
  const distFile = path.join(repoRoot, 'dist', baselineName)
  const publicFile = path.join(repoRoot, 'public', baselineName)
  const indexFile = path.join(repoRoot, 'dist', 'index.html')
  assert(existsSync(distFile), `missing dist/${baselineName}`)
  assert(existsSync(publicFile), `missing public/${baselineName}`)
  assert(existsSync(indexFile), 'missing dist/index.html')
  assert(!existsSync(path.join(repoRoot, baselineName)), `unpublished root ${baselineName} is still present`)
  if (!existsSync(distFile) || !existsSync(indexFile) || !existsSync(publicFile)) return null

  const blob = git(['hash-object', distFile])
  assert(blob.status === 0, `git hash-object failed: ${blob.stderr}`)
  const gitBlobSha = (blob.stdout || '').trim()
  const sha256 = sha256File(distFile)
  const committed = git(['rev-parse', `HEAD:public/${baselineName}`])
  assert(committed.status === 0, `committed public baseline missing: ${committed.stderr}`)
  const committedBlob = (committed.stdout || '').trim()

  assert(gitBlobSha === expectedBlob, `dist blob ${gitBlobSha} != ${expectedBlob}`)
  assert(committedBlob === expectedBlob, `public blob ${committedBlob} != ${expectedBlob}`)
  assert(sha256 === expectedSha256, `dist sha256 ${sha256} != ${expectedSha256}`)
  assert(readFileSync(distFile).equals(readFileSync(publicFile)), 'dist baseline bytes differ from public/')

  const html = readFileSync(indexFile, 'utf8')
  const srcs = scriptSrcs(html)
  const localSrc = srcs.find((src) => src.split('?')[0].endsWith(baselineName))
  assert(Boolean(localSrc), `dist/index.html does not reference ${baselineName}`)
  let resolvedPath = ''
  if (localSrc) {
    assert(!isRemoteUrl(localSrc), `dist/index.html baseline script is remote: ${localSrc}`)
    const resolved = new URL(localSrc, `http://127.0.0.1${pagesBase}/index.html`)
    resolvedPath = resolved.pathname
    assert(resolved.hostname === '127.0.0.1', `baseline script resolved off-origin: ${resolved.href}`)
    assert(resolvedPath === `${pagesBase}/${baselineName}`, `baseline script resolved to ${resolvedPath}`)
  }

  console.log('loop-baseline provenance')
  console.log(`  dist: dist/${baselineName}`)
  console.log(`  bytes: ${statSync(distFile).size}`)
  console.log(`  gitBlobSha: ${gitBlobSha}`)
  console.log(`  sha256: ${sha256}`)
  console.log(`  indexScriptSrc: ${localSrc || ''}`)
  console.log(`  resolvedPath: ${resolvedPath}`)
  return { distFile, localSrc, resolvedPath, gitBlobSha, sha256 }
}

function which(command) {
  const result = spawnSync('bash', ['-lc', `command -v ${command}`], { encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim() : ''
}

function findChrome() {
  const candidates = [process.env.CHROME_PATH, process.env.CHROME_BIN, 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].filter(Boolean)
  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && existsSync(candidate)) return candidate
    const found = which(candidate)
    if (found) return found
  }
  return ''
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function contentType(file) {
  switch (path.extname(file).toLowerCase()) {
    case '.html':
    case '.htm':
      return 'text/html; charset=utf-8'
    case '.js':
    case '.mjs':
      return 'text/javascript; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    default:
      return 'application/octet-stream'
  }
}

function startServer(distDir) {
  const smokeHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:,">
  <title>loop baseline smoke</title>
  <script src="./${baselineName}" defer></script>
</head>
<body><p id="smoke">ok</p></body>
</html>
`
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end()
      return
    }
    const pathname = decodeURIComponent(url.pathname)
    if (pathname === `${pagesBase}/loop-baseline-smoke.html`) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' })
      res.end(req.method === 'HEAD' ? undefined : smokeHtml)
      return
    }
    if (pathname !== pagesBase && !pathname.startsWith(`${pagesBase}/`)) {
      res.writeHead(404).end('not found')
      return
    }
    let rel = pathname.slice(pagesBase.length)
    if (rel === '' || rel === '/') rel = '/index.html'
    const file = path.resolve(distDir, `.${rel}`)
    const root = path.resolve(distDir)
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end('forbidden')
      return
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end('missing')
      return
    }
    const body = readFileSync(file)
    res.writeHead(200, { 'content-type': contentType(file), 'content-length': body.length, 'cache-control': 'no-store' })
    res.end(req.method === 'HEAD' ? undefined : body)
  })
  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
    server.on('error', reject)
  })
}

function connectCdp(wsUrl) {
  const ws = new WebSocket(wsUrl)
  let next = 1
  const pending = new Map()
  const listeners = []
  const opened = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve)
    ws.addEventListener('error', () => reject(new Error(`CDP socket failed: ${wsUrl}`)))
  })
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(typeof event.data === 'string' ? event.data : Buffer.from(event.data).toString('utf8'))
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(`${msg.error.message || 'CDP error'}`))
      else resolve(msg.result || {})
      return
    }
    if (msg.method) for (const listener of listeners) listener(msg)
  })
  return {
    ready: opened,
    on(listener) { listeners.push(listener) },
    send(method, params = {}) {
      const id = next++
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })
    },
    close() { ws.close() },
  }
}

async function getJson(port, pathname) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: pathname }, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))) }
        catch (error) { reject(error) }
      })
    })
    req.on('error', reject)
  })
}

async function waitFor(fn, timeoutMs, label) {
  const start = Date.now()
  let lastError
  while (Date.now() - start < timeoutMs) {
    try { return await fn() }
    catch (error) { lastError = error }
    await sleep(100)
  }
  throw new Error(`${label} timed out${lastError ? `: ${lastError.message}` : ''}`)
}

async function browserSmoke() {
  const chromePath = findChrome()
  assert(chromePath, 'headless Chrome/Chromium was not found; set CHROME_PATH. Reproducible command: npm run verify:loop-baseline')
  if (!chromePath) return

  if (typeof WebSocket !== 'function') {
    fail('global WebSocket is required (Node 22+)')
    return
  }

  const distDir = path.join(repoRoot, 'dist')
  const { server, port } = await startServer(distDir)
  const userDataDir = await mkdtemp(path.join(tmpdir(), 'loop-baseline-chrome-'))
  const stderr = []
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--mute-audio',
    '--remote-debugging-port=0',
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${userDataDir}`,
    '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'], detached: true })
  chrome.stderr.on('data', (chunk) => {
    stderr.push(chunk.toString())
    if (stderr.join('').length > 12000) stderr.shift()
  })
  chrome.stderr.on('error', () => {})
  chrome.on('error', () => {})

  let browser
  let page
  try {
    const debugPort = await waitFor(async () => {
      const file = path.join(userDataDir, 'DevToolsActivePort')
      if (!existsSync(file)) throw new Error('DevToolsActivePort missing')
      const value = Number(readFileSync(file, 'utf8').split('\n')[0])
      if (!value) throw new Error('DevTools port empty')
      return value
    }, 15000, 'Chrome DevTools')

    const version = await waitFor(() => getJson(debugPort, '/json/version'), 10000, 'Chrome version endpoint')
    browser = connectCdp(version.webSocketDebuggerUrl)
    await browser.ready
    const created = await browser.send('Target.createTarget', { url: 'about:blank' })
    const targets = await waitFor(async () => {
      const list = await getJson(debugPort, '/json/list')
      const target = list.find((item) => item.id === created.targetId && item.webSocketDebuggerUrl)
      if (!target) throw new Error('page target missing')
      return target
    }, 10000, 'Chrome page target')
    page = connectCdp(targets.webSocketDebuggerUrl)
    await page.ready
    await page.send('Network.enable')
    await page.send('Page.enable')
    await page.send('Runtime.enable')
    await page.send('Log.enable')

    const requests = []
    const responses = new Map()
    const consoleErrors = []
    let loaded = false
    page.on((msg) => {
      if (msg.method === 'Network.requestWillBeSent') requests.push(msg.params.request.url)
      if (msg.method === 'Network.responseReceived') {
        responses.set(msg.params.requestId, {
          url: msg.params.response.url,
          status: msg.params.response.status,
        })
      }
      if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'assert')) {
        const text = (msg.params.args || []).map((arg) => arg.value ?? arg.description ?? arg.type).join(' ')
        consoleErrors.push(text || msg.params.type)
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails?.text || 'exception')
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry?.level === 'error') {
        consoleErrors.push(msg.params.entry.text || 'log error')
      }
      if (msg.method === 'Page.loadEventFired') loaded = true
    })

    const pageUrl = `http://127.0.0.1:${port}${pagesBase}/loop-baseline-smoke.html`
    await page.send('Page.navigate', { url: pageUrl })
    await waitFor(async () => {
      if (!loaded) throw new Error('load event pending')
      return true
    }, 15000, 'page load')
    await sleep(300)

    const scriptUrl = `http://127.0.0.1:${port}${pagesBase}/${baselineName}`
    const scriptResponse = [...responses.values()].find((item) => item.url.split('?')[0] === scriptUrl)
    const forbiddenRequests = requests.filter((url) => {
      let parsed
      try { parsed = new URL(url) } catch { return true }
      const local = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost'
      if (!local) return url.includes('loop-baseline') || url.includes(designSystemMark)
      return url.includes(designSystemMark)
    })
    const executed = await page.send('Runtime.evaluate', {
      expression: `({
        loaded: window.__AGENTROPOLIS_LOOP_BASELINE__ === true,
        version: window.__AGENTROPOLIS_LOOP_BASELINE_VERSION__ || '',
        host: Boolean(document.getElementById('agentropolis-loop-baseline'))
      })`,
      returnByValue: true,
    })

    assert(Boolean(scriptResponse), `local baseline script was not requested: ${scriptUrl}`)
    assert(scriptResponse?.status === 200, `local baseline script status ${scriptResponse?.status ?? 'missing'}`)
    assert(consoleErrors.length === 0, `console errors:\n${consoleErrors.join('\n')}`)
    assert(forbiddenRequests.length === 0, `remote baseline or design-system requests:\n${forbiddenRequests.join('\n')}`)
    assert(executed.result?.value?.loaded === true, 'baseline script did not set its load flag')
    assert(executed.result?.value?.host === true, 'baseline host element missing')

    const versionText = spawnSync(chromePath, ['--version'], { encoding: 'utf8' }).stdout.trim()
    console.log('browser smoke')
    console.log(`  chrome: ${versionText}`)
    console.log(`  page: ${pageUrl}`)
    console.log(`  scriptUrl: ${scriptUrl}`)
    console.log(`  scriptStatus: ${scriptResponse?.status ?? 'missing'}`)
    console.log(`  consoleErrors: ${consoleErrors.length}`)
    console.log(`  forbiddenRequests: ${forbiddenRequests.length}`)
    console.log(`  executed: ${executed.result?.value?.loaded === true}`)
    console.log(`  version: ${executed.result?.value?.version || ''}`)
    console.log(`  requestCount: ${requests.length}`)
  } catch (error) {
    fail(`headless smoke failed: ${error.message}`)
    if (stderr.length) console.error(stderr.join('').slice(-4000))
  } finally {
    try { page?.close() } catch { /* The DevTools socket may already be closed. */ }
    try { browser?.close() } catch { /* The DevTools socket may already be closed. */ }
    await stopChrome(chrome)
    await new Promise((resolve) => server.close(resolve))
    await removeProfile(userDataDir)
  }
}

async function stopChrome(chrome) {
  if (!chrome || chrome.exitCode !== null) return
  try {
    process.kill(-chrome.pid, 'SIGKILL')
  } catch {
    try { chrome.kill('SIGKILL') } catch { /* Chrome has already exited. */ }
  }
  await new Promise((resolve) => {
    if (chrome.exitCode !== null) {
      resolve()
      return
    }
    const timer = setTimeout(resolve, 2000)
    chrome.once('exit', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

async function removeProfile(dir) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(dir, { recursive: true, force: true, maxRetries: 2, retryDelay: 50 })
      return
    } catch (error) {
      if (attempt === 4) {
        console.error(`chrome profile cleanup skipped: ${error.message}`)
        return
      }
      await sleep(200)
    }
  }
}

async function main() {
  console.log('reproducible command: npm run verify:loop-baseline')
  checkDetector()
  const sourceHits = scanFiles(walkSource(repoRoot), 'source')
  console.log(`source scan forbidden script refs: ${sourceHits}`)
  runBuild()
  verifyDist()
  const distHits = scanFiles(listDistWeb(path.join(repoRoot, 'dist')), 'dist')
  console.log(`dist scan forbidden script refs: ${distHits}`)
  if (!failures.length) await browserSmoke()
  if (failures.length) {
    console.error('FAIL')
    for (const message of failures) console.error(`- ${message}`)
    process.exit(1)
  }
  console.log('PASS')
}

function listDistWeb(dir, results = []) {
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) listDistWeb(full, results)
    else if (/\.(html|htm|js|mjs)$/i.test(entry.name)) results.push(full)
  }
  return results
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
