import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ButtonBanner } from 'src/components/button-banner/button-banner';
import { OverlayBox } from 'src/components/button-banner/styles';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';

import CustomizedAccordions from '../components/customized-accordions';
import Gallery from '../components/gallery';

const CHARACTER_LIMIT_VIDEO_URL = 200;
const CHARACTER_LIMIT_WEEKS = 2;
const CHARACTER_LIMIT_DAYS_WEEKS = 1;

export default function TrainingNewEditForm({ currentTraining, onClose, program_id }) {
  const [openGallery, setOpenGallery] = useState(false);
  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTraining?.name || '',
      subtitle: currentTraining?.subtitle || '',
      video_url: currentTraining?.video_url || '',
      description: currentTraining?.description || '',
      week_cycle: currentTraining?.week_cycle || 0,
      weeks: currentTraining?.weeks || '',
      days_per_week: currentTraining?.days_per_week || '',
      minutes_per_day: currentTraining?.minutes_per_day || '',
      difficulty_level: currentTraining?.difficulty_level || '',
      program_id: currentTraining?.program_id || program_id,
      sort: currentTraining?.sort || 0,
      pay: currentTraining?.pay || 0,
      published: currentTraining?.published || 0,
      premium: currentTraining?.premium || 0,
      goal: currentTraining?.goal || 0,
      points: currentTraining?.points || 2,
      translations: currentTraining?.translations || '',
      cover_url:
        currentTraining?.cover_url || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg',
      cover_path: currentTraining?.cover_path || '',
    }),
    [currentTraining],
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

  const handleOpenGallery = () => {
    setOpenGallery(true);
  };

  const handleCloseGallery = () => {
    setOpenGallery(false);
  };

  const handleChangePublished = useCallback(
    (event) => {
      setValue('published', event.target.checked);
    },
    [setValue],
  );
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
        <Box rowGap={3} columnGap={2} display="grid">
          <RHFTextField name="name" label="Titulo *" variant="standard" />
          <RHFTextField name="subtitle" label="Subtítulo" variant="standard" />
          <Typography>Imagem miniatura do Treino</Typography>

          <Stack flexDirection={'row'} spacing={5}>
            {values.name.length === 0 && (
              <OverlayBox height="15%">
                {' '}
                Antes de enviar uma miniatura, adicione um TÍTULO ao Treino.{' '}
              </OverlayBox>
            )}

            <Avatar
              alt="Logo"
              src={values.cover_url}
              variant="rounded"
              imgProps={{
                onError: () =>
                  setValue('cover_url', 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'),
              }}
              sx={{
                borderRadius: '16px',
                height: 'auto',
                width: '48%',
              }}
            />
            <ButtonBanner onClick={handleOpenGallery}>Escolher imagem</ButtonBanner>
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
              <RHFTextField name="description" label="Description" multiline rows={3} />
              <RHFTextField
                variant="standard"
                name="weeks"
                label="Semanas"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  maxLength: CHARACTER_LIMIT_WEEKS,
                }}
                helperText={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span />
                    {true && <span>{`1 / ${CHARACTER_LIMIT_WEEKS}`}</span>}
                  </Box>
                }
              />
              <RHFTextField
                variant="standard"
                name="days_per_week"
                label="Dias por semana"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  maxLength: CHARACTER_LIMIT_DAYS_WEEKS,
                }}
                helperText={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span />
                    {true && <span>{`1 / ${CHARACTER_LIMIT_DAYS_WEEKS}`}</span>}
                  </Box>
                }
              />

              <RHFTextField
                variant="standard"
                name="minutes_per_day"
                label="Minutos por dia"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  maxLength: CHARACTER_LIMIT_WEEKS,
                }}
                helperText={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span />
                    {true && <span>{`1 / ${CHARACTER_LIMIT_WEEKS}`}</span>}
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
      <Gallery open={openGallery} onClose={handleCloseGallery} />
    </>
  );
}

TrainingNewEditForm.propTypes = {
  currentTraining: PropTypes.object,
  onClose: PropTypes.func,
  program_id: PropTypes.number,
};
