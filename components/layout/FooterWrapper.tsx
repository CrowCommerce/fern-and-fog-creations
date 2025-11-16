import { unstable_noStore as noStore } from 'next/cache';
import { getFooterNavigation } from '@/lib/builder/navigation';
import Footer from './Footer';

export default async function FooterWrapper() {
  noStore(); // Opt out of static generation to avoid Builder.io prerender errors
  const footerNavigation = await getFooterNavigation();

  return <Footer footerNavigation={footerNavigation} />;
}
