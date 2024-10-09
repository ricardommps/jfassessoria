import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { m } from 'framer-motion';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { varFade } from 'src/components/animate';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useBoolean } from 'src/hooks/use-boolean';
import useMedia from 'src/hooks/use-media';
import { useResponsive } from 'src/hooks/use-responsive';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

export const _tags = ['Alongamentos', 'Aquecimentos'];

function getId(url) {
  let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}
export default function MediaNewEditForm({ currentMedia }) {
  const mdUp = useResponsive('up', 'md');
  const { onCreateMedia } = useMedia();
  const toggleTags = useBoolean(true);

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
      tags: currentMedia?.tags || [],
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

  const handleChangeTags = useCallback((newValue) => {
    setValue('tags', newValue);
  }, []);

  const onSubmit = useCallback(async (data) => {
    try {
      const payload = Object.assign({}, data);
      onCreateMedia(payload);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify
            icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

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
            {renderTags}
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
