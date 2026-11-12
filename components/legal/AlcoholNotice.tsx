import Image from 'next/image'
import s from './AlcoholNotice.module.css'

// Content and typography: arrêté du 17 octobre 2016, annexes 4 and 6.
// The Republic mark is framed from the original JO image, never redrawn.
export default function AlcoholNotice() {
  return <aside className={s.notice} data-alcohol-notice aria-label="Interdiction de vente de boissons alcooliques aux mineurs">
    <span className={s.republic} aria-hidden="true"><Image unoptimized src="/images/legal/interdiction-vente-mineurs-original.png" alt="" width="1920" height="264" /></span>
    <div className={s.copy}><p className={s.title}>Interdiction de vente de boissons alcooliques aux mineurs de moins de 18 ans</p><p className={s.detail}>La preuve de majorité de l’acheteur est exigée au moment de la vente en ligne.</p><p className={s.reference}>CODE DE LA SANTÉ PUBLIQUE, ART. L. 3342-1 et L. 3353-3</p></div>
  </aside>
}
