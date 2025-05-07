import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton } from '@mui/material';
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
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTablePvContext } from 'src/components/drawer-table-pv';
import ExertionZone from 'src/components/exertion-zone/exertion-zone';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import { MediaSelectHeating, MediaSelectStreches } from 'src/components/media-select';
import MediaSelectWorkout from 'src/components/media-select/media-select-workout';
import { useBoolean } from 'src/hooks/use-boolean';
import { _tags } from 'src/utils/tags';
import { trainingModules } from 'src/utils/training-modules';
import * as Yup from 'yup';

import WorkoutView from './workout/workout-view';

const stretchTags = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos'];
const heatingTags = ['Aquecimento'];
const excludedTags = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos', 'Aquecimento'];

export default function TrainingForm({
  training,
  onUpdateTraining,
  onCreateTraining,
  program,
  handleSuccessCreate,
  onClose,
}) {
  const { id, type } = program;
  const tablePv = useTablePvContext();
  const listMedias = useBoolean();
  const isStretches = useBoolean();
  const isHeating = useBoolean();
  const exertionZone = useBoolean();
  const drawerHeating = useBoolean();
  const drawerWorkout = useBoolean();
  const drawerStreches = useBoolean();

  const toggleTags = useBoolean(true);

  const [loading, setLoading] = useState(false);

  const NewTrainingRunnerSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });

  const NewTraininGymSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
    displayOrder: Yup.string().required('Campo obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      programId: training?.programId || id,
      name: training?.name || '',
      subtitle: training?.subtitle || '',
      heating: training?.heating || '',
      recovery: training?.recovery || '',
      description: training?.description || '',
      coverPath: training?.coverPath || '',
      datePublished: training?.datePublished || null,
      workoutDateOther: training?.workoutDateOther || null,
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
      displayOrder: training?.displayOrder,
      running: training?.running,
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(type === 2 ? NewTraininGymSchema : NewTrainingRunnerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const newData = Object.assign({}, data);
        const mediasID = newData.medias.map((item) => item.id);
        const uniqueMedias = [...new Set(mediasID)];
        if (training) {
          const payload = newData;
          payload.medias = uniqueMedias;
          delete payload.id;
          // delete payload.programId;
          await onUpdateTraining(payload, training.id);
          reset({ ...defaultValues });
          enqueueSnackbar('Treino atualizado com sucesso!', {
            autoHideDuration: 8000,
            variant: 'success',
          });
          setLoading(false);
          handleSuccessCreate();
        } else {
          delete newData.medias;
          const payload = {
            workout: newData,
            medias: uniqueMedias,
          };
          if (!type || type === 1) {
            payload.workout.running = true;
          }
          await onCreateTraining(payload);
          enqueueSnackbar('Treino criado com sucesso!', {
            autoHideDuration: 8000,
            variant: 'success',
          });
          setLoading(false);
          handleSuccessCreate();
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde!', {
          autoHideDuration: 8000,
          variant: 'error',
        });
        handleSuccessCreate();
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

    const newMedias = [...new Set([...medias, ...heatings])];
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

  const handleRemoveStreches = (removed) => {
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

  const orderStretches = (stretches) => {
    const idsStretches = stretches.map((item) => item.id);
    const stretchesOrder = [...values.stretchesOrder];
    const isDuplicate = (item) => {
      return stretchesOrder.some((element) =>
        Array.isArray(element) ? element.includes(item) : element === item,
      );
    };
    idsStretches.forEach((item) => {
      if (!isDuplicate(item)) {
        stretchesOrder.push(item);
      }
    });
    setValue('stretchesOrder', stretchesOrder);
  };

  const orderHeating = (heatings) => {
    const idsHeatings = heatings.map((item) => item.id);
    const heatingOrder = [...values.heatingOrder];
    const isDuplicate = (item) => {
      return heatingOrder.some((element) =>
        Array.isArray(element) ? element.includes(item) : element === item,
      );
    };
    idsHeatings.forEach((item) => {
      if (!isDuplicate(item)) {
        heatingOrder.push(item);
      }
    });
    setValue('heatingOrder', heatingOrder);
  };

  const orderWorkout = (workout) => {
    const idsWorkout = workout.map((item) => item.id);
    const workoutOrder = [...values.mediaOrder];
    const isDuplicate = (item) => {
      return workoutOrder.some((element) =>
        Array.isArray(element) ? element.includes(item) : element === item,
      );
    };
    idsWorkout.forEach((item) => {
      if (!isDuplicate(item)) {
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

  const filterHeatingFind = (medias) => {
    const flattenOrder = values.heatingOrder.flat(Infinity); // Ensures deeply nested arrays are flattened
    if (flattenOrder.length > 0) {
      const filtered = medias?.filter((item) => {
        return flattenOrder.includes(item.id);
      });
      return filtered;
    }
    return [];
  };

  const filterStretchesFind = (medias) => {
    const flattenOrder = values.stretchesOrder.flat(Infinity); // Ensures deeply nested arrays are flattened
    if (flattenOrder.length > 0) {
      const filtered = medias?.filter((item) => {
        return flattenOrder.includes(item.id);
      });
      return filtered;
    }
    return [];
  };

  const filterWorkoutFind = (medias) => {
    const flattenOrder = values.mediaOrder.flat(Infinity); // Ensures deeply nested arrays are flattened
    if (flattenOrder.length > 0) {
      const filtered = medias?.filter((item) => {
        return flattenOrder.includes(item.id);
      });
      return filtered;
    }
    return [];
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
  const availableTags = _tags.filter((tag) => tag !== 'Aquecimento');
  const renderTags = (
    <Stack spacing={1.5}>
      {toggleTags.value && (
        <Autocomplete
          multiple
          freeSolo
          options={availableTags}
          getOptionLabel={(option) => option}
          defaultValue={availableTags.slice(0, 3)}
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
      setValue('workoutDateOther', null);
    }
  }, [values.datePublished]);

  useEffect(() => {
    if (type === 2) {
      setValue('name', 'FORCA');
    }
  }, [type]);

  return (
    <>
      <Box sx={{ height: 'auto' }}>
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
        {(!type || type === 1) && (
          <Stack>
            <Button variant="outlined" sx={{ width: 'fit-content' }} onClick={tablePv.onToggle}>
              {!tablePv.open ? 'Exibir tabela Pv' : 'Ocultas tabela Pv'}
            </Button>
            <Stack spacing={1.5} direction="row" mt={3}>
              <Typography>Zona de esforço</Typography>
              <IconButton sx={{ padding: 0 }} onClick={exertionZone.onTrue}>
                <Iconify icon="eva:info-outline" />
              </IconButton>
            </Stack>
          </Stack>
        )}

        <Grid container spacing={6}>
          <Grid xs={12} md={12}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <>
                <Box rowGap={3} columnGap={2} display="grid" pt={2}>
                  {type === 2 ? (
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
                  {type === 2 && (
                    <Stack>
                      <RHFTextField
                        name="displayOrder"
                        label="Ordem de exibição no app do aluno"
                        type="number"
                      />
                    </Stack>
                  )}

                  <Stack>
                    <RHFTextField name="subtitle" label="Subtítulo" />
                  </Stack>
                  {type === 2 && <>{renderTags}</>}
                  {(!type || type === 1) && (
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
                          name="workoutDateOther"
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
                  )}
                  <Box>
                    <RHFTextField name="heating" label="Aquecimento" multiline rows={3} />
                    {type === 2 && (
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
                        <AccordionSummary
                          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                        >
                          <Typography variant="subtitle1">Vídeos de aquecimento</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack pb={2} sx={{ width: 'fit-content' }}>
                            {/* <HeatingFind
                              handleSaveHeatings={handleSaveHeatings}
                              heatingMedias={filterHeatingFind(values.medias)}
                            /> */}
                            <Button variant="outlined" onClick={drawerHeating.onTrue}>
                              Selecione os vídeos de aquecimento
                            </Button>
                          </Stack>
                          <Stack>
                            {values.heatingOrder.length > 0 && (
                              <Box
                                sx={{
                                  overflowY: 'auto',
                                  height: 'auto',
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
                    )}
                  </Box>
                  {(!type || type === 1) && (
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
                        <Typography variant="subtitle1">
                          Alongamentos ativos e educativos de corrida
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack pb={2} sx={{ width: 'fit-content' }}>
                          {/* <StrechesFind
                            handleSaveStretches={handleSaveStretches}
                            strechesMedias={filterStretchesFind(values.medias)}
                          /> */}
                          <Button variant="outlined" onClick={drawerStreches.onTrue}>
                            Selecione vídeos de alongamentos ativos e educativos de corrida
                          </Button>
                        </Stack>
                        <Stack>
                          {values.stretchesOrder.length > 0 && (
                            <Box
                              sx={{
                                overflowY: 'auto',
                                height: 'auto',
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
                                ungroupWorkout={ungroupStretches}
                                handleRemoveWorkout={handleRemoveStreches}
                                handleReorderWorkout={handleReorderStretches}
                              />
                            </Box>
                          )}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  <RHFTextField name="description" label="Parte principal" multiline rows={6} />
                  {type === 2 && (
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
                        <Typography variant="subtitle1">Vídeos da parte principal</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack pb={2} sx={{ width: 'fit-content' }}>
                          {/* <WorkoutFind
                            handleSaveWorkout={handleSaveMedias}
                            workoutMedias={filterWorkoutFind(values.medias)}
                            tags={values.tags}
                          /> */}
                          <Button variant="outlined" onClick={drawerWorkout.onTrue}>
                            Selecione vídeos da parte principal
                          </Button>
                        </Stack>
                        <Stack>
                          {values.mediaOrder.length > 0 && (
                            <Box
                              sx={{
                                overflowY: 'auto',
                                height: 'auto',
                                display: 'flex',
                                flexGrow: 1,
                                flexDirection: 'column',
                              }}
                            >
                              <WorkoutView
                                medias={filterWorkoutFind(values.medias)}
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
                  <LoadingButton type="submit" variant="contained" loading={loading} fullWidth>
                    Salvar
                  </LoadingButton>
                  <Button fullWidth variant="outlined" color="warning" onClick={onClose}>
                    Cancelar
                  </Button>
                </Stack>
              </>
            </FormProvider>
          </Grid>
        </Grid>
        {exertionZone.value && (
          <ExertionZone
            open={exertionZone.value}
            onClose={exertionZone.onFalse}
            pv={program.pv}
            pace={program.pace}
            vla={program.vla}
            paceVla={program.paceVla}
            vlan={program.vlan}
            paceVlan={program.paceVlan}
          />
        )}
      </Box>
      {drawerHeating.value && (
        <MediaSelectHeating
          drawer={drawerHeating}
          handleSaveHeatings={handleSaveHeatings}
          heatingMedias={filterHeatingFind(values.medias)}
          handleRemoveHeatings={handleRemoveHeatings}
          workoutMedias={filterWorkoutFind(values.medias)}
        />
      )}

      {drawerStreches.value && (
        <MediaSelectStreches
          drawer={drawerStreches}
          handleSaveStreches={handleSaveStretches}
          strechesMedias={filterStretchesFind(values.medias)}
          handleRemoveStreches={handleRemoveStreches}
        />
      )}

      {drawerWorkout.value && (
        <MediaSelectWorkout
          drawer={drawerWorkout}
          handleSaveWorkout={handleSaveMedias}
          workoutMedias={filterWorkoutFind(values.medias)}
          handleRemoveWorkout={handleRemoveWorkout}
          tags={values.tags}
          heatingMedias={filterHeatingFind(values.medias)}
        />
      )}
    </>
  );
}

TrainingForm.propTypes = {
  handleCancel: PropTypes.func,
};
