import { getFooterNavigation } from '@/lib/builder/navigation';
import Footer from './Footer';

export default async function FooterWrapper() {
  const footerNavigation = await getFooterNavigation();

  return <Footer footerNavigation={footerNavigation} />;
}
