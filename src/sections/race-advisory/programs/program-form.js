import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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
import { extrapolation } from 'src/utils/extrapolation';
import { fPercent } from 'src/utils/format-number';
import * as Yup from 'yup';

import ReferenceMonthDate from './reference-month-date';
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
  currentCustomer,
  onCloseForm,
  currentProgram,
  onCancel,
}) {
  const [currentExtrapolation, setCurrentExtrapolation] = useState(null);
  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
    difficulty_level: Yup.string().required('Nível de dificuldade obrigatório'),
    pv: Yup.string().required('Pico de Velocidade obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentProgram?.id || '',
      name: currentProgram?.name || '',
      vlan: currentProgram?.vlan || '',
      vla: currentProgram?.vla || '',
      goal: currentProgram?.vla || '',
      pv: currentProgram?.pv || '',
      difficulty_level: currentProgram?.difficulty_level || '',
      pace: currentProgram?.pace || '',
      test: currentProgram?.test || '',
      dateTest: currentProgram?.dateTest || '',
      referenceMonth: currentProgram?.referenceMonth
        ? dayjs(currentProgram?.referenceMonth).toDate()
        : '',
      customers: currentProgram?.customers || {
        customer_id: currentCustomer?.id,
        user_id: currentCustomer?.user_id,
        program_id: currentCustomer?.program_id,
        created_at: currentCustomer?.created_at,
        updated_at: currentCustomer?.updated_at,
      },
    }),
    [],
  );
  const methods = useForm({
    resolver: yupResolver(NewProgramSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
      onCloseForm();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getVlan = () => {
    if (values.pv > 0) {
      const resultValue = fPercent(values.pv, 80);
      if (resultValue > 0) {
        setValue('vlan', resultValue);
      }
      return resultValue;
    }
  };

  const getVla = () => {
    if (values.pv > 0 && values.difficulty_level.length > 0) {
      const percent = values.difficulty_level === 'Iniciante' ? 60 : 70;
      const resultValue = fPercent(values.pv, percent);
      if (resultValue > 0) {
        setValue('vla', resultValue);
      }
      return resultValue;
    }
  };

  const handleChangePv = (event) => {
    const getPace = PVOPTIONS.filter((op) => op.value === event.target.value);
    setValue('pace', getPace[0].pace);
    setValue('pv', event.target.value);
  };

  useEffect(() => {
    if (values.pv) {
      getVlan();
      getExtrapolationByPv();
    }
  }, [values.pv]);

  useEffect(() => {
    if (values.pv && values.difficulty_level) {
      getVla();
    }
  }, [values.pv, values.difficulty_level]);

  const getExtrapolationByPv = () => {
    const resultValue = extrapolation[values.pv];
    setCurrentExtrapolation(resultValue);
  };

  const getFcValue = () => {
    const birthdate = format(new Date(currentCustomer?.details?.birthdate), 'dd/MM/yyyy');
    if (birthdate) {
      const from = birthdate.split('/');
      var birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
      var cur = new Date();
      var diff = cur - birthdateTimeStamp;
      var currentAge = Math.floor(diff / 31557600000);
      return currentAge ? 220 - currentAge : '';
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <>
          <Box rowGap={3} columnGap={2} display="grid" pt={2}>
            <ReferenceMonthDate name={'referenceMonth'} />
            <RHFTextField name="name" label="Titulo *" variant="standard" />
            <RHFTextField name="goal" label="Objetivo" variant="standard" />
            <RHFSelect name="difficulty_level" label="Nível de dificuldade *" variant="standard">
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
            <RHFTextField name="test" label="Teste realizado" variant="standard" />
            <TestDate />
          </Box>
          <Box rowGap={3} columnGap={2} display="grid" pt={2}>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Resultado
            </Typography>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {values.vlan && values.difficulty_level && (
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                <Stack spacing={1.5} direction="row">
                  <ListItemText
                    primary={'VLan'}
                    secondary={values.vlan && <>{values.vlan} km/h</>}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.primary',
                      component: 'span',
                    }}
                  />
                </Stack>
                <Stack spacing={1.5} direction="row">
                  <ListItemText
                    primary={`Vla(${values.difficulty_level === 'Iniciante' ? '60%' : '70%'})`}
                    secondary={values.vla && <>{values.vla} km/h</>}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.primary',
                      component: 'span',
                    }}
                  />
                </Stack>
                <Stack spacing={1.5} direction="row">
                  <ListItemText
                    primary={'Pace'}
                    secondary={values.pace}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.primary',
                      component: 'span',
                    }}
                  />
                </Stack>
                <Stack spacing={1.5} direction="row">
                  <ListItemText
                    primary={'Fc'}
                    secondary={getFcValue()}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.primary',
                      component: 'span',
                    }}
                  />
                </Stack>
                <Stack spacing={1.5} direction="row">
                  <ListItemText
                    primary={'V02máx'}
                    secondary={currentExtrapolation?.VO2}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.primary',
                      component: 'span',
                    }}
                  />
                </Stack>
              </Box>
            )}
          </Box>
          {currentExtrapolation && values.vlan && values.difficulty_level && (
            <Box rowGap={3} columnGap={2} display="grid" pt={2}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                Validade Extrapolativa
              </Typography>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                {Object.keys(currentExtrapolation).map((item, index) => (
                  <>
                    {item !== 'VO2' && (
                      <Stack key={index} spacing={1.5} direction="row">
                        <ListItemText
                          primary={item}
                          secondary={currentExtrapolation[item]}
                          primaryTypographyProps={{
                            typography: 'body2',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                          secondaryTypographyProps={{
                            typography: 'subtitle2',
                            color: 'text.primary',
                            component: 'span',
                          }}
                        />
                      </Stack>
                    )}
                  </>
                ))}
              </Box>
            </Box>
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
    </>
  );
}

ProgramNewEditForm.propTypes = {
  currentCustomer: PropTypes.object,
  onCloseForm: PropTypes.func,
  currentProgram: PropTypes.object,
  onCancel: PropTypes.func,
};
