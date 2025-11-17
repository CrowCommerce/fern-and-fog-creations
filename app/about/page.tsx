import { Metadata } from 'next';
import { getPageMetadata, getAboutPage, getAboutProcessSteps, getAboutValues } from '@/lib/shopify';
import AboutPageContent from './AboutPageContent';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('about');

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

export default async function AboutPage() {
  // Fetch all about page data in parallel
  const [content, processSteps, values] = await Promise.all([
    getAboutPage(),
    getAboutProcessSteps(),
    getAboutValues(),
  ]);

  return <AboutPageContent content={content} processSteps={processSteps} values={values} />;
}
