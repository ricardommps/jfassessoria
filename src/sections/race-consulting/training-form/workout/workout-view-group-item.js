import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
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

export default function WorkoutViewGroupItem({
  media,
  exerciseInfo,
  handleSaveExerciseInfo,
  mediasSelected,
  mediaGroupSelected,
  setMediaGroupSelected,
  medias,
  providedGroupItem,
  handleRemoveWorkout,
}) {
  const mediaItem = medias.find((m) => m.id === media);
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === mediaItem.id)[0];
  const player = useBoolean();
  const info = useBoolean();

  const handleCheckboxChange = (event) => {
    const selected = event.target.checked;
    setMediaGroupSelected((prevSelected) =>
      selected ? [...prevSelected, mediaItem.id] : prevSelected.filter((id) => id !== mediaItem.id),
    );
  };

  return (
    <>
      {mediaItem && (
        <Box pb={2}>
          <ListItem>
            <Box>
              <IconButton {...providedGroupItem.dragHandleProps}>
                <DragIndicatorIcon />
              </IconButton>
            </Box>
            <Checkbox
              disabled={mediasSelected.length > 0}
              checked={mediaGroupSelected?.includes(mediaItem.id)}
              onChange={handleCheckboxChange}
            />
            <TextColum>
              <Stack direction="row" alignItems={'center'}>
                <Title sx={{ flex: 1 }}>{mediaItem.title}</Title>
                <Box sx={{ paddingRight: 2 }}>
                  <IconButton onClick={player.onTrue}>
                    <Iconify icon="mdi:youtube" width={20} />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleRemoveWorkout([mediaItem])}>
                    <Iconify icon="mdi:bin-circle" width={24} height={24} />
                  </IconButton>
                </Box>
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
                        INTERVALO DE RECUPERAÇÃO: {exerciseInfoById?.reset || 0}
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
                        repetições de reserva: {exerciseInfoById?.rir || 0}
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
              url={mediaItem.videoUrl}
              title={mediaItem.title}
            />
          )}
          {info.value && (
            <ExerciseInfo
              open={info.value}
              onClose={info.onFalse}
              title={mediaItem.title}
              id={mediaItem.id}
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
