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
import ReferenceMonthDate from 'src/components/reference-month-date';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

const DIFFICULTYLEVELOPTIONS = [
  { value: 'Iniciante', label: 'Iniciante' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado', label: 'Avançado' },
];

export default function ProgramGymForm({ typeProgram, program }) {
  const router = useRouter();

  const { onUpdateProgram, onCreateProgram, programCreate, programCreateStatus } = useProgram();
  const { customer } = useCustomer();

  const [action, setAction] = useState(null);
  const [payload, setPayload] = useState(null);

  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      name: program?.name || '',
      goal: program?.vla || '',
      difficultyLevel: program?.difficultyLevel || '',
      warningPdf: program?.warningPdf || null,
      customerId: program?.customerId || customer?.id,
      active: false,
      referenceMonth: program?.referenceMonth || null,
      type: program?.type || typeProgram,
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onPreSubmitNew = useCallback(
    async (data) => {
      try {
        setPayload(data);
        setAction('new');
      } catch (error) {
        console.error(error);
      }
    },
    [onCreateProgram, reset, program, onUpdateProgram],
  );

  const onPreSubmitClose = useCallback(
    async (data) => {
      try {
        setPayload(data);
        setAction('close');
      } catch (error) {
        console.error(error);
      }
    },
    [onCreateProgram, reset, program, onUpdateProgram],
  );

  const onSubmit = useCallback(async (data) => {
    try {
      const payloadData = Object.assign({}, data);
      if (program) {
        delete payloadData.id;
        delete payloadData.programId;
        delete payloadData.createdAt;
        delete payloadData.updatedAt;
        onUpdateProgram(payloadData, program.id);
      } else {
        onCreateProgram(payloadData);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (program) {
      reset({ ...program });
    } else {
      reset({ ...defaultValues });
    }
  }, [program]);

  useEffect(() => {
    if (action && payload) {
      onSubmit(payload);
    }
  }, [action, payload]);

  useEffect(() => {
    if (programCreate) {
      enqueueSnackbar('Programa criado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    }
  }, [programCreate]);

  useEffect(() => {
    if (programCreate) {
      enqueueSnackbar('Programa criado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      if (action === 'close') {
        router.push(paths.dashboard.program.root(customer?.id));
      }
    }
  }, [programCreate]);

  useEffect(() => {
    if (programCreateStatus.error) {
      enqueueSnackbar('Erro ao criar programa', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    }
  }, [programCreateStatus.error]);

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
      <FormProvider methods={methods}>
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
          </Box>
          <Box mt={3}>
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }}>
              Informções adicionais
            </Typography>
            <Stack mt={1}>
              <ReferenceMonthDate value={values.referenceMonth} />
            </Stack>
          </Box>
          <Stack pt={3}>
            <RHFTextField name="warningPdf" label="Aviso - PDF" multiline rows={6} />
          </Stack>
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
            <LoadingButton
              variant="contained"
              loading={isSubmitting}
              fullWidth
              color={'info'}
              onClick={handleSubmit(onPreSubmitNew)}
            >
              Salvar e ir para CRIAR TREINOS
            </LoadingButton>
            <LoadingButton
              variant="contained"
              loading={isSubmitting}
              fullWidth
              onClick={handleSubmit(onPreSubmitClose)}
            >
              Salvar e Fechar
            </LoadingButton>
            <Button fullWidth variant="outlined" color="warning">
              Cancelar
            </Button>
          </Stack>
        </>
      </FormProvider>
    </>
  );
}
