import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import useNotifications from 'src/hooks/use-notifications';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';
export default function NotificationNewEditForm({ notification, recipientId }) {
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
      router.push(paths.dashboard.notification.root(recipientId));
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    }
  }, [createAndEditStatus.error]);

  useEffect(() => {
    if (createAndEdit) {
      reset();
      enqueueSnackbar(notification ? 'Editado com sucesso!' : 'Criado com  sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      router.push(paths.dashboard.notification.root(recipientId));
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
          };
          await onCreateAndEdit(payload, notification.id);
        } else {
          const payload = {
            recipientId: recipientId,
            ...data,
          };
          await onCreateAndEdit(payload);
        }
      } catch (error) {
        router.push(paths.dashboard.notification.root(recipientId));
        enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
          autoHideDuration: 8000,
          variant: 'error',
        });
      }
    },
    [notification, enqueueSnackbar, reset, router],
  );

  const renderDetails = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Título" />

            <RHFTextField name="content" label="Mensagem" multiline rows={3} />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
          sx={{ ml: 2 }}
        >
          {!notification ? 'Enviar' : 'Editar'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Grid container spacing={3}>
          {renderDetails}

          {renderActions}
        </Grid>
      </Stack>
    </FormProvider>
  );
}
