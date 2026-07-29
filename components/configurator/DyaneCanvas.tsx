'use client'

import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  type ConfiguratorStep,
  defaultMaterialCalibration,
  type FormatId,
  type FormatOption,
  formatById,
  formats,
  glazePresets,
  type MaterialCalibration,
  type Palette,
  porcelainPresets,
  studioPreset,
} from './data'

const modelHeight = 2.144
const porcelainColor = new THREE.Color(porcelainPresets.body.color)
const secondaryPorcelainColor = new THREE.Color('#eadfd2')
const signatureColor = new THREE.Color('#302824')

const curtainVertexShader = `
  uniform float uTime;
  uniform float uSide;
  uniform float uOpening;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float verticalWave = sin((uv.y * 8.0) + (uTime * 1.15) + (uSide * 1.7));
    float fineWave = sin((uv.y * 19.0) - (uTime * 0.72) + (uv.x * 3.2));
    transformed.z += verticalWave * 0.055 + fineWave * 0.018;
    transformed.x += sin((uv.y * 5.0) + uTime) * 0.018;
    float innerDistance = uSide < 0.0 ? 1.0 - uv.x : uv.x;
    float looseEdge = 1.0 - smoothstep(0.0, 0.34, innerDistance);
    transformed.x += uSide * looseEdge * uOpening * (0.72 * verticalWave + 0.24 * fineWave);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const curtainFragmentShader = `
  uniform float uOpacity;
  uniform float uSide;
  uniform float uOpening;
  varying vec2 vUv;

  void main() {
    float fold = 0.5 + 0.5 * sin((vUv.x * 17.0) + (vUv.y * 2.4) + uSide);
    float secondaryFold = 0.5 + 0.5 * sin((vUv.x * 31.0) - (vUv.y * 3.1));
    float innerDistance = uSide < 0.0 ? 1.0 - vUv.x : vUv.x;
    float waveringEdge = innerDistance + sin(vUv.y * 17.0 + uSide) * 0.018 * uOpening;
    float innerFade = mix(1.0, smoothstep(0.0, 0.18, waveringEdge), smoothstep(0.06, 0.36, uOpening));
    float verticalFade = smoothstep(0.0, 0.055, vUv.y) * smoothstep(1.0, 0.945, vUv.y);
    vec3 ivory = mix(vec3(0.79, 0.76, 0.71), vec3(0.99, 0.96, 0.90), fold * 0.76 + secondaryFold * 0.12);
    float fabricDensity = mix(0.7, 0.92, fold) * mix(0.9, 1.0, secondaryFold);
    gl_FragColor = vec4(ivory, uOpacity * fabricDensity * innerFade * verticalFade);
  }
`

interface SceneStateProps {
  activeStep: ConfiguratorStep
  selectedFormatId: FormatId | null
  palette: Palette
  reducedMotion: boolean
  introActive: boolean
  calibration: MaterialCalibration
}

interface InstanceTarget {
  position: [number, number, number]
  rotationY: number
  scale: number
  emphasis: number
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
    emphasis: 1,
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
        emphasis: 1,
      }
    }

    return {
      position: [reducedMotion ? initialX : side * (isMobile ? 2.4 : 4.2), 0, -1.5],
      rotationY: initial.rotationY,
      scale: format.modelScale,
      emphasis: 0.7,
    }
  }

  if (isSelected) {
    return {
      position: [reducedMotion ? initialX * 0.45 : 0, 0, reducedMotion ? 0.18 : 0.62],
      rotationY: 0,
      scale: format.modelScale * (reducedMotion ? 1.01 : 1.055),
      emphasis: 1,
    }
  }

  return {
    position: [reducedMotion ? initialX : side * (isMobile ? 1.25 : 2.58), 0, reducedMotion ? initialZ : -0.42],
    rotationY: initial.rotationY,
    scale: format.modelScale,
    emphasis: reducedMotion ? 0.82 : 0.72,
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
  introActive,
  calibration,
}: DyaneInstanceProps) {
  const group = useRef<THREE.Group>(null)
  const introStart = useRef<number | null>(null)
  const { size, pointer } = useThree()
  const isMobile = size.width < 720
  const veilTargetColor = useMemo(() => new THREE.Color(palette.material.color), [palette.material.color])
  const secondaryVeilColor = useMemo(() => {
    const color = new THREE.Color(palette.material.color)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    return color.setHSL(hsl.h, hsl.s * 0.7, hsl.l * 0.92)
  }, [palette.material.color])

  const porcelainMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        ...porcelainPresets.body,
        color: porcelainPresets.body.color,
        specularColor: porcelainPresets.body.specularColor,
        opacity: 1,
        transparent: false,
        depthWrite: true,
      }),
    [],
  )

  const capMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        ...porcelainPresets.cap,
        color: porcelainPresets.cap.color,
        specularColor: porcelainPresets.cap.specularColor,
        opacity: 1,
        transparent: false,
        depthWrite: true,
      }),
    [],
  )

  const veilMaterial = useMemo(
    () => {
      const preset = glazePresets['bordeaux-profond']
      return new THREE.MeshPhysicalMaterial({
        ...preset,
        color: preset.color,
        specularColor: preset.specularColor,
        opacity: 1,
        transparent: false,
        depthWrite: true,
        side: THREE.DoubleSide,
      })
    },
    [],
  )

  const signatureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: signatureColor,
        roughness: 0.46,
        metalness: 0,
        opacity: 1,
        transparent: false,
        depthWrite: true,
        side: THREE.DoubleSide,
      }),
    [],
  )

  const { model, centeredPosition } = useMemo(() => {
    const clone = sourceScene.clone(true)

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.castShadow = true
      object.receiveShadow = true

      const name = object.name.toLowerCase()
      if (name.includes('scarf')) object.material = veilMaterial
      else if (name.includes('body.001')) object.material = signatureMaterial
      else if (name.includes('cap')) object.material = capMaterial
      else object.material = porcelainMaterial
    })

    const bounds = new THREE.Box3().setFromObject(clone)
    const center = bounds.getCenter(new THREE.Vector3())

    return {
      model: clone,
      centeredPosition: new THREE.Vector3(-center.x, -bounds.min.y, -center.z),
    }
  }, [capMaterial, porcelainMaterial, signatureMaterial, sourceScene, veilMaterial])

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
      capMaterial.dispose()
      signatureMaterial.dispose()
      veilMaterial.dispose()
    }, [capMaterial, porcelainMaterial, signatureMaterial, veilMaterial],
  )

  useFrame((state, delta) => {
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
    if (introActive && introStart.current === null) introStart.current = state.clock.elapsedTime
    if (!introActive) introStart.current = null
    const introElapsed = introStart.current === null ? 3 : state.clock.elapsedTime - introStart.current
    const introSettle = reducedMotion ? 1 : THREE.MathUtils.smoothstep(introElapsed, 1.35, 2.25)
    const introTurnProgress = THREE.MathUtils.clamp((introElapsed - 1.45) / 0.75, 0, 1)
    const introRotation =
      introActive && index === 1 && !reducedMotion
        ? Math.sin(introTurnProgress * Math.PI) * THREE.MathUtils.degToRad(6)
        : 0
    const targetX = target.position[0] * (1 + (1 - introSettle) * 0.12)
    const targetZ = target.position[2] - (1 - introSettle) * 0.18

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, lambda, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, target.position[1], lambda, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, lambda, delta)
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      target.rotationY + interactiveRotation + introRotation,
      lambda,
      delta,
    )

    const nextScale = THREE.MathUtils.damp(group.current.scale.x, target.scale, lambda, delta)
    group.current.scale.setScalar(nextScale)

    const porcelainTarget = target.emphasis < 0.9 ? secondaryPorcelainColor : porcelainColor
    porcelainMaterial.color.lerp(porcelainTarget, 1 - Math.exp(-lambda * delta))
    capMaterial.color.lerp(porcelainTarget, 1 - Math.exp(-lambda * delta))
    const veilColor = target.emphasis < 0.9 ? secondaryVeilColor : veilTargetColor
    veilMaterial.color.lerp(veilColor, 1 - Math.exp(-(reducedMotion ? 12 : 4.8) * delta))

    porcelainMaterial.roughness = calibration.bodyRoughness
    porcelainMaterial.clearcoat = calibration.bodyClearcoat
    porcelainMaterial.clearcoatRoughness = calibration.bodyClearcoatRoughness
    capMaterial.roughness = Math.min(calibration.bodyRoughness + 0.015, 0.6)
    capMaterial.clearcoat = Math.max(calibration.bodyClearcoat - 0.02, 0)
    capMaterial.clearcoatRoughness = Math.min(calibration.bodyClearcoatRoughness + 0.015, 0.5)
    porcelainMaterial.envMapIntensity = THREE.MathUtils.damp(
      porcelainMaterial.envMapIntensity,
      calibration.bodyEnvMapIntensity * target.emphasis,
      lambda,
      delta,
    )
    capMaterial.envMapIntensity = THREE.MathUtils.damp(
      capMaterial.envMapIntensity,
      porcelainPresets.cap.envMapIntensity * target.emphasis,
      lambda,
      delta,
    )
    const veilRoughnessOffset = calibration.veilRoughness - defaultMaterialCalibration.veilRoughness
    const veilClearcoatOffset = calibration.veilClearcoat - defaultMaterialCalibration.veilClearcoat
    veilMaterial.roughness = THREE.MathUtils.damp(
      veilMaterial.roughness,
      THREE.MathUtils.clamp(palette.material.roughness + veilRoughnessOffset, 0.04, 0.6),
      reducedMotion ? 12 : 4.8,
      delta,
    )
    veilMaterial.clearcoat = THREE.MathUtils.damp(
      veilMaterial.clearcoat,
      THREE.MathUtils.clamp(palette.material.clearcoat + veilClearcoatOffset, 0, 0.85),
      reducedMotion ? 12 : 4.8,
      delta,
    )
    veilMaterial.clearcoatRoughness = THREE.MathUtils.damp(
      veilMaterial.clearcoatRoughness,
      palette.material.clearcoatRoughness,
      reducedMotion ? 12 : 4.8,
      delta,
    )
    veilMaterial.envMapIntensity = THREE.MathUtils.damp(
      veilMaterial.envMapIntensity,
      palette.material.envMapIntensity * target.emphasis,
      lambda,
      delta,
    )
    veilMaterial.specularIntensity = palette.material.specularIntensity
    veilMaterial.specularColor.set(palette.material.specularColor)
  })

  return (
    <group ref={group}>
      <primitive object={model} position={centeredPosition} dispose={null} />
    </group>
  )
}

function CameraRig({
  activeStep,
  selectedFormatId,
  reducedMotion,
}: Pick<SceneStateProps, 'activeStep' | 'selectedFormatId' | 'reducedMotion'>) {
  const { camera, size } = useThree()
  const currentTarget = useRef(new THREE.Vector3(0, 1.48, 0))
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const overviewPosition = useMemo(() => new THREE.Vector3(), [])
  const overviewTarget = useMemo(() => new THREE.Vector3(), [])

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

function RendererCalibration({ calibration }: { calibration: MaterialCalibration }) {
  const { gl } = useThree()

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = calibration.exposure
  }, [calibration.exposure, gl])

  return null
}

function RevealCurtains({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const startTime = useRef<number | null>(null)
  const leftMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: curtainVertexShader,
        fragmentShader: curtainFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.92 },
          uSide: { value: -1 },
          uOpening: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  )
  const rightMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: curtainVertexShader,
        fragmentShader: curtainFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.92 },
          uSide: { value: 1 },
          uOpening: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  )

  useEffect(
    () => () => {
      leftMaterial.dispose()
      rightMaterial.dispose()
    },
    [leftMaterial, rightMaterial],
  )

  useFrame((state) => {
    if (!left.current || !right.current) return
    if (active && startTime.current === null) startTime.current = state.clock.elapsedTime
    if (!active) startTime.current = null

    const elapsed = startTime.current === null ? 3 : state.clock.elapsedTime - startTime.current
    const opening = reducedMotion ? 0 : THREE.MathUtils.smoothstep(elapsed, 0.3, 1.8)
    const opacity = active
      ? reducedMotion
        ? 0.86 * (1 - THREE.MathUtils.smoothstep(elapsed, 0, 0.46))
        : 0.92 * (1 - THREE.MathUtils.smoothstep(elapsed, 0.72, 1.92))
      : 0

    left.current.position.set(-2.84 - opening * 5.8, 1.42, 4.55 - opening * 1.65)
    right.current.position.set(2.84 + opening * 5.8, 1.42, 4.55 - opening * 1.65)
    left.current.rotation.y = -opening * 0.13
    right.current.rotation.y = opening * 0.13
    left.current.visible = opacity > 0.006
    right.current.visible = opacity > 0.006
    leftMaterial.uniforms.uTime.value = elapsed
    rightMaterial.uniforms.uTime.value = elapsed
    leftMaterial.uniforms.uOpacity.value = opacity
    rightMaterial.uniforms.uOpacity.value = opacity
    leftMaterial.uniforms.uOpening.value = opening
    rightMaterial.uniforms.uOpening.value = opening
  })

  return (
    <group renderOrder={10}>
      <mesh ref={left} material={leftMaterial} renderOrder={10}>
        <planeGeometry args={[6.4, 8.2, 30, 22]} />
      </mesh>
      <mesh ref={right} material={rightMaterial} renderOrder={10}>
        <planeGeometry args={[6.4, 8.2, 30, 22]} />
      </mesh>
    </group>
  )
}

function StudioFloor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={studioPreset.floor} roughness={0.96} metalness={0} />
    </mesh>
  )
}

type StudioProps = SceneStateProps

function Studio({
  activeStep,
  selectedFormatId,
  palette,
  reducedMotion,
  introActive,
  calibration,
}: StudioProps) {
  const { scene } = useGLTF(formats[0].modelPath)
  const { size } = useThree()
  const isMobile = size.width < 720

  return (
    <>
      <color attach="background" args={[studioPreset.background]} />
      <fog attach="fog" args={[studioPreset.fog, 14, 26]} />
      <RendererCalibration calibration={calibration} />
      <CameraRig activeStep={activeStep} selectedFormatId={selectedFormatId} reducedMotion={reducedMotion} />

      <ambientLight intensity={studioPreset.ambientIntensity} color="#fff7eb" />
      <directionalLight
        castShadow
        position={[-5.8, 8.2, 4.6]}
        intensity={calibration.keyLightIntensity}
        color="#fff3df"
        shadow-bias={-0.00018}
        shadow-normalBias={0.018}
        shadow-mapSize-width={isMobile ? 1024 : 2048}
        shadow-mapSize-height={isMobile ? 1024 : 2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={22}
      />
      <spotLight
        castShadow
        position={[-0.8, 7.5, 2.6]}
        intensity={studioPreset.contactLightIntensity}
        color="#fff9ef"
        angle={0.62}
        penumbra={1}
        distance={14}
        decay={2}
        shadow-bias={-0.00012}
        shadow-normalBias={0.012}
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
      />
      <rectAreaLight
        position={[-4.5, 5.2, 4.2]}
        rotation={[0, -0.72, 0]}
        width={4.8}
        height={6.5}
        intensity={calibration.keyLightIntensity * 0.78}
        color="#fff4e3"
      />
      <rectAreaLight
        position={[4.6, 3.2, 3]}
        rotation={[0, 0.78, 0]}
        width={3.6}
        height={5.4}
        intensity={calibration.fillLightIntensity}
        color="#dce5eb"
      />
      <rectAreaLight
        position={[0, 2.8, 5.4]}
        width={6.8}
        height={4.2}
        intensity={0.42}
        color="#fff6e9"
      />
      <rectAreaLight
        position={[0, 6.5, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={5.5}
        height={2.2}
        intensity={studioPreset.topLightIntensity}
        color="#fff8ed"
      />
      <rectAreaLight
        position={[0.4, 3.5, -4.2]}
        rotation={[0, Math.PI, 0]}
        width={4.5}
        height={5.5}
        intensity={studioPreset.rimLightIntensity}
        color="#edf2f4"
      />

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
          introActive={introActive}
          calibration={calibration}
        />
      ))}

      <StudioFloor />

      <Environment resolution={isMobile ? 128 : 256}>
        <group rotation={[-0.2, 0.12, 0.08]}>
          <Lightformer form="rect" intensity={3.4} color="#fff3df" position={[-4.5, 4.5, 4]} scale={[3.2, 6.5, 1]} />
          <Lightformer form="rect" intensity={1.25} color="#dbe4e9" position={[4.8, 2.8, 3]} scale={[2.6, 5, 1]} />
          <Lightformer form="rect" intensity={0.82} color="#fff8ed" position={[0, 6, 0]} scale={[6, 1.3, 1]} />
          <Lightformer form="rect" intensity={0.55} color="#e8edef" position={[1, 3, -5]} scale={[4.2, 5, 1]} />
        </group>
      </Environment>

      <RevealCurtains active={introActive} reducedMotion={reducedMotion} />
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
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = props.calibration.exposure
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
