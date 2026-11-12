'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { cartProducts } from '@/components/cart/catalog'
import { localizedPath } from '@/i18n/paths'
import { budgetLabels, emptyProject, projectBudgets, projectFinishes, projectMixology, projectSummary, type ConciergeProject } from '@/lib/personalization/project'
import s from './BespokeGift.module.css'

export default function BespokeGift({ locale }: { locale: 'fr' | 'en' }) {
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const [project, setProject] = useState<ConciergeProject>(emptyProject)
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [website, setWebsite] = useState('')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null)
  const selected = cartProducts.find(product => product.sku === project.sculpture) ?? cartProducts[0]
  const photo = selected.sku === 'dyane-sculpture-150cl' ? '/images/officielles/collections/dyane-no1-pornstar-martini-portrait-officiel.png' : selected.image
  const steps = en ? ['Your work', 'Colours', 'Personal details', 'Mixology', 'Budget', 'Your project'] : ['Votre œuvre', 'Les couleurs', 'Les détails', 'La mixologie', 'Votre budget', 'Votre projet']
  const titles = en ? ['CHOOSE YOUR WORK', 'IMAGINE THE COLOURS', 'MAKE IT PERSONAL', 'A COMPOSITION IN YOUR IMAGE', 'YOUR PROJECT, YOUR VISION', 'ENTRUST US WITH YOUR DREAM']
    : ['CHOISIR SON ŒUVRE', 'IMAGINER LES COULEURS', 'PERSONNALISER LES DÉTAILS', 'UNE COMPOSITION À VOTRE IMAGE', 'VOTRE PROJET, VOTRE VISION', 'CONFIEZ-NOUS VOTRE RÊVE']
  function update<K extends keyof ConciergeProject>(key: K, value: ConciergeProject[K]) { setProject(previous => ({ ...previous, [key]: value })); setError('') }
  function move(next: number) {
    setStep(next); setError('')
    requestAnimationFrame(() => { titleRef.current?.focus(); titleRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' }) })
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    if (step < 5) {
      if (step === 4 && !project.budget) { setError(t('Choisissez une enveloppe budgétaire.', 'Choose an indicative budget.')); return }
      move(step + 1); return
    }
    setBusy(true); setError('')
    const fingerprint = JSON.stringify({ project, locale })
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() }
    try {
      const response = await fetch('/api/concierge-project', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, locale, website, submissionId: attempt.current.id }) })
      const result = await response.json()
      if (!response.ok || result.ok !== true || typeof result.id !== 'string' || !result.id) throw new Error('delivery')
      setSent(true)
      requestAnimationFrame(() => titleRef.current?.focus())
    } catch {
      setError(t('Votre projet n’a pas pu être transmis. Vos choix sont conservés : réessayez ou écrivez à conciergerie@dyaneparis.com.', 'Your project could not be sent. Your choices are saved here: try again or write to conciergerie@dyaneparis.com.'))
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally { setBusy(false) }
  }
  const textField = (key: keyof ConciergeProject, label: string, maximum: number, options?: { multiline?: boolean; type?: string; required?: boolean; autoComplete?: string }) => {
    const common = { id: `project-${key}`, name: key, value: String(project[key]), maxLength: maximum, required: options?.required,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, event.target.value), autoComplete: options?.autoComplete }
    return <div className={s.field}><label htmlFor={common.id}>{label}</label>{options?.multiline ? <textarea {...common} rows={3} /> : <input {...common} type={options?.type || 'text'} />}</div>
  }

  return <main className={s.page}>
    <header className={s.intro}>
      <p className={s.eyebrow}>{t('LA MAISON DYANE PARIS', 'THE HOUSE OF DYANE PARIS')}</p>
      <h1>{t('VOTRE CADEAU DE NOËL RÊVÉ', 'YOUR DREAM CHRISTMAS GIFT')}</h1>
      <p className={s.lead}>{t('Il existe des cadeaux que l’on offre. Et des œuvres que l’on imagine pour quelqu’un.', 'There are gifts we give. And works we imagine for someone.')}</p>
      <p>{t('Cette année, Dyane Paris vous invite à imaginer une création qui n’appartient qu’à vous. Une sculpture singulière, une composition de mixologie exclusive, des couleurs choisies, des détails personnels.', 'This year, Dyane Paris invites you to imagine a creation that belongs only to you. A singular sculpture, an exclusive mixology composition, chosen colours and personal details.')}</p>
      <p>{t('Une œuvre pensée pour une personne, une histoire, un instant.', 'A work conceived for a person, a story, a moment.')}</p>
    </header>
    <div className={s.journey}>
      <aside className={s.visual} aria-label={t('Votre œuvre de départ', 'Your starting work')}>
        <div className={s.photo}><Image src={photo} alt={`${selected.name}, ${selected.format}`} fill sizes="(max-width: 760px) 100vw, 49vw" /></div>
        <p>{selected.name} · {selected.format}</p>
        <span>{t('Photographie de l’œuvre de départ. Vos souhaits seront étudiés avec la Maison.', 'Photograph of the starting work. Your wishes will be explored with the House.')}</span>
      </aside>
      <section className={s.panel} aria-labelledby="project-step-title">
        {sent ? <div className={s.success}>
          <p className={s.eyebrow}>{t('VOTRE PROJET A ÉTÉ TRANSMIS', 'YOUR PROJECT HAS BEEN SENT')}</p>
          <h2 id="project-step-title" ref={titleRef} tabIndex={-1}>{t('MERCI POUR VOTRE CONFIANCE', 'THANK YOU FOR YOUR TRUST')}</h2>
          <p>{t('Notre Conciergerie étudiera votre demande et reviendra vers vous pour imaginer, ensemble, votre œuvre.', 'Our Concierge will review your request and get back to you so that, together, we can imagine your work.')}</p>
          <Link href={localizedPath(locale, '/personnalisables')} className={s.outline}>{t('DÉCOUVRIR LES PERSONNALISABLES', 'DISCOVER PERSONALISABLE WORKS')}</Link>
        </div> : <>
          <nav className={s.steps} aria-label={t('Étapes du projet', 'Project steps')}>{steps.map((label, index) => <button key={label} type="button" disabled={index > step || busy} aria-current={index === step ? 'step' : undefined} onClick={() => move(index)}><span>{String(index + 1).padStart(2, '0')}</span><span>{label}</span></button>)}</nav>
          <p className={s.eyebrow}>{t('ÉTAPE', 'STEP')} {step + 1} / 6</p>
          <h2 id="project-step-title" ref={titleRef} tabIndex={-1}>{titles[step]}</h2>
          <form onSubmit={submit} aria-busy={busy}>
            <fieldset disabled={busy} className={s.fields}>
              <legend className={s.srOnly}>{titles[step]}</legend>
              {step === 0 && <div className={s.options}>{cartProducts.filter(product => product.personalization.enabled).map(product => <label className={s.workOption} key={product.sku} data-selected={project.sculpture === product.sku}><input type="radio" name="sculpture" value={product.sku} checked={project.sculpture === product.sku} onChange={() => update('sculpture', product.sku)} /><strong>{product.name}</strong><span>{product.format}</span></label>)}</div>}
              {step === 1 && <>
                {textField('bodyColour', t('Couleur principale souhaitée', 'Desired main colour'), 120)}
                {textField('drapeColour', t('Couleur du drapé souhaitée', 'Desired drape colour'), 120)}
                <fieldset className={s.optionField}><legend>{t('Finition à étudier', 'Finish to explore')}</legend><div className={s.options}>{projectFinishes.map((finish, index) => <label className={s.choice} key={finish} data-selected={project.finish === finish}><input type="radio" name="finish" checked={project.finish === finish} onChange={() => update('finish', finish)} />{(en ? ['To discuss', 'Matte', 'Glossy'] : ['À étudier', 'Mate', 'Brillante'])[index]}</label>)}</div></fieldset>
                {textField('paintedDetails', t('Détails peints à la main, motifs ou couleurs particuliers', 'Hand-painted details, particular patterns or colours'), 1000, { multiline: true })}
                <p className={s.note}>{t('Ces choix expriment vos souhaits. Les couleurs et finitions seront confirmées après une étude de faisabilité.', 'These choices express your wishes. Colours and finishes will be confirmed following a feasibility review.')}</p>
              </>}
              {step === 2 && <>
                {textField('inscription', t('Initiales, prénom ou inscription', 'Initials, name or inscription'), 160)}
                {textField('meaningfulDate', t('Une date importante', 'A meaningful date'), 120)}
                {textField('personalMessage', t('Un message personnel', 'A personal message'), 1000, { multiline: true })}
                {textField('artisticMotif', t('Un motif ou une décoration artistique', 'An artistic motif or decoration'), 1000, { multiline: true })}
                <label className={s.checkbox}><input type="checkbox" checked={project.exclusive} onChange={event => update('exclusive', event.target.checked)} /><span>{t('Je souhaite imaginer une création exclusive.', 'I would like to imagine an exclusive work.')}</span></label>
              </>}
              {step === 3 && <>
                <div className={s.stacked}>{projectMixology.map((mixology, index) => <label className={s.choice} key={mixology} data-selected={project.mixology === mixology}><input type="radio" name="mixology" checked={project.mixology === mixology} onChange={() => update('mixology', mixology)} />{(en ? ['An existing Dyane composition', 'A composition created especially for you', 'No or low alcohol, subject to feasibility', 'A particular request for the House'] : ['Une composition Dyane existante', 'Une composition de mixologie créée spécialement', 'Une création sans alcool ou faiblement alcoolisée, sous réserve de faisabilité', 'Une demande particulière à communiquer à la Maison'])[index]}</label>)}</div>
                {textField('flavours', t('Saveurs, inspirations et préférences', 'Flavours, inspirations and preferences'), 1500, { multiline: true })}
              </>}
              {step === 4 && <>
                <div className={s.stacked}>{projectBudgets.map((budget, index) => <label className={s.choice} key={budget} data-selected={project.budget === budget}><input type="radio" name="budget" checked={project.budget === budget} onChange={() => update('budget', budget)} required />{budgetLabels[locale][index]}</label>)}</div>
                <p className={s.note}>{t('Ces enveloppes sont indicatives et ne constituent ni un prix fixe ni un devis. Chaque œuvre sur commande fait l’objet d’une étude et d’une proposition personnalisée.', 'These budgets are indicative and constitute neither a fixed price nor a quote. Every commissioned work is the subject of a study and a personalised proposal.')}</p>
              </>}
              {step === 5 && <>
                <details className={s.summary}><summary>{t('LE RÉCAPITULATIF DE VOTRE PROJET', 'YOUR PROJECT SUMMARY')}</summary><dl>{projectSummary(project, locale).filter(([, value]) => value).slice(0, 13).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details>
                <div className={s.twoColumns}>{textField('firstName', t('Prénom*', 'First name*'), 80, { required: true, autoComplete: 'given-name' })}{textField('lastName', t('Nom*', 'Last name*'), 100, { required: true, autoComplete: 'family-name' })}</div>
                {textField('email', 'E-mail*', 180, { required: true, type: 'email', autoComplete: 'email' })}
                {textField('phone', t('Téléphone (facultatif)', 'Phone (optional)'), 60, { type: 'tel', autoComplete: 'tel' })}
                {textField('desiredDate', t('Date souhaitée de réception, à confirmer', 'Desired reception date, to be confirmed'), 10, { type: 'date' })}
                {textField('message', t('Message complémentaire', 'Additional message'), 2000, { multiline: true })}
                <div className={s.honeypot} aria-hidden="true"><label htmlFor="project-website">Website</label><input id="project-website" name="website" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></div>
                <label className={s.checkbox}><input type="checkbox" required checked={project.consent} onChange={event => update('consent', event.target.checked)} /><span>{t('J’accepte que mes coordonnées et mes choix soient utilisés pour répondre à cette demande.', 'I agree to my details and choices being used to respond to this request.')} <Link href={localizedPath(locale, '/confidentialite')}>{t('Politique de confidentialité', 'Privacy policy')}</Link></span></label>
              </>}
            </fieldset>
            {error && <p className={s.error} role="alert" ref={errorRef} tabIndex={-1}>{error}</p>}
            <div className={s.actions}>{step > 0 && <button type="button" className={s.back} disabled={busy} onClick={() => move(step - 1)}>{t('RETOUR', 'BACK')}</button>}<button type="submit" className={s.outline} disabled={busy}>{busy ? t('TRANSMISSION EN COURS', 'SENDING YOUR PROJECT') : step === 5 ? t('CONFIER MON PROJET À DYANE', 'ENTRUST MY PROJECT TO DYANE') : t('CONTINUER', 'CONTINUE')}</button></div>
            {step === 5 && <p className={s.note}>{t('Notre Conciergerie étudiera votre demande et reviendra vers vous pour imaginer, ensemble, votre œuvre. Aucun paiement n’est demandé à cette étape.', 'Our Concierge will review your request and get back to you so that, together, we can imagine your work. No payment is requested at this stage.')}</p>}
          </form>
          <Link href={localizedPath(locale, '/oeuvre-sur-commande')} className={s.permanent}>{t('LE SERVICE ŒUVRE SUR COMMANDE, TOUTE L’ANNÉE', 'COMMISSION A WORK, ALL YEAR ROUND')}</Link>
        </>}
      </section>
    </div>
  </main>
}
