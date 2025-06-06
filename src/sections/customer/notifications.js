import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import LoadingProgress from 'src/components/loading-progress';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';
import useNotifications from 'src/hooks/use-notifications';
import { fDate } from 'src/utils/format-time';

import NotificationForm from './forms/notification-form';

export default function Notifications({ id, loading, setLoading }) {
  const { onGetNotifications, notifications, notificationsStatus, onDeleteNoticifation } =
    useNotifications();
  const popover = usePopover();
  const onDelete = useBoolean();
  const newNotification = useBoolean();
  useEffect(() => {
    if (id) {
      onGetNotifications(id);
    }
  }, [id]);

  const handleSuccess = () => {
    newNotification.onFalse();
    onGetNotifications(id);
  };
  return (
    <>
      <Stack direction={'row'} sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Notificações
        </Typography>
        <Button
          onClick={newNotification.onTrue}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nova
        </Button>
      </Stack>
      {notificationsStatus.loading ? (
        <LoadingProgress />
      ) : (
        <>
          {!newNotification.value && (
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              {notifications.length > 0 && (
                <>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      popover={popover}
                      onDelete={onDelete}
                      loading={loading}
                      setLoading={setLoading}
                      onDeleteNoticifation={onDeleteNoticifation}
                      handleSuccess={handleSuccess}
                    />
                  ))}
                </>
              )}
            </Box>
          )}
          {newNotification.value && (
            <Box>
              <NotificationForm
                id={id}
                onCancel={newNotification.onFalse}
                onSuccess={handleSuccess}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}

function NotificationItem({
  notification,
  popover,
  onDelete,
  loading,
  setLoading,
  onDeleteNoticifation,
  handleSuccess,
}) {
  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      onDelete.onFalse();
      await onDeleteNoticifation(notification.id);
      enqueueSnackbar('Notificação deletada com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleSuccess();
    } catch (error) {
      enqueueSnackbar(`${error.message}`, {
        autoHideDuration: 8000,
        variant: 'error',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [notification.id]);

  return (
    <>
      <Stack component={Card} direction="row" key={notification.id}>
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
            width: '100%',
          }}
        >
          <Stack direction="row" pb={2}>
            <Box flexGrow={1}>
              <Label variant="soft" color={(notification.readAt && 'success') || 'warning'}>
                {notification.readAt ? 'Lido' : 'Não lido'}
              </Label>
            </Box>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(notification.createdAt, 'dd/MM/yyyy p')}
            </Box>
          </Stack>
          <Stack spacing={1} flexGrow={1}>
            <TextMaxLine variant="subtitle2" line={2}>
              {notification.title}
            </TextMaxLine>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }} line={5}>
              {notification.content}
            </TextMaxLine>
          </Stack>
          <Stack direction="row" alignItems="center" pt={2}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-left"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete.onTrue();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Deletar
        </MenuItem>
      </CustomPopover>
      {onDelete.value && (
        <ConfirmDialog
          open={onDelete.value}
          onClose={onDelete.onFalse}
          title={'Deseja DELETAR a notificação?'}
          action={
            <LoadingButton
              variant="contained"
              color="success"
              onClick={handleDelete}
              loading={loading}
            >
              Confirmar
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
