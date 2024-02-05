'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import useMedia from 'src/hooks/use-media';
import { useRouter } from 'src/routes/hook';

import MediaNewEditForm from '../media-new-edit-form';
export default function MediaCreateView() {
  const router = useRouter();
  const { mediaCreate, mediaCreateStatus } = useMedia();
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  useEffect(() => {
    if (mediaCreate) {
      enqueueSnackbar('Mídia criada com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      router.back();
    }
  }, [mediaCreate]);

  useEffect(() => {
    if (mediaCreateStatus.error) {
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
      router.back();
    }
  }, [mediaCreateStatus.error]);

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
