import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import useNotifications from 'src/hooks/use-notifications';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';
export default function NotificationNewEditForm({
  notification,
  recipientId,
  onCancel,
  onSuccess,
  type = 'alert',
}) {
  const { onCreateAndEdit, createAndEdit, createAndEditStatus } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const NewNotificationSchema = Yup.object().shape({
    title: Yup.string().required('Campo obrigatório'),
    content: Yup.string().required('Campo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      title: notification?.title || '',
      content: notification?.content || '',
      type: notification?.type || type,
    }),
    [notification],
  );

  const methods = useForm({
    resolver: yupResolver(NewNotificationSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (notification) {
      reset(defaultValues);
    }
  }, [notification, defaultValues, reset]);

  useEffect(() => {
    if (createAndEditStatus.error) {
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
      if (onCancel) {
        onCancel();
      } else {
        router.push(paths.dashboard.notification.root(recipientId));
      }
    }
  }, [createAndEditStatus.error]);

  useEffect(() => {
    if (createAndEdit) {
      reset();
      enqueueSnackbar(
        notification ? 'Notificação editada com sucesso!' : 'Notificação enviada com sucesso!',
        {
          autoHideDuration: 8000,
          variant: 'success',
        },
      );
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(paths.dashboard.notification.root(recipientId));
      }
    }
  }, [createAndEdit]);

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        if (notification) {
          const payload = {
            title: data.title,
            content: data.content,
            type: type,
          };
          await onCreateAndEdit(payload, notification.id);
        } else {
          const payload = {
            recipientId: recipientId,
            ...data,
            type: type,
          };
          await onCreateAndEdit(payload);
        }
      } catch (error) {
        enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
          autoHideDuration: 8000,
          variant: 'error',
        });
        if (onCancel) {
          onCancel();
        } else {
          router.push(paths.dashboard.notification.root(recipientId));
        }
      }
    },
    [notification, enqueueSnackbar, reset, router],
  );

  const renderActions = (
    <>
      <Stack
        alignItems="flex-end"
        sx={{ mt: 3 }}
        spacing={2}
        flexDirection={'row'}
        justifyContent={'flex-end'}
      >
        <LoadingButton type="submit" variant="contained" loading={loading} sx={{ ml: 2 }}>
          {!notification ? 'Enviar' : 'Editar'}
        </LoadingButton>
        {onCancel && (
          <Button variant="outlined" color="warning" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </Stack>
    </>
  );

  const renderDetails = (
    <>
      <>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Título" />

            <RHFTextField name="content" label="Mensagem" multiline rows={3} />
          </Stack>
        </Card>
        {renderActions}
      </>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>{renderDetails}</Stack>
    </FormProvider>
  );
}
