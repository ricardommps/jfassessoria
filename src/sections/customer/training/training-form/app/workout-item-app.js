import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from '../exercise-info';
import MusclesWorked from '../muscles-worked';
import { Accordion, AccordionDetails, AccordionSummary, ListItem, TextColum } from '../styles';

/**
 * WorkoutItemApp - Updated to pass workoutIndex to MusclesWorked
 */

export default function WorkoutItemApp({
  media,
  providedItem,
  isSelected = false,
  isMediaGroup = false,
  handleSaveMediaInfo,
  mediaInfo,
  handleRemoveMedia,
  onToggleSelection,
  workoutIndex, // NEW: Índice do workoutItem no array
}) {
  const info = useBoolean();
  const [exerciseInfoById, setExerciseInfoById] = useState(null);

  // Sync exercise info from mediaInfo prop
  useEffect(() => {
    if (!mediaInfo?.length || !media?.id) return;

    const foundMediaInfo = mediaInfo.find((m) => m.mediaId === media.id);
    setExerciseInfoById(foundMediaInfo || null);
  }, [media?.id, mediaInfo]);

  // Handle checkbox selection
  const handleCheckboxChange = useCallback(
    (event) => {
      if (!onToggleSelection || !media?.id) return;
      onToggleSelection(media.id, event.target.checked);
    },
    [onToggleSelection, media?.id],
  );

  // Handle remove
  const handleRemove = useCallback(() => {
    if (!handleRemoveMedia || !media?.id) return;
    handleRemoveMedia(media.id);
  }, [handleRemoveMedia, media?.id]);

  // Early return if no media
  if (!media) {
    return null;
  }

  return (
    <>
      <Box component={Card} mb={2} sx={{ backgroundColor: 'background.neutral', pr: 1, pl: 1 }}>
        {/* Top Action Bar */}
        <Stack direction="row" justifyContent="flex-start" mr={1}>
          <Box sx={{ flex: 1 }}>
            <IconButton {...providedItem.dragHandleProps}>
              <DragIndicatorIcon />
            </IconButton>
          </Box>

          {/* Video Icon */}
          <IconButton>
            <Iconify icon="mdi:youtube" width={20} />
          </IconButton>

          {/* Remove Icon */}
          <IconButton edge="end" onClick={handleRemove}>
            <Iconify icon="mdi:bin-circle" width={24} height={24} />
          </IconButton>
        </Stack>

        {/* Exercise Title with Checkbox */}
        <ListItem>
          {!isMediaGroup && onToggleSelection && (
            <Checkbox checked={isSelected} onChange={handleCheckboxChange} />
          )}
          <TextColum>
            <Stack direction="row" alignItems="center">
              <TextMaxLine variant="subtitle1" line={3} sx={{ flex: 1 }}>
                {media?.title || 'Exercício sem nome'}
              </TextMaxLine>
            </Stack>
          </TextColum>
        </ListItem>

        {/* Exercise Info Accordion */}
        <Accordion
          sx={{
            marginLeft: 1,
            marginRight: 1,
            '&.MuiAccordion-root:last-of-type': {
              marginBottom: 2,
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
            <Stack flexDirection="row">
              <Stack gap={1}>
                <InfoRow label="MÉTODO" value={exerciseInfoById?.method} />
                <InfoRow label="RANGE DE REPETIÇÕES" value={exerciseInfoById?.reps} />
                <InfoRow label="INTERVALO DE RECUPERAÇÃO" value={exerciseInfoById?.reset} />
                <InfoRow label="REPETIÇÕES DE RESERVA" value={exerciseInfoById?.rir} />
                <InfoRow
                  label="CADÊNCIA / VELOCIDADE DE MOVIMENTO"
                  value={exerciseInfoById?.cadence}
                />

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

              {/* Edit Button */}
              <Stack justifyContent="center">
                <IconButton size="small" disableRipple onClick={info.onTrue}>
                  <Iconify icon="material-symbols:edit" />
                </IconButton>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Muscles Worked Section */}
        <Box p={2}>
          <MusclesWorked
            mediaId={media.id}
            musclesWorked={media?.musclesWorked}
            workoutIndex={workoutIndex}
          />
        </Box>
      </Box>

      {/* Exercise Info Dialog */}
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

/**
 * Helper component for displaying exercise info rows
 */
function InfoRow({ label, value }) {
  return (
    <Stack flexDirection="row" spacing={1}>
      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{label}:</Typography>
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'text.primary',
        }}
      >
        {value || '—'}
      </Typography>
    </Stack>
  );
}
