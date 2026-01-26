'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IntensityBadges } from 'src/components/feedback/IntensityBadges';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import useWorkout from 'src/hooks/use-workout';
import {
  convertMetersToKilometersFormat,
  convertPaceToSpeed,
  convertSecondsToHourMinuteFormat,
} from 'src/utils/convertValues';
import { extractUrl } from 'src/utils/extract-url';
import { fDate } from 'src/utils/format-time';
import { getModuleName } from 'src/utils/training-modules';

export default function HistoryItem({ historyItem, workoutInfo, refreshList, customerId }) {
  const { onReviewWorkout } = useWorkout();
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();
  const feedBackForm = useBoolean();

  const [loading, setLoading] = useState(false);
  const opacityCard = () => {
    return 1;
  };

  const defaultValues = useMemo(
    () => ({
      feedback: '',
    }),
    [],
  );

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);
      const payload = Object.assign({}, data);
      await onReviewWorkout(customerId, historyItem.id, payload);
      feedBackForm.onFalse();
      refreshList();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const renderIntensities = () => {
    return (
      <IntensityBadges
        intensities={historyItem.intensities}
        unitMeasurement={historyItem.unitmeasurement}
      />
    );
  };

  return (
    <>
      <Stack component={Card} direction="row" sx={{ opacity: opacityCard(), mb: 2 }}>
        <Stack
          sx={{
            p: 2,
            width: '100%',
          }}
        >
          {workoutInfo && (
            <Stack spacing={2}>
              <ListItemText
                primary={
                  <Stack spacing={1} direction="row" alignItems="center" sx={{ typography: 'h6' }}>
                    {getModuleName(historyItem.trainingname)}
                  </Stack>
                }
                secondary={historyItem.trainingsubtitle}
                primaryTypographyProps={{ typography: 'subtitle1' }}
                secondaryTypographyProps={{ typography: 'subtitle2' }}
              />
            </Stack>
          )}
          <Stack spacing={2}>
            <Typography variant="subtitle1" color={theme.palette.info.main}>
              {fDate(historyItem.executionDay, 'EEEE, dd/MM/yyyy')}
            </Typography>
            {historyItem.unrealized && (
              <Label variant="soft" color={'error'}>
                Treino não realizado
              </Label>
            )}
            {historyItem.comments.length === 0 ? (
              <Typography variant="caption">O aluno não deixou comentário</Typography>
            ) : (
              <Typography variant="caption">{`Comentário do Aluno: ${historyItem.comments}`}</Typography>
            )}
            {historyItem.typetraining ? (
              <>
                {historyItem.typetraining === 'outdoor' && (
                  <Typography variant="caption">Treino Outdoor</Typography>
                )}
                {historyItem.typetraining === 'indoor' && (
                  <Typography variant="caption">Treino Indoor</Typography>
                )}
              </>
            ) : (
              <>
                {(!historyItem.type || historyItem.type === 1) && (
                  <>
                    {historyItem.outdoor ? (
                      <Typography variant="caption">Treino Outdoor</Typography>
                    ) : (
                      <Typography variant="caption">Treino Indoor</Typography>
                    )}
                  </>
                )}
              </>
            )}
            <Grid container spacing={2}>
              {historyItem.distanceInMeters && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="Distância em metros"
                      secondary={convertMetersToKilometersFormat(
                        historyItem.distanceInMeters,
                        true,
                      )}
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
              {historyItem.durationInSeconds && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="Tempo total"
                      secondary={convertSecondsToHourMinuteFormat(historyItem.durationInSeconds)}
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
              {historyItem.warmUpDuration > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="Tempo de aquec. (min)"
                      secondary={convertSecondsToHourMinuteFormat(historyItem.warmUpDuration)}
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
              {historyItem?.warmUpIntensities > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary={`Intensidade de aquecimento (${
                        historyItem.unitmeasurement === 'pace' ? 'min' : 'km/h'
                      })`}
                      secondary={
                        historyItem.unitmeasurement === 'pace'
                          ? convertSecondsToHourMinuteFormat(historyItem.warmUpIntensities)
                          : convertMetersToKilometersFormat(historyItem.warmUpIntensities)
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
              {historyItem?.coolDownDuration > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="Tempo de desaquecimento. (min)"
                      secondary={convertSecondsToHourMinuteFormat(historyItem.coolDownDuration)}
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
              {historyItem?.coolDownDuration > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="Tempo de desaquecimento. (min)"
                      secondary={convertSecondsToHourMinuteFormat(historyItem.coolDownDuration)}
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

              {historyItem?.coolDownIntensities > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary={`Intensidade de desaquecimento (${
                        historyItem.unitmeasurement === 'pace' ? 'min' : 'km/h'
                      })`}
                      secondary={
                        historyItem.unitmeasurement === 'pace'
                          ? convertSecondsToHourMinuteFormat(historyItem.coolDownIntensities)
                          : convertMetersToKilometersFormat(historyItem.coolDownIntensities)
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

              {historyItem.paceInSeconds && Number(historyItem.paceInSeconds) > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="Pace médio da sessão"
                      secondary={convertPaceToSpeed(historyItem.paceInSeconds, true)}
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

              {historyItem.rpe > 0 && (
                <Grid xs={12} sm={6}>
                  <Stack direction="row" alignItems="center">
                    <ListItemText
                      primary="RPE"
                      secondary={historyItem?.rpe}
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
            <Stack direction={'column'} spacing={smDown ? 1 : 5}>
              {historyItem?.intensities?.length > 0 && (
                <Stack pt={2}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }} color={'text.primary'}>
                    Intensidade dos esforços
                  </Typography>
                  {renderIntensities()}
                </Stack>
              )}
            </Stack>
            {!historyItem.review ? (
              <>
                {feedBackForm.value ? (
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
                        onClick={feedBackForm.onFalse}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </FormProvider>
                ) : (
                  <Button variant="outlined" onClick={feedBackForm.onTrue}>
                    Dar FeedBack
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="caption" color={theme.palette.success.main}>{`Feedback : ${
                historyItem.feedback ? historyItem.feedback : ''
              }`}</Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
