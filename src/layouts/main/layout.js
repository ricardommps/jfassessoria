'use client';

// @mui
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
// routes
import { usePathname } from 'src/routes/hook';

export default function MainLayout({ children }) {
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
