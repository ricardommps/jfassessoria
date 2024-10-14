'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import useMedia from 'src/hooks/use-media';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import MediaNewEditForm from '../media-new-edit-form';
export default function MediaEditView() {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { media, onMediaById, mediaStatus, mediaCreate, mediaCreateStatus } = useMedia();
  const { id } = params;

  useEffect(() => {
    if (id) {
      onMediaById(id);
    }
  }, [id]);

  useEffect(() => {
    if (mediaCreate) {
      enqueueSnackbar('Mídia editada com sucesso!', {
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
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Mídias',
            href: paths.dashboard.medias.root,
          },
          { name: media?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {mediaStatus.loading && (
        <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative', height: '50vh' }}>
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
      )}
      {media && !mediaStatus.loading && <MediaNewEditForm currentMedia={media} />}
    </Container>
  );
}
