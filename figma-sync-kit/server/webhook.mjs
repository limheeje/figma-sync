/**
 * Figma webhook receiver — 스택 무관 배치 모드.
 *
 *   node --env-file=.env server/webhook.mjs
 *
 * FILE_UPDATE / FILE_VERSION_UPDATE → 디바운스 → detect-changes.mjs 로
 * server/figma-map.json 의 노드 중 바뀐 것만 골라 → 노드마다
 * `claude -p "/figma-sync <url>"` 를 순차 실행.
 *
 * 프로젝트마다 다른 것은 오직 server/figma-map.json (노드 ↔ 파일 매핑) 뿐.
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')
const MAP = JSON.parse(readFileSync(join(HERE, 'figma-map.json'), 'utf8'))

const {
  WEBHOOK_PASSCODE = '',
  PORT = '3000',
  DEBOUNCE_MS = '300000',
  DRY_RUN = '1',
  CLAUDE_ARGS = '--dangerously-skip-permissions',
} = process.env

const debounceMs = Number(DEBOUNCE_MS)
const dryRun = DRY_RUN !== '0'
const logFile = join(HERE, '.sync-log')

function log(...a) {
  const line = `[${new Date().toISOString()}] ${a.join(' ')}`
  console.log(line)
  try {
    appendFileSync(logFile, line + '\n')
  } catch {}
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: REPO, shell: true, ...opts })
    let out = ''
    child.stdout.on('data', (d) => {
      out += d
      process.stdout.write(d)
    })
    child.stderr.on('data', (d) => process.stderr.write(d))
    if (opts.stdin != null) {
      child.stdin.write(opts.stdin)
      child.stdin.end()
    }
    child.on('close', (code) => resolve({ code, out }))
    child.on('error', (e) => {
      log(`spawn error: ${e.message}`)
      resolve({ code: -1, out })
    })
  })
}

function nodeUrl(id) {
  return `https://www.figma.com/design/${MAP.fileKey}/x?node-id=${id.replace(':', '-')}`
}

let timer = null
let running = false
let pending = false

function schedule(reason) {
  log(`change: ${reason} — batch in ${debounceMs / 1000}s`)
  clearTimeout(timer)
  timer = setTimeout(runBatch, debounceMs)
}

async function runBatch() {
  if (running) {
    pending = true
    log('batch already running — queued')
    return
  }
  running = true
  try {
    log('detecting changed nodes…')
    const { code, out } = await run('node', [
      '--env-file=.env',
      'server/detect-changes.mjs',
    ])
    if (code !== 0) return log('detect-changes failed — aborting batch')

    const ids = out.split('\n').map((s) => s.trim()).filter(Boolean)
    if (!ids.length) return log('nothing to sync')

    for (const id of ids) {
      const entry = MAP.nodes[id]
      const url = nodeUrl(id)
      log(`sync ${id} -> ${entry?.component ?? '?'}`)
      if (dryRun) {
        log(`DRY_RUN: would run -> claude -p ${CLAUDE_ARGS} "/figma-sync ${url}"`)
        continue
      }
      const { code: c } = await run(
        'claude',
        ['-p', ...CLAUDE_ARGS.split(' ').filter(Boolean)],
        { stdin: `/figma-sync ${url}` },
      )
      log(`  ${id} claude exit ${c}`)
    }
    log(`batch done (${ids.length} node${ids.length > 1 ? 's' : ''})`)
  } finally {
    running = false
    if (pending) {
      pending = false
      log('running queued batch')
      runBatch()
    }
  }
}

const server = createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('figma-sync webhook receiver (batch mode)\n')
    return
  }
  if (req.method === 'POST' && req.url === '/figma-hook') {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end('{"ok":true}')
      let p
      try {
        p = JSON.parse(body)
      } catch {
        return log('bad payload')
      }
      const { event_type, passcode, file_name, label } = p
      if (event_type === 'PING') return log('PING received — webhook is live ✅')
      if (WEBHOOK_PASSCODE && passcode !== WEBHOOK_PASSCODE)
        return log(`rejected ${event_type}: passcode mismatch`)
      if (event_type === 'FILE_UPDATE') schedule(`FILE_UPDATE "${file_name}"`)
      else if (event_type === 'FILE_VERSION_UPDATE')
        schedule(`FILE_VERSION_UPDATE "${file_name}" (${label || 'no label'})`)
      else log(`ignoring event: ${event_type}`)
    })
    return
  }
  res.writeHead(404)
  res.end()
})

server.listen(Number(PORT), () => {
  log(
    `listening on http://localhost:${PORT}  (DRY_RUN=${dryRun ? 1 : 0}, debounce=${debounceMs / 1000}s, ${Object.keys(MAP.nodes).length} mapped nodes)`,
  )
})
