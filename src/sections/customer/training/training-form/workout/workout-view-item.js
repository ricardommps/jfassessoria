import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import MediaPlayer from 'src/components/media-player';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from '../exercise-info';
import { Accordion, AccordionDetails, AccordionSummary, ListItem, TextColum } from '../styles';

export default function WorkoutViewItem({
  medias,
  mediaItem,
  handleSaveExerciseInfo,
  exerciseInfo,
  mediasSelected,
  setMediasSelected,
  mediaGroupSelected,
  providedItem,
  handleRemoveWorkout,
}) {
  const player = useBoolean();
  const info = useBoolean();

  const handleCheckboxChange = (event) => {
    const selected = event.target.checked;
    setMediasSelected((prevSelected) =>
      selected ? [...prevSelected, media.id] : prevSelected.filter((id) => id !== media?.id),
    );
  };

  const [exerciseInfoById, setexErciseInfoById] = useState(null);

  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (medias?.length > 0) {
      const mediaFind = medias.find((m) => m.id === mediaItem);
      if (mediaFind) {
        const exerciseInfoFilter = exerciseInfo?.filter(
          (item) => item.mediaId === mediaFind?.id,
        )[0];
        setexErciseInfoById(exerciseInfoFilter);
      }
      setMedia(mediaFind);
    }
  }, [medias, exerciseInfo]);
  return (
    <>
      {media && (
        <Box component={Card} mb={2} sx={{ backgroundColor: 'background.neutral', pr: 1, pl: 1 }}>
          <Stack direction="row" justifyContent={'flex-start'} mr={1}>
            <Box sx={{ flex: 1 }}>
              <IconButton {...providedItem.dragHandleProps}>
                <DragIndicatorIcon />
              </IconButton>
            </Box>
            <IconButton onClick={player.onTrue}>
              <Iconify icon="mdi:youtube" width={20} />
            </IconButton>
            <IconButton edge="end" onClick={() => handleRemoveWorkout([media])}>
              <Iconify icon="mdi:bin-circle" width={24} height={24} />
            </IconButton>
          </Stack>
          <ListItem>
            <Checkbox
              checked={mediasSelected?.includes(media?.id)}
              onChange={handleCheckboxChange}
              disabled={mediaGroupSelected.length > 0}
            />
            <TextColum>
              <Stack direction="row" alignItems={'center'}>
                <TextMaxLine variant="subtitle1" line={3} sx={{ flex: 1 }}>
                  {media?.title}
                </TextMaxLine>
              </Stack>
            </TextColum>
          </ListItem>

          <>
            <Accordion
              sx={{
                marginLeft: 1,
                marginRight: 1,
                '&.MuiAccordion-root:last-of-type': {
                  marginBottom: 2, // 16px
                },
              }}
            >
              <AccordionSummary
                aria-controls="heationg-content"
                id="heationg-header"
                sx={{ fontSize: '0.8rem' }}
              >
                Informações do exercício
              </AccordionSummary>
              <AccordionDetails>
                <Stack flexDirection={'row'}>
                  <Stack gap={1}>
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
                    <Stack flexDirection="column">
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Observações:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        }}
                      >
                        {exerciseInfoById?.comments}
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
        </Box>
      )}

      {player.value && (
        <MediaPlayer
          open={player.value}
          onClose={player.onFalse}
          url={media?.videoUrl}
          title={media?.title}
        />
      )}
      {info.value && (
        <ExerciseInfo
          open={info.value}
          onClose={info.onFalse}
          title={media?.title}
          id={media?.id}
          onSave={handleSaveExerciseInfo}
          exerciseInfoById={exerciseInfoById}
          hideRir={true}
        />
      )}
    </>
  );
}
