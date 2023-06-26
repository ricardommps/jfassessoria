import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ButtonBanner } from 'src/components/button-banner/button-banner';
import { OverlayBox } from 'src/components/button-banner/styles';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';

import CustomizedAccordions from '../components/customized-accordions';
import { ImgCover } from './styles';

const CHARACTER_LIMIT_VIDEO_URL = 200;
const CHARACTER_LIMIT_SERIES = 28;
const CHARACTER_LIMIT_WEIGHT = 100;
const CHARACTER_LIMIT_INTERVALS = 3;

export function WorkoutNewEditForm({ currentWorkout, onClose, training_id }) {
  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentWorkout?.name || '',
      name: currentWorkout?.name || '',
      series_repetitions: currentWorkout?.series_repetitions || '',
      intervals: currentWorkout?.intervals || '',
      weight_suggestion: currentWorkout?.weight_suggestion || '',
      video_url: currentWorkout?.video_url || '',
      cover_path: currentWorkout?.cover_path || '',
      description: currentWorkout?.description || '',
      training_id: currentWorkout?.training_id || training_id,
      serie_id: currentWorkout?.serie_id || '',
      library_workout_id: currentWorkout?.library_workout_id || '',
      sort: currentWorkout?.sort || '',
      translations: currentWorkout?.translations || '',
      created_at: currentWorkout?.created_at || '',
      updated_at: currentWorkout?.updated_at || '',
      cover_url:
        currentWorkout?.cover_url || 'https://supertreinosapp.com/img/EXERCICIO-BANNER-PADRAO.jpg',
      serie_check: currentWorkout?.serie_check || '',
    }),
    [currentWorkout],
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
      onClose();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box rowGap={3} columnGap={2} display="grid">
        <RHFTextField name="name" label="Titulo *" variant="standard" />
        <Typography>Imagem miniatura do Exercício</Typography>
        <Stack flexDirection={'row'} spacing={5}>
          {values.name.length === 0 && (
            <OverlayBox height="164px">
              {' '}
              Antes de enviar um banner, adicione um TÍTULO ao Exercício.{' '}
            </OverlayBox>
          )}
          <ImgCover src={values.cover_url} />
          <ButtonBanner>Escolher imagem</ButtonBanner>
        </Stack>
      </Box>
      <Box pt={2}>
        <CustomizedAccordions>
          <Box rowGap={3} columnGap={2} display="grid">
            <RHFTextField
              variant="standard"
              name="video_url"
              label="Endereço do vídeo"
              inputProps={{
                maxLength: CHARACTER_LIMIT_VIDEO_URL,
              }}
              helperText={
                <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Utilize vídeos do Youtube ou Vimeo</span>
                  {true && (
                    <span>{`${values.video_url.length} / ${CHARACTER_LIMIT_VIDEO_URL}`}</span>
                  )}
                </Box>
              }
            />
            <RHFTextField name="description" label="Description" multiline rows={5} />
            <RHFTextField
              variant="standard"
              name="series_repetitions"
              label="Séries x Repetições"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                maxLength: CHARACTER_LIMIT_SERIES,
              }}
              helperText={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span />
                  {true && (
                    <span>{`${values.series_repetitions.length} / ${CHARACTER_LIMIT_SERIES}`}</span>
                  )}
                </Box>
              }
            />
            <RHFTextField
              variant="standard"
              name="weight_suggestion"
              label="Sugestão de carga (opcional)"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                maxLength: CHARACTER_LIMIT_WEIGHT,
              }}
              helperText={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span />
                  {true && (
                    <span>{`${values.series_repetitions.length} / ${CHARACTER_LIMIT_WEIGHT}`}</span>
                  )}
                </Box>
              }
            />
            <RHFTextField
              variant="standard"
              name="intervals"
              type="number"
              label="Intervalo(segundos)"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                maxLength: CHARACTER_LIMIT_INTERVALS,
              }}
              helperText={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span />
                  {true && (
                    <span>{`${values.intervals.length} / ${CHARACTER_LIMIT_INTERVALS}`}</span>
                  )}
                </Box>
              }
            />
          </Box>
        </CustomizedAccordions>
      </Box>
      <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
          Salvar
        </LoadingButton>
        <Button fullWidth variant="outlined" color="warning" onClick={onClose}>
          Cancelar
        </Button>
      </Stack>
    </FormProvider>
  );
}

WorkoutNewEditForm.propTypes = {
  currentWorkout: PropTypes.object,
  onClose: PropTypes.func,
  training_id: PropTypes.number,
};
