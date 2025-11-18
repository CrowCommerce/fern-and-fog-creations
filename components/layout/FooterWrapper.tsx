import { getMenu } from '@/lib/shopify';
import Footer from './Footer';

export default async function FooterWrapper() {
  // Fetch all three footer menus in parallel
  const [shopMenu, aboutMenu, policiesMenu] = await Promise.all([
    getMenu('fern-fog-footer-shop-menu'),
    getMenu('fern-fog-footer-about-menu'),
    getMenu('fern-fog-footer-policies-menu'),
  ]);

  return (
    <Footer
      shopMenu={shopMenu}
      aboutMenu={aboutMenu}
      policiesMenu={policiesMenu}
    />
  );
}
