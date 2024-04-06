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
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTablePvContext } from 'src/components/drawer-table-pv';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';
import SelectMedia from 'src/components/select-media';
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
import { trainingModules } from 'src/utils/training-modules';
import * as Yup from 'yup';

import MediasView from './medias-view';

export default function TrainingForm({ handleCancel }) {
  const tablePv = useTablePvContext();
  const { training, onUpdateTraining, onCreateTraining } = useTraining();
  const { program } = useProgram();
  const listMedias = useBoolean();

  const NewTrainingSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      programId: training?.programId || program.id,
      name: training?.name || '',
      subtitle: training?.subtitle || '',
      heating: training?.heating || '',
      recovery: training?.recovery || '',
      description: training?.description || '',
      coverPath: training?.coverPath || '',
      datePublished: training?.datePublished || null,
      trainingDateOther: training?.trainingDateOther || null,
      published: training?.published || false,
      videos: training?.videos || null,
      hide: training?.hide || false,
      finished: training?.finished || false,
      medias: training?.medias || [],
      mediaOrder: training?.mediaOrder || [],
      exerciseInfo: training?.exerciseInfo || [],
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(NewTrainingSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        const newData = Object.assign({}, data);
        const mediasID = newData.medias.map((item) => item.id);
        if (training) {
          const payload = newData;
          payload.medias = mediasID;
          delete payload.id;
          // delete payload.programId;
          onUpdateTraining(payload, training.id);
          reset({ ...defaultValues });
        } else {
          delete newData.medias;
          const payload = {
            trainig: newData,
            medias: mediasID,
          };
          onCreateTraining(payload);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onCreateTraining, reset, training, onUpdateTraining],
  );

  const handleChangePublished = useCallback(
    (event) => {
      setValue('published', event.target.checked);
    },
    [setValue],
  );

  const handleSaveMedias = (leftList) => {
    setValue('medias', leftList);
    orderMedias(leftList);
    listMedias.onFalse();
  };

  const handleReorderMedias = (newMedias) => {
    setValue('medias', newMedias);
    orderMedias(newMedias);
  };

  const handleSaveExerciseInfo = (data) => {
    const exerciseInfo = values.exerciseInfo;
    const currentIndex = exerciseInfo.findIndex((item) => item.id === data.id);

    const newExerciseInfo = [...values.exerciseInfo];

    if (currentIndex === -1) {
      newExerciseInfo.push(data);
    } else {
      newExerciseInfo[currentIndex] = data;
    }
    setValue('exerciseInfo', newExerciseInfo);
  };

  const orderMedias = (medias) => {
    const mediasID = medias.map((item) => item.id);
    setValue('mediaOrder', mediasID);
  };

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
    if (!values.datePublished) {
      setValue('trainingDateOther', null);
    }
  }, [values.datePublished]);

  useEffect(() => {
    if (program.type === 2) {
      setValue('name', 'FORCA');
    }
  }, [program]);

  return (
    <>
      <Stack>
        <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
          {training ? 'Editar Treino' : 'Novo Treino'}
        </Typography>
        <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
          {training
            ? 'Atualize os dados do treino com este formulário'
            : 'Cadastre um novo Treino para o programa do seu aluno com este formulário'}
          .
        </Typography>
      </Stack>
      {(!program.type || program.type === 1) && (
        <Stack>
          <Button variant="outlined" sx={{ width: 'fit-content' }} onClick={tablePv.onToggle}>
            {!tablePv.open ? 'Exibir tabela Pv' : 'Ocultas tabela Pv'}
          </Button>
        </Stack>
      )}

      <Grid container spacing={6}>
        <Grid xs={12} md={12}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <>
              <Box rowGap={3} columnGap={2} display="grid" pt={2}>
                {program?.type === 2 ? (
                  <Typography>Força</Typography>
                ) : (
                  <RHFSelect name="name" label="Módulo *" variant="standard">
                    {trainingModules.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
                <Stack>
                  <RHFTextField name="subtitle" label="Subtítulo" />
                </Stack>
                <Stack mt={1}>
                  <Controller
                    name="datePublished"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Data do treino"
                        format="dd/MM/yyyy"
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
                  <Stack mt={2}>
                    <Controller
                      name="trainingDateOther"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          disabled={!values.datePublished}
                          label="Data do treino alternativa"
                          format="dd/MM/yyyy"
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
                </Stack>
                <RHFTextField name="heating" label="Aquecimento" multiline rows={3} />
                <RHFTextField name="description" label="Parte principal" multiline rows={6} />
                <RHFTextField name="recovery" label="Desaquecimento" multiline rows={3} />
                <Stack>
                  {values.medias.length > 0 && (
                    <Box
                      sx={{
                        overflowY: 'auto',
                        maxHeight: '40vh',
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: 'column',
                      }}
                    >
                      <Scrollbar>
                        <MediasView
                          medias={values.medias}
                          handleReorderMedias={handleReorderMedias}
                          mediaOrder={values.mediaOrder}
                          handleSaveExerciseInfo={handleSaveExerciseInfo}
                          exerciseInfo={values.exerciseInfo}
                        />
                      </Scrollbar>
                    </Box>
                  )}
                  <Box pt={1}>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                      sx={{ flexShrink: 0 }}
                      onClick={listMedias.onTrue}
                    >
                      {values.medias.length > 0
                        ? 'Editar Exercícios Selecionados'
                        : 'Selecionar Exercícios'}
                    </Button>
                  </Box>
                </Stack>
                <Stack alignItems="flex-start" sx={{ mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(values.published)}
                        color="primary"
                        onChange={handleChangePublished}
                      />
                    }
                    label="Liberado"
                    labelPlacement="end"
                  />
                </Stack>
              </Box>
              <Stack pt={2} sx={{ width: '100%' }} spacing={2}>
                {renderErros}
              </Stack>
              <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
                  Salvar
                </LoadingButton>
                <Button fullWidth variant="outlined" color="warning" onClick={handleCancel}>
                  Cancelar
                </Button>
              </Stack>
            </>
          </FormProvider>
        </Grid>
      </Grid>
      {listMedias?.value && (
        <SelectMedia
          open={listMedias.value}
          onClose={listMedias.onFalse}
          onSelectMedias={handleSaveMedias}
          mediasSelected={values.medias}
        />
      )}
    </>
  );
}

TrainingForm.propTypes = {
  handleCancel: PropTypes.func,
};
