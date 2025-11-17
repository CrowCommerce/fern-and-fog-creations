import { Metadata } from 'next'
import { getPageMetadata } from '@/lib/shopify'
import ContactForm from './ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('contact');

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: {
      index: metadata.robotsIndex,
      follow: metadata.robotsFollow,
    },
    openGraph: metadata.ogImageUrl
      ? {
          images: [{ url: metadata.ogImageUrl }],
        }
      : undefined,
  };
}

export default function ContactPage() {
  return <ContactForm />
}

