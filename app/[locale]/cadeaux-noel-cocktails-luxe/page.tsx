import GiftingPage, { giftingMetadata } from '@/components/discovery/GiftingPage'
export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => giftingMetadata('cadeaux-noel-cocktails-luxe', params)
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <GiftingPage slug="cadeaux-noel-cocktails-luxe" params={params} />
}
