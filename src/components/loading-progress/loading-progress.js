import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
export default function LoadingProgress() {
  return (
    <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
      <Box
        sx={{
          mt: 1,
          width: 1,
          height: 320,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="error" />
      </Box>
    </Stack>
  );
}
