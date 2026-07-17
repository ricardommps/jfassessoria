'use client';

import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

export default function RunningFinishedAllItem({ notification, onMarkAsRead }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async () => {
    try {
      setLoading(true);
      await onMarkAsRead(notification.id);
      enqueueSnackbar('Notificação marcada como lida!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      enqueueSnackbar('Não foi possível marcar a notificação como lida.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        p: 1.5,
        alignItems: 'flex-start',
        borderBottom: `dashed 1px ${theme.palette.divider}`,
      }}
    >
      <Stack
        spacing={1}
        sx={{
          width: '100%',
          pl: 1,
          p: 1.5,
          mt: 1.5,
          borderRadius: 1.5,
          bgcolor: 'background.neutral',
        }}
      >
        <ListItemText
          disableTypography
          primary={
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {notification.title}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {notification.content}
            </Typography>
          }
        />

        <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
          {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
        </Box>

        <LoadingButton
          size="small"
          variant="outlined"
          color="warning"
          onClick={handleMarkAsRead}
          loading={loading}
          sx={{ alignSelf: 'flex-start', mt: 0.5 }}
        >
          Marcar como lida
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
