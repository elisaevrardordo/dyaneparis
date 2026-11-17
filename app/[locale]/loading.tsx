import SiteLoader from '@/components/layout/SiteLoader'

export default function Loading() {
  // The fixed loader takes no layout space. Reserve the first viewport while
  // streamed page content arrives so the footer cannot flash above the page.
  return <div style={{ minHeight: '100svh' }} aria-busy="true"><SiteLoader /></div>
}
