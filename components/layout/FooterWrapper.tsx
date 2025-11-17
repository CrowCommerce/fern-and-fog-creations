import { getMenu } from '@/lib/shopify';
import Footer from './Footer';

export default async function FooterWrapper() {
  const menu = await getMenu('fern-fog-footer-menu');

  return <Footer menu={menu} />;
}
