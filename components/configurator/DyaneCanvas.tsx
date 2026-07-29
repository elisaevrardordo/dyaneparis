'use client'

import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  type ConfiguratorStep,
  type FormatId,
  type FormatOption,
  formatById,
  formats,
  type Palette,
} from './data'

const porcelainColor = new THREE.Color('#eee9df')
const mutedPorcelainColor = new THREE.Color('#d9d5ce')
const modelHeight = 2.144

interface SceneStateProps {
  activeStep: ConfiguratorStep
  selectedFormatId: FormatId | null
  palette: Palette
  reducedMotion: boolean
}

interface InstanceTarget {
  position: [number, number, number]
  rotationY: number
  scale: number
  opacity: number
}

function getInstanceTarget(
  format: FormatOption,
  index: number,
  isMobile: boolean,
  activeStep: ConfiguratorStep,
  selectedFormatId: FormatId | null,
  reducedMotion: boolean,
): InstanceTarget {
  const desktopX = [-1.85, -0.05, 1.85]
  const mobileX = [-1.05, 0, 1.05]
  const mobileZ = [-0.9, 0, -0.72]
  const initialX = (isMobile ? mobileX : desktopX)[index]
  const initialZ = isMobile ? mobileZ[index] : 0
  const initial: InstanceTarget = {
    position: [initialX, 0, initialZ],
    rotationY: [0.06, 0, -0.05][index],
    scale: format.modelScale,
    opacity: 1,
  }

  if (!selectedFormatId) return initial

  const selectedIndex = formats.findIndex((item) => item.id === selectedFormatId)
  const isSelected = format.id === selectedFormatId
  const otherIndices = formats.map((_, itemIndex) => itemIndex).filter((itemIndex) => itemIndex !== selectedIndex)
  const side = index === otherIndices[0] ? -1 : 1

  if (activeStep === 'palette') {
    if (isSelected) {
      return {
        position: [isMobile ? 0 : -0.72, 0, reducedMotion ? 0.35 : 0.82],
        rotationY: reducedMotion ? 0.12 : 0.34,
        scale: format.modelScale * (isMobile ? 1 : 1.04),
        opacity: 1,
      }
    }

    return {
      position: [reducedMotion ? initialX : side * (isMobile ? 2.4 : 4.2), 0, -1.5],
      rotationY: initial.rotationY,
      scale: format.modelScale,
      opacity: 0,
    }
  }

  if (isSelected) {
    return {
      position: [reducedMotion ? initialX * 0.45 : 0, 0, reducedMotion ? 0.18 : 0.62],
      rotationY: 0,
      scale: format.modelScale * (reducedMotion ? 1.01 : 1.055),
      opacity: 1,
    }
  }

  return {
    position: [reducedMotion ? initialX : side * (isMobile ? 1.25 : 2.58), 0, reducedMotion ? initialZ : -0.42],
    rotationY: initial.rotationY,
    scale: format.modelScale,
    opacity: reducedMotion ? 0.48 : 0.34,
  }
}

interface DyaneInstanceProps extends SceneStateProps {
  format: FormatOption
  index: number
  sourceScene: THREE.Group
}

function DyaneInstance({
  format,
  index,
  sourceScene,
  activeStep,
  selectedFormatId,
  palette,
  reducedMotion,
}: DyaneInstanceProps) {
  const group = useRef<THREE.Group>(null)
  const { size, pointer } = useThree()
  const isMobile = size.width < 720
  const veilTargetColor = useMemo(() => new THREE.Color(palette.color), [palette.color])

  const porcelainMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: porcelainColor,
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.16,
        clearcoatRoughness: 0.72,
        sheen: 0.14,
        sheenColor: new THREE.Color('#fffdf7'),
        transparent: true,
      }),
    [],
  )

  const veilMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#6f172b',
        roughness: 0.34,
        metalness: 0.02,
        clearcoat: 0.22,
        clearcoatRoughness: 0.56,
        sheen: 0.12,
        sheenColor: new THREE.Color('#f2d7cf'),
        transparent: true,
      }),
    [],
  )

  const signatureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#332b27',
        roughness: 0.5,
        metalness: 0.04,
        transparent: true,
      }),
    [],
  )

  const { model, meshes, centeredPosition } = useMemo(() => {
    const clone = sourceScene.clone(true)
    const clonedMeshes: THREE.Mesh[] = []

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      clonedMeshes.push(object)
      object.castShadow = true
      object.receiveShadow = true

      const name = object.name.toLowerCase()
      if (name.includes('scarf')) object.material = veilMaterial
      else if (name.includes('body.001')) object.material = signatureMaterial
      else object.material = porcelainMaterial
    })

    const bounds = new THREE.Box3().setFromObject(clone)
    const center = bounds.getCenter(new THREE.Vector3())

    return {
      model: clone,
      meshes: clonedMeshes,
      centeredPosition: new THREE.Vector3(-center.x, -bounds.min.y, -center.z),
    }
  }, [porcelainMaterial, signatureMaterial, sourceScene, veilMaterial])

  const materials = useMemo(
    () => [porcelainMaterial, veilMaterial, signatureMaterial],
    [porcelainMaterial, signatureMaterial, veilMaterial],
  )

  useLayoutEffect(() => {
    if (!group.current) return
    const target = getInstanceTarget(format, index, isMobile, 'format', null, reducedMotion)
    group.current.position.set(...target.position)
    group.current.rotation.y = target.rotationY
    group.current.scale.setScalar(target.scale)
  }, [format, index, isMobile, reducedMotion])

  useEffect(
    () => () => {
      porcelainMaterial.dispose()
      signatureMaterial.dispose()
      veilMaterial.dispose()
    }, [porcelainMaterial, signatureMaterial, veilMaterial],
  )

  useFrame((_, delta) => {
    if (!group.current) return

    const target = getInstanceTarget(
      format,
      index,
      isMobile,
      activeStep,
      selectedFormatId,
      reducedMotion,
    )
    const lambda = reducedMotion ? 14 : 5.2
    const isSelected = format.id === selectedFormatId
    const interactiveRotation = activeStep === 'palette' && isSelected && !reducedMotion ? pointer.x * 0.075 : 0

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, target.position[0], lambda, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, target.position[1], lambda, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, target.position[2], lambda, delta)
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      target.rotationY + interactiveRotation,
      lambda,
      delta,
    )

    const nextScale = THREE.MathUtils.damp(group.current.scale.x, target.scale, lambda, delta)
    group.current.scale.setScalar(nextScale)

    const nextOpacity = THREE.MathUtils.damp(materials[0].opacity, target.opacity, lambda, delta)
    for (const material of materials) {
      material.opacity = nextOpacity
      material.depthWrite = nextOpacity > 0.45
    }

    const porcelainTarget = target.opacity < 0.8 ? mutedPorcelainColor : porcelainColor
    porcelainMaterial.color.lerp(porcelainTarget, 1 - Math.exp(-lambda * delta))
    veilMaterial.color.lerp(veilTargetColor, 1 - Math.exp(-(reducedMotion ? 12 : 4.8) * delta))
    veilMaterial.roughness = THREE.MathUtils.damp(
      veilMaterial.roughness,
      palette.material.roughness,
      reducedMotion ? 12 : 4.8,
      delta,
    )
    veilMaterial.metalness = THREE.MathUtils.damp(
      veilMaterial.metalness,
      palette.material.metalness,
      reducedMotion ? 12 : 4.8,
      delta,
    )
    veilMaterial.clearcoat = THREE.MathUtils.damp(
      veilMaterial.clearcoat,
      palette.material.clearcoat,
      reducedMotion ? 12 : 4.8,
      delta,
    )

    const shouldRender = nextOpacity > 0.012 || target.opacity > 0
    group.current.visible = shouldRender
    for (const mesh of meshes) mesh.castShadow = nextOpacity > 0.08
  })

  return (
    <group ref={group}>
      <primitive object={model} position={centeredPosition} dispose={null} />
    </group>
  )
}

function CameraRig({ activeStep, selectedFormatId, reducedMotion }: Omit<SceneStateProps, 'palette'>) {
  const { camera, size } = useThree()
  const currentTarget = useRef(new THREE.Vector3(0, 1.48, 0))
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const overviewPosition = useMemo(() => new THREE.Vector3(), [])
  const overviewTarget = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    camera.layers.enable(1)
  }, [camera])

  useFrame((_, delta) => {
    const isMobile = size.width < 720
    const selectedFormat = selectedFormatId ? formatById[selectedFormatId] : null
    const selectedHeight = selectedFormat ? modelHeight * selectedFormat.modelScale : modelHeight

    if (!selectedFormat) {
      desiredPosition.set(0, isMobile ? 1.25 : 1.2, isMobile ? 12.6 : 11.8)
      desiredTarget.set(0, isMobile ? 0.72 : 0.65, 0)
    } else if (activeStep === 'palette') {
      if (isMobile) {
        desiredPosition.set(0, selectedHeight * 0.38, 8 + selectedFormat.modelScale * 2.8)
        desiredTarget.set(0, selectedHeight * 0.28, 0.12)
      } else {
        desiredPosition.set(0.2, selectedHeight * 0.5, 4.35 + selectedFormat.modelScale * 2.1)
        desiredTarget.set(-0.42, selectedHeight * 0.47, 0.12)
      }
    } else {
      desiredPosition.set(
        0,
        selectedHeight * 0.4,
        (isMobile ? 5.6 : 4.5) + selectedFormat.modelScale * (isMobile ? 5 : 4.9),
      )
      desiredTarget.set(0, selectedHeight * 0.35, 0.1)
    }

    if (reducedMotion && selectedFormat) {
      overviewPosition.set(0, isMobile ? 1.25 : 1.2, isMobile ? 12.6 : 11.8)
      overviewTarget.set(0, isMobile ? 0.72 : 0.65, 0)
      desiredPosition.lerp(overviewPosition, 0.34)
      desiredTarget.lerp(overviewTarget, 0.34)
    }

    const lambda = reducedMotion ? 12 : 4.1
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosition.x, lambda, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosition.y, lambda, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosition.z, lambda, delta)
    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, desiredTarget.x, lambda, delta)
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, desiredTarget.y, lambda, delta)
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, desiredTarget.z, lambda, delta)
    camera.lookAt(currentTarget.current)
  })

  return null
}

function ShadowFloor() {
  const floor = useRef<THREE.Mesh>(null)

  useLayoutEffect(() => {
    floor.current?.layers.set(1)
  }, [])

  return (
    <mesh ref={floor} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]}>
      <planeGeometry args={[30, 30]} />
      <shadowMaterial color="#665d55" opacity={0.16} transparent depthWrite={false} />
    </mesh>
  )
}

type StudioProps = SceneStateProps

function Studio({ activeStep, selectedFormatId, palette, reducedMotion }: StudioProps) {
  const { scene } = useGLTF(formats[0].modelPath)
  const { size } = useThree()
  const isMobile = size.width < 720

  return (
    <>
      <color attach="background" args={['#efeee9']} />
      <fog attach="fog" args={['#efeee9', 10, 22]} />
      <CameraRig activeStep={activeStep} selectedFormatId={selectedFormatId} reducedMotion={reducedMotion} />

      <ambientLight intensity={0.9} color="#fffdf8" />
      <directionalLight
        castShadow
        position={[-5.5, 8.5, 4.8]}
        intensity={3.1}
        color="#fff7e9"
        shadow-bias={-0.00025}
        shadow-normalBias={0.025}
        shadow-mapSize-width={isMobile ? 1024 : 2048}
        shadow-mapSize-height={isMobile ? 1024 : 2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-3}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <directionalLight
        castShadow
        position={[-0.9, 10, 1.5]}
        intensity={0.42}
        color="#fffaf1"
        shadow-bias={-0.00018}
        shadow-normalBias={0.02}
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={5}
        shadow-camera-bottom={-2}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
      />
      <rectAreaLight position={[-4.5, 6, 4]} width={5} height={6} intensity={3.8} color="#fff9ee" />
      <rectAreaLight position={[5, 3, 2]} width={3.5} height={5} intensity={1.35} color="#e4e7ea" />

      {formats.map((format, index) => (
        <DyaneInstance
          key={format.id}
          format={format}
          index={index}
          sourceScene={scene}
          activeStep={activeStep}
          selectedFormatId={selectedFormatId}
          palette={palette}
          reducedMotion={reducedMotion}
        />
      ))}

      <ShadowFloor />

      <Environment resolution={isMobile ? 128 : 256}>
        <group rotation={[-0.25, 0.15, 0.12]}>
          <Lightformer form="rect" intensity={2.2} color="#fffaf1" position={[-4, 5, 4]} scale={[4, 6, 1]} />
          <Lightformer form="rect" intensity={1.1} color="#dfe3e6" position={[5, 2, 3]} scale={[3, 5, 1]} />
          <Lightformer form="rect" intensity={0.7} color="#ffffff" position={[0, 5, -5]} scale={[6, 2, 1]} />
        </group>
      </Environment>
    </>
  )
}

export type DyaneCanvasProps = SceneStateProps

export default function DyaneCanvas(props: DyaneCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [0, 1.2, 11.8], fov: 28, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.03
      }}
      aria-label="Trois sculptures Dyane en porcelaine, alignées sur un même sol dans un studio clair"
      role="img"
    >
      <Suspense fallback={null}>
        <Studio {...props} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(formats[0].modelPath)
