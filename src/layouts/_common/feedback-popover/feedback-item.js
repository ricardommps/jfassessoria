'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';
import useWorkout from 'src/hooks/use-workout';
import {
  convertMetersToKilometersFormat,
  convertPaceToSpeed,
  convertSecondsToHourMinuteFormat,
} from 'src/utils/convertValues';
import { extractUrl } from 'src/utils/extract-url';
import { fDate } from 'src/utils/format-time';
import { getModuleName } from 'src/utils/training-modules';

export default function FeedbackItem({ feedback, refreshList, handleWorkoutSelected }) {
  const { onReviewWorkout } = useWorkout();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const feedBackForm = useBoolean();

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
      await onReviewWorkout(feedback.customer.id, feedback.id, payload);
      feedBackForm.onFalse();
      refreshList();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const renderIntensities = () => {
    const intensities = feedback.intensities.map((intensities) => JSON.parse(intensities));
    const intensitiesValues = intensities.map((intensities) => {
      if (intensities.value) {
        return intensities.value;
      }
      if (intensities.intensitie) {
        return intensities.intensitie;
      }
      return intensities;
    });
    const noEmptyValues = intensitiesValues.filter((str) => str !== '');
    return (
      <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)" width={'50px'} pt={3}>
        {noEmptyValues.map((item, index) => (
          <Badge badgeContent={index + 1} color="info" key={`intensities-badge-key-${index}`}>
            <Chip
              label={`${item} ${feedback.unitmeasurement === 'pace' ? 'min' : 'km/h'}`}
              key={`intensities-key-${index}`}
              sx={{ width: '100px' }}
            />
          </Badge>
        ))}
      </Box>
    );
  };

  const renderAvatar = (
    <ListItemAvatar>
      <Avatar src={feedback?.customer?.avatar} sx={{ bgcolor: 'background.neutral' }} />
    </ListItemAvatar>
  );

  const renderName = (
    <ListItemText
      disableTypography
      primary={reader(feedback?.customer?.name)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{ width: 2, height: 2, bgcolor: 'currentColor', mx: 0.5, borderRadius: '50%' }}
            />
          }
        >
          {feedback?.customer?.email}
        </Stack>
      }
    />
  );

  const renderFinishedItem = (itemFeedback) => {
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
            {renderIntensities()}
          </Stack>
        )}
        <Box pt={2}>
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
            <Button variant="outlined" onClick={feedBackForm.onTrue} fullWidth>
              Dar FeedBack
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => handleWorkoutSelected(feedback)}
            fullWidth
            sx={{ mt: 2 }}
          >
            Ver treino
          </Button>
        </Box>
      </Stack>
    );
  };

  return (
    <Stack
      direction="row"
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderAvatar}
      <Stack sx={{ flexGrow: 1 }}>
        {renderName}
        {renderFinishedItem(feedback)}
      </Stack>
    </Stack>
  );
}

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
