/**
 * figma-map.json 의 노드들을 Figma REST API로 가져와 스냅샷과 비교,
 * 내용이 바뀐 노드 ID를 stdout에 한 줄씩 출력한다.
 *
 *   node --env-file=.env server/detect-changes.mjs init   # 최초 스냅샷 저장 (출력 없음)
 *   node --env-file=.env server/detect-changes.mjs         # 비교 → 바뀐 노드 ID 출력 + 스냅샷 갱신
 *
 * 스냅샷: server/.snapshots.json  (노드 ID -> 문서 subtree 해시)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const MAP = JSON.parse(readFileSync(join(HERE, 'figma-map.json'), 'utf8'))
const SNAP_FILE = join(HERE, '.snapshots.json')

const { FIGMA_TOKEN } = process.env
if (!FIGMA_TOKEN) {
  console.error('Missing FIGMA_TOKEN in .env')
  process.exit(1)
}

const mode = process.argv[2] // 'init' | undefined
const ids = Object.keys(MAP.nodes)

// --- fetch node subtrees ---
const url =
  `https://api.figma.com/v1/files/${MAP.fileKey}/nodes` +
  `?ids=${ids.map(encodeURIComponent).join(',')}&geometry=paths`
const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } })
if (!res.ok) {
  console.error(`Figma API ${res.status}: ${await res.text()}`)
  process.exit(1)
}
const data = await res.json()

// --- deterministic stringify + hash ---
function stable(v) {
  if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']'
  if (v && typeof v === 'object') {
    return (
      '{' +
      Object.keys(v)
        .sort()
        .map((k) => JSON.stringify(k) + ':' + stable(v[k]))
        .join(',') +
      '}'
    )
  }
  return JSON.stringify(v)
}
function hash(node) {
  return createHash('sha256').update(stable(node)).digest('hex').slice(0, 16)
}

const current = {}
for (const id of ids) {
  const doc = data.nodes?.[id]?.document
  if (!doc) {
    console.error(`node ${id} not found in file — skipping`)
    continue
  }
  current[id] = hash(doc)
}

const prev = existsSync(SNAP_FILE)
  ? JSON.parse(readFileSync(SNAP_FILE, 'utf8'))
  : {}

if (mode === 'init') {
  writeFileSync(SNAP_FILE, JSON.stringify(current, null, 2) + '\n')
  console.error(`snapshots initialised: ${Object.keys(current).length} nodes`)
  process.exit(0)
}

const changed = ids.filter((id) => current[id] && current[id] !== prev[id])

writeFileSync(SNAP_FILE, JSON.stringify(current, null, 2) + '\n')

for (const id of changed) console.log(id) // stdout: 바뀐 노드 ID
console.error(
  changed.length
    ? `changed: ${changed.join(', ')}`
    : 'no content change in mapped nodes',
)
