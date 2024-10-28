import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
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
import { _tags } from 'src/utils/tags';
import { trainingModules } from 'src/utils/training-modules';
import * as Yup from 'yup';

import HeatingView from './heating-view';
import MediasView from './medias-view';
import StretchesView from './stretches-view';

const stretchTags = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos'];
const heatingTags = ['Aquecimento'];
const excludedTags = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos', 'Aquecimento'];

export default function TrainingForm({ handleCancel }) {
  const tablePv = useTablePvContext();
  const { training, onUpdateTraining, onCreateTraining } = useTraining();
  const { program } = useProgram();
  const listMedias = useBoolean();
  const isStretches = useBoolean();
  const isHeating = useBoolean();

  const toggleTags = useBoolean(true);

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
      stretchesOrder: training?.stretchesOrder || [],
      heatingOrder: training?.heatingOrder || [],
      exerciseInfo: training?.exerciseInfo || [],
      tags: training?.tags || [],
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
    const medias = values.medias;
    const filtered = medias?.filter((item) => item.tags.some((tag) => excludedTags.includes(tag)));
    const newMedias = [...filtered, ...leftList];
    setValue('medias', newMedias);
    orderMedias(leftList);
    listMedias.onFalse();
  };

  const handleSaveStretches = (leftList) => {
    const medias = values.medias;
    const filtered = medias?.filter((item) => !item.tags.some((tag) => stretchTags.includes(tag)));
    const newMedias = [...filtered, ...leftList];
    setValue('medias', newMedias);
    orderStretches(leftList);
    isStretches.onFalse();
  };

  const handleSaveHeatings = (leftList) => {
    const medias = values.medias;
    const filtered = medias?.filter((item) => !item.tags.some((tag) => heatingTags.includes(tag)));
    const newMedias = [...filtered, ...leftList];
    setValue('medias', newMedias);
    orderHeating(leftList);
    isHeating.onFalse();
  };

  const handleReorderMedias = (newMedias) => {
    //setValue('medias', newMedias);
    orderMedias(newMedias);
  };

  const handleReorderStretches = (itens) => {
    //setValue('medias', itens);
    orderStretches(filterStretches(itens));
  };

  const handleReorderHeatings = (itens) => {
    //setValue('medias', itens);
    orderHeating(filterHeating(itens));
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
    const newMedias = filterMedias(medias);
    const mediasID = newMedias.map((item) => item.id);
    setValue('mediaOrder', mediasID);
  };

  const orderStretches = (stretches) => {
    const newMedias = filterStretches(stretches);
    const stretchesID = newMedias.map((item) => item.id);
    setValue('stretchesOrder', stretchesID);
  };

  const orderHeating = (heatings) => {
    const newMedias = filterHeating(heatings);
    const heatingID = newMedias.map((item) => item.id);
    setValue('heatingOrder', heatingID);
  };

  const handleChangeTags = useCallback((newValue) => {
    setValue('tags', newValue);
  }, []);

  const filterMedias = (medias) => {
    const filtered = medias?.filter((item) => !item.tags.some((tag) => excludedTags.includes(tag)));
    return filtered;
  };

  const filterStretches = (medias) => {
    const filtered = medias?.filter((item) => item.tags.some((tag) => stretchTags.includes(tag)));
    return filtered;
  };

  const filterHeating = (medias) => {
    const filtered = medias?.filter((item) => item.tags.some((tag) => heatingTags.includes(tag)));
    return filtered;
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

  const renderTags = (
    <Stack spacing={1.5}>
      {toggleTags.value && (
        <Autocomplete
          multiple
          freeSolo
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          defaultValue={_tags.slice(0, 3)}
          value={values.tags}
          onChange={(event, newValue) => {
            handleChangeTags(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option}
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="#Adicionar Tags" />}
        />
      )}
    </Stack>
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
                {program.type === 2 && <>{renderTags}</>}

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
                <Box>
                  <RHFTextField name="heating" label="Aquecimento" multiline rows={3} />
                  <Stack>
                    {filterHeating(values.medias).length > 0 && (
                      <Box
                        sx={{
                          overflowY: 'auto',
                          maxHeight: '40vh',
                          display: 'flex',
                          flexGrow: 1,
                          flexDirection: 'column',
                        }}
                      >
                        <Scrollbar sx={{ height: 320 }}>
                          <HeatingView
                            medias={filterHeating(values.medias)}
                            handleReorderMedias={handleReorderHeatings}
                            mediaOrder={values.heatingOrder}
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
                        onClick={() => {
                          isStretches.onFalse();
                          listMedias.onFalse();
                          isHeating.onTrue();
                        }}
                      >
                        {filterHeating(values.medias).length > 0
                          ? 'Editar Aquecimentos Selecionados'
                          : 'Selecionar Aquecimentos'}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
                {(!program?.type || program?.type === 1) && (
                  <Box
                    component="fieldset"
                    sx={{
                      borderWidth: '2px',
                      borderStyle: 'groove',
                      borderColor: 'rgba(145, 158, 171, 0.2)',
                      borderRadius: '8px',
                    }}
                  >
                    <legend>
                      <Typography fontSize={'12px'} color={'#919EAB'}>
                        Alongamentos ativos e educativos de corrida
                      </Typography>
                    </legend>
                    {filterStretches(values.medias).length > 0 && (
                      <Box>
                        <Scrollbar sx={{ height: 320 }}>
                          <StretchesView
                            medias={filterStretches(values.medias)}
                            handleReorderMedias={handleReorderStretches}
                            mediaOrder={values.stretchesOrder}
                            handleSaveExerciseInfo={handleSaveExerciseInfo}
                            exerciseInfo={values.exerciseInfo}
                          />
                        </Scrollbar>
                      </Box>
                    )}
                    <Stack>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexShrink: 0 }}
                        onClick={() => {
                          listMedias.onFalse();
                          isStretches.onTrue();
                          isHeating.onFalse();
                        }}
                      >
                        Selecionar Alongamentos
                      </Button>
                    </Stack>
                  </Box>
                )}

                <RHFTextField name="description" label="Parte principal" multiline rows={6} />
                <Stack>
                  {filterMedias(values.medias).length > 0 && (
                    <Box
                      sx={{
                        overflowY: 'auto',
                        maxHeight: '40vh',
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: 'column',
                      }}
                    >
                      <Scrollbar sx={{ height: 320 }}>
                        <MediasView
                          medias={filterMedias(values.medias)}
                          handleReorderMedias={handleReorderMedias}
                          mediaOrder={values.mediaOrder}
                          handleSaveExerciseInfo={handleSaveExerciseInfo}
                          exerciseInfo={values.exerciseInfo}
                        />
                      </Scrollbar>
                    </Box>
                  )}
                  {program?.type === 2 && (
                    <Box pt={1}>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexShrink: 0 }}
                        onClick={() => {
                          isStretches.onFalse();
                          listMedias.onTrue();
                          isHeating.onFalse();
                        }}
                      >
                        {filterMedias(values.medias).length > 0
                          ? 'Editar Exercícios Selecionados'
                          : 'Selecionar Exercícios'}
                      </Button>
                    </Box>
                  )}
                </Stack>
                <RHFTextField name="recovery" label="Desaquecimento" multiline rows={3} />
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
          mediasSelected={filterMedias(values.medias)}
          mediaOrder={values.mediaOrder}
          tags={values.tags}
          excludedTags={['Alongamento ativo', 'Alongamento passivo', 'Alongamentos', 'Aquecimento']}
        />
      )}
      {isStretches?.value && (
        <SelectMedia
          open={isStretches.value}
          onClose={isStretches.onFalse}
          onSelectMedias={handleSaveStretches}
          mediasSelected={filterStretches(values.medias)}
          mediaOrder={values.stretchesOrder}
          includedTags={stretchTags}
        />
      )}
      {isHeating?.value && (
        <SelectMedia
          open={isHeating.value}
          onClose={isHeating.onFalse}
          onSelectMedias={handleSaveHeatings}
          mediasSelected={filterHeating(values.medias)}
          mediaOrder={values.heatingOrder}
          includedTags={heatingTags}
        />
      )}
    </>
  );
}

TrainingForm.propTypes = {
  handleCancel: PropTypes.func,
};
