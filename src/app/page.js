/* import { redirect } from 'next/navigation';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default async function HomePage() {
  redirect(PATH_AFTER_LOGIN);
}
 */

// sections
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Joana Foltz - App Assessoria',
};

export default function HomePage() {
  return <HomeView />;
}
