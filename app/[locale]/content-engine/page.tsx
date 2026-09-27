import type { Metadata } from 'next'
import styles from './ContentEngine.module.css'

export const metadata: Metadata = {
    title: 'DYANE CONTENT ENGINE',
    description: 'Public information, Terms of Service and Privacy Policy for DYANE CONTENT ENGINE.',
    robots: {
        index: false,
        follow: false,
    },
}

const terms = [
    'DYANE CONTENT ENGINE is a content management and publishing service operated by DYANE PARIS.',
    'The service enables authorized users to connect supported third-party social media accounts, review selected content and publishing settings, and initiate authorized content distribution through official platform integrations.',
    'Users may connect only accounts that they own or are authorized to manage.',
    'Users remain responsible for the content they choose to upload or publish and for complying with applicable laws, intellectual property rights and the terms and policies of the relevant third-party platforms.',
    "Actions involving third-party platforms are performed using the permissions granted by the user through those platforms' official authorization systems.",
    "DYANE CONTENT ENGINE does not request or store users' social-media passwords.",
    'Availability of integrations may depend on third-party platforms and their APIs. Features may therefore be modified, temporarily unavailable or discontinued where required for security, maintenance, legal compliance or platform compliance.',
    'Users may revoke third-party platform access through the relevant platform where supported.',
    'For questions regarding DYANE CONTENT ENGINE, users may contact DYANE PARIS through the contact information available on dyaneparis.com.',
]

const privacyIntro = [
    'DYANE CONTENT ENGINE is operated by DYANE PARIS.',
    'When an authorized user connects a supported social-media account, DYANE CONTENT ENGINE may process limited information provided through the relevant platform\'s official APIs.',
]

const privacyInformation = [
    'basic account identity information;',
    'account identifiers supplied by the platform;',
    'authorization permissions;',
    'access credentials required to maintain the authorized connection;',
    'selected content and publishing metadata;',
    'publishing or upload status information.',
]

const privacyPurposes = [
    'identify the connected account;',
    'display relevant account and publishing information;',
    'perform actions explicitly initiated or authorized by the user;',
    'upload or publish approved content;',
    'verify processing or publishing status;',
    'maintain the security and operation of the integration.',
]

export default function ContentEnginePage() {
    return (
        <main className={styles.page}>
            <article className={styles.content}>
                <header className={styles.introduction}>
                    <p className={styles.eyebrow}>DYANE PARIS</p>
                    <h1>DYANE CONTENT ENGINE</h1>
                    <p className={styles.lead}>
                        Content management and publishing infrastructure operated by DYANE PARIS.
                    </p>
                    <p>
                        DYANE CONTENT ENGINE enables authorized users to securely connect supported social media accounts, review selected content and publishing settings, and send approved content through official platform integrations.
                    </p>
                    <p>
                        The service uses platform-provided authorization systems and APIs. It does not require users to provide their social-media passwords directly to DYANE CONTENT ENGINE.
                    </p>
                    <nav className={styles.sectionLinks} aria-label="Page sections">
                        <a href="#terms">Terms of Service</a>
                        <a href="#privacy">Privacy Policy</a>
                    </nav>
                </header>

                <section id="terms" className={styles.section}>
                    <p className={styles.sectionLabel}>Legal</p>
                    <h2>Terms of Service</h2>
                    <p className={styles.updated}>Last updated: September 2026</p>
                    <div className={styles.copy}>
                        {terms.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </section>

                <section id="privacy" className={styles.section}>
                    <p className={styles.sectionLabel}>Legal</p>
                    <h2>Privacy Policy</h2>
                    <p className={styles.updated}>Last updated: September 2026</p>
                    <div className={styles.copy}>
                        {privacyIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        <p>Depending on the integration and permissions granted, this may include:</p>
                        <ul>{privacyInformation.map((item) => <li key={item}>{item}</li>)}</ul>
                        <p>This information is used only as necessary to:</p>
                        <ul>{privacyPurposes.map((item) => <li key={item}>{item}</li>)}</ul>
                        <p>For TikTok integrations, DYANE CONTENT ENGINE may use permissions including basic profile access and content publishing/upload permissions where authorized by the user.</p>
                        <p>OAuth access and refresh credentials are stored securely and are not exposed through the user interface.</p>
                        <p>DYANE CONTENT ENGINE does not request or store a user&apos;s TikTok password or other supported platform passwords.</p>
                        <p>Personal information obtained through platform integrations is not sold to advertisers.</p>
                        <p>Data is retained only for as long as reasonably necessary to provide the authorized service, maintain security, comply with applicable obligations or until access is revoked or a valid deletion request is processed, where applicable.</p>
                        <p>Users may revoke access through the relevant third-party platform where that functionality is available.</p>
                        <p>Requests concerning personal data, access or deletion may be submitted to DYANE PARIS using the contact information available on dyaneparis.com.</p>
                        <p>Use of third-party platform data remains subject to the permissions granted by the user and the applicable policies of those platforms.</p>
                    </div>
                </section>

                <footer className={styles.localFooter}>
                    <div>
                        <p>DYANE PARIS</p>
                        <p>Paris, France</p>
                    </div>
                    <nav aria-label="Content Engine footer">
                        <a href="/">Official website</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#privacy">Privacy Policy</a>
                    </nav>
                </footer>
            </article>
        </main>
    )
}
