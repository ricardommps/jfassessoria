'use client';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ChangePassword from '../change-password/changePassword';
export default function Security() {
  return (
    <Container maxWidth="md" sx={{ height: 1 }}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Segurança
      </Typography>
      <ChangePassword />
    </Container>
  );
}
