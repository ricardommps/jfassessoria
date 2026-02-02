import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, IconButton, InputAdornment, TextField } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTablePvContext } from 'src/components/drawer-table-pv';
import ExertionZone from 'src/components/exertion-zone/exertion-zone';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import LoadingProgress from 'src/components/loading-progress';
import { useBoolean } from 'src/hooks/use-boolean';
import { trainingModules } from 'src/utils/training-modules';
import * as Yup from 'yup';

import SelectMedia from './select-media';
import WorkoutViewApp from './workout-view-app';

export default function TrainingFormApp({
  workout,
  onUpdateWorkouts,
  onCreateWorkouts,
  program,
  handleSuccessCreate,
  onClose,
  setLoadingForm,
  loadingForm,
}) {
  const { id, type } = program;
  const tablePv = useTablePvContext();
  const exertionZone = useBoolean();

  // Mudança principal: usar estado para controlar qual drawer está aberto
  const [openDrawerIndex, setOpenDrawerIndex] = useState(null);

  const NewTrainingRunnerSchema = Yup.object().shape({
    title: Yup.string().required('Titulo obrigatório'),
  });

  const NewTraininGymSchema = Yup.object().shape({
    title: Yup.string().required('Titulo obrigatório'),
    displayOrder: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        // Se for string vazia, converte para null
        if (originalValue === '' || originalValue === null || originalValue === undefined) {
          return null;
        }
        // Converte para número
        return Number(originalValue);
      })
      .typeError('Deve ser um número válido')
      .positive('Deve ser um número positivo')
      .integer('Deve ser um número inteiro')
      .required('Campo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      programId: workout?.programId || id,
      title: workout?.title || '',
      subtitle: workout?.subtitle || '',
      distance: workout?.distance || '',
      link: workout?.link || '',
      heating: workout?.heating || '',
      recovery: workout?.recovery || '',
      description: workout?.description || '',
      datePublished: workout?.datePublished || null,
      workoutDateOther: workout?.workoutDateOther || null,
      published: workout?.published || false,
      hide: workout?.hide || false,
      finished: workout?.finished || false,
      // Corrigido: converter para number ou null
      displayOrder: workout?.displayOrder ? Number(workout.displayOrder) : null,
      running: workout?.running || (type === 1 ? true : false),
      workoutItems: workout?.workoutItems || [],
      musclesWorked: workout?.musclesWorked || true,
    }),
    [workout, id, type], // Adicione as dependências
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workoutItems',
  });

  const handleAdd = () => {
    append({
      _id: values.workoutItems.length + 1,
      category: '',
      description: '',
      medias: [],
      mediaOrder: [],
      mediaInfo: [],
      drawerStreches: false,
      isWorkoutLoad: false,
    });
  };

  const handleRemove = (index) => {
    remove(index);

    // Atualiza os _id dos itens restantes
    const updatedItems = values.workoutItems
      .filter((_, i) => i !== index) // remove o item
      .map((item, i) => ({ ...item, _id: i + 1 })); // reatribui _id sequencial

    setValue('workoutItems', updatedItems);
  };
  // Funções para controlar a abertura/fechamento do drawer específico
  const handleOpenDrawer = (index) => {
    setOpenDrawerIndex(index);
  };

  const handleCloseDrawer = () => {
    setOpenDrawerIndex(null);
  };

  const groupWorkout = (itens, index) => {
    const itensAsString = itens.map(String);
    const currentMediaOrder = values.workoutItems?.[index]?.mediaOrder || [];

    // Filtra elementos, convertendo tudo para string
    const filteredOrder = currentMediaOrder.filter((element) => {
      if (Array.isArray(element)) {
        return !element.some((id) => itensAsString.includes(String(id)));
      }
      return !itensAsString.includes(String(element));
    });

    // Encontra índice de inserção: primeiro item encontrado
    const insertIndex = currentMediaOrder.findIndex((element) => {
      if (Array.isArray(element)) {
        return element.some((id) => itensAsString.includes(String(id)));
      }
      return itensAsString.includes(String(element));
    });

    const newWorkoutOrder = [...filteredOrder];
    newWorkoutOrder.splice(insertIndex >= 0 ? insertIndex : 0, 0, itensAsString);

    setValue(`workoutItems[${index}].mediaOrder`, newWorkoutOrder);
  };

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoadingForm(true);

        // Função para limpar dados antes do envio
        const cleanData = (obj) => {
          const cleaned = { ...obj };

          // Converter displayOrder para number ou null
          if (cleaned.displayOrder === '' || cleaned.displayOrder === undefined) {
            cleaned.displayOrder = null;
          } else if (cleaned.displayOrder !== null) {
            cleaned.displayOrder = Number(cleaned.displayOrder);
          }

          // Limpar workoutItems
          if (cleaned.workoutItems) {
            cleaned.workoutItems = cleaned.workoutItems.map((item) => ({
              ...item,
              isWorkoutLoad: Boolean(item.isWorkoutLoad),
            }));
          }

          return cleaned;
        };

        const newData = cleanData(data);

        if (workout) {
          await onUpdateWorkouts(newData, workout.id);
          enqueueSnackbar('Treino atualizado com sucesso!', {
            autoHideDuration: 8000,
            variant: 'success',
          });
        } else {
          await onCreateWorkouts(newData);
          enqueueSnackbar('Treino criado com sucesso!', {
            autoHideDuration: 8000,
            variant: 'success',
          });
        }
        setLoadingForm(false);
        handleSuccessCreate();
        reset({ ...defaultValues });
      } catch (error) {
        console.error(error);
        setLoadingForm(false);
      }
    },
    [onCreateWorkouts, onUpdateWorkouts, reset, workout, defaultValues, handleSuccessCreate],
  );

  const handleChangePublished = useCallback(
    (event) => {
      setValue('published', event.target.checked);
    },
    [setValue],
  );

  const handleChangeMusclesWorked = useCallback(
    (event) => {
      setValue('musclesWorked', event.target.checked);
    },
    [setValue],
  );

  const handleChangeIsWorkoutLoad = useCallback(
    (event, index) => {
      setValue(`workoutItems[${index}].isWorkoutLoad`, event.target.checked);
    },
    [setValue],
  );

  const handleSaveMediasInfo = (mediaInfo, index) => {
    const existingMediasInfo = values.workoutItems?.[index]?.mediaInfo || [];

    const currentIndex = existingMediasInfo.findIndex((item) => item.mediaId === mediaInfo.mediaId);

    const newMediasInfo = [...existingMediasInfo];
    if (currentIndex === -1) {
      newMediasInfo.push(mediaInfo);
    } else {
      newMediasInfo[currentIndex] = mediaInfo;
    }
    setValue(`workoutItems[${index}].mediaInfo`, newMediasInfo);
  };
  const handleSaveMedias = (mediasSelected, index) => {
    const existingMedias = values.workoutItems?.[index]?.medias || [];
    const existingMediaOrder = values.workoutItems?.[index]?.mediaOrder || [];

    const selectedIds = new Set(mediasSelected.map((media) => String(media.id)));

    const existingIds = new Set();
    existingMedias.forEach((mediaGroup) => {
      if (Array.isArray(mediaGroup)) {
        mediaGroup.forEach((media) => {
          if (media && media.id) {
            existingIds.add(String(media.id));
          }
        });
      }
    });
    const newMediasToAdd = mediasSelected.filter((media) => !existingIds.has(String(media.id)));
    const idsToRemove = new Set();
    existingIds.forEach((id) => {
      if (!selectedIds.has(id)) {
        idsToRemove.add(id);
      }
    });
    const filteredMedias = existingMedias
      .map((mediaGroup) => {
        if (Array.isArray(mediaGroup)) {
          return mediaGroup.filter(
            (media) => media && media.id && !idsToRemove.has(String(media.id)),
          );
        }
        return mediaGroup;
      })
      .filter((mediaGroup) => Array.isArray(mediaGroup) && mediaGroup.length > 0);

    // Adicionar as novas medias (cada uma em seu próprio array)
    const formattedNewMedias = newMediasToAdd.map((media) => [media]);
    const newMedias = [...filteredMedias, ...formattedNewMedias];

    const processMediaOrder = (orderItem) => {
      if (Array.isArray(orderItem)) {
        const filteredGroup = orderItem.filter((id) => !idsToRemove.has(String(id)));
        if (filteredGroup.length === 1) {
          return filteredGroup[0];
        }
        if (filteredGroup.length > 1) {
          return filteredGroup;
        }
        return null;
      } else {
        return !idsToRemove.has(String(orderItem)) ? orderItem : null;
      }
    };

    const filteredMediaOrder = existingMediaOrder
      .map(processMediaOrder)
      .filter((item) => item !== null);

    const newMediaIds = newMediasToAdd.map((media) => String(media.id));
    const mediaOrder = [...filteredMediaOrder, ...newMediaIds];

    setValue(`workoutItems[${index}].medias`, newMedias);
    setValue(`workoutItems[${index}].mediaOrder`, mediaOrder);
  };

  const handleRemoveMedia = (mediaIdToRemove, index) => {
    const existingMedias = values.workoutItems?.[index]?.medias || [];
    const existingMediaOrder = values.workoutItems?.[index]?.mediaOrder || [];

    const mediaIdString = String(mediaIdToRemove);

    // Remove da estrutura de medias (array de arrays)
    const filteredMedias = existingMedias
      .map((mediaGroup) => {
        if (Array.isArray(mediaGroup)) {
          // Filtra o grupo removendo a mídia com o ID especificado
          return mediaGroup.filter(
            (media) => media && media.id && String(media.id) !== mediaIdString,
          );
        }
        return mediaGroup;
      })
      // Remove grupos vazios após a filtragem
      .filter((mediaGroup) => {
        if (Array.isArray(mediaGroup)) {
          return mediaGroup.length > 0;
        }
        return true; // Mantém itens que não são arrays
      });

    // Remove do mediaOrder
    const processMediaOrder = (orderItem) => {
      if (Array.isArray(orderItem)) {
        // Se é um array (grupo), filtra removendo o ID
        const filteredGroup = orderItem.filter((id) => String(id) !== mediaIdString);

        // Se sobrou apenas 1 item, retorna como item individual
        if (filteredGroup.length === 1) {
          return filteredGroup[0];
        }
        // Se sobrou mais de 1, mantém como array
        if (filteredGroup.length > 1) {
          return filteredGroup;
        }
        // Se não sobrou nenhum, retorna null para ser removido
        return null;
      } else {
        // Se é um item individual, verifica se deve ser mantido
        return String(orderItem) !== mediaIdString ? orderItem : null;
      }
    };

    const filteredMediaOrder = existingMediaOrder
      .map(processMediaOrder)
      .filter((item) => item !== null);

    // Atualiza os valores
    setValue(`workoutItems[${index}].medias`, filteredMedias);
    setValue(`workoutItems[${index}].mediaOrder`, filteredMediaOrder);
  };

  const handleReorderWorkout = (newMediaOrder, index) => {
    setValue(`workoutItems[${index}].mediaOrder`, newMediaOrder);
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
      setValue('workoutDateOther', null);
    }
  }, [values.datePublished, setValue]);

  useEffect(() => {
    if (type === 2) {
      setValue('title', 'FORCA');
    }
  }, [type, setValue]);

  useEffect(() => {
    if (workout) {
      reset(defaultValues);
    }
  }, [workout, reset, defaultValues]);

  return (
    <>
      {loadingForm ? (
        <LoadingProgress />
      ) : (
        <Box sx={{ height: 'auto' }}>
          <Stack>
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
              {workout ? 'Editar Treino' : 'Novo Treino'}
            </Typography>
            <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
              {workout
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
                      <RHFSelect name="title" label="Módulo *" variant="standard">
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

                    <Stack alignItems="flex-start" sx={{ mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(values.musclesWorked)}
                            color="primary"
                            onChange={handleChangeMusclesWorked}
                          />
                        }
                        label="Exibir musculaturas trabalhada"
                        labelPlacement="end"
                      />
                    </Stack>

                    {type === 1 && (
                      <>
                        <Controller
                          name="distance"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              label="Distância (km)"
                              type="number"
                              fullWidth
                              inputProps={{
                                step: 0.01,
                                min: 0,
                              }}
                              value={field.value ? field.value / 1000 : ''}
                              onChange={(e) => {
                                const km = Number(e.target.value);
                                field.onChange(isNaN(km) ? null : Math.round(km * 1000));
                              }}
                              error={!!error}
                              helperText={error?.message}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">km</InputAdornment>,
                              }}
                            />
                          )}
                        />
                        <RHFTextField name="link" label="Link" />
                      </>
                    )}

                    <Stack
                      spacing={3}
                      direction={{ xs: 'column', md: 'row' }}
                      alignItems={{ xs: 'flex-end', md: 'center' }}
                    >
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexShrink: 0 }}
                        onClick={handleAdd}
                      >
                        Adicionar categoria
                      </Button>
                    </Stack>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
                        Treinos:
                      </Typography>
                      <Stack
                        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
                        spacing={3}
                      >
                        {fields.map((item, index) => (
                          <Fragment key={item.id}>
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
                                <RHFTextField
                                  onClick={(e) => e.stopPropagation()}
                                  onFocus={(e) => e.stopPropagation()}
                                  name={`workoutItems[${index}].category`}
                                  label="Categoria"
                                  variant="filled"
                                />
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stack alignItems="flex-start" sx={{ mb: 1 }}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={Boolean(values.workoutItems[index]?.isWorkoutLoad)}
                                        color="primary"
                                        onChange={(event) =>
                                          handleChangeIsWorkoutLoad(event, index)
                                        }
                                      />
                                    }
                                    label="Permitir edição de carga"
                                    labelPlacement="end"
                                  />
                                </Stack>
                                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                                  <Stack direction="column" sx={{ width: 1 }} gap={4}>
                                    <RHFTextField
                                      name={`workoutItems[${index}].description`}
                                      label="Observações"
                                      multiline
                                      rows={6}
                                    />
                                    <Stack pb={2} sx={{ width: 'fit-content' }}>
                                      <Button
                                        variant="outlined"
                                        onClick={() => handleOpenDrawer(index)}
                                      >
                                        {`Selecione os vídeos para ${
                                          values?.workoutItems[index].category || 'categoria'
                                        }`}
                                      </Button>
                                    </Stack>
                                    <Stack>
                                      {values?.workoutItems[index]?.medias?.length > 0 && (
                                        <WorkoutViewApp
                                          medias={values?.workoutItems[index]?.medias}
                                          mediaOrder={values?.workoutItems[index]?.mediaOrder}
                                          index={index}
                                          handleReorderWorkout={handleReorderWorkout}
                                          groupWorkout={groupWorkout}
                                          handleSaveMediasInfo={handleSaveMediasInfo}
                                          mediaInfo={values?.workoutItems[index]?.mediaInfo}
                                          onRemoveMedia={handleRemoveMedia}
                                        />
                                      )}
                                    </Stack>
                                  </Stack>

                                  <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                    onClick={() => handleRemove(index)}
                                  >
                                    Remove
                                  </Button>
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                            {/* Mudança principal: renderizar o drawer apenas para o índice correto */}
                            {openDrawerIndex === index && (
                              <SelectMedia
                                open={true}
                                handleSave={handleSaveMedias}
                                mediasSelected={values.workoutItems[index].medias}
                                onClose={handleCloseDrawer}
                                index={index}
                              />
                            )}
                          </Fragment>
                        ))}
                      </Stack>
                    </Box>
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
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={loadingForm}
                      fullWidth
                    >
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
      )}
    </>
  );
}

TrainingFormApp.propTypes = {
  handleCancel: PropTypes.func,
};
