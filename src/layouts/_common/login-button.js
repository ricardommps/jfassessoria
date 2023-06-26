import Button from '@mui/material/Button';
import PropTypes from 'prop-types'; // @mui
// auth
import { useAuthContext } from 'src/auth/hooks';
import { RouterLink } from 'src/routes/components';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

export default function LoginButton({ sx }) {
  const { method } = useAuthContext();

  const loginPath = loginPaths[method];

  return (
    <Button component={RouterLink} href={loginPath} variant="outlined" sx={{ mr: 1, ...sx }}>
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
