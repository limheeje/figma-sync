/**
 * 실행 중인 dev 서버의 한 경로를 PNG로 캡처 — Figma 스크린샷과 대조용.
 *
 *   node scripts/figma-shot.mjs [url] [outfile]
 *
 * 기본: http://localhost:5173/  ->  scripts/.shots/render.png
 * 뷰포트: SHOT_W x SHOT_H (기본 1440x900). 모바일/디바이스 디자인이면 env로 조정:
 *   SHOT_W=720 SHOT_H=1440 node scripts/figma-shot.mjs http://localhost:5173/login out.png
 *
 * 필요: npm i -D playwright  &&  npx playwright install chromium
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const url = process.argv[2] ?? 'http://localhost:5173/'
const out = process.argv[3] ?? 'scripts/.shots/render.png'
const width = Number(process.env.SHOT_W ?? 1440)
const height = Number(process.env.SHOT_H ?? 900)

mkdirSync(dirname(out), { recursive: true })

const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200) // 웹폰트 안정화
  await page.screenshot({ path: out, fullPage: true })
  console.log(`saved ${out}  (${width}x${height})`)
} finally {
  await browser.close()
}
