import { yupResolver } from '@hookform/resolvers/yup';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import useFinishedTraining from 'src/hooks/use-finished-training';
import * as Yup from 'yup';

export default function FinishedForm({ training, editForm, onCancel }) {
  const { onUpdateFinishedTraining, updateFinishedTrainingStatus } = useFinishedTraining();

  const NewTrainingSchema = Yup.object().shape({
    distance: Yup.number().required('Distância obrigatório'),
    duration: Yup.string().required('Duração obrigatório'),
    rpe: Yup.string().required('RPE obrigatório'),
    trimp: Yup.string().required('Trimp obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      distance: training?.distance || null,
      duration: training?.duration || null,
      rpe: training?.rpe || null,
      trimp: training?.trimp || null,
      link: training?.link || null,
      trainingId: training?.trainingid || null,
      id: training?.finishedid || null,
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(NewTrainingSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = useCallback(async (data) => {
    try {
      const payload = Object.assign({}, data);
      payload.duration = Number(payload.duration);
      payload.rpe = Number(payload.rpe);
      onUpdateFinishedTraining(payload);
    } catch (err) {
      enqueueSnackbar(`Erro ao salvar: ${err}`, {
        autoHideDuration: 8000,
        variant: 'error',
      });
    }
  }, []);

  useEffect(() => {
    if (updateFinishedTrainingStatus.error) {
      enqueueSnackbar(`Erro ao salvar`, {
        autoHideDuration: 8000,
        variant: 'error',
      });
    }
  }, [updateFinishedTrainingStatus]);

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

  const handleCancel = () => {
    onCancel();
    reset(training);
  };

  const handleOpenLink = () => {
    if (training.link.length > 0) {
      window.open(training.link, '_blank', 'noreferrer');
    }
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <>
          <Box rowGap={3} columnGap={2} display="grid" pt={2}>
            <RHFTextField
              name="distance"
              label="Distância em metros *"
              variant="standard"
              type="number"
              disabled={!editForm}
            />
            <RHFTextField
              name="duration"
              label="Tempo total em minutos *"
              variant="standard"
              disabled={!editForm}
            />
            <RHFTextField
              name="pace"
              label="Pace médio da sessão"
              variant="standard"
              disabled={!editForm}
            />
            <RHFTextField name="rpe" label="RPE *" variant="standard" disabled={!editForm} />
            <RHFTextField name="trimp" label="Trimp *" variant="standard" disabled={!editForm} />
            <RHFTextField
              name="link"
              label="Link"
              variant="standard"
              disabled={!editForm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleOpenLink}>
                      {<OpenInBrowserIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Stack pt={2} sx={{ width: '100%' }} spacing={2}>
            {renderErros}
          </Stack>
          {editForm && (
            <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
                Editar
              </LoadingButton>
              <Button fullWidth variant="outlined" color="warning" onClick={handleCancel}>
                Cancelar
              </Button>
            </Stack>
          )}
        </>
      </FormProvider>
    </>
  );
}
