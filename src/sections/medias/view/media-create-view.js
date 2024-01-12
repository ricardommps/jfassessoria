'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useCallback } from 'react';
import { useRouter } from 'src/routes/hook';

import MediaNewEditForm from '../media-new-edit-form';
export default function MediaCreateView() {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);
  return (
    <Container maxWidth={'lg'}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 5 }}>
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeftIcon />}
          onClick={handleGoBack}
        >
          Voltar
        </Button>
      </Box>
      <MediaNewEditForm />
    </Container>
  );
}
