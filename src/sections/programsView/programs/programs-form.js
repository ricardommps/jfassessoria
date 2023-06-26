import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { goalsData } from 'src/_mock';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';

import CustomizedAccordions from '../components/customized-accordions';
import Gallery from '../components/gallery';

const CHARACTER_LIMIT_VIDEO_URL = 200;
const CHARACTER_LIMIT_WEEKS = 2;
const CHARACTER_LIMIT_DAYS_WEEKS = 1;

const OPTIONS = [
  { value: 'Iniciante', label: 'Iniciante' },
  { value: 'Intermediário', label: 'Intermediário ' },
  { value: 'Avançado', label: 'Avançado' },
  { value: 'Expert', label: 'Expert' },
];

export default function ProgramsNewEditForm({ currentProgram, onGoBack }) {
  const [openGallery, setOpenGallery] = useState(false);
  const { goals } = goalsData;
  const NewProgramSchema = Yup.object().shape({
    name: Yup.string().required('Titulo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProgram?.name || '',
      video_url: currentProgram?.video_url || '',
      cover_url: currentProgram?.cover_url || 'https://supertreinosapp.com/img/free/BASICO.jpg',
      description: currentProgram?.description || '',
      goals: currentProgram?.goals[0]?.name || '',
      difficulty_level: currentProgram?.difficulty_level || '',
      weeks: currentProgram?.weeks || '',
      days_per_week: currentProgram?.days_per_week || '',
      minutes_per_day: currentProgram?.minutes_per_day || '',
    }),
    [currentProgram],
  );

  const methods = useForm({
    resolver: yupResolver(NewProgramSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onGoBack();
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
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box rowGap={3} columnGap={2} display="grid">
          <RHFTextField name="name" label="Titulo *" variant="standard" />
          <Stack>
            <Typography>Poster do Programa</Typography>
            <Avatar
              alt="Logo"
              src={values.cover_url}
              variant="rounded"
              imgProps={{
                onError: (e) => {
                  e.target.src = 'https://supertreinosapp.com/img/free/BASICO.jpg';
                },
              }}
              sx={{
                borderRadius: '16px',
                height: '209px',
                width: '158px',
                float: 'left',
                border: '2px solid #333',
              }}
            />
            <Button
              color="info"
              variant="contained"
              sx={{ marginTop: 2 }}
              onClick={handleOpenGallery}
            >
              Escolher poster
            </Button>
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
              <RHFSelect name="goals" label="Objetivo" variant="standard">
                {goals.map((goal) => (
                  <MenuItem key={goal.id} value={goal.name}>
                    {goal.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="difficulty_level" label="Dificuldade" variant="standard">
                {OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
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
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
            Salvar
          </LoadingButton>
        </Stack>
      </FormProvider>
      <Gallery open={openGallery} onClose={handleCloseGallery} />
    </>
  );
}

ProgramsNewEditForm.propTypes = {
  currentProgram: PropTypes.object,
  onGoBack: PropTypes.func,
};
