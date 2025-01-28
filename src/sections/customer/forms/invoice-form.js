import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addHours } from 'date-fns';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';

const formatDate = (date) => {
  if (date) {
    const newDate = addHours(new Date(date), 3);
    return dayjs(newDate).toDate();
  }
  return null;
};
function gerarInvoiceNumber(id) {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const dia = String(agora.getDate()).padStart(2, '0');
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  const segundos = String(agora.getSeconds()).padStart(2, '0');

  const protocolo = `${ano}${mes}${dia}${horas}${minutos}${segundos}${id}`;

  return protocolo;
}

export const STATUSOPTIONS = [
  { label: 'Pago', value: 'paid' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Atrasado', value: 'overdue' },
  { label: 'Rascunho', value: 'draft' },
];

export default function InvoiceForm({
  invoice,
  customerId,
  setLoading,
  loading,
  onCancel,
  onSalve,
}) {
  const NewInvoiceSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required('Numero obrigatório'),
    dueDate: Yup.date().required('Data de vencimento obrigatório').typeError(''),
    description: Yup.string().required('Descrição obrigatório'),
    status: Yup.string().required('Status obrigatório'),
    totalAmount: Yup.string().required('Valor obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      id: invoice?.id || null,
      invoiceNumber: invoice?.invoiceNumber || gerarInvoiceNumber(customerId),
      dueDate: invoice?.dueDate || null,
      description: invoice?.description || '',
      status: invoice?.status || 'draft',
      totalAmount: invoice?.totalAmount || '',
    }),
    [invoice],
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const { reset, control, handleSubmit } = methods;

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        onSalve(data);
      } catch (error) {
        enqueueSnackbar(`${error.message}`, {
          autoHideDuration: 8000,
          variant: 'error',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [reset, invoice],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [invoice]);

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }} pb={3}>
            Dados da fatura
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
            <RHFTextField name="invoiceNumber" label="Número da fatura" disabled />
            <RHFTextField name="totalAmount" label="Valor" />
            <Controller
              name="dueDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Data de vencimento"
                  format="dd/MM/yyyy"
                  value={formatDate(field?.value) || null}
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
            <RHFSelect name="status" label="Status" variant="standard">
              {STATUSOPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>
          <Box pt={2}>
            <RHFTextField name="description" label="Descrição" multiline rows={6} />
          </Box>

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
            <Button variant="outlined" color="warning" onClick={onCancel}>
              Cancelar
            </Button>
          </Stack>
        </Card>
      </FormProvider>
    </Box>
  );
}
