'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import MetricsList from '../matrics-list';
export const NEW_OPTIONS = [
  {
    value: 1,
    label: 'Métricas de desempenho',
  },
  {
    value: 2,
    label: 'Métricas de competição',
  },
  {
    value: 3,
    label: 'Métricas de parametros fisiológicos',
  },
];
export default function MetricsView() {
  const params = useParams();
  const popover = usePopover();
  const router = useRouter();

  const { id } = params;
  const handleChangeType = useCallback(
    (value) => {
      router.push(paths.dashboard.metrics.create(value, id));
    },
    [router],
  );

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

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
          Métricas
        </Typography>
        <Button
          color="inherit"
          variant="contained"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          Criar
        </Button>
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="top-right"
          sx={{ width: 'auto' }}
        >
          {NEW_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === 0}
              onClick={() => {
                popover.onClose();
                handleChangeType(option.value);
              }}
            >
              {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" />}
              {option.value === 'draft' && <Iconify icon="solar:file-text-bold" />}
              {option.label}
            </MenuItem>
          ))}
        </CustomPopover>
      </Stack>
      <MetricsList id={id} />
    </Container>
  );
}
