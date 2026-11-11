#!/usr/bin/env node
/**
 * Locate Cloudinary dependencies before and after a media migration.
 *
 * node scripts/audit-cloudinary.mjs
 * node scripts/audit-cloudinary.mjs --csv
 * node scripts/audit-cloudinary.mjs --fail
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skip = new Set(['.git', '.next', 'node_modules', 'dist', 'out', '.vercel'])
const scanExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.md', '.css', '.html'])
const pattern = /https?:\/\/res\.cloudinary\.com\/[^\s"'<>\x60]+/g
const hits = []

function scan(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    if (item.isDirectory()) {
      if (!skip.has(item.name)) scan(join(directory, item.name))
      continue
    }
    if (!item.isFile() || !scanExt.has(extname(item.name))) continue
    if (item.name === 'package-lock.json') continue
    const filename = join(directory, item.name)
    const lines = readFileSync(filename, 'utf8').split(/\r?\n/)
    for (let index = 0; index < lines.length; index++) {
      for (const match of lines[index].matchAll(pattern)) {
        const url = match[0].replace(/[),;]+$/, '')
        hits.push({ file: relative(root, filename), line: index + 1, url })
      }
    }
  }
}

scan(root)
const unique = new Set(hits.map((hit) => hit.url))
const imageCount = [...unique].filter((url) => url.includes('/image/upload/')).length
const videoCount = [...unique].filter((url) => url.includes('/video/upload/')).length

console.log('Cloudinary audit')
console.log('  references: ' + hits.length)
console.log('  unique URLs: ' + unique.size)
console.log('  image URLs: ' + imageCount)
console.log('  video URLs: ' + videoCount)
console.log('')
for (const hit of hits) console.log(hit.file + ':' + hit.line + ' ' + hit.url)

if (process.argv.includes('--csv')) {
  const csvCell = (value) => '"' + String(value).replace(/"/g, '""') + '"'
  const report = ['file,line,url', ...hits.map((hit) =>
    [hit.file, hit.line, hit.url].map(csvCell).join(',')
  )].join('\n') + '\n'
  const reportPath = join(root, 'reports', 'cloudinary-assets.csv')
  mkdirSync(join(root, 'reports'), { recursive: true })
  writeFileSync(reportPath, report, 'utf8')
  console.log('\nSaved report: ' + relative(root, reportPath))
}
if (process.argv.includes('--fail') && hits.length > 0) process.exitCode = 1
