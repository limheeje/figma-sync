/**
 * router.ts 의 각 라우트 meta.node + 컴포넌트 경로를 읽어
 * server/figma-map.json 을 생성한다.
 *
 *   node server/gen-figma-map.mjs
 *
 * 새 화면이 라우트에 추가되면 (meta.node 포함) 다시 돌리기만 하면 됨.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')

const { FIGMA_FILE_KEY } = process.env
if (!FIGMA_FILE_KEY) {
  console.error('Missing FIGMA_FILE_KEY in .env')
  process.exit(1)
}

const routerSrc = readFileSync(join(REPO, 'src/router.ts'), 'utf8')

// 각 라우트 블록에서 import('./screens/X.vue') 와 meta:{ ... node: '8:7519' } 추출
const blockRe = /import\(['"](\.\/screens\/[^'"]+\.vue)['"]\)[\s\S]*?meta:\s*\{[^}]*?node:\s*['"]([\d:]+)['"]/g

const nodes = {}
let m
while ((m = blockRe.exec(routerSrc))) {
  const component = 'src/' + m[1].replace(/^\.\//, '')
  const node = m[2]
  // 같은 라우트 객체의 name (import 직전, 가장 가까운 것)
  const before = routerSrc.slice(Math.max(0, m.index - 160), m.index)
  const nameM = [...before.matchAll(/name:\s*['"]([^'"]+)['"]/g)].pop()
  nodes[node] = { component, ...(nameM ? { route: nameM[1] } : {}) }
}

if (!Object.keys(nodes).length) {
  console.error('No routes with meta.node found in src/router.ts')
  process.exit(1)
}

const out = { fileKey: FIGMA_FILE_KEY, nodes }
writeFileSync(join(HERE, 'figma-map.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`figma-map.json: ${Object.keys(nodes).length} nodes`)
for (const [id, v] of Object.entries(nodes)) console.log(`  ${id}  ->  ${v.component}`)
