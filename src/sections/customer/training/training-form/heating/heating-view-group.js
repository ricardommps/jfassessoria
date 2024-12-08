import { Draggable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import React from 'react';
import Iconify from 'src/components/iconify';
import MediaPlayer from 'src/components/media-player';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from '../exercise-info';
import HeatingViewGroupItem from './heating-view-group-item';

export default function HeatingViewGroup({
  media,
  index,
  handleSaveExerciseInfo,
  exerciseInfo,
  handleRemoveHeatings,
  mediasSelected,
  mediaGroupSelected,
  setMediaGroupSelected,
  ungroupHeatings,
}) {
  const player = useBoolean();
  const info = useBoolean();
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === media.id)[0];

  const handleUngroupHeatings = () => {
    ungroupHeatings(mediaGroupSelected);
    setMediaGroupSelected([]);
  };

  return (
    <>
      <Draggable draggableId={`draggable-group-heating${index}`} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Paper
              variant="outlined"
              pb={2}
              sx={{
                marginBottom: '8.25px',
                paddingTop: '10px',
                paddingRight: '10px',
                paddingLeft: '10px',
                borderRadius: 1.5,
                borderStyle: 'dashed',
                borderColor: (theme) => alpha(theme.palette.grey[300], 0.5),
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              }}
            >
              <Box justifyContent={'flex-end'} display={'flex'} pr={2} gap={2}>
                {mediaGroupSelected.length > 0 && (
                  <Button variant="outlined" size="small" onClick={handleUngroupHeatings}>
                    Desagrupar
                  </Button>
                )}
                <IconButton edge="end" onClick={() => handleRemoveHeatings(media)}>
                  <Iconify icon={'mdi:bin-circle'} width="24" height="24" />
                </IconButton>
              </Box>
              {media.map((subMedia, index) => (
                <React.Fragment key={index}>
                  <HeatingViewGroupItem
                    media={subMedia}
                    exerciseInfo={exerciseInfo}
                    handleSaveExerciseInfo={handleSaveExerciseInfo}
                    mediasSelected={mediasSelected}
                    mediaGroupSelected={mediaGroupSelected}
                    setMediaGroupSelected={setMediaGroupSelected}
                  />
                </React.Fragment>
              ))}
            </Paper>
          </div>
        )}
      </Draggable>
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
    </>
  );
}
