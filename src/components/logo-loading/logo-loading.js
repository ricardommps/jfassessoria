import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// @mui
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const LogoLoading = forwardRef(({ disabledLink = false, sx }) => {
  const logo = (
    <Box
      component="img"
      src="/assets/illustrations/logo_loading.png"
      sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

LogoLoading.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default LogoLoading;
