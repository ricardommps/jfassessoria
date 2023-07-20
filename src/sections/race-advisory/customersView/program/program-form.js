import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import { extrapolation } from 'src/utils/extrapolation';
import { fPercent } from 'src/utils/format-number';
import * as Yup from 'yup';

import { ExtrapolativeValidity } from './extrapolative-validity';
import ReferenceMonthDate from './reference-month-date';
import { ResultadoPv } from './resultado-pv';
import TestDate from './test-date';

const DIFFICULTYLEVELOPTIONS = [
  { value: 'Iniciante', label: 'Iniciante(60%)' },
  { value: 'Avançado', label: 'Avançado(70%)' },
];

const PVOPTIONS = [
  { value: '8', label: '8 Km/h', pace: '7.5' },
  { value: '9', label: '9 Km/h', pace: '6.7' },
  { value: '10', label: '10 Km/h', pace: '6' },
  { value: '11', label: '11 Km/h', pace: '5.5' },
  { value: '12', label: '12 Km/h', pace: '5' },
  { value: '13', label: '13 Km/h', pace: '4.6' },
  { value: '14', label: '14 Km/h', pace: '4.3' },
  { value: '15', label: '15 Km/h', pace: '4' },
  { value: '16', label: '16 Km/h', pace: '3.8' },
  { value: '17', label: '17 Km/h', pace: '3.5' },
  { value: '18', label: '18 Km/h', pace: '3.3' },
  { value: '19', label: '19 Km/h', pace: '3.2' },
  { value: '20', label: '20 Km/h', pace: '3' },
];

export default function ProgramNewEditForm({
  program,
  birthDate,
  customerId,
  onCreateProgram,
  onCancel,
  loading,
  onUpdateProgram,
  programId,
}) {
  const [currentExtrapolation, setCurrentExtrapolation] = useState(null);
  const [showEstrapolativeTable, setShowEstrapolativeTable] = useState(false);
  const [showResultPv, setShowResulPv] = useState(false);

  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
    difficultyLevel: Yup.string().required('Nível de dificuldade obrigatório'),
    pv: Yup.string().required('Pico de Velocidade obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      name: program?.name || '',
      goal: program?.vla || '',
      difficultyLevel: program?.difficultyLevel || '',
      vlan: program?.vlan || '',
      paceVlan: program?.paceVlan || '',
      vla: program?.vla || '',
      paceVla: program?.paceVla || '',
      pv: program?.pv || '',
      pace: program?.pace || '',
      test: program?.test || '',
      dateTest: program?.dateTest || '',
      customerId: customerId || null,
      active: false,
      referenceMonth: program?.referenceMonth ? dayjs(program?.referenceMonth).toDate() : '',
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const getVlan = () => {
    if (values.pv > 0) {
      const resultValue = fPercent(values.pv, 80);
      if (resultValue > 0) {
        setValue('vlan', resultValue.toString());
        const resultValueRound = parseInt(resultValue);
        const getPace = 60 / resultValueRound;
        setValue('paceVlan', getPace.toFixed(1));
      }
    }
  };

  const getVla = () => {
    if (values.pv > 0 && values.difficultyLevel.length > 0) {
      const percent = values.difficultyLevel === 'Iniciante' ? 60 : 70;
      const resultValue = fPercent(values.pv, percent);
      if (resultValue > 0) {
        setValue('vla', resultValue.toString());
        const resultValueRound = parseInt(resultValue);
        const getPace = 60 / resultValueRound;
        setValue('paceVla', getPace.toFixed(1));
      }
    }
  };

  const getFcValue = () => {
    if (birthDate) {
      const birthdateValue = format(new Date(birthDate), 'dd/MM/yyyy');
      if (birthdateValue) {
        const from = birthdateValue.split('/');
        var birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
        var cur = new Date();
        var diff = cur - birthdateTimeStamp;
        var currentAge = Math.floor(diff / 31557600000);
        return currentAge ? 220 - currentAge : '';
      }
    }
    return null;
  };

  const handleChangePv = (event) => {
    const getPace = 60 / parseInt(event.target.value);
    setValue('pace', getPace.toFixed(1));
    setValue('pv', event.target.value);
  };

  const handleOpenEstrapolativeTable = () => {
    setShowEstrapolativeTable(true);
  };

  const handleCloseEstrapolativeTable = () => {
    setShowEstrapolativeTable(false);
  };

  const handleOpenResultPv = () => {
    setShowResulPv(true);
  };

  const handleCloseResultPv = () => {
    setShowResulPv(false);
  };

  const onSubmit = useCallback(
    async (data) => {
      try {
        if (program) {
          onUpdateProgram(data, programId);
          reset({ ...defaultValues });
        } else {
          onCreateProgram(data);
          reset({ ...defaultValues });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onCreateProgram, reset, program],
  );

  useEffect(() => {
    if (values.pv) {
      getVlan();
      getExtrapolationByPv();
    }
  }, [values.pv]);

  useEffect(() => {
    if (values.pv && values.difficultyLevel) {
      getVla();
    }
  }, [values.pv, values.difficultyLevel]);

  useEffect(() => {
    if (program) {
      reset({ ...program });
    } else {
      reset({ ...defaultValues });
    }
  }, [program]);

  const getExtrapolationByPv = () => {
    const resultValue = extrapolation[values.pv];
    setCurrentExtrapolation(resultValue);
  };

  const getExtrapolationRender = (extrapolationItem) => {
    const item = Object.keys(extrapolationItem);
    delete item[0];
    return item;
  };
  return (
    <>
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
        <>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
            {program ? 'Editar Programa' : 'Novo Programa'}
          </Typography>
          <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
            {program
              ? 'Atualize os dados do programa com este formulário'
              : 'Cadastre um novo programa para seu aluno com este formulário'}
            .
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <>
              <Box rowGap={3} columnGap={2} display="grid" pt={2}>
                <RHFTextField name="name" label="Titulo *" variant="standard" />
                <RHFTextField name="goal" label="Objetivo" variant="standard" />
                <RHFSelect name="difficultyLevel" label="Nível de dificuldade *" variant="standard">
                  {DIFFICULTYLEVELOPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="pv"
                  label="Pico de Velocidade(PV) *"
                  variant="standard"
                  onChange={handleChangePv}
                >
                  {PVOPTIONS.map((option) => (
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
                  <ReferenceMonthDate name={'referenceMonth'} />
                  <RHFTextField name="test" label="Teste realizado" variant="standard" />
                  <TestDate />
                </Stack>
              </Box>
              {values.vlan && values.difficultyLevel && (
                <Stack spacing={1.5} direction="row" mt={3}>
                  <Typography>Resultado PV</Typography>
                  <IconButton sx={{ padding: 0 }} onClick={handleOpenResultPv}>
                    <Iconify icon="eva:info-outline" />
                  </IconButton>
                </Stack>
              )}
              {currentExtrapolation && values.vlan && values.difficultyLevel && (
                <Stack spacing={1.5} direction="row" mt={3}>
                  <Typography>Validade Extrapolativa</Typography>
                  <IconButton sx={{ padding: 0 }} onClick={handleOpenEstrapolativeTable}>
                    <Iconify icon="eva:info-outline" />
                  </IconButton>
                </Stack>
              )}
              <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
                  Salvar
                </LoadingButton>
                <Button fullWidth variant="outlined" color="warning" onClick={onCancel}>
                  Cancelar
                </Button>
              </Stack>
            </>
          </FormProvider>
          <ExtrapolativeValidity
            open={showEstrapolativeTable}
            onClose={handleCloseEstrapolativeTable}
          >
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              {currentExtrapolation && (
                <>
                  {getExtrapolationRender(currentExtrapolation).map((item, index) => (
                    <Stack key={index} spacing={1.5} direction="row">
                      <ListItemText
                        primary={item}
                        secondary={currentExtrapolation[item]}
                        primaryTypographyProps={{
                          typography: 'body2',
                          color: 'text.secondary',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          mb: 0.5,
                        }}
                        secondaryTypographyProps={{
                          typography: 'subtitle2',
                          textAlign: 'center',
                          component: 'span',
                        }}
                      />
                    </Stack>
                  ))}
                </>
              )}
            </Box>
          </ExtrapolativeValidity>
        </>
      )}

      {values.vlan && values.difficultyLevel && (
        <ResultadoPv
          open={showResultPv}
          onClose={handleCloseResultPv}
          vla={values.vla}
          paceVla={values.paceVla}
          vlan={values.vlan}
          paceVlan={values.paceVlan}
          pace={values.pace}
          VO2={currentExtrapolation?.VO2}
          fc={getFcValue()}
        />
      )}
    </>
  );
}

ProgramNewEditForm.propTypes = {
  program: PropTypes.object,
  birthDate: PropTypes.string,
  customerId: PropTypes.number,
  onCreateProgram: PropTypes.func,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  onUpdateProgram: PropTypes.func,
  programId: PropTypes.number,
};
