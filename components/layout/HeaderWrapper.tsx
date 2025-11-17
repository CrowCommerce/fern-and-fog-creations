import { getMenu } from '@/lib/shopify';
import Header from './Header';

export default async function HeaderWrapper() {
  const menu = await getMenu('fern-fog-header-menu');

  return <Header navigation={menu} />;
}
