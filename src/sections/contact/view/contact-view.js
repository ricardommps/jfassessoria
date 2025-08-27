'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// _mock
import ContactForm from '../contact-form';
import ContactHero from '../contact-hero';
import ContactLogo from '../contact-logo';
//

// ----------------------------------------------------------------------

export default function ContactView() {
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
          <ContactLogo />
          <ContactForm />
        </Box>
      </Container>
    </>
  );
}
