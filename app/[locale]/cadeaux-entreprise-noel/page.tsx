import GiftingPage, { giftingMetadata } from '@/components/discovery/GiftingPage'
export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => giftingMetadata('cadeaux-entreprise-noel', params)
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <GiftingPage slug="cadeaux-entreprise-noel" params={params} />
}
