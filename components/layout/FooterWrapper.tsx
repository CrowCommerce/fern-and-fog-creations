import { getFooterNavigation } from '@/lib/builder/navigation';
import Footer from './Footer';

/**
 * Render the Footer component with fetched footer navigation data.
 *
 * @returns A React element for the footer populated with the retrieved navigation items
 */
export default async function FooterWrapper() {
  const footerNavigation = await getFooterNavigation();

  return <Footer footerNavigation={footerNavigation} />;
}