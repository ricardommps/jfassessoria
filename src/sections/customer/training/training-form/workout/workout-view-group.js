import { Draggable, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import MediaPlayer from 'src/components/media-player';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from '../exercise-info';
import WorkoutViewGroupItem from './workout-view-group-item';

export default function WorkoutViewGroup({
  media,
  index,
  handleSaveExerciseInfo,
  exerciseInfo,
  handleRemoveWorkout,
  mediasSelected,
  mediaGroupSelected,
  setMediaGroupSelected,
  ungroupWorkout,
}) {
  const player = useBoolean();
  const info = useBoolean();
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === media.id)[0];

  const handleUngroupWorkout = () => {
    ungroupWorkout(mediaGroupSelected);
    setMediaGroupSelected([]);
  };

  return (
    <>
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
        <Box justifyContent="flex-end" display="flex" pr={2} gap={2}>
          {mediaGroupSelected.length > 0 && (
            <Button variant="outlined" size="small" onClick={handleUngroupWorkout}>
              Desagrupar
            </Button>
          )}
          <IconButton edge="end" onClick={() => handleRemoveWorkout(media)}>
            <Iconify icon="mdi:bin-circle" width={24} height={24} />
          </IconButton>
        </Box>
        <Droppable droppableId={index.toString()} type="ITEM">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {media.map((subMedia, subIndex) => (
                <Draggable
                  key={`subitem-${index}-${subIndex}`}
                  draggableId={`subitem-${index}-${subIndex}`}
                  index={subIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <WorkoutViewGroupItem
                        media={subMedia}
                        exerciseInfo={exerciseInfo}
                        handleSaveExerciseInfo={handleSaveExerciseInfo}
                        mediasSelected={mediasSelected}
                        mediaGroupSelected={mediaGroupSelected}
                        setMediaGroupSelected={setMediaGroupSelected}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Paper>

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
