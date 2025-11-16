import { getNavigation } from '@/lib/builder/navigation';
import Header from './Header';

/**
 * Render the Header component using the application's navigation data.
 *
 * @returns The JSX element for `Header` with its `navigation` prop populated.
 */
export default async function HeaderWrapper() {
  const navigation = await getNavigation();

  return <Header navigation={navigation} />;
}