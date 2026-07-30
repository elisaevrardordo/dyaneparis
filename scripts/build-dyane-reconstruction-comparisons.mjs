import { mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, 'assets/models/reconstruction')
const outputRoots = [
  path.join(sourceRoot, 'comparisons'),
  path.join(projectRoot, 'public/previews/dyane-reconstruction'),
]

const references = {
  front: {
    path: '/Users/elisaevrard/Desktop/DYANE-FULL/1.png',
    crop: { left: 40, top: 20, width: 520, height: 1310 },
  },
  profile: {
    path: '/Users/elisaevrard/Desktop/DYANE-FULL/2.png',
    crop: { left: 90, top: 20, width: 510, height: 1310 },
  },
  'three-quarter': {
    path: '/Users/elisaevrard/Desktop/DYANE-FULL/3.png',
    crop: { left: 55, top: 20, width: 535, height: 1310 },
  },
  back: {
    path: '/Users/elisaevrard/Desktop/DYANE-FULL/4.png',
    crop: { left: 75, top: 20, width: 500, height: 1310 },
  },
}

const panelWidth = 480
const panelHeight = 680
const labelHeight = 44
const imageHeight = panelHeight - labelHeight
const background = { r: 231, g: 225, b: 219, alpha: 1 }

function labelSvg(label) {
  return Buffer.from(`
    <svg width="${panelWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e7e1db"/>
      <text x="240" y="28" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="2" fill="#302824">${label}</text>
    </svg>
  `)
}

async function panel(input, label, extract) {
  let pipeline = sharp(input)
  if (extract) pipeline = pipeline.extract(extract)
  const image = await pipeline
    .resize(panelWidth, imageHeight, { fit: 'contain', background })
    .flatten({ background })
    .png()
    .toBuffer()

  return sharp({
    create: { width: panelWidth, height: panelHeight, channels: 4, background },
  })
    .composite([
      { input: labelSvg(label), left: 0, top: 0 },
      { input: image, left: 0, top: labelHeight },
    ])
    .png()
    .toBuffer()
}

async function buildVariant(angle, reference, variant) {
  const prefix = variant === 'neutral' ? 'neutral-' : ''
  const v2Path = path.join(sourceRoot, 'renders/v00', `${prefix}${angle}.png`)
  const v3Path = path.join(sourceRoot, 'renders/v05', `${prefix}${angle}.png`)
  const [photoPanel, v2Panel, v3Panel] = await Promise.all([
    panel(reference.path, 'PHOTOGRAPHIE', reference.crop),
    panel(v2Path, 'DYANE WEB V2'),
    panel(v3Path, 'CANDIDAT V3'),
  ])

  const comparison = await sharp({
    create: { width: panelWidth * 3, height: panelHeight, channels: 4, background },
  })
    .composite([
      { input: photoPanel, left: 0, top: 0 },
      { input: v2Panel, left: panelWidth, top: 0 },
      { input: v3Panel, left: panelWidth * 2, top: 0 },
    ])
    .png()
    .toBuffer()

  const [photoImage, v3Image] = await Promise.all([
    sharp(reference.path)
      .extract(reference.crop)
      .resize(panelWidth, imageHeight, { fit: 'contain', background })
      .flatten({ background })
      .png()
      .toBuffer(),
    sharp(v3Path)
      .resize(panelWidth, imageHeight, { fit: 'contain', background })
      .flatten({ background })
      .png()
      .toBuffer(),
  ])

  const overlay = await sharp(photoImage)
    .composite([{ input: v3Image, blend: 'over', opacity: 0.5 }])
    .png()
    .toBuffer()

  for (const outputRoot of outputRoots) {
    await sharp(comparison).toFile(path.join(outputRoot, `${angle}-${variant}.png`))
    if (variant === 'studio') {
      await sharp(comparison).toFile(path.join(outputRoot, `${angle}.png`))
      await sharp(overlay).toFile(path.join(outputRoot, `${angle}-overlay.png`))
    }
  }
}

async function buildAngle(angle, reference) {
  await Promise.all([
    buildVariant(angle, reference, 'neutral'),
    buildVariant(angle, reference, 'studio'),
  ])
}

for (const outputRoot of outputRoots) await mkdir(outputRoot, { recursive: true })
await Promise.all(Object.entries(references).map(([angle, reference]) => buildAngle(angle, reference)))

const candidatePublicDir = path.join(projectRoot, 'public/models/candidates')
await mkdir(candidatePublicDir, { recursive: true })
await copyFile(
  path.join(sourceRoot, 'exports/dyane-web-v3-candidate.glb'),
  path.join(candidatePublicDir, 'dyane-web-v3-candidate.glb'),
)

console.log('Dyane reconstruction comparisons and Preview candidate are ready.')
