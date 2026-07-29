'use client'

import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { formats, type Palette } from './data'

const porcelainColor = '#eee8dc'

interface DyaneModelProps {
  palette: Palette
  reducedMotion: boolean
}

function DyaneModel({ palette, reducedMotion }: DyaneModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(formats[0].modelPath)

  const porcelainMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: porcelainColor,
        roughness: 0.56,
        metalness: 0,
        clearcoat: 0.08,
        clearcoatRoughness: 0.82,
        sheen: 0.18,
        sheenColor: new THREE.Color('#fffaf0'),
      }),
    [],
  )

  const veilMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: palette.color,
        roughness: palette.material.roughness,
        metalness: palette.material.metalness,
        clearcoat: palette.material.clearcoat,
        clearcoatRoughness: 0.58,
        sheen: 0.14,
        sheenColor: new THREE.Color('#f4d8cf'),
      }),
    [palette],
  )

  const signatureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d2521',
        roughness: 0.42,
        metalness: 0.08,
      }),
    [],
  )

  const model = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      object.castShadow = true
      object.receiveShadow = true

      const name = object.name.toLowerCase()
      if (name.includes('scarf')) object.material = veilMaterial
      else if (name.includes('body.001')) object.material = signatureMaterial
      else object.material = porcelainMaterial
    })

    return clone
  }, [porcelainMaterial, scene, signatureMaterial, veilMaterial])

  useEffect(
    () => () => {
      porcelainMaterial.dispose()
      signatureMaterial.dispose()
      veilMaterial.dispose()
    }, [porcelainMaterial, signatureMaterial, veilMaterial],
  )

  useFrame(({ clock }, delta) => {
    if (!group.current || reducedMotion) return
    const restingAngle = Math.sin(clock.elapsedTime * 0.28) * 0.025
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, restingAngle, 1.8, delta)
  })

  return (
    <group ref={group} position={[0, -1.075, 0]}>
      <primitive object={model} dispose={null} />
    </group>
  )
}

function CameraRig() {
  const { camera, size } = useThree()

  useEffect(() => {
    const distance = size.width < 720 ? 8.7 : formats[0].cameraDistance
    camera.position.set(0, 0.12, distance)
    camera.lookAt(0, 0.12, 0)
    camera.updateProjectionMatrix()
  }, [camera, size.width])

  return null
}

function Studio({ palette, reducedMotion }: DyaneModelProps) {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.55} color="#fff4e7" />
      <rectAreaLight position={[-3.6, 4.5, 3.2]} width={4.5} height={5.5} intensity={4.2} color="#fff4e8" />
      <rectAreaLight position={[3.8, 2.4, 2.6]} width={3} height={4} intensity={2.6} color="#e8d8c8" />
      <spotLight
        position={[0.4, 4.8, -2.5]}
        angle={0.5}
        penumbra={1}
        intensity={2.8}
        color="#fff9ed"
        castShadow
        shadow-bias={-0.0002}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense fallback={null}>
        <DyaneModel palette={palette} reducedMotion={reducedMotion} />
        <Environment resolution={256}>
          <group rotation={[-0.35, 0, 0.2]}>
            <Lightformer form="rect" intensity={2.6} color="#fff5e6" position={[-4, 4, 4]} scale={[3, 5, 1]} />
            <Lightformer form="rect" intensity={1.8} color="#d8c0ae" position={[4, 1, 3]} scale={[2, 4, 1]} />
            <Lightformer form="ring" intensity={1.1} color="#fffaf2" position={[0, 4, -4]} scale={2.5} />
          </group>
        </Environment>
      </Suspense>

      <ContactShadows
        position={[0, -1.075, 0]}
        opacity={0.42}
        scale={3.7}
        blur={2.8}
        far={2.8}
        color="#241b18"
        resolution={512}
        frames={1}
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.055}
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-0.18}
        maxAzimuthAngle={0.18}
        minPolarAngle={Math.PI / 2 - 0.08}
        maxPolarAngle={Math.PI / 2 + 0.08}
        rotateSpeed={0.34}
        target={[0, 0.12, 0]}
      />
    </>
  )
}

export interface DyaneCanvasProps {
  palette: Palette
  reducedMotion: boolean
}

export default function DyaneCanvas({ palette, reducedMotion }: DyaneCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.12, formats[0].cameraDistance], fov: 27, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-label="Sculpture Dyane en porcelaine, vue interactive en trois dimensions"
      role="img"
    >
      <Studio palette={palette} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

useGLTF.preload(formats[0].modelPath)
