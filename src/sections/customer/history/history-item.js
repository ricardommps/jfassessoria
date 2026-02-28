'use client';

import CommentIcon from '@mui/icons-material/Comment';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton } from '@mui/material';
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
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CommentsDialog } from 'src/components/comments';
import { IntensityBadges } from 'src/components/feedback/IntensityBadges';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';
import { useComments, useGetComments } from 'src/hooks/use-commnts';
import useFeedback from 'src/hooks/use-feedback';
import { useCreateFeedback } from 'src/hooks/use-finished';
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

const ActivityMap = dynamic(
  () => import('../../../components/activity-map/activity-map').then((mod) => mod.ActivityMap),
  { ssr: false },
);

export default function HistoryItem({ historyItem, workoutInfo, refreshList, customerId }) {
  const { onGetUnreviewedFinished } = useFeedback();
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();
  const feedBackForm = useBoolean();
  const openComments = useBoolean();

  const { data: comments, refetch: refetchNewComments } = useGetComments(historyItem.id);

  const { mutate: sendComment, isLoading } = useComments({
    invalidateQueries: ['history'], // ou qualquer query que precise atualizar
    onSuccess: () => openComments.onFalse(), // fecha o modal
  });

  const lastComment = comments && comments[comments.length - 1];

  const { createFeedback } = useCreateFeedback();
  const hasUnreadComments = comments?.some(
    (comment) => !comment.isAdmin === true && comment.read === false,
  );

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

  const handleSendComment = (message) => {
    if (!message.trim()) return;

    const payload = {
      finishedId: historyItem.id,
      content: message.trim(),
      parentId: lastComment ? lastComment.id : null,
      authorUserId: lastComment?.author?.id ?? null, // 👈 AQUI
    };
    sendComment(payload);
  };

  const { handleSubmit } = methods;

  const handleSubmitFeedback = useCallback(
    async (data, commentId) => {
      try {
        const payload = {
          ...data,
          ...(commentId && { commentId }),
        };
        await createFeedback({
          customerId: customerId,
          finishedId: historyItem?.id,
          payload: payload,
        });

        feedBackForm.onFalse();
        onGetUnreviewedFinished();
        refreshList();
      } catch (error) {
        console.error('Erro ao criar feedback:', error);
      }
    },
    [createFeedback, historyItem, feedBackForm, refreshList],
  );

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
            {!comments || comments?.length === 0 ? (
              <Typography variant="caption">O aluno não deixou comentário</Typography>
            ) : (
              <Typography variant="caption">{`Comentário do Aluno: ${comments[0]?.content}`}</Typography>
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
            <Box>
              {historyItem.summaryPolyline && (
                <ActivityMap encodedPolyline={historyItem.summaryPolyline} />
              )}
            </Box>
            <Box>
              {historyItem.linkstrava && (
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<DirectionsRunIcon />}
                    href={historyItem.linkstrava}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#FC4C02', // Laranja oficial Strava
                      color: '#ffffff',
                      fontWeight: 700,
                      borderRadius: '14px',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(252, 76, 2, 0.35)',
                      '&:hover': {
                        backgroundColor: '#E34402', // tom mais escuro no hover
                        boxShadow: '0 6px 16px rgba(252, 76, 2, 0.45)',
                      },
                    }}
                  >
                    Ver atividade no Strava
                  </Button>
                </Box>
              )}
            </Box>
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
            {historyItem?.link &&
              (() => {
                const url = extractUrl(historyItem.link);

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
                  <FormProvider
                    methods={methods}
                    onSubmit={handleSubmit((data) => {
                      const commentId = comments?.length > 0 ? comments[0].id : undefined;
                      handleSubmitFeedback(data, commentId);
                    })}
                  >
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
              <Box>
                <IconButton
                  aria-label="comments"
                  sx={{ p: 0 }}
                  color="inherit"
                  onClick={openComments.onTrue}
                >
                  <Badge
                    badgeContent={comments?.length || 0}
                    color={hasUnreadComments ? 'error' : 'primary'}
                  >
                    <CommentIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>
      {openComments.value && (
        <CommentsDialog
          open={openComments.value}
          onClose={() => {
            openComments.onFalse(); // fecha o modal
            refetchNewComments(); // 🔄 recarrega newComments
            refreshList();
          }}
          comments={comments}
          onSend={handleSendComment}
          isLoading={isLoading} // opcional para desabilitar botão durante envio
        />
      )}
    </>
  );
}
