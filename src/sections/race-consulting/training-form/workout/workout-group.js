import { Draggable, Droppable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify/iconify';

import WorkoutViewGroupItem from './workout-view-group-item';

export default function WorkoutGroup({
  item,
  index,
  medias,
  mediaGroupSelected,
  setMediaGroupSelected,
  ungroupWorkout,
  handleRemoveWorkout,
  exerciseInfo,
  handleSaveExerciseInfo,
  mediasSelected,
  providedGroupRoot,
}) {
  const groupedMedias = medias.filter((media) => item.includes(media.id));

  const handleUngroupWorkout = () => {
    ungroupWorkout(mediaGroupSelected);
    setMediaGroupSelected([]);
  };

  return (
    <Droppable droppableId={index.toString()} type="ITEM">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            padding: 0,
          }}
        >
          <Box justifyContent="flex-start" display="flex" pr={2} gap={2}>
            <Box sx={{ flex: 1 }}>
              <IconButton {...providedGroupRoot.dragHandleProps}>
                <DragIndicatorIcon />
              </IconButton>
            </Box>
            {mediaGroupSelected.length > 0 && (
              <Button variant="outlined" size="small" onClick={handleUngroupWorkout}>
                Desagrupar
              </Button>
            )}
            <IconButton edge="end" onClick={() => handleRemoveWorkout(groupedMedias)}>
              <Iconify icon="mdi:bin-circle" width={24} height={24} />
            </IconButton>
          </Box>
          {item.map((subItem, subIndex) => (
            <Draggable
              key={`subitem-${index}-${subIndex}`}
              draggableId={`subitem-${index}-${subIndex}`}
              index={subIndex}
            >
              {(providedGroupItem) => (
                <Box ref={providedGroupItem.innerRef} {...providedGroupItem.draggableProps}>
                  <WorkoutViewGroupItem
                    media={subItem}
                    exerciseInfo={exerciseInfo}
                    handleSaveExerciseInfo={handleSaveExerciseInfo}
                    mediasSelected={mediasSelected}
                    mediaGroupSelected={mediaGroupSelected}
                    setMediaGroupSelected={setMediaGroupSelected}
                    medias={medias}
                    providedGroupItem={providedGroupItem}
                  />
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}
