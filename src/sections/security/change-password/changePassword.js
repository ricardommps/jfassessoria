import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useUser from 'src/hooks/use-user';
import { useRouter } from 'src/routes/hook';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function ChangePassword() {
  const router = useRouter();

  const { logout } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const password = useBoolean();
  const { onChangePassword, changePasswordSuccess, changePasswordStatus } = useUser();

  const ChangePassWordSchema = Yup.object().shape({
    lastPassword: Yup.string().required('Senha antiga obrigatória'),
    newPassword: Yup.string()
      .required('Nova senha obrigatória')
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .test(
        'no-match',
        'A nova senha deve ser diferente da senha antiga',
        (value, { parent }) => value !== parent.lastPassword,
      ),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'As senhas devem ser iguais'),
  });

  const defaultValues = {
    lastPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = useCallback(
    async (data) => {
      try {
        onChangePassword(data);
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

  useEffect(() => {
    if (changePasswordSuccess) {
      enqueueSnackbar('Senha atualizada com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleLogout();
    }
  }, [changePasswordSuccess]);

  useEffect(() => {
    if (changePasswordStatus.error?.message) {
      enqueueSnackbar(changePasswordStatus.error.message, {
        autoHideDuration: 3000,
        variant: 'error',
      });
    }
  }, [changePasswordStatus.error]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="lastPassword"
          type={password.value ? 'text' : 'password'}
          label="Senha antiga"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="newPassword"
          label="Nova senha"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum
              6+
            </Stack>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Confirme a nova senha"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={changePasswordStatus.loading}
          sx={{ ml: 'auto' }}
        >
          Salvar
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
