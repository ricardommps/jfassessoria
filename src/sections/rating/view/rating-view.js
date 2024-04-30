'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useRouter } from 'src/routes/hook';

import RatingsList from '../ratings-list';
export default function RatingView() {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);
  const [loading, setLoading] = useState(false);
  return (
    <Container maxWidth={'lg'} sx={{ height: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 2 }}>
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeftIcon />}
          onClick={handleGoBack}
        >
          Voltar
        </Button>
      </Box>
      <Stack direction={'row'}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Avaliações
        </Typography>
      </Stack>
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {loading ? (
          <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
            <Box
              sx={{
                mt: 5,
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
        ) : (
          <RatingsList setLoading={setLoading} />
        )}
      </Stack>
    </Container>
  );
}
