'use client'

import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import styles from './GlbComparison.module.css'
import { glazePresets, porcelainPresets } from './data'

type ComparisonMode = 'geometry' | 'studio'
type Orientation = 'front' | 'three-quarter'
type ComparisonPair = 'audit' | 'reconstruction'

const ORIGINAL_PATH = '/models/dyane.glb'
const V2_PATH = '/models/dyane-web-v2.glb'
const V3_PATH = '/models/candidates/dyane-web-v3-candidate.glb?v=acb43651'

const metrics = {
  original: { bytes: 1_597_996, triangles: 61_513, drawCalls: 4 },
  v2: { bytes: 1_599_028, triangles: 61_506, drawCalls: 4 },
  v3: { bytes: 1_914_644, triangles: 61_792, drawCalls: 5 },
} as const

function formatWeight(bytes: number) {
  return `${(bytes / 1_000_000).toFixed(2).replace('.', ',')} Mo`
}

function cloneForComparison(source: THREE.Group, mode: ComparisonMode) {
  const clone = source.clone(true)
  const neutral = new THREE.MeshStandardMaterial({
    color: '#bdb8b1',
    roughness: 0.62,
    metalness: 0,
    side: THREE.DoubleSide,
  })
  const porcelain = new THREE.MeshPhysicalMaterial({
    ...porcelainPresets.body,
    color: porcelainPresets.body.color,
    specularColor: porcelainPresets.body.specularColor,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    side: THREE.DoubleSide,
  })
  const cap = new THREE.MeshPhysicalMaterial({
    ...porcelainPresets.cap,
    color: porcelainPresets.cap.color,
    specularColor: porcelainPresets.cap.specularColor,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    side: THREE.DoubleSide,
  })
  const glaze = new THREE.MeshPhysicalMaterial({
    ...glazePresets['bordeaux-profond'],
    color: glazePresets['bordeaux-profond'].color,
    specularColor: glazePresets['bordeaux-profond'].specularColor,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    side: THREE.DoubleSide,
  })
  const signature = new THREE.MeshStandardMaterial({
    color: '#302824',
    roughness: 0.46,
    metalness: 0,
    side: THREE.DoubleSide,
  })

  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.castShadow = true
    object.receiveShadow = true
    if (mode === 'geometry') {
      object.material = neutral
      return
    }
    const name = object.name.toLowerCase()
    if (name.includes('scarf')) object.material = glaze
    else if (name.includes('body.001') || name.includes('signature')) object.material = signature
    else if (name.includes('cap')) object.material = cap
    else object.material = porcelain
  })

  let bounds = new THREE.Box3().setFromObject(clone)
  const size = bounds.getSize(new THREE.Vector3())
  const normalizedScale = 2.16 / size.y
  clone.scale.setScalar(normalizedScale)
  clone.updateMatrixWorld(true)
  bounds = new THREE.Box3().setFromObject(clone)
  const center = bounds.getCenter(new THREE.Vector3())
  clone.position.set(-center.x, -bounds.min.y, -center.z)

  return { clone, materials: [neutral, porcelain, cap, glaze, signature] }
}

function ComparisonModel({
  source,
  x,
  mode,
  orientation,
}: {
  source: THREE.Group
  x: number
  mode: ComparisonMode
  orientation: Orientation
}) {
  const prepared = useMemo(() => cloneForComparison(source, mode), [mode, source])

  useEffect(
    () => () => {
      prepared.materials.forEach((material) => {
        material.dispose()
      })
    },
    [prepared],
  )

  return (
    <group position={[x, 0, 0]} rotation={[0, orientation === 'front' ? 0 : 0.38, 0]}>
      <primitive object={prepared.clone} dispose={null} />
    </group>
  )
}

function CameraCalibration() {
  const { camera, size } = useThree()

  useEffect(() => {
    camera.position.set(0, size.width < 720 ? 1.1 : 1.04, size.width < 720 ? 8.1 : 6.8)
    camera.lookAt(0, 1.02, 0)
    camera.updateProjectionMatrix()
  }, [camera, size.width])

  return null
}

function ComparisonScene({
  mode,
  orientation,
  pair,
}: {
  mode: ComparisonMode
  orientation: Orientation
  pair: ComparisonPair
}) {
  const original = useGLTF(ORIGINAL_PATH)
  const v2 = useGLTF(V2_PATH)
  const v3 = useGLTF(V3_PATH)
  const { size, gl } = useThree()
  const isMobile = size.width < 720
  const horizontalOffset = isMobile ? 0.58 : 0.84
  const leftSource = pair === 'audit' ? original.scene : v2.scene
  const rightSource = pair === 'audit' ? v2.scene : v3.scene

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = mode === 'studio' ? 1.05 : 0.96
  }, [gl, mode])

  return (
    <>
      <color attach="background" args={[mode === 'studio' ? '#e7e1db' : '#d8d4cf']} />
      <CameraCalibration />
      <ambientLight intensity={mode === 'studio' ? 0.28 : 0.72} color="#fff7eb" />
      <directionalLight
        castShadow
        position={[-4.8, 7, 4]}
        intensity={mode === 'studio' ? 2.55 : 1.8}
        color="#fff3df"
        shadow-bias={-0.00018}
        shadow-normalBias={0.018}
        shadow-mapSize-width={isMobile ? 1024 : 2048}
        shadow-mapSize-height={isMobile ? 1024 : 2048}
      />
      <rectAreaLight position={[4, 3, 3]} width={3} height={5} intensity={0.9} color="#dce5eb" />
      <rectAreaLight position={[0, 3, 4.5]} width={5} height={3.5} intensity={0.36} color="#fff7ee" />

      <ComparisonModel source={leftSource} x={-horizontalOffset} mode={mode} orientation={orientation} />
      <ComparisonModel source={rightSource} x={horizontalOffset} mode={mode} orientation={orientation} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={mode === 'studio' ? '#ebe5de' : '#d2ceca'} roughness={0.96} />
      </mesh>

      {mode === 'studio' ? (
        <Environment resolution={isMobile ? 128 : 256}>
          <group rotation={[-0.2, 0.12, 0.08]}>
            <Lightformer form="rect" intensity={3.4} color="#fff3df" position={[-4.5, 4.5, 4]} scale={[3.2, 6.5, 1]} />
            <Lightformer form="rect" intensity={1.25} color="#dbe4e9" position={[4.8, 2.8, 3]} scale={[2.6, 5, 1]} />
            <Lightformer form="rect" intensity={0.82} color="#fff8ed" position={[0, 6, 0]} scale={[6, 1.3, 1]} />
          </group>
        </Environment>
      ) : null}
    </>
  )
}

export default function GlbComparison({ locale }: { locale: string }) {
  const [mode, setMode] = useState<ComparisonMode>('geometry')
  const [orientation, setOrientation] = useState<Orientation>('front')
  const [pair, setPair] = useState<ComparisonPair>('reconstruction')
  const configuratorHref = locale === 'en' ? '/en/configurateur' : '/configurateur'
  const leftMetric = pair === 'audit' ? metrics.original : metrics.v2
  const rightMetric = pair === 'audit' ? metrics.v2 : metrics.v3
  const leftLabel = pair === 'audit' ? 'Original' : 'Dyane Web V2'
  const rightLabel = pair === 'audit' ? 'Dyane Web V2' : 'Candidat V3'

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={configuratorHref} className={styles.backLink}>
          ← Retour au configurateur
        </Link>
        <div>
          <p className={styles.eyebrow}>Audit technique — Preview uniquement</p>
          <h1>{leftLabel} / {rightLabel}</h1>
        </div>
        <div className={styles.controls}>
          <fieldset className={styles.controlGroup}>
            <legend className={styles.visuallyHidden}>Versions comparées</legend>
            <button type="button" aria-pressed={pair === 'audit'} onClick={() => setPair('audit')}>
              Audit V1 / V2
            </button>
            <button
              type="button"
              aria-pressed={pair === 'reconstruction'}
              onClick={() => setPair('reconstruction')}
            >
              Remodelage V2 / V3
            </button>
          </fieldset>
          <fieldset className={styles.controlGroup}>
            <legend className={styles.visuallyHidden}>Type de comparaison</legend>
            <button type="button" aria-pressed={mode === 'geometry'} onClick={() => setMode('geometry')}>
              Géométrie neutre
            </button>
            <button type="button" aria-pressed={mode === 'studio'} onClick={() => setMode('studio')}>
              Porcelaine studio
            </button>
          </fieldset>
          <fieldset className={styles.controlGroup}>
            <legend className={styles.visuallyHidden}>Orientation</legend>
            <button type="button" aria-pressed={orientation === 'front'} onClick={() => setOrientation('front')}>
              Face
            </button>
            <button
              type="button"
              aria-pressed={orientation === 'three-quarter'}
              onClick={() => setOrientation('three-quarter')}
            >
              Trois-quarts
            </button>
          </fieldset>
        </div>
      </header>

      <section className={styles.comparison} aria-label="Comparaison 3D synchronisée">
        <div className={styles.divider} aria-hidden="true" />
        <div className={`${styles.modelLabel} ${styles.leftLabel}`}>
          <span>{leftLabel}</span>
          <strong>{leftMetric.triangles.toLocaleString('fr-FR')} triangles</strong>
          <small>{formatWeight(leftMetric.bytes)} · {leftMetric.drawCalls} draw calls</small>
        </div>
        <div className={`${styles.modelLabel} ${styles.rightLabel}`}>
          <span>{rightLabel}</span>
          <strong>{rightMetric.triangles.toLocaleString('fr-FR')} triangles</strong>
          <small>{formatWeight(rightMetric.bytes)} · {rightMetric.drawCalls} draw calls</small>
        </div>
        <Canvas
          shadows
          dpr={[1, 1.7]}
          camera={{ position: [0, 1.04, 6.8], fov: 28, near: 0.1, far: 30 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <ComparisonScene mode={mode} orientation={orientation} pair={pair} />
          </Suspense>
        </Canvas>
      </section>

      <footer className={styles.note}>
        {mode === 'geometry'
          ? 'Même matériau neutre, même caméra et même lumière : cette vue isole les changements du fichier GLB.'
          : 'Même matériau de porcelaine final et même environnement studio : cette vue isole le comportement du rendu.'}
      </footer>

      <section className={styles.referenceSection} aria-labelledby="reference-comparison-title">
        <p className={styles.eyebrow}>Contrôle photographique</p>
        <h2 id="reference-comparison-title">Photographie / V2 / candidat V3</h2>
        <div className={styles.referenceGrid}>
          {(['front', 'profile', 'three-quarter', 'back'] as const).map((angle) => (
            <figure key={angle}>
              <Image
                src={`/previews/dyane-reconstruction/${angle}.png`}
                alt={`Comparaison ${angle} entre la photographie, Dyane Web V2 et le candidat V3`}
                width={1440}
                height={680}
              />
              <figcaption>{angle === 'three-quarter' ? 'Trois-quarts' : angle}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}

useGLTF.preload(ORIGINAL_PATH)
useGLTF.preload(V2_PATH)
useGLTF.preload(V3_PATH)
