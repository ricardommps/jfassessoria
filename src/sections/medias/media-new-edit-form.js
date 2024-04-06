import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { m } from 'framer-motion';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { varFade } from 'src/components/animate';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';
import useMedia from 'src/hooks/use-media';
import { useResponsive } from 'src/hooks/use-responsive';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

function getId(url) {
  let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}
export default function MediaNewEditForm({ currentMedia }) {
  const mdUp = useResponsive('up', 'md');
  const { onCreateMedia } = useMedia();
  const NewMediaSchema = Yup.object().shape({
    title: Yup.string().required('Title obrigatório'),
    videoUrl: Yup.string().required('Url do vídeo obrigatória'),
  });
  const defaultValues = useMemo(
    () => ({
      title: currentMedia?.title || '',
      thumbnail: currentMedia?.thumbnail || null,
      videoUrl: currentMedia?.videoUrl || '',
      instrucctions: currentMedia?.instrucctions || null,
      blocked: currentMedia?.blocked || false,
    }),
    [],
  );
  const methods = useForm({
    resolver: yupResolver(NewMediaSchema),
    defaultValues,
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleChangeBlocked = useCallback(
    (event) => {
      setValue('blocked', event.target.checked);
    },
    [setValue],
  );

  const onSubmit = useCallback(async (data) => {
    try {
      const payload = Object.assign({}, data);
      onCreateMedia(payload);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(values.blocked)}
              color="error"
              onChange={handleChangeBlocked}
            />
          }
          label="Bloquear"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <Button
          component={RouterLink}
          href={paths.dashboard.medias.root}
          variant="outlined"
          color="inherit"
          size="large"
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          Salvar
        </LoadingButton>
      </Grid>
    </>
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Mídia
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Título *, Thumbnail, Url do vídeo(Youtube) * , instruções
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Media" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Título" />
            <RHFTextField name="videoUrl" label="Url do Vídeo" />
            <RHFTextField name="instrucctions" label="Instruções" fullWidth multiline rows={5} />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Thumbnail</Typography>
              {values.thumbnail && (
                <m.div variants={varFade().inUp}>
                  <Image
                    alt="darkmode"
                    src={values.thumbnail}
                    style={{ width: 200, height: 200 }}
                    sx={{
                      boxShadow: (theme) =>
                        `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
                    }}
                  />
                </m.div>
              )}
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  useEffect(() => {
    if (values.videoUrl) {
      const idVideo = getId(values.videoUrl);
      if (idVideo) {
        const thumbnail = `http://img.youtube.com/vi/${idVideo}/0.jpg`;
        setValue('thumbnail', thumbnail);
      } else {
        setValue('thumbnail', null);
      }
    }
  }, [values.videoUrl]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
