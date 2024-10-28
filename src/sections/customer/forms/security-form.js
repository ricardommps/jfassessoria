import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
// components
// hooks
import * as Yup from 'yup';
export default function SecurityForm({ customer, loading, setLoading }) {
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  const { onChangePassword } = useCustomer();
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

  const { reset, handleSubmit } = methods;

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        await onChangePassword(data, customer.id);
        reset();
        setLoading(false);
      } catch (error) {
        enqueueSnackbar(error, {
          autoHideDuration: 3000,
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, reset],
  );

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }} pb={3}>
            Gerar nova senha
          </Typography>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
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
            />

            <RHFTextField
              name="confirmNewPassword"
              type={password.value ? 'text' : 'password'}
              label="Confirmar nova senha"
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
          </Box>
        </Card>
        <Stack
          alignItems="flex-end"
          sx={{ mt: 3 }}
          spacing={2}
          flexDirection={'row'}
          justifyContent={'flex-end'}
        >
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Salvar
          </LoadingButton>
          <Button variant="outlined" color="warning">
            Cancelar
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );
}
