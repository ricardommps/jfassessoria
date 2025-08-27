'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import PrivacyLogo from '../privacy-logo';
import PrivacyPage from '../privacy-page';

//

// ----------------------------------------------------------------------

export default function PrivacyView() {
  return (
    <>
      <Container sx={{ py: 10 }}>
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <PrivacyLogo />
          <PrivacyPage />
        </Box>
      </Container>
    </>
  );
}
