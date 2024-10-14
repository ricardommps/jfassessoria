import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';
import useNotifications from 'src/hooks/use-notifications';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
export default function NotificationList({ notification, id }) {
  const router = useRouter();
  const popover = usePopover();
  const onDelete = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { onDeleteNoticifation, deleteNotification, deleteNotificationStatus, onGetNotifications } =
    useNotifications();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleEdit = () => {
    router.push(paths.dashboard.notification.create(id, notification.id));
  };
  const handleDelete = () => {
    setLoadingDelete(true);
    onDelete.onFalse();
    onDeleteNoticifation(notification.id);
  };

  useEffect(() => {
    if (deleteNotificationStatus.error) {
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
      setLoadingDelete(false);
      onGetNotifications(id);
    }
  }, [deleteNotificationStatus.error]);

  useEffect(() => {
    if (deleteNotification) {
      enqueueSnackbar('Deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      setLoadingDelete(false);
      onGetNotifications(id);
    }
  }, [deleteNotification]);
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

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
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
        {!notification.readAt && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              handleEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
        )}

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
          title={'Deseja DELETAR a notificaçãp?'}
          action={
            <LoadingButton
              variant="contained"
              color="success"
              onClick={handleDelete}
              loading={loadingDelete}
            >
              Confirmar
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
