import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
import * as Yup from 'yup';

import VideosForm from './videos-form';
export default function TrainingForm({ handleCancel }) {
  const { training, onUpdateTraining, onCreateTraining } = useTraining();
  const { program } = useProgram();

  const NewTrainingSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      programId: training?.programId || program.id,
      name: training?.name || '',
      description: training?.description || '',
      coverPath: training?.coverPath || '',
      datePublished: training?.datePublished || null,
      published: training?.published || false,
      videos: training?.videos || null,
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        if (training) {
          const payload = Object.assign({}, data);
          delete payload.id;
          delete payload.programId;
          onUpdateTraining(payload, training.id);
          reset({ ...defaultValues });
        } else {
          onCreateTraining(data);
          reset({ ...defaultValues });
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <>
          <Box rowGap={3} columnGap={2} display="grid" pt={2}>
            <RHFTextField name="name" label="Titulo *" variant="standard" />
            <Stack mt={3}>
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
                    }}
                  />
                )}
              />
            </Stack>
            <RHFTextField name="description" label="Description" multiline rows={6} />
            <Stack>
              <VideosForm />
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
    </>
  );
}

TrainingForm.propTypes = {
  handleCancel: PropTypes.func,
};
