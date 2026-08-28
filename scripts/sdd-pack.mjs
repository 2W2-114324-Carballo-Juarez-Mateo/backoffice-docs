import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { existsSync, mkdirSync, createWriteStream } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { ZipArchive } = require('archiver')

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(here, '..')
const sddRoot = resolve(siteRoot, '..', 'sdd')
const outDir = join(siteRoot, 'docs', 'public', 'sdd')

const targets = [
  { src: join(sddRoot, 'backend'), zipName: 'sdd-backend.zip', entryName: 'backend' },
  { src: join(sddRoot, 'frontend'), zipName: 'sdd-frontend.zip', entryName: 'frontend' }
]

if (!existsSync(sddRoot)) {
  console.log('[sdd:pack] skip: no se encontró ../sdd (solo local).')
  process.exit(0)
}

mkdirSync(outDir, { recursive: true })

for (const t of targets) {
  if (!existsSync(t.src)) {
    console.log(`[sdd:pack] skip: falta ${t.src}`)
    continue
  }
  const dest = join(outDir, t.zipName)
  await new Promise((resolvePromise, reject) => {
    const output = createWriteStream(dest)
    const archive = new ZipArchive({ zlib: { level: 9 } })
    output.on('close', () => resolvePromise())
    archive.on('error', reject)
    archive.pipe(output)
    archive.directory(t.src, t.entryName)
    archive.file(join(sddRoot, 'AGENTS.md'), { name: 'AGENTS.md' })
    archive.finalize()
  })
  console.log(`[sdd:pack] creado ${dest}`)
}

console.log('[sdd:pack] listo.')