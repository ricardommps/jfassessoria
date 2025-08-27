import Box from '@mui/material/Box';

export default function PrivacyLogo() {
  return (
    <Box
      component="img"
      alt="auth"
      src={'/assets/illustrations/logo.png'}
      sx={{ maxWidth: 320, width: 320 }}
    />
  );
}
