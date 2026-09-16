/**
 * Generate public/cv.pdf from live CMS data (Opsi A, identity-sync).
 *
 * Usage: `bun scripts/cv/generate.ts` (wired as `prebuild-only`).
 * - Fetches `/api/v1/personal/data`, renders an ATS-friendly EN layout.
 * - Prints via puppeteer-bundled Chromium (dev dependency, cached in
 *   ~/.cache/puppeteer; no apt browser, no snap, no service).
 * - Backend unreachable or invalid shape = hard fail (no stale PDF).
 */
import { writeFile } from 'node:fs/promises'
import puppeteer, { type Page } from 'puppeteer'
import { fetchCvData } from './fetch-data'
import { renderCvHtml } from './template'

const OUT = new URL('../../public/cv.pdf', import.meta.url).pathname

const data = await fetchCvData()
console.log(
  `CV source: ${data.personalInfo.fullname} | ${data.experiences.length} exp | ` +
    `${data.education.length} edu | ${data.achievements.length} ach | ${data.skills.length} skills`,
)

const html = renderCvHtml(data)
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
})
try {
  const page: Page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  await page.evaluateHandle('document.fonts.ready')
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  await writeFile(OUT, pdf)
  console.log(`CV written: ${OUT} (${pdf.length} bytes)`)
} finally {
  await browser.close()
}
