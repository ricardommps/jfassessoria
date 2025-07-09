import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import TextMaxLine from 'src/components/text-max-line';
import useTraining from 'src/hooks/use-training';

export default function WorkoutItem({ media, mediaInfo, checkList }) {
  const [exerciseInfoById, setexErciseInfoById] = useState(null);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/|\/shorts\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (mediaInfo?.length > 0) {
      const mediaInfoFind = mediaInfo.find((m) => m.mediaId === media.id);
      if (mediaInfoFind) {
        setexErciseInfoById(mediaInfoFind);
      }
    }
  }, [media, mediaInfo]);

  return (
    <Paper
      sx={{
        mr: 0,
        borderRadius: 2,
        position: 'relative',
        bgcolor: 'background.neutral',
        ...(media?.id &&
          checkList?.length &&
          checkList.includes(media.id) && {
            border: (theme) => theme.palette.primary.main,
            borderStyle: 'dashed',
          }),
      }}
    >
      <Stack spacing={2} sx={{ px: 2, pb: 1, pt: 2.5 }}>
        <TextMaxLine variant="subtitle2" line={2}>
          {media.title}
        </TextMaxLine>
        <iframe
          src={`https://www.youtube.com/embed/${getYoutubeId(
            media.videoUrl,
          )}?controls=0&disablekb=1&modestbranding=1&rel=0&fs=0&vq=hd720&hd=1`}
          style={{
            width: '100%',
            height: '400px', // Altura fixa maior
            borderRadius: 12,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={media.title}
        />
        <Stack flexDirection={'row'}>
          <Stack spacing={1}>
            {exerciseInfoById?.method && exerciseInfoById?.method.length > 0 && (
              <Stack>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
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
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
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
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
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
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
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
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Cadência / Vel. de mov.:
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.cadence}
                </TextMaxLine>
              </Stack>
            )}
            {exerciseInfoById?.comments && exerciseInfoById?.comments.length > 0 && (
              <Stack>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Observações:
                </Typography>
                <TextMaxLine variant="subtitle2" line={2}>
                  {exerciseInfoById?.comments}
                </TextMaxLine>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
