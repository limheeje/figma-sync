/**
 * Render a route from the running dev server to a PNG for visual diffing against Figma.
 *
 *   node scripts/figma-shot.mjs [url] [outfile]
 *
 * Defaults: http://localhost:5173/  ->  scripts/.shots/render.png
 * Viewport is 1920 wide (design is a fixed 1920px desktop layout).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const url = process.argv[2] ?? 'http://localhost:5173/'
const out = process.argv[3] ?? 'scripts/.shots/render.png'

mkdirSync(dirname(out), { recursive: true })

const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1400 },
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200) // let webfonts settle
  await page.screenshot({ path: out, fullPage: true })
  console.log(`saved ${out}`)
} finally {
  await browser.close()
}
