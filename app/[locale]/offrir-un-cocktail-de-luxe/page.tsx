import GiftingPage, { giftingMetadata } from '@/components/discovery/GiftingPage'
export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => giftingMetadata('offrir-un-cocktail-de-luxe', params)
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <GiftingPage slug="offrir-un-cocktail-de-luxe" params={params} />
}
