import { unstable_noStore as noStore } from 'next/cache';
import { getNavigation } from '@/lib/builder/navigation';
import Header from './Header';

export default async function HeaderWrapper() {
  noStore(); // Opt out of static generation to avoid Builder.io prerender errors
  const navigation = await getNavigation();

  return <Header navigation={navigation} />;
}
