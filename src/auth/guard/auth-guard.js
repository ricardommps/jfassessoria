import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hook';
// routes
import { paths } from 'src/routes/paths';

//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const router = useRouter();

  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({ returnTo: window.location.href }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
