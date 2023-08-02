import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useCustomer from 'src/hooks/use-customer';
import * as Yup from 'yup';

export const GENDER_OPTIONS = [
  { label: 'Homem', value: 'Men' },
  { label: 'Mulher', value: 'Women' },
  { label: 'Criança', value: 'Kids' },
];

export default function CustomerForm({ handleCloseNewCustomer }) {
  const {
    customer,
    customerStatus,
    onUpdateCustomer,
    onCreateCustomer,
    onClearCustome,
    customerCreate,
    onListCustomers,
    updateCustomerSuccess,
  } = useCustomer();
  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
    email: Yup.string().required('Email obrigatório'),
    birthDate: Yup.date().required('Due date is required').typeError(''),
  });
  const defaultValues = useMemo(
    () => ({
      name: customer?.name || '',
      email: customer?.email || '',
      isRunner: customer?.isRunner || false,
      isStrength: customer?.isStrength || false,
      gender: customer?.gender || 'Women',
      birthDate: customer?.birthDate || null,
    }),
    [customer],
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        if (customer) {
          const payload = Object.assign({}, data);
          delete payload.id;
          delete payload.typeUser;
          delete payload.programs;
          onUpdateCustomer(payload, customer.id);
        } else {
          onCreateCustomer(data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onCreateCustomer, reset, customer],
  );

  const handleChangeGender = useCallback(
    (newValue) => {
      setValue('gender', newValue);
    },
    [setValue],
  );

  const handleCancel = () => {
    reset({ ...defaultValues });
    onClearCustome();
    handleCloseNewCustomer();
  };

  useEffect(() => {
    if (customerCreate) {
      onListCustomers();
      enqueueSnackbar('Aluno criado com sucesso!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [customerCreate]);

  useEffect(() => {
    if (updateCustomerSuccess) {
      onListCustomers();
      enqueueSnackbar('Update success!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [updateCustomerSuccess]);

  useEffect(() => {
    if (customer) {
      reset({ ...customer });
    } else {
      reset({ ...defaultValues });
    }
  }, [customer]);

  return (
    <Paper
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        <Stack p={2}>
          <Typography variant="h3">Formulário</Typography>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
            {customer ? 'Editar Aluno' : 'Novo Aluno'}
          </Typography>
          <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
            {customer
              ? 'Atualize os dados do seu alunos com este formulário'
              : 'Cadastre seus alunos com este formulário'}
            .
          </Typography>
        </Stack>

        <Stack spacing={2} sx={{ width: '25vw', py: 1, height: '60vh' }}>
          <Scrollbar>
            {customerStatus?.loading && (
              <Box
                sx={{
                  mt: 5,
                  width: 1,
                  height: 320,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress color="error" />
              </Box>
            )}
            {!customerStatus?.loading && (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <>
                  <RHFTextField name="name" label="Nome *" variant="standard" />
                  <RHFTextField name="email" label="Email *" variant="standard" />
                  <Stack mt={2}>
                    <RHFSwitch
                      name="isRunner"
                      labelPlacement="start"
                      label={
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Assessoria de corrida
                          </Typography>
                        </>
                      }
                      sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  </Stack>
                  <Stack mt={2}>
                    <RHFSwitch
                      name="isStrength"
                      labelPlacement="start"
                      label={
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Assessoria de força
                          </Typography>
                        </>
                      }
                      sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  </Stack>
                  <Stack mt={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Sexo
                    </Typography>
                    {GENDER_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={values.gender === option.value}
                            onClick={() => handleChangeGender(option.value)}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </Stack>
                  <Stack mt={3}>
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label="Data de Nasc."
                          value={dayjs(field?.value).toDate() || null}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                  <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      fullWidth
                    >
                      Salvar
                    </LoadingButton>
                    <Button fullWidth variant="outlined" color="warning" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </Stack>
                </>
              </FormProvider>
            )}
          </Scrollbar>
        </Stack>
      </Stack>
    </Paper>
  );
}
