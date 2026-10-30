import Link from 'next/link'
import styles from './CampaignCaption.module.css'

type CampaignCaptionProps = {
  cta?: string
  description?: string
  href?: string
  lines: readonly string[]
  position?: 'overlay' | 'flow'
  singleLine?: boolean
  spacing?: 'default' | 'generous'
  titleElement?: 'h1' | 'h2' | 'p'
  titleId?: string
  tone?: 'black' | 'white'
  cinematic?: boolean
}

export default function CampaignCaption({
  cta,
  description,
  href,
  lines,
  position = 'overlay',
  singleLine = false,
  spacing = 'default',
  titleElement = 'p',
  titleId,
  tone = 'white',
  cinematic = false,
}: CampaignCaptionProps) {
  const TitleElement = titleElement

  return (
    <div
      className={`${styles.caption} ${styles[position]} ${styles[tone]}${cinematic ? ` ${styles.cinematic}` : ''}${singleLine ? ` ${styles.singleLine}` : ''}${spacing === 'generous' ? ` ${styles.generous}` : ''}`}
    >
      <TitleElement className={styles.title} id={titleId}>
        {lines.map((line) => <span key={line}>{line}</span>)}
      </TitleElement>
      {description ? <p className={styles.description}>{description}</p> : null}
      {cta && href ? <Link className={styles.link} href={href}>{cta}</Link> : null}
    </div>
  )
}
