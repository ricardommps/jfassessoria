import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';
export default function TrainingNewEditForm({ currentTraining, currentProgram, onCloseForm }) {
  const NewTrainingSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentTraining?.id || null,
      program_id: currentTraining?.program_id || currentProgram.id,
      name: currentTraining?.name || '',
      description: currentTraining?.description || '',
      cover_path: currentTraining?.cover_path || '',
      cloned_from: currentTraining?.cloned_from || 0,
      datePublished: currentTraining?.datePublished || '',
      published: currentTraining?.published || 0,
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(NewTrainingSchema),
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

  const handleChangePublished = useCallback(
    (event) => {
      setValue('published', event.target.checked);
    },
    [setValue],
  );
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <>
        <Box rowGap={3} columnGap={2} display="grid" pt={2}>
          <RHFTextField name="name" label="Titulo *" variant="standard" />
          <DatePicker
            value={dayjs(values?.datePublished).toDate() || null}
            label="Data do treino"
            slotProps={{
              textField: {
                variant: 'standard',
                error: false,
              },
            }}
          />
          <RHFTextField name="description" label="Description" multiline rows={3} />
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
              labelPlacement="bottom"
            />
          </Stack>
        </Box>
        <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
            Salvar
          </LoadingButton>
          <Button fullWidth variant="outlined" color="warning" onClick={onCloseForm}>
            Cancelar
          </Button>
        </Stack>
      </>
    </FormProvider>
  );
}

TrainingNewEditForm.propTypes = {
  currentProgram: PropTypes.object,
  currentTraining: PropTypes.object,
  onCloseForm: PropTypes.func,
};
