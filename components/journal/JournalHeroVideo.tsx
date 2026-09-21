'use client'

import { useEffect, useRef } from 'react'
import styles from './Journal.module.css'

const VIDEO_URL = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788707627/RECETTES_WCA_ok0sez.mp4'
const POSTER_URL = 'https://res.cloudinary.com/dazhkrimv/video/upload/f_jpg,q_auto,so_0/v1788707627/RECETTES_WCA_ok0sez.jpg'

export default function JournalHeroVideo({ locale }: { locale: string }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const isEnglish = locale === 'en'

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const playVideo = () => {
            video.muted = true
            void video.play().catch(() => undefined)
        }

        playVideo()
        video.addEventListener('canplay', playVideo)
        window.addEventListener('focus', playVideo)

        return () => {
            video.removeEventListener('canplay', playVideo)
            window.removeEventListener('focus', playVideo)
        }
    }, [])

    return (
        <header
            className={styles.indexMasthead}
            data-page-hero
            data-header-foreground="white"
        >
            <video
                ref={videoRef}
                className={styles.indexHeroVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={POSTER_URL}
                aria-hidden="true"
                tabIndex={-1}
            >
                <source src={VIDEO_URL} type="video/mp4" />
            </video>
            <div className={styles.indexHeroShade} aria-hidden="true" />
            <div className={styles.indexHeroCopy}>
                <p className={styles.eyebrow}>Dyane Paris</p>
                <h1>{isEnglish ? 'THE JOURNAL' : 'LE JOURNAL'}</h1>
                <p className={styles.mastheadIntro}>{isEnglish
                    ? 'Artistic collaborations, private experiences and stories from the Maison.'
                    : 'Collaborations artistiques, expériences privées et histoires de la Maison.'}</p>
            </div>
        </header>
    )
}
