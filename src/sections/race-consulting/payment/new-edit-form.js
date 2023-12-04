import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useBoolean } from 'src/hooks/use-boolean';
import usePayment from 'src/hooks/use-payment';
import * as Yup from 'yup';
export default function NewEditForm({ payment, customerId, handleCancelPayment }) {
  const deletePayment = useBoolean();
  const {
    onCreatePayment,
    onUpdatePayment,
    onDeletePayment,
    updatePaymentSuccess,
    deletePaymentSuccess,
  } = usePayment();

  const [loading, setLoading] = useState(false);
  const [paymentMonth, setPaymentMonthe] = useState(null);
  const currentMouthe =
    payment &&
    format(new Date(payment.startDate), 'MMMM/yyyy', {
      locale: ptBR,
    });

  const NewPaymentSchema = Yup.object().shape({
    customerId: Yup.number().required('Aluno obrigatório'),
    startDate: Yup.string().required('Data de início obrigatório'),
    expiresDate: Yup.string().required('Data de expiração obrigatório'),
    dueDate: Yup.string().required('Data de vencimento obrigatório'),
    value: Yup.string().required('Valor obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      customerId: payment?.customerId || customerId,
      startDate: payment?.startDate || null,
      expiresDate: payment?.expiresDate || null,
      dueDate: payment?.dueDate || null,
      value: payment?.value || null,
      updatedAt: payment?.updatedAt || null,
      paymentDate: payment?.paymentDate || null,
    }),
    [],
  );
  const methods = useForm({
    resolver: yupResolver(NewPaymentSchema),
    defaultValues,
  });

  const { reset, watch, control, handleSubmit } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const payload = Object.assign({}, data);
        payload.value = Number(payload.value);
        payload.startDate = new Date(payload.startDate).toISOString();
        payload.expiresDate = new Date(payload.expiresDate).toISOString();
        payload.dueDate = new Date(payload.dueDate).toISOString();
        delete payload.updatedAt;
        if (payment) {
          delete payload.id;
          delete payload.userId;
          delete payload.createdAt;
          delete payload.updatedAt;
          onUpdatePayment(payload, payment.id);
        } else {
          onCreatePayment(payload);
        }
      } catch (error) {
        console.error(error);
      }
      reset({ ...defaultValues });
    },
    [onCreatePayment, reset],
  );

  const formatDate = (date) => {
    if (date) {
      const newDate = addHours(new Date(date), 3);
      return dayjs(newDate).toDate();
    }
    return null;
  };

  const handleCancelDelete = () => {
    setPaymentMonthe(null);
    deletePayment.onFalse();
  };

  useUpdateEffect(() => {
    if (payment) {
      reset({ ...payment });
    } else {
      reset({ ...defaultValues });
    }
  }, [payment]);

  useUpdateEffect(() => {
    if (updatePaymentSuccess || deletePaymentSuccess) {
      setLoading(false);
    }
  }, [updatePaymentSuccess, deletePaymentSuccess]);

  return (
    <>
      <Stack>
        <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
          {payment ? 'Editar Registro' : 'Novo Registro'}
        </Typography>
      </Stack>
      {payment && (
        <Stack>
          <Button fullWidth variant="outlined" color="error" onClick={deletePayment.onTrue}>
            Deletar registro
          </Button>
        </Stack>
      )}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <>
          <Box rowGap={3} columnGap={2} display="grid" pt={1}>
            <Stack mt={3} spacing={2}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data de Início"
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
              <Controller
                name="expiresDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data de Expiração"
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
              <Controller
                name="dueDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data de Vencimento"
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
              <RHFTextField
                size="small"
                name="value"
                label="Valor"
                type="number"
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>R$</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 196 } }}
              />

              <Controller
                name="paymentDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data do pagamento"
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
            </Stack>
            <RHFTextField name="comments" label="Observações" multiline rows={6} />
            {values.updatedAt && (
              <Stack>
                <Typography>{`Ultima atualização em: ${format(
                  addHours(new Date(values.updatedAt), 3),
                  'dd/MM/yyyy',
                )}`}</Typography>
              </Stack>
            )}
            <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
              <LoadingButton type="submit" variant="contained" loading={loading} fullWidth>
                Salvar
              </LoadingButton>
              <Button fullWidth variant="outlined" color="warning" onClick={handleCancelPayment}>
                Cancelar
              </Button>
            </Stack>
          </Box>
        </>
      </FormProvider>
      <ConfirmDialog
        open={deletePayment.value}
        onClose={handleCancelDelete}
        title={`DELERAR REGISTRO DO MÊS ${currentMouthe}`}
        content={
          <>
            <Typography>Este registro será excluído definitivamente.</Typography>
            <Alert variant="filled" severity="error" sx={{ margin: '15px 0' }}>
              Aviso: esta ação não é reversível. Por favor, tenha certeza.
            </Alert>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Typography>Selecione o mês e ano do registro para continuar:</Typography>
              <Stack pt={2}>
                <DatePicker
                  label={'Selecione o mês e ano'}
                  views={['month', 'year']}
                  slotProps={{
                    actionBar: {
                      actions: ['clear'],
                    },
                  }}
                  onChange={(newValue) =>
                    setPaymentMonthe(
                      format(new Date(newValue), 'MMMM/yyyy', {
                        locale: ptBR,
                      }),
                    )
                  }
                />
              </Stack>
            </FormControl>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeletePayment(payment.id);
              setPaymentMonthe(null);
              deletePayment.onFalse();
            }}
            disabled={currentMouthe != paymentMonth}
          >
            DELETAR
          </Button>
        }
      />
    </>
  );
}
