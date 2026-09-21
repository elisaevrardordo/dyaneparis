'use client'

import { useEffect, useRef, useState } from 'react'
import type { JournalRatio } from '@/content/journal'
import styles from './Journal.module.css'

type EditorialVideoProps = {
    src: string
    mobileSrc?: string
    poster: string
    label: string
    ratio: Exclude<JournalRatio, 'square'>
    autoplay?: boolean
    locale: string
}

export default function EditorialVideo({
    src,
    mobileSrc,
    poster,
    label,
    ratio,
    autoplay = false,
    locale,
}: EditorialVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(true)
    const [reducedMotion, setReducedMotion] = useState(true)

    const copy = locale === 'en'
        ? { play: 'Play video', pause: 'Pause video', mute: 'Mute video', unmute: 'Unmute video', fullscreen: 'View fullscreen' }
        : { play: 'Lire la vidéo', pause: 'Mettre la vidéo en pause', mute: 'Couper le son', unmute: 'Activer le son', fullscreen: 'Afficher en plein écran' }

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)')
        const syncPreference = () => setReducedMotion(query.matches)
        syncPreference()
        query.addEventListener('change', syncPreference)
        return () => query.removeEventListener('change', syncPreference)
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                video.pause()
                return
            }
            if (autoplay && !reducedMotion) {
                video.muted = true
                setMuted(true)
                void video.play().catch(() => undefined)
            }
        }, { rootMargin: '160px 0px', threshold: 0.12 })

        observer.observe(video)
        return () => observer.disconnect()
    }, [autoplay, reducedMotion])

    const togglePlayback = async () => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) await video.play().catch(() => undefined)
        else video.pause()
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return
        video.muted = !video.muted
        setMuted(video.muted)
    }

    const enterFullscreen = async () => {
        const video = videoRef.current
        if (!video) return
        await video.requestFullscreen?.().catch(() => undefined)
    }

    return (
        <div className={`${styles.videoFrame} ${styles[`ratio${ratio}`]}`}>
            <video
                ref={videoRef}
                className={styles.video}
                muted
                loop
                playsInline
                preload="metadata"
                poster={poster}
                aria-label={label}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
            >
                {mobileSrc ? <source media="(max-width: 640px)" src={mobileSrc} /> : null}
                <source src={src} />
            </video>
            <fieldset className={styles.videoControls}>
                <legend className={styles.srOnly}>{locale === 'en' ? 'Video controls' : 'Commandes vidéo'}</legend>
                <button type="button" onClick={togglePlayback} aria-label={playing ? copy.pause : copy.play}>
                    {playing ? 'Ⅱ' : '▶'}
                </button>
                <button type="button" onClick={toggleMute} aria-label={muted ? copy.unmute : copy.mute}>
                    {muted ? 'MUTE' : 'SOUND'}
                </button>
                <button type="button" onClick={enterFullscreen} aria-label={copy.fullscreen}>↗</button>
            </fieldset>
        </div>
    )
}
