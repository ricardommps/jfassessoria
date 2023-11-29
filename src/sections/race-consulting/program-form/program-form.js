import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import { extrapolation } from 'src/utils/extrapolation';
import { fPercent } from 'src/utils/format-number';
import * as Yup from 'yup';

import DialogTablePaceSpeed from './dialog-table-pace-speed';
import { ExtrapolativeValidity } from './extrapolative-validity';
import ReferenceMonthDate from './reference-month-date';
import { ResultadoPv } from './resultado-pv';
import TestDate from './test-date';

const DIFFICULTYLEVELOPTIONS = [
  { value: 'Iniciante', label: 'Iniciante' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado', label: 'Avançado' },
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

export default function ProgramForm({ handleClear, typeProgram }) {
  const { program, onUpdateProgram, onCreateProgram, getFcValue } = useProgram();

  const { customer } = useCustomer();
  const openTable = useBoolean();

  const [currentExtrapolation, setCurrentExtrapolation] = useState(null);
  const [showEstrapolativeTable, setShowEstrapolativeTable] = useState(false);
  const [showResultPv, setShowResulPv] = useState(false);
  const [actionType, setActionType] = useState(null);

  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
    difficultyLevel: Yup.string().required('Nível de dificuldade obrigatório'),
    pv: Yup.string().required('Pico de Velocidade obrigatório'),
    pace: Yup.string().required('Pace obrigatório'),
    vla: Yup.string().required('Vla obrigatório'),
    vlan: Yup.string().required('Vlan obrigatório'),
    paceVla: Yup.string().required('Pace Vla obrigatório'),
    paceVlan: Yup.string().required('Pace Vlan obrigatório'),
    vlaLevel: Yup.string().required('Nível Vla obrigatório'),
    vlanLevel: Yup.string().required('Nível Vlan obrigatório'),
    fcmValue: Yup.string().required('FCM obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      name: program?.name || '',
      goal: program?.vla || '',
      difficultyLevel: program?.difficultyLevel || '',
      vlan: program?.vlan || '',
      paceVlan: program?.paceVlan || '',
      vlanLevel: program?.vlanLevel || '',
      vla: program?.vla || '',
      paceVla: program?.paceVla || '',
      vlaLevel: program?.vlaLevel || '',
      pv: program?.pv || '',
      pace: program?.pace || '',
      test: program?.test || null,
      warningPdf: program?.warningPdf || null,
      dateTest: program?.dateTest || null,
      customerId: program?.customerId || customer?.id,
      active: false,
      referenceMonth: program?.referenceMonth || null,
      fcmValue: program?.fcmValue || getFcValue(),
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

  const handleTableSelected = (item) => {
    if (actionType === 'pace') {
      setValue('pace', item.toString());
    }
    if (actionType === 'paceVla') {
      setValue('paceVla', item.toString());
    }

    if (actionType === 'paceVlan') {
      setValue('paceVlan', item.toString());
    }
    setActionType(null);
  };

  const onSubmit = useCallback(
    async (data) => {
      try {
        const payload = Object.assign({}, data);
        payload.vlanLevel = Number(payload.vlanLevel);
        payload.vlaLevel = Number(payload.vlaLevel);
        payload.fcmValue = Number(payload.fcmValue);
        if (program) {
          delete payload.id;
          delete payload.programId;
          delete payload.createdAt;
          delete payload.updatedAt;
          onUpdateProgram(payload, program.id);
          reset({ ...defaultValues });
        } else {
          onCreateProgram(payload);
          reset({ ...defaultValues });
        }
      } catch (error) {
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

  const getExtrapolationRender = (extrapolationItem) => {
    const item = Object.keys(extrapolationItem);
    delete item[0];
    return item;
  };

  const handleChangeVlaLevel = (event) => {
    const vlaLevel = Number(event.target.value);
    const resultValue = fPercent(values.pv, vlaLevel);
    setValue('vla', resultValue.toString());
    setValue('vlaLevel', event.target.value);
  };

  const handleChangeVlanLevel = (event) => {
    const vlanLevel = Number(event.target.value);
    const resultValue = fPercent(values.pv, vlanLevel);
    setValue('vlan', resultValue.toString());
    setValue('vlanLevel', vlanLevel);
  };

  const handleOpenTableSpeed = (type) => {
    setActionType(type);
    openTable.onTrue();
  };

  const getExtrapolationByPv = () => {
    const resultValue = extrapolation[values.pv];
    setCurrentExtrapolation(resultValue);
  };

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

  useEffect(() => {
    if (values.pv) {
      getExtrapolationByPv();
    }
  }, [values.pv]);

  return (
    <>
      <Stack>
        <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
          {program ? 'Editar Programa de Corrida' : 'Novo Programa de Corrida'}
        </Typography>
        <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
          {program
            ? 'Atualize os dados do programa de corrida com este formulário'
            : 'Cadastre um novo programa de corrida para seu aluno com este formulário'}
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
            <RHFSelect
              name="pv"
              label="Pico de Velocidade(PV) *"
              variant="standard"
              onChange={(e) => setValue('pv', e.target.value)}
            >
              {PVOPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="fcmValue" label="FCM" variant="standard" type={'number'} />

            {values.pv && values.difficultyLevel && (
              <>
                <RHFSelect
                  name="vlaLevel"
                  label="Nível Vla"
                  variant="standard"
                  onChange={handleChangeVlaLevel}
                >
                  <MenuItem value={60}>60%</MenuItem>
                  <MenuItem value={70}>70%</MenuItem>
                </RHFSelect>

                <RHFSelect
                  name="vlanLevel"
                  label="Nível Vlan"
                  variant="standard"
                  onChange={handleChangeVlanLevel}
                >
                  <MenuItem value={70}>70%</MenuItem>
                  <MenuItem value={80}>80%</MenuItem>
                </RHFSelect>

                <Stack
                  direction="row"
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'left',
                    borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack
                    sx={{
                      typography: 'body2',
                      cursor: 'pointer',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                    onClick={() => handleOpenTableSpeed('pace')}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Pace
                    </Typography>
                    {values.pace ? <>{values.pace}</> : <>Clique aqui para selecionar um valor</>}
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'left',
                    borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack sx={{ typography: 'body2', width: '50%', maxWidth: '50%' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Vla(km/h)
                    </Typography>
                    <Typography>{values.vla}</Typography>
                  </Stack>
                  <Stack
                    sx={{
                      typography: 'body2',
                      cursor: values.vla && 'pointer',
                      width: '50%',
                      maxWidth: '50%',
                    }}
                    onClick={() => handleOpenTableSpeed('paceVla')}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Pace - Vla
                    </Typography>
                    {values.vla && (
                      <Typography>
                        {values.paceVla ? (
                          <>{values.paceVla}</>
                        ) : (
                          <>Clique aqui para selecionar um valor</>
                        )}
                      </Typography>
                    )}
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'left',
                    borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack sx={{ typography: 'body2', width: '50%', maxWidth: '50%' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Vlan(km/h)
                    </Typography>
                    <Typography>{values.vlan}</Typography>
                  </Stack>
                  <Stack
                    sx={{
                      typography: 'body2',
                      cursor: values.vla && 'pointer',
                      width: '50%',
                      maxWidth: '50%',
                    }}
                    onClick={() => handleOpenTableSpeed('paceVlan')}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Pace - Vlan
                    </Typography>
                    {values.vla && (
                      <Typography>
                        {values.paceVlan ? (
                          <>{values.paceVlan}</>
                        ) : (
                          <>Clique aqui para selecionar um valor</>
                        )}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </>
            )}
          </Box>
          <Box mt={3}>
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }}>
              Informções adicionais
            </Typography>
            <Stack mt={1}>
              <ReferenceMonthDate value={values.referenceMonth} />
              <RHFTextField name="test" label="Teste realizado" variant="standard" />
              <TestDate value={values.dateTest} />
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
          {values.vlan && values.difficultyLevel && (
            <Stack spacing={1.5} direction="row" mt={3}>
              <Typography>Validade Extrapolativa</Typography>
              <IconButton sx={{ padding: 0 }} onClick={handleOpenEstrapolativeTable}>
                <Iconify icon="eva:info-outline" />
              </IconButton>
            </Stack>
          )}
          {values.vlan && values.difficultyLevel && (
            <Stack spacing={1.5} direction="row" mt={3}>
              <Typography>Tabela Pace/Km</Typography>
              <IconButton sx={{ padding: 0 }} onClick={openTable.onTrue}>
                <Iconify icon="eva:info-outline" />
              </IconButton>
            </Stack>
          )}
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
            <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
              Salvar
            </LoadingButton>
            <Button fullWidth variant="outlined" color="warning" onClick={handleClear}>
              Cancelar
            </Button>
          </Stack>
        </>
      </FormProvider>
      <ExtrapolativeValidity open={showEstrapolativeTable} onClose={handleCloseEstrapolativeTable}>
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
          fc={values.fcmValue}
        />
      )}
      {openTable.value && (
        <DialogTablePaceSpeed
          open={openTable.value}
          onClose={openTable.onFalse}
          actionType={actionType}
          handleTableSelected={handleTableSelected}
        />
      )}
    </>
  );
}

ProgramForm.propTypes = {
  handleClear: PropTypes.func,
};
