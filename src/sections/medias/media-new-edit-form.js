import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import * as Yup from 'yup';

import ImageList from './image-list';
import { RHFImage } from './rhf-image';
export default function MediaNewEditForm() {
  const mdUp = useResponsive('up', 'md');
  const imageList = useBoolean();

  const NewMediaSchema = Yup.object().shape({
    title: Yup.string().required('Title obrigatório'),
    videoUrl: Yup.string().required('Url do vídeo obrigatória'),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
      thumbnail:
        'https://res.cloudinary.com/dtjwulffm/image/upload/c_thumb,w_200,g_face/v1701520618/xnu1bkdbelb913yv0qlb.jpg',
      videoUrl: '',
      instrucctions: null,
      blocked: false,
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(NewMediaSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const handleClearImage = () => {
    setValue('thumbnail', '');
  };

  const onSubmit = useCallback(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Media
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
              <RHFImage
                name={'thumbnail'}
                handleClearImage={handleClearImage}
                onClick={imageList.onTrue}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>
      {imageList.value && <ImageList open={imageList.value} onClose={imageList.onFalse} />}
    </FormProvider>
  );
}
