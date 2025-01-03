import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReactPlayer from 'react-player';
import TextMaxLine from 'src/components/text-max-line';
export default function WorkoutItemGroup({ media, exerciseInfo, index, checkList }) {
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === media.id)[0];
  const handleError = (e) => {
    console.log(e);
  };
  return (
    <Paper
      id={'WorkoutItemGroup'}
      sx={{
        mr: 1,
        borderRadius: 2,
        position: 'relative',
        bgcolor: 'background.neutral',
        width: '100%',
        ...(media?.id &&
          checkList?.length &&
          checkList.includes(media.id) && {
            border: (theme) => theme.palette.primary.main,
            borderStyle: 'dashed',
          }),
      }}
    >
      <Stack
        spacing={2}
        sx={{
          px: 2,
          pb: 1,
          pt: 2.5,
        }}
      >
        <Stack flexDirection={'row'} spacing={2}>
          <Stack
            justifyContent={'center'}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              padding: '0px 6px',
              borderRadius: '15px',
              height: '20px',
            }}
          >
            <Typography>{index}</Typography>
          </Stack>

          <TextMaxLine variant="subtitle2" line={2}>
            {media.title}
          </TextMaxLine>
        </Stack>
        <ReactPlayer
          className="react-player"
          url={media.videoUrl}
          width="100%"
          height={200}
          light={media.thumbnail}
          onError={(e) => handleError(e)}
        />
        {media.workoutLoad && (
          <Stack direction="row" spacing={1}>
            <Typography>Carga:</Typography>
            <Typography fontWeight={'bold'}>
              {media.workoutLoad.length > 0 ? media.workoutLoad[0].load : 'Não definido'}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack flexDirection={'row'}>
        <Stack spacing={1} p={2}>
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
        </Stack>
      </Stack>
    </Paper>
  );
}
