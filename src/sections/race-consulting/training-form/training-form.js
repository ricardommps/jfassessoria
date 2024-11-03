import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
import { _tags } from 'src/utils/tags';
import { trainingModules } from 'src/utils/training-modules';
import * as Yup from 'yup';

import HeatingFind from './heating/heating-find';
import StrechesFind from './streches/streches-find';
import WorkoutFind from './workout/workout-find';
import WorkoutView from './workout/workout-view';

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

  const handleSaveMedias = (workouts) => {
    const medias = values.medias;
    const filtered = medias?.filter((item) => item.tags.some((tag) => excludedTags.includes(tag)));
    const newMedias = [...filtered, ...workouts];
    setValue('medias', newMedias);
    if (!workouts || workouts.length === 0) {
      setValue('mediaOrder', []);
    }
    orderWorkout(workouts);
    listMedias.onFalse();
  };

  const handleSaveStretches = (stretches) => {
    const medias = values.medias;
    const filtered = medias?.filter((item) => !item.tags.some((tag) => stretchTags.includes(tag)));
    const newMedias = [...filtered, ...stretches];
    setValue('medias', newMedias);
    if (!stretches || stretches.length === 0) {
      setValue('stretchesOrder', []);
    }
    orderStretches(stretches);
    isStretches.onFalse();
  };

  const handleSaveHeatings = (heatings) => {
    const medias = values.medias;
    const filtered = medias?.filter((item) => !item.tags.some((tag) => heatingTags.includes(tag)));
    const newMedias = [...filtered, ...heatings];
    setValue('medias', newMedias);
    if (!heatings || heatings.length === 0) {
      setValue('heatingOrder', []);
    } else {
      orderHeating(heatings);
    }

    isHeating.onFalse();
  };

  const handleRemoveHeatings = (removed) => {
    const idsToRemove = removed.map((item) => item.id);
    const medias = [...values.medias];
    const heatingOrder = [...values.heatingOrder];

    const newHeatingOrder = heatingOrder
      .flatMap((element) => {
        if (idsToRemove.includes(element)) {
          return [];
        }
        const resultado =
          typeof element === 'object' && element !== null
            ? element.flatMap((subElement) =>
                idsToRemove.includes(subElement) ? [] : [subElement],
              )
            : element;
        return Array.isArray(resultado) && resultado.length === 0 ? [] : [resultado];
      })
      .filter((item) => !Array.isArray(item) || item.length !== 0);
    const filteredMedias = medias.filter((item) => !idsToRemove.includes(item.id));
    setValue('heatingOrder', newHeatingOrder);
    setValue('medias', filteredMedias);
  };

  const handleRemoveStretches = (removed) => {
    const idsToRemove = removed.map((item) => item.id);
    const medias = [...values.medias];
    const stretchesOrder = [...values.stretchesOrder];

    const newStretchesOrder = stretchesOrder
      .flatMap((element) => {
        if (idsToRemove.includes(element)) {
          return [];
        }
        const resultado =
          typeof element === 'object' && element !== null
            ? element.flatMap((subElement) =>
                idsToRemove.includes(subElement) ? [] : [subElement],
              )
            : element;
        return Array.isArray(resultado) && resultado.length === 0 ? [] : [resultado];
      })
      .filter((item) => !Array.isArray(item) || item.length !== 0);
    const filteredMedias = medias.filter((item) => !idsToRemove.includes(item.id));
    setValue('stretchesOrder', newStretchesOrder);
    setValue('medias', filteredMedias);
  };

  const handleRemoveWorkout = (removed) => {
    const idsToRemove = removed.map((item) => item.id);
    const medias = [...values.medias];
    const mediaOrder = [...values.mediaOrder];

    const newWorkoutOrder = mediaOrder
      .flatMap((element) => {
        if (idsToRemove.includes(element)) {
          return [];
        }
        const resultado =
          typeof element === 'object' && element !== null
            ? element.flatMap((subElement) =>
                idsToRemove.includes(subElement) ? [] : [subElement],
              )
            : element;
        return Array.isArray(resultado) && resultado.length === 0 ? [] : [resultado];
      })
      .filter((item) => !Array.isArray(item) || item.length !== 0);
    const filteredMedias = medias.filter((item) => !idsToRemove.includes(item.id));
    setValue('mediaOrder', newWorkoutOrder);
    setValue('medias', filteredMedias);
  };

  const handleReorderMedias = (itens) => {
    setValue('mediaOrder', itens);
  };

  const handleReorderStretches = (itens) => {
    setValue('stretchesOrder', itens);
  };

  const handleReorderHeatings = (itens) => {
    setValue('heatingOrder', itens);
  };

  const groupHeatings = (itens) => {
    const heatingOrder = [...values.heatingOrder];
    const newHeatingOrder = heatingOrder
      .map((element) => {
        return itens.includes(element) ? null : element;
      })
      .filter((element) => element !== null);

    newHeatingOrder.splice(1, 0, [...itens]);
    setValue('heatingOrder', newHeatingOrder);
  };

  const ungroupHeatings = (idsToUngroup) => {
    const heatingOrder = [...values.heatingOrder];
    const newHeatingOrder = heatingOrder.flatMap((element) => {
      if (Array.isArray(element)) {
        const desagrupados = element.filter((subElement) => idsToUngroup.includes(subElement));
        const restantes = element.filter((subElement) => !idsToUngroup.includes(subElement));
        if (desagrupados.length > 0) {
          return restantes.length > 0 ? [...desagrupados, restantes] : desagrupados;
        }
        return [element];
      }
      return element;
    });
    setValue('heatingOrder', newHeatingOrder);
  };

  const ungroupStretches = (idsToUngroup) => {
    const stretchesOrder = [...values.stretchesOrder];
    const newStretchesOrder = stretchesOrder.flatMap((element) => {
      if (Array.isArray(element)) {
        const desagrupados = element.filter((subElement) => idsToUngroup.includes(subElement));
        const restantes = element.filter((subElement) => !idsToUngroup.includes(subElement));
        if (desagrupados.length > 0) {
          return restantes.length > 0 ? [...desagrupados, restantes] : desagrupados;
        }
        return [element];
      }
      return element;
    });
    setValue('stretchesOrder', newStretchesOrder);
  };

  const groupStretches = (itens) => {
    const stretchesOrder = [...values.stretchesOrder];
    const newStretchesOrder = stretchesOrder
      .map((element) => {
        return itens.includes(element) ? null : element;
      })
      .filter((element) => element !== null);

    newStretchesOrder.splice(1, 0, [...itens]);
    setValue('stretchesOrder', newStretchesOrder);
  };

  const groupWorkout = (itens) => {
    const workoutOrder = [...values.mediaOrder];
    const newWorkoutOrder = workoutOrder
      .map((element) => {
        return itens.includes(element) ? null : element;
      })
      .filter((element) => element !== null);

    newWorkoutOrder.splice(1, 0, [...itens]);
    setValue('mediaOrder', newWorkoutOrder);
  };

  const ungroupWorkout = (idsToUngroup) => {
    const workoutOrder = [...values.mediaOrder];
    const newWorkoutOrder = workoutOrder.flatMap((element) => {
      if (Array.isArray(element)) {
        const desagrupados = element.filter((subElement) => idsToUngroup.includes(subElement));
        const restantes = element.filter((subElement) => !idsToUngroup.includes(subElement));
        if (desagrupados.length > 0) {
          return restantes.length > 0 ? [...desagrupados, restantes] : desagrupados;
        }
        return [element];
      }
      return element;
    });
    setValue('mediaOrder', newWorkoutOrder);
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
    const idsStretches = stretches.map((item) => item.id);
    const stretchesOrder = [...values.stretchesOrder];
    idsStretches.forEach((item) => {
      const isDuplicate = stretchesOrder.some((element) =>
        Array.isArray(element) && Array.isArray(item)
          ? JSON.stringify(element) === JSON.stringify(item)
          : element === item,
      );

      if (!isDuplicate) {
        stretchesOrder.push(item);
      }
    });
    setValue('stretchesOrder', stretchesOrder);
  };

  const orderHeating = (heatings) => {
    const idsHeatings = heatings.map((item) => item.id);
    const heatingOrder = [...values.heatingOrder];
    idsHeatings.forEach((item) => {
      const isDuplicate = heatingOrder.some((element) =>
        Array.isArray(element) && Array.isArray(item)
          ? JSON.stringify(element) === JSON.stringify(item)
          : element === item,
      );

      if (!isDuplicate) {
        heatingOrder.push(item);
      }
    });
    setValue('heatingOrder', heatingOrder);
  };

  const orderWorkout = (workout) => {
    const idsWorkout = workout.map((item) => item.id);
    const workoutOrder = [...values.mediaOrder];
    idsWorkout.forEach((item) => {
      const isDuplicate = workoutOrder.some((element) =>
        Array.isArray(element) && Array.isArray(item)
          ? JSON.stringify(element) === JSON.stringify(item)
          : element === item,
      );

      if (!isDuplicate) {
        workoutOrder.push(item);
      }
    });
    setValue('mediaOrder', workoutOrder);
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
                  <Accordion
                    aria-controls="heating-medias-content"
                    id="heating-medias-header"
                    defaultExpanded
                    sx={{
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography variant="subtitle1">Vídeos de aquecimento</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack py={2}>
                        <HeatingFind
                          handleSaveHeatings={handleSaveHeatings}
                          heatingMedias={filterHeating(values.medias)}
                        />
                      </Stack>
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
                            <WorkoutView
                              medias={filterHeating(values.medias)}
                              mediaOrder={values.heatingOrder}
                              handleSaveExerciseInfo={handleSaveExerciseInfo}
                              exerciseInfo={values.exerciseInfo}
                              groupWorkout={groupHeatings}
                              ungroupWorkout={ungroupHeatings}
                              handleRemoveWorkout={handleRemoveHeatings}
                              handleReorderWorkout={handleReorderHeatings}
                            />
                          </Box>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Box>
                {(!program?.type || program?.type === 1) && (
                  <Accordion
                    aria-controls="stretches-medias-content"
                    id="stretches-medias-header"
                    defaultExpanded
                    elevation={0}
                    sx={{
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography variant="subtitle1">Vídeos de alongamentos</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack py={2}>
                        <StrechesFind
                          handleSaveStretches={handleSaveStretches}
                          strechesMedias={filterStretches(values.medias)}
                        />
                      </Stack>
                      <Stack>
                        {filterStretches(values.medias).length > 0 && (
                          <Box
                            sx={{
                              overflowY: 'auto',
                              maxHeight: '40vh',
                              display: 'flex',
                              flexGrow: 1,
                              flexDirection: 'column',
                            }}
                          >
                            <WorkoutView
                              medias={filterStretches(values.medias)}
                              mediaOrder={values.stretchesOrder}
                              handleSaveExerciseInfo={handleSaveExerciseInfo}
                              exerciseInfo={values.exerciseInfo}
                              groupWorkout={groupStretches}
                              ungroupWorkout={ungroupHeatings}
                              handleRemoveWorkout={handleRemoveStretches}
                              handleReorderWorkout={handleReorderStretches}
                            />
                          </Box>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                  // <Box
                  //   component="fieldset"
                  //   sx={{
                  //     borderWidth: '2px',
                  //     borderStyle: 'groove',
                  //     borderColor: 'rgba(145, 158, 171, 0.2)',
                  //     borderRadius: '8px',
                  //   }}
                  // >
                  //   <legend>
                  //     <Typography fontSize={'12px'} color={'#919EAB'}>
                  //       Alongamentos ativos e educativos de corrida
                  //     </Typography>
                  //   </legend>
                  //   {filterStretches(values.medias).length > 0 && (
                  //     <Box>
                  //       <Scrollbar sx={{ height: 320 }}>
                  //         <StretchesView
                  //           medias={filterStretches(values.medias)}
                  //           handleReorderMedias={handleReorderStretches}
                  //           mediaOrder={values.stretchesOrder}
                  //           handleSaveExerciseInfo={handleSaveExerciseInfo}
                  //           exerciseInfo={values.exerciseInfo}
                  //         />
                  //       </Scrollbar>
                  //     </Box>
                  //   )}
                  //   <Stack>
                  //     <Button
                  //       size="small"
                  //       color="primary"
                  //       startIcon={<Iconify icon="mingcute:add-line" />}
                  //       sx={{ flexShrink: 0 }}
                  //       onClick={() => {
                  //         listMedias.onFalse();
                  //         isStretches.onTrue();
                  //         isHeating.onFalse();
                  //       }}
                  //     >
                  //       Selecionar Alongamentos
                  //     </Button>
                  //   </Stack>
                  // </Box>
                )}

                <RHFTextField name="description" label="Parte principal" multiline rows={6} />
                {program?.type === 2 && (
                  <Accordion
                    aria-controls="stretches-medias-content"
                    id="stretches-medias-header"
                    defaultExpanded
                    elevation={0}
                    sx={{
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography variant="subtitle1">Vídeos dos exercícios</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack py={2}>
                        <WorkoutFind
                          handleSaveWorkout={handleSaveMedias}
                          workoutMedias={filterMedias(values.medias)}
                          tags={values.tags}
                        />
                      </Stack>
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
                            <WorkoutView
                              medias={filterMedias(values.medias)}
                              mediaOrder={values.mediaOrder}
                              handleSaveExerciseInfo={handleSaveExerciseInfo}
                              exerciseInfo={values.exerciseInfo}
                              groupWorkout={groupWorkout}
                              ungroupWorkout={ungroupWorkout}
                              handleRemoveWorkout={handleRemoveWorkout}
                              handleReorderWorkout={handleReorderMedias}
                            />
                          </Box>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )}
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
    </>
  );
}

TrainingForm.propTypes = {
  handleCancel: PropTypes.func,
};
