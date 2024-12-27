import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import ReactPlayer from 'react-player';
import TextMaxLine from 'src/components/text-max-line';

const WorkoutItem = React.memo(({ media, exerciseInfo, isWorkoutLoad }) => {
  const exerciseInfoById = useMemo(
    () => exerciseInfo?.find((item) => item.id === media.id),
    [exerciseInfo, media.id],
  );

  const handleError = (e) => {
    console.log(e);
  };

  return (
    <Paper sx={{ mr: 0, borderRadius: 2, position: 'relative', bgcolor: 'background.neutral' }}>
      <Stack spacing={2} sx={{ px: 2, pb: 1, pt: 2.5 }}>
        <TextMaxLine variant="subtitle2" line={2}>
          {media.title}
        </TextMaxLine>
        <ReactPlayer
          className="react-player"
          url={media.videoUrl}
          width="100%"
          height={100}
          light={media.thumbnail}
          onError={(e) => handleError(e)}
        />
        {media.workoutLoad && isWorkoutLoad && (
          <Stack direction="row" spacing={1}>
            <Typography>Carga:</Typography>
            <Typography fontWeight={'bold'}>
              {media.workoutLoad.length > 0 ? media.workoutLoad[0].load : 'Não definido'}
            </Typography>
          </Stack>
        )}
        <Stack flexDirection={'row'}>
          <Stack spacing={1}>
            {exerciseInfoById?.method && exerciseInfoById?.method.length > 0 && (
              <Stack>
                <Typography
                  sx={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}
                >
                  MÉTODO:
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.method}
                </TextMaxLine>
              </Stack>
            )}
            {exerciseInfoById?.reps && exerciseInfoById?.reps.length > 0 && (
              <Stack>
                <Typography
                  sx={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}
                >
                  RANGE DE REPETIÇÕES:
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.reps}
                </TextMaxLine>
              </Stack>
            )}
            {exerciseInfoById?.reset > 0 && (
              <Stack>
                <Typography
                  sx={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}
                >
                  INTERVALO DE RECUPERAÇÃO:
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.reset}
                </TextMaxLine>
              </Stack>
            )}

            {exerciseInfoById?.rir && exerciseInfoById?.rir.length > 0 && (
              <Stack>
                <Typography
                  sx={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}
                >
                  repetições de reserva
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.rir}
                </TextMaxLine>
              </Stack>
            )}
            {exerciseInfoById?.cadence && exerciseInfoById?.cadence.length > 0 && (
              <Stack>
                <Typography
                  sx={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}
                >
                  Cadência / Vel. de mov.:
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.cadence}
                </TextMaxLine>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
});

export default WorkoutItem;
