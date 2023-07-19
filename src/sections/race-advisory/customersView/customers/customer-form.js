import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import CardTitle from 'src/sections/programsView/components/card-title';
import { hideScroll } from 'src/theme/css';
import * as Yup from 'yup';

export const GENDER_OPTIONS = [
  { label: 'Homem', value: 'Men' },
  { label: 'Mulher', value: 'Women' },
  { label: 'Criança', value: 'Kids' },
];

export default function CustomerNewEditForm({
  customer,
  onCreateCustomer,
  loading,
  onCancel,
  onUpdateCustomer,
}) {
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
          onUpdateCustomer(data, customer.id);
          reset({ ...defaultValues });
        } else {
          onCreateCustomer(data);
          reset({ ...defaultValues });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onCreateCustomer, reset, customer],
  );

  const onClose = useCallback(async () => {
    try {
      onCancel();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleChangeGender = useCallback(
    (newValue) => {
      setValue('gender', newValue);
    },
    [setValue],
  );

  useEffect(() => {
    if (customer) {
      reset({ ...customer });
    } else {
      reset({ ...defaultValues });
    }
  }, [customer]);
  return (
    <Grid xs={12} md={4}>
      <Card sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          <CardTitle title="Formulário" />
          <CardContent>
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
              {customer ? 'Editar Aluno' : 'Novo Aluno'}
            </Typography>
            <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
              {customer
                ? 'Atualize os dados do seu alunos com este formulário'
                : 'Cadastre seus alunos com este formulário'}
              .
            </Typography>
            {loading && (
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
            {!loading && (
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
                    <Button fullWidth variant="outlined" color="warning" onClick={onClose}>
                      Cancelar
                    </Button>
                  </Stack>
                </>
              </FormProvider>
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

CustomerNewEditForm.propTypes = {
  customer: PropTypes.object,
  onCreateCustomer: PropTypes.func,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onUpdateCustomer: PropTypes.func,
};
