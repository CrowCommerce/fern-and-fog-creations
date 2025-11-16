import { getNavigation } from '@/lib/builder/navigation';
import Header from './Header';

export default async function HeaderWrapper() {
  const navigation = await getNavigation();

  return <Header navigation={navigation} />;
}
