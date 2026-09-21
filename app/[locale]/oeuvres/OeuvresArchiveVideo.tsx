'use client'

import { useEffect, useRef } from 'react'

export default function OeuvresArchiveVideo({
    alt,
    className,
    mobileSrc,
    poster,
    src,
}: {
    alt: string
    className: string
    mobileSrc?: string
    poster: string
    src: string
}) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            video.pause()
            return
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                void video.play().catch(() => undefined)
            } else {
                video.pause()
            }
        }, { rootMargin: '120px 0px', threshold: 0.08 })

        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    return (
        <video
            ref={videoRef}
            className={className}
            aria-label={alt}
            loop
            muted
            playsInline
            poster={poster}
            preload="metadata"
        >
            {mobileSrc ? <source media="(max-width: 700px)" src={mobileSrc} /> : null}
            <source src={src} />
        </video>
    )
}
