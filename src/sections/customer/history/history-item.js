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
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { fDate } from 'src/utils/format-time';
import { getModuleName } from 'src/utils/training-modules';

export default function HistoryItem({ historyItem, workoutInfo, refreshList }) {
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
      await onReviewWorkout(historyItem.id, payload);
      feedBackForm.onFalse();
      refreshList();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const renderIntensities = () => {
    const intensities = historyItem.intensities.map((intensities) => JSON.parse(intensities));
    const intensitiesValues = intensities.map((intensities) => {
      if (intensities.value) {
        return intensities.value;
      }
      return intensities.intensitie;
    });
    const noEmptyValues = intensitiesValues.filter((str) => str !== '');
    return (
      <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)" width={'50px'} pt={3}>
        {noEmptyValues.map((item, index) => (
          <Badge badgeContent={index + 1} color="info" key={`intensities-badge-key-${index}`}>
            <Chip
              label={`${item} ${historyItem.unitmeasurement === 'pace' ? 'min' : 'km/h'}`}
              key={`intensities-key-${index}`}
              sx={{ width: '100px' }}
            />
          </Badge>
        ))}
      </Box>
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
            <Stack direction={smDown ? 'column' : 'row'} spacing={smDown ? 1 : 5}>
              {historyItem.distanceInMeters && (
                <Stack direction="row" alignItems="center">
                  <ListItemText
                    primary={`Distância em metros`}
                    secondary={convertMetersToKilometersFormat(historyItem.distanceInMeters, true)}
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
              )}
              {historyItem.durationInSeconds && (
                <Stack direction="row" alignItems="center">
                  <ListItemText
                    primary={`Tempo total`}
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
              )}

              {historyItem.paceInSeconds && Number(historyItem.paceInSeconds) > 0 && (
                <Stack direction="row" alignItems="center">
                  <ListItemText
                    primary={`Pace médio da sessão`}
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
              )}

              {historyItem.rpe > 0 && (
                <Stack direction="row" alignItems="center">
                  <ListItemText
                    primary={`RPE`}
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
              )}

              {historyItem?.link && (
                <TextMaxLine
                  asLink
                  target="_blank"
                  href={historyItem?.link}
                  color="primary"
                  sx={{ maxWidth: 200 }}
                >
                  Link do treino
                </TextMaxLine>
              )}

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
