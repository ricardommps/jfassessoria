import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import useCustomer from 'src/hooks/use-customer';
import * as Yup from 'yup';

import DateSelect from './date-select';

const DIFFICULTYLEVELOPTIONS = [
  { value: 'Iniciante', label: 'Iniciante' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado', label: 'Avançado' },
];

export default function GymProgramForm({
  program,
  onUpdateProgram,
  onCreateProgram,
  handleClose,
  handleSuccessCreateProgram,
}) {
  const { customer } = useCustomer();

  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });

  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: program?.name || '',
      goal: program?.vla || '',
      difficultyLevel: program?.difficultyLevel || '',
      warningPdf: program?.warningPdf || null,
      customerId: program?.customerId || customer?.id,
      active: false,
      referenceMonth: program?.referenceMonth || null,
      type: program?.type || 2,
      startDate: program?.startDate || null,
      endDate: program?.endDate || null,
    }),
    [],
  );
  const methods = useForm({
    resolver: yupResolver(NewProgramSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const payload = Object.assign({}, data);
        if (program) {
          delete payload.id;
          delete payload.programId;
          delete payload.createdAt;
          delete payload.updatedAt;
          await onUpdateProgram(payload, program.id);
          reset({ ...defaultValues });
          enqueueSnackbar('Programa atualizado com sucesso!', {
            autoHideDuration: 8000,
            variant: 'success',
          });
          handleSuccessCreateProgram();
          setLoading(false);
        } else {
          await onCreateProgram(payload);
          reset({ ...defaultValues });
          enqueueSnackbar('Programa criado com sucesso!', {
            autoHideDuration: 8000,
            variant: 'success',
          });
          handleSuccessCreateProgram();
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    },
    [onCreateProgram, reset, program, onUpdateProgram],
  );

  useEffect(() => {
    if (program) {
      reset({ ...program });
    } else {
      reset({ ...defaultValues });
    }
  }, [program]);

  const handleChangeActive = useCallback(
    (event) => {
      setValue('active', event.target.checked);
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

  return (
    <>
      <Stack>
        <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
          {program ? 'Editar Programa de Força' : 'Novo Programa de Força'}
        </Typography>
        <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
          {program
            ? 'Atualize os dados do programa de força com este formulário'
            : 'Cadastre um novo programa de força para seu aluno com este formulário'}
          .
        </Typography>
      </Stack>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <>
          <Box rowGap={3} columnGap={2} display="grid" pt={1}>
            <RHFTextField name="name" label="Titulo *" variant="standard" />
            <RHFTextField name="goal" label="Objetivo" variant="standard" />
            <RHFSelect name="difficultyLevel" label="Nível de dificuldade *" variant="standard">
              {DIFFICULTYLEVELOPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <DateSelect
              value={values.startDate}
              name={'startDate'}
              label={'Seleciona a data inicial'}
            />

            <DateSelect value={values.endDate} name={'endDate'} label={'Seleciona a data final'} />
          </Box>
          <Stack alignItems="flex-start" sx={{ mb: 1, mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.active)}
                  color="primary"
                  onChange={handleChangeActive}
                />
              }
              label="Liberado"
              labelPlacement="end"
            />
          </Stack>
          <Stack pt={2} sx={{ width: '100%' }} spacing={2}>
            {renderErros}
          </Stack>
          <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
            <LoadingButton type="submit" variant="contained" loading={loading} fullWidth>
              Salvar
            </LoadingButton>
            <Button fullWidth variant="outlined" color="warning" onClick={handleClose}>
              Cancelar
            </Button>
          </Stack>
        </>
      </FormProvider>
    </>
  );
}
