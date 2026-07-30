'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { defaultMaterialCalibration, palettes } from '@/components/configurator/data'
import type { HomeImage } from '@/content/home'
import styles from './Home.module.css'

const DyaneCanvas = dynamic(() => import('@/components/configurator/DyaneCanvas'), {
  ssr: false,
})

export default function HomeConfiguratorPreview({ fallback }: { fallback: HomeImage }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [deviceCanRender3D, setDeviceCanRender3D] = useState(false)

  useEffect(() => {
    const device = navigator as Navigator & {
      connection?: { saveData?: boolean }
      deviceMemory?: number
    }
    const constrainedDevice =
      device.connection?.saveData === true ||
      (device.deviceMemory !== undefined && device.deviceMemory <= 4) ||
      (device.hardwareConcurrency !== undefined && device.hardwareConcurrency <= 4)
    setDeviceCanRender3D(!constrainedDevice)

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)

    const node = containerRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    if (node) observer.observe(node)

    return () => {
      media.removeEventListener('change', syncMotion)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.customizationVisual}>
      <Image
        className={styles.mediaImage}
        src={fallback.src}
        alt={fallback.alt}
        fill
        sizes="(max-width: 980px) 100vw, 70vw"
        style={{ objectPosition: fallback.objectPosition }}
      />
      {nearViewport && deviceCanRender3D ? (
        <div className={styles.customizationCanvas}>
          <DyaneCanvas
            activeStep="format"
            selectedFormatId={null}
            palette={palettes[0]}
            reducedMotion={reducedMotion}
            introActive={false}
            calibration={defaultMaterialCalibration}
          />
        </div>
      ) : null}
    </div>
  )
}
