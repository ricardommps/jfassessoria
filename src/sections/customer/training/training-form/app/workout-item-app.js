import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from '../exercise-info';
import MusclesWorked from '../muscles-worked';
import { Accordion, AccordionDetails, AccordionSummary, ListItem, TextColum } from '../styles';

export default function WorkoutItemApp({
  media,
  providedItem,
  setMediasSelected,
  mediasSelected,
  handleSaveMediaInfo,
  mediaInfo,
  handleRemoveMedia,
}) {
  const info = useBoolean();

  const [exerciseInfoById, setexErciseInfoById] = useState(null);

  const handleCheckboxChange = (event) => {
    const selected = event.target.checked;
    setMediasSelected((prevSelected) =>
      selected ? [...prevSelected, media.id] : prevSelected.filter((id) => id !== media?.id),
    );
  };

  useEffect(() => {
    if (mediaInfo?.length > 0) {
      const mediaInfoFind = mediaInfo.find((m) => m.mediaId === media.id);
      if (mediaInfoFind) {
        setexErciseInfoById(mediaInfoFind);
      }
    }
  }, [media, mediaInfo]);

  // Ensure media object exists to prevent errors
  if (!media) {
    return null;
  }
  return (
    <>
      <Box component={Card} mb={2} sx={{ backgroundColor: 'background.neutral', pr: 1, pl: 1 }}>
        <Stack direction="row" justifyContent={'flex-start'} mr={1}>
          <Box sx={{ flex: 1 }}>
            {/* No longer need to attach dragHandleProps here - they're on the parent div now */}
            <IconButton {...providedItem.dragHandleProps}>
              <DragIndicatorIcon />
            </IconButton>
          </Box>
          <IconButton>
            <Iconify icon="mdi:youtube" width={20} />
          </IconButton>
          <IconButton edge="end" onClick={() => handleRemoveMedia(media.id)}>
            <Iconify icon="mdi:bin-circle" width={24} height={24} />
          </IconButton>
        </Stack>
        <ListItem>
          <Checkbox checked={mediasSelected?.includes(media?.id)} onChange={handleCheckboxChange} />
          <TextColum>
            <Stack direction="row" alignItems={'center'}>
              <TextMaxLine variant="subtitle1" line={3} sx={{ flex: 1 }}>
                {media?.title || 'Untitled Exercise'}
              </TextMaxLine>
            </Stack>
          </TextColum>
        </ListItem>
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
            aria-controls="exercise-info-content"
            id="exercise-info-header"
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
                    {exerciseInfoById?.method || '—'}
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
                    {exerciseInfoById?.reps || '—'}
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
                    {exerciseInfoById?.reset || '—'}
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
                    {exerciseInfoById?.rir || '—'}
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
                    {exerciseInfoById?.cadence || '—'}
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
                    {exerciseInfoById?.comments || '—'}
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
        <Box p={2}>
          <MusclesWorked mediaId={media.id} musclesWorked={media?.musclesWorked} />
        </Box>
      </Box>
      {info.value && (
        <ExerciseInfo
          open={info.value}
          onClose={info.onFalse}
          title={media?.title}
          id={media?.id}
          onSave={handleSaveMediaInfo}
          exerciseInfoById={exerciseInfoById}
          hideRir={true}
        />
      )}
    </>
  );
}
