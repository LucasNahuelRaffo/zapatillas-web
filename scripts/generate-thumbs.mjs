// Genera thumbnails WebP de las imágenes de producto para las cards del shop
// y los avatares del admin. Correr con: npm run thumbs
// Los thumbs quedan commiteados en public/sneakers/thumbs/ y se deployan con el build.
import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const SRC_DIR = 'public/sneakers'
const OUT_DIR = 'public/sneakers/thumbs'
const WIDTH = 480
const QUALITY = 78

await mkdir(OUT_DIR, { recursive: true })

const files = (await readdir(SRC_DIR)).filter(f => /\.(jpe?g|png|webp)$/i.test(f))

let done = 0
let srcBytes = 0
let outBytes = 0

for (const file of files) {
  const src = path.join(SRC_DIR, file)
  const out = path.join(OUT_DIR, file.replace(/\.(jpe?g|png|webp)$/i, '.webp'))
  await sharp(src)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out)
  srcBytes += (await stat(src)).size
  outBytes += (await stat(out)).size
  done++
}

// Hero del home (LCP): mismo tratamiento pero a mayor ancho
const HERO_SRC = 'src/img/hero_sneaker-removebg-preview.png'
const HERO_OUT = 'src/img/hero_sneaker.webp'
try {
  await sharp(HERO_SRC).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 82 }).toFile(HERO_OUT)
  console.log(`Hero: ${HERO_SRC} -> ${HERO_OUT} (${((await stat(HERO_OUT)).size / 1024).toFixed(0)} KB)`)
} catch (e) {
  console.warn('Hero no convertido:', e.message)
}

console.log(`Thumbs: ${done} imágenes -> ${OUT_DIR}`)
console.log(`Peso: ${(srcBytes / 1024 / 1024).toFixed(1)} MB originales -> ${(outBytes / 1024 / 1024).toFixed(1)} MB en thumbs`)
