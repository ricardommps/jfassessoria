import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/iconify';
import MediaPlayer from 'src/components/media-player';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from '../exercise-info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItem,
  TextColum,
  Title,
} from '../styles';

export default function HeatingViewGroupItem({
  media,
  exerciseInfo,
  handleSaveExerciseInfo,
  mediasSelected,
  mediaGroupSelected,
  setMediaGroupSelected,
}) {
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === media.id)[0];
  const player = useBoolean();
  const info = useBoolean();

  const handleCheckboxChange = (event) => {
    const selected = event.target.checked;
    setMediaGroupSelected((prevSelected) =>
      selected ? [...prevSelected, media.id] : prevSelected.filter((id) => id !== media.id),
    );
  };

  return (
    <>
      {media && (
        <Box pb={2}>
          <ListItem>
            <Checkbox
              disabled={mediasSelected.length > 0}
              checked={mediaGroupSelected?.includes(media.id)}
              onChange={handleCheckboxChange}
            />
            <TextColum>
              <Stack direction="row" alignItems={'center'}>
                <Title sx={{ flex: 1 }}>{media.title}</Title>
                <IconButton sx={{ paddingRight: 2 }} onClick={player.onTrue}>
                  <Iconify icon="mdi:youtube" width={20} />
                </IconButton>
              </Stack>
            </TextColum>
          </ListItem>
          <>
            <Accordion sx={{ marginLeft: 1, marginRight: 1 }}>
              <AccordionSummary
                aria-controls="heationg-content"
                id="heationg-header"
                sx={{ fontSize: '0.8rem' }}
              >
                Informações do exercício
              </AccordionSummary>
              <AccordionDetails>
                <Stack flexDirection={'row'}>
                  <Stack>
                    <Stack flexDirection="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        MÉTODO:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        }}
                      >
                        {exerciseInfoById?.method || 0}
                      </Typography>
                    </Stack>
                    <Stack flexDirection="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        RANGE DE REPETIÇÕES:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        }}
                      >
                        {exerciseInfoById?.reps || 0}
                      </Typography>
                    </Stack>
                    <Stack flexDirection="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        INTERVALO DE RECUPERAÇÃO:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        }}
                      >
                        {exerciseInfoById?.reset || 0}
                      </Typography>
                    </Stack>
                    <Stack flexDirection="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        repetições de reserva:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        }}
                      >
                        {exerciseInfoById?.rir || 0}
                      </Typography>
                    </Stack>
                    <Stack flexDirection="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Cadência / velocidade de movimento:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        }}
                      >
                        {exerciseInfoById?.cadence || 0}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ flexGrow: 1 }} />
                  <Stack justifyContent={'center'}>
                    <IconButton size="small" disableRipple onClick={info.onTrue}>
                      <Iconify icon="material-symbols:edit" />
                    </IconButton>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </>
          {player.value && (
            <MediaPlayer
              open={player.value}
              onClose={player.onFalse}
              url={media.videoUrl}
              title={media.title}
            />
          )}
          {info.value && (
            <ExerciseInfo
              open={info.value}
              onClose={info.onFalse}
              title={media.title}
              id={media.id}
              onSave={handleSaveExerciseInfo}
              exerciseInfoById={exerciseInfoById}
              hideRir={true}
            />
          )}
        </Box>
      )}
    </>
  );
}
