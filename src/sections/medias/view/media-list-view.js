'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import useMedia from 'src/hooks/use-media';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import MediaList from '../media-list';

export default function MediaListView() {
  const router = useRouter();
  const { onGetListMedias, medias, mediasStatus } = useMedia();

  const initialize = useCallback(async () => {
    try {
      onGetListMedias();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
          Midias
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.medias.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nova
        </Button>
      </Stack>
      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      ></Stack>
      <Stack>
        <MediaList medias={medias} loading={mediasStatus.loading} />
      </Stack>
    </Container>
  );
}
