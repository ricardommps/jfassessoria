import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import TextMaxLine from 'src/components/text-max-line';
import {
  convertMetersToKilometersFormat,
  convertPaceToSpeed,
  convertSecondsToHourMinuteFormat,
} from 'src/utils/convertValues';
import { extractUrl } from 'src/utils/extract-url';
import { fDate } from 'src/utils/format-time';
import { getModuleName } from 'src/utils/training-modules';

import { IntensityBadges } from './IntensityBadges';

export function WorkoutDetails({
  itemFeedback,
  feedBackFormValue,
  loading,
  onSubmit,
  onCancelFeedback,
  onOpenFeedback,
  onViewWorkout,
  reader,
}) {
  const theme = useTheme();

  const methods = useForm({
    defaultValues: {
      feedback: '',
    },
  });

  const { handleSubmit } = methods;

  return (
    <Stack
      spacing={1}
      sx={{
        pl: 1,
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      {itemFeedback.unrealized && (
        <Alert variant="outlined" severity="warning">
          Treino não realizado
        </Alert>
      )}

      <ListItemText
        disableTypography
        primary={
          <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
            {itemFeedback?.workout.running
              ? reader(getModuleName(itemFeedback?.workout?.name))
              : reader(itemFeedback?.customer?.name)}
          </Typography>
        }
        secondary={
          <>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', color: 'text.secondary' }}
              divider={
                <Box
                  sx={{
                    mx: 0.5,
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    bgcolor: 'currentColor',
                  }}
                />
              }
            >
              <span>{itemFeedback?.workout.subtitle}</span>
            </Stack>
            <Typography variant="subtitle2" color={theme.palette.info.main}>
              {fDate(itemFeedback.executionDay, 'EEEE, dd/MM/yyyy')}
            </Typography>
            {itemFeedback.comments.length === 0 ? (
              <Typography variant="caption">O aluno não deixou comentário</Typography>
            ) : (
              <Typography variant="caption">{`Comentário do Aluno: ${itemFeedback.comments}`}</Typography>
            )}
          </>
        }
      />

      <Divider />

      {itemFeedback?.workout.running && (
        <>
          {itemFeedback.outdoor ? (
            <Typography variant="caption">Treino Outdoor</Typography>
          ) : (
            <Typography variant="caption">Treino Indoor</Typography>
          )}
        </>
      )}

      <Grid container spacing={2}>
        {itemFeedback.distanceInMeters && (
          <Grid xs={12} sm={6}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary="Distância em metros"
                secondary={convertMetersToKilometersFormat(itemFeedback.distanceInMeters, true)}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback.durationInSeconds && (
          <Grid xs={12} sm={6}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary="Tempo total"
                secondary={convertSecondsToHourMinuteFormat(itemFeedback.durationInSeconds)}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback.warmUpDuration > 0 && (
          <Grid xs={12} sm={12}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary="Tempo de aquec. (min)"
                secondary={convertSecondsToHourMinuteFormat(itemFeedback.warmUpDuration)}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback?.warmUpIntensities > 0 && (
          <Grid xs={12} sm={12}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary={`Intensidade de aquecimento (${
                  itemFeedback.unitmeasurement === 'pace' ? 'min' : 'km/h'
                })`}
                secondary={
                  itemFeedback.unitmeasurement === 'pace'
                    ? convertSecondsToHourMinuteFormat(itemFeedback.warmUpIntensities)
                    : convertMetersToKilometersFormat(itemFeedback.warmUpIntensities)
                }
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback?.coolDownDuration > 0 && (
          <Grid xs={12} sm={12}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary="Tempo de desaquecimento. (min)"
                secondary={convertSecondsToHourMinuteFormat(itemFeedback.coolDownDuration)}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback?.coolDownIntensities > 0 && (
          <Grid xs={12} sm={12}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary={`Intensidade de desaquecimento (${
                  itemFeedback.unitmeasurement === 'pace' ? 'min' : 'km/h'
                })`}
                secondary={
                  itemFeedback.unitmeasurement === 'pace'
                    ? convertSecondsToHourMinuteFormat(itemFeedback.coolDownIntensities)
                    : convertMetersToKilometersFormat(itemFeedback.coolDownIntensities)
                }
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback.paceInSeconds && Number(itemFeedback.paceInSeconds) > 0 && (
          <Grid xs={12} sm={6}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary="Pace médio da sessão"
                secondary={convertPaceToSpeed(itemFeedback.paceInSeconds, true)}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}

        {itemFeedback.rpe > 0 && (
          <Grid xs={12} sm={6}>
            <Stack direction="row" alignItems="center">
              <ListItemText
                primary="RPE"
                secondary={itemFeedback?.rpe}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.primary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.secondary',
                  component: 'span',
                }}
              />
            </Stack>
          </Grid>
        )}
      </Grid>

      {itemFeedback?.link &&
        (() => {
          const url = extractUrl(itemFeedback.link);

          if (!url) {
            return (
              <Typography variant="caption" color="text.secondary">
                Link inválido
              </Typography>
            );
          }

          return (
            <TextMaxLine
              asLink
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              color="primary"
              sx={{ maxWidth: 200 }}
            >
              Link do treino
            </TextMaxLine>
          );
        })()}

      {itemFeedback?.intensities?.length > 0 && (
        <Stack pt={2}>
          <Typography variant="body2" sx={{ flexGrow: 1 }} color="text.primary">
            Intensidade dos esforços
          </Typography>
          <IntensityBadges
            intensities={itemFeedback.intensities}
            unitMeasurement={itemFeedback.unitmeasurement}
          />
        </Stack>
      )}

      <Box pt={2}>
        {feedBackFormValue ? (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box rowGap={3} columnGap={2} display="grid" pt={2}>
              <RHFTextField
                name="feedback"
                label="Comentários"
                multiline
                rows={6}
                inputRef={(input) => {
                  if (input != null) {
                    input.focus();
                  }
                }}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
              <LoadingButton type="submit" variant="contained" fullWidth loading={loading}>
                Salvar
              </LoadingButton>
              <Button
                fullWidth
                variant="outlined"
                color="warning"
                onClick={onCancelFeedback}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Stack>
          </FormProvider>
        ) : (
          <Button variant="outlined" onClick={onOpenFeedback} fullWidth>
            Dar FeedBack
          </Button>
        )}
        {onViewWorkout && (
          <Button variant="outlined" onClick={onViewWorkout} fullWidth sx={{ mt: 2 }}>
            Ver treino
          </Button>
        )}
      </Box>
    </Stack>
  );
}
