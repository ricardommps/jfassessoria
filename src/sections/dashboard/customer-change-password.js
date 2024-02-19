'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function CustomerChangePassword() {
  const settings = useSettingsContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const {
    customer,
    onCustomerById,
    customerStatus,
    changePasswordSuccess,
    changePasswordStatus,
    onChangePassword,
  } = useCustomer();
  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Nova senha é obrigatória')
      .test('no-match', (value, { parent }) => value !== parent.oldPassword),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'As senhas devem ser iguais'),
  });

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data) => {
      try {
        onChangePassword(data, id);
        reset();
      } catch (error) {
        enqueueSnackbar(error, {
          autoHideDuration: 3000,
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, reset],
  );

  const handleCancel = () => {
    router.replace(paths.dashboard.customersRacing);
  };
  useEffect(() => {
    if (id) {
      onCustomerById(id);
    } else {
      router.replace(paths.dashboard.customersRacing);
    }
  }, [id]);

  useEffect(() => {
    if (customerStatus.error) {
      router.replace(paths.dashboard.customersRacing);
    }
  }, [customerStatus]);

  useEffect(() => {
    if (changePasswordSuccess) {
      enqueueSnackbar('Senha atualizada com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      router.replace(paths.dashboard.customersRacing);
    }
  }, [changePasswordSuccess]);

  useEffect(() => {
    if (changePasswordStatus.error?.message) {
      enqueueSnackbar('Não foi possivel atualizar a senha, tente novamente', {
        autoHideDuration: 3000,
        variant: 'error',
      });
      router.replace(paths.dashboard.customersRacing);
    }
  }, [changePasswordStatus.error]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Gerar Senha"
        links={[{ name: 'Alunos', href: paths.dashboard.customersRacing }, { name: 'Gerar Senha' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {customer && (
        <>
          <Stack>
            <Typography variant="h4">{customer.name}</Typography>
            <Typography variant="h6">{customer.email}</Typography>
          </Stack>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack component={Card} spacing={3} sx={{ p: 3 }}>
              <RHFTextField
                name="newPassword"
                label="Nova senha"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="confirmNewPassword"
                type={password.value ? 'text' : 'password'}
                label="Confirmar nova senha"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction={'row'} justifyContent={'flex-end'} spacing={3}>
                <Button onClick={handleCancel}>Cancelar</Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Salvar
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </>
      )}
    </Container>
  );
}
