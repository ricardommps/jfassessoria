import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import Scrollbar from 'src/components/scrollbar';

import WorkoutGroup from './workout-group';
import WorkoutViewItem from './workout-view-item';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const reorderItems = (items, source, destination) => {
  const updatedItems = [...items];

  const sourceGroupIndex = Number.isInteger(parseInt(source.droppableId))
    ? parseInt(source.droppableId, 10)
    : null;
  const destinationGroupIndex = Number.isInteger(parseInt(destination.droppableId))
    ? parseInt(destination.droppableId, 10)
    : null;

  if (
    sourceGroupIndex !== null &&
    destinationGroupIndex !== null &&
    sourceGroupIndex === destinationGroupIndex
  ) {
    // Reordenar dentro do mesmo grupo
    updatedItems[sourceGroupIndex] = reorder(
      updatedItems[sourceGroupIndex],
      source.index,
      destination.index,
    );
  } else if (sourceGroupIndex !== null && destinationGroupIndex === null) {
    const [movedItem] = updatedItems[sourceGroupIndex].splice(source.index, 1);
    updatedItems.splice(destination.index, 0, movedItem);
  } else if (sourceGroupIndex === null && destinationGroupIndex !== null) {
    const [movedItem] = updatedItems.splice(source.index, 1);
    updatedItems[destinationGroupIndex].splice(destination.index, 0, movedItem);
  } else if (sourceGroupIndex === null && destinationGroupIndex === null) {
    const [movedItem] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, movedItem);
  }

  return updatedItems;
};

export default function WorkoutView({
  medias,
  mediaOrder,
  handleSaveExerciseInfo,
  exerciseInfo,
  groupWorkout,
  ungroupWorkout,
  handleRemoveWorkout,
  handleReorderWorkout,
}) {
  const [mediasSelected, setMediasSelected] = useState([]);
  const [mediaGroupSelected, setMediaGroupSelected] = useState([]);

  const handleGroupWorkout = () => {
    groupWorkout(mediasSelected);
    setMediasSelected([]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newItems = reorderItems(mediaOrder, source, destination);
    handleReorderWorkout(newItems);
  };

  return (
    <Box sx={{ p: 1, overflow: 'hidden' }}>
      {mediasSelected.length > 1 && (
        <Box py={1} justifyContent="flex-end" display="flex">
          <Button variant="outlined" onClick={handleGroupWorkout}>
            Agrupar
          </Button>
        </Box>
      )}
      <Scrollbar sx={{ height: 320 }}>
        <Stack spacing={2}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="top-level" type="GROUP">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {mediaOrder.map((item, index) =>
                    Array.isArray(item) ? (
                      <Draggable
                        key={`group-${index}`}
                        draggableId={`group-${index}`}
                        index={index}
                      >
                        {(providedGroupRoot) => (
                          <div
                            ref={providedGroupRoot.innerRef}
                            {...providedGroupRoot.draggableProps}
                          >
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
                              <WorkoutGroup
                                item={item}
                                index={index}
                                medias={medias}
                                mediaGroupSelected={mediaGroupSelected}
                                setMediaGroupSelected={setMediaGroupSelected}
                                ungroupWorkout={ungroupWorkout}
                                handleRemoveWorkout={handleRemoveWorkout}
                                exerciseInfo={exerciseInfo}
                                handleSaveExerciseInfo={handleSaveExerciseInfo}
                                mediasSelected={mediasSelected}
                                providedGroupRoot={providedGroupRoot}
                              />
                            </Paper>
                          </div>
                        )}
                      </Draggable>
                    ) : (
                      <Draggable key={`item-${index}`} draggableId={`item-${index}`} index={index}>
                        {(providedItem) => (
                          <div ref={providedItem.innerRef} {...providedItem.draggableProps}>
                            <WorkoutViewItem
                              medias={medias}
                              mediaItem={item}
                              index={index}
                              key={`media-${index}`}
                              handleSaveExerciseInfo={handleSaveExerciseInfo}
                              exerciseInfo={exerciseInfo}
                              mediasSelected={mediasSelected}
                              setMediasSelected={setMediasSelected}
                              mediaGroupSelected={mediaGroupSelected}
                              providedItem={providedItem}
                              handleRemoveWorkout={handleRemoveWorkout}
                            />
                          </div>
                        )}
                      </Draggable>
                    ),
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
      </Scrollbar>
    </Box>
  );
}
