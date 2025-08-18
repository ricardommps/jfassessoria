// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
// auth
// components
import Logo from 'src/components/logo';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image }) {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');

  const renderLogoDesktop = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: 5,
        width: 80,
        height: 80,
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 6, md: 30 }, // menor no mobile para aproximar do logo
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94,
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/logo.png'}
        sx={{ maxWidth: 320, width: 320 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction={{ xs: 'column', md: 'row' }} // <- coluna no mobile
      sx={{ minHeight: '100vh' }}
    >
      {upMd && renderLogoDesktop}

      {upMd && renderSection}

      <Stack sx={{ flex: 1 }}>
        {!upMd && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <Logo sx={{ width: 96, height: 96 }} />
          </Box>
        )}

        {renderContent}
      </Stack>
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
