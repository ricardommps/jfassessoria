import { yupResolver } from '@hookform/resolvers/yup';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useCustomer from 'src/hooks/use-customer';
import * as Yup from 'yup';

export const GENDER_OPTIONS = [
  { label: 'Masculino', value: 'Men' },
  { label: 'Feminino', value: 'Women' },
  { label: 'Outro', value: 'OTHER' },
];

export const MARITAL_OPTIONS = [
  { label: 'Solteiro(a)', value: 'Solteiro' },
  { label: 'Casado(a)', value: 'Casado' },
  { label: 'Divorciado(a)', value: 'Divorciado' },
  { label: 'Viúvo(a)', value: 'Viúvo' },
];

const ESTADOSBRASILEIROS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

export default function CustomerForm({ handleCloseNewCustomer, isMobile = false }) {
  const {
    customer,
    customerStatus,
    onUpdateCustomer,
    onCreateCustomer,
    onClearCustome,
    customerCreate,
    onListCustomersReview,
    updateCustomerSuccess,
    customerError,
  } = useCustomer();

  const [loading, setLoading] = useState(false);
  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
    email: Yup.string().required('Email obrigatório'),
    phone: Yup.string().required('Telefone obrigatório'),
    gender: Yup.string().required('Sexo obrigatório'),
    birthDate: Yup.date().required('Data de Nascimento obrigatório').typeError(''),
  });
  const defaultValues = useMemo(
    () => ({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      isRunner: customer?.isRunner || false,
      isStrength: customer?.isStrength || false,
      gender: customer?.gender || 'Women',
      birthDate: customer?.birthDate || null,
      active: customer?.active || false,
      maritalStatus: customer?.phone || 'Solteiro',
      zipCode: customer?.zipCode || '',
      street: customer?.street || '',
      streetNumber: customer?.streetNumber || '',
      complement: customer?.complement || '',
      city: customer?.city || '',
      state: customer?.state || '',
      district: customer?.district || '',
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
    formState: { errors },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
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

  const handleChangeActive = useCallback(
    (event) => {
      setValue('active', event.target.checked);
    },
    [setValue],
  );

  const handleChangeEmail = useCallback(
    (event) => {
      setValue('email', event.target.value.toLowerCase());
    },
    [setValue],
  );

  const renderErros = (
    <>
      {errors && (
        <>
          {Object.keys(errors).map((key) => (
            <Alert severity="error" key={key}>
              {errors[key].message}
            </Alert>
          ))}
        </>
      )}
    </>
  );

  useEffect(() => {
    if (customerCreate) {
      setLoading(false);
      onListCustomersReview();
      enqueueSnackbar('Aluno criado com sucesso!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [customerCreate]);

  useEffect(() => {
    if (updateCustomerSuccess) {
      setLoading(false);
      onListCustomersReview();
      enqueueSnackbar('Aluno atualizado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [updateCustomerSuccess]);

  useEffect(() => {
    if (customerError) {
      setLoading(false);
      onListCustomersReview();
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
      handleCancel();
    }
  }, [customerError]);

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
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        {isMobile && (
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'}>
            <Button onClick={handleCancel} startIcon={<ArrowCircleLeftIcon />}>
              Voltar
            </Button>
          </Stack>
        )}
        <Stack>
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

        <Stack spacing={3}>
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
                  <RHFTextField
                    name="email"
                    label="Email *"
                    variant="standard"
                    type="email"
                    onChange={handleChangeEmail}
                    sx={{ mt: 2 }}
                  />
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
                            actionBar: {
                              actions: ['clear'],
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(values.active)}
                        color="primary"
                        onChange={handleChangeActive}
                      />
                    }
                    label="Aluno ativo"
                    labelPlacement="end"
                  />
                  <Stack pt={2} sx={{ width: '100%' }} spacing={2}>
                    {renderErros}
                  </Stack>
                  <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={loading} fullWidth>
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
