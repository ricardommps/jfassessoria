import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';
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
export default function CustomerForm({ customer, loading, setLoading }) {
  const { onUpdateCustomer, onCreateCustomer } = useCustomer();
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
      maritalStatus: customer?.maritalStatus || 'Solteiro',
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

  useEffect(() => {
    reset(defaultValues);
  }, [customer]);
  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }} pb={3}>
            Dados do aluno
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
            <RHFTextField name="name" label="Nome" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="phone" label="Telefone" />
            <Controller
              name="birthDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Data de nascimento."
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
            <Stack>
              <Typography variant="subtitle2">Sexo</Typography>
              <RHFRadioGroup row spacing={4} name="gender" options={GENDER_OPTIONS} />
            </Stack>
            <Stack>
              <Typography variant="subtitle2">Estado civil:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <RHFRadioGroup row spacing={4} name="maritalStatus" options={MARITAL_OPTIONS} />
              </Stack>
            </Stack>
          </Box>
        </Card>
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }} pb={3}>
            Endereço completo
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
            <RHFTextField name="zipCode" label="CEP" autoComplete="off" />
            <RHFTextField name="street" label="Rua" autoComplete="off" />
            <RHFTextField
              name="streetNumber"
              label="Número"
              autoComplete="off"
              disabled={!values.street}
            />
            <RHFTextField
              name="complement"
              label="Complemento"
              autoComplete="off"
              disabled={!values.street}
            />
          </Box>
          <Box
            pt={3}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
          >
            <RHFTextField name="district" label="Bairro" autoComplete="off" />
            <RHFTextField name="city" label="Cidade" autoComplete="off" />
            <RHFSelect name="state" label="UF" variant="standard">
              {ESTADOSBRASILEIROS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
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
