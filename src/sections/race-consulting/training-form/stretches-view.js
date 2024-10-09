import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useCallback } from 'react';

import StretchesViewItem from './stretches-view-item';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
export default function StretchesView({
  medias,
  handleReorderMedias,
  mediaOrder,
  handleSaveExerciseInfo,
  exerciseInfo,
}) {
  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const newMedias = reorder(medias, result.source.index, result.destination.index);
      handleReorderMedias(newMedias);
    },

    [medias],
  );

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={2}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {medias
                  .sort((a, b) => mediaOrder.indexOf(a.id) - mediaOrder.indexOf(b.id))
                  .map((media, index) => (
                    <StretchesViewItem
                      media={media}
                      index={index}
                      key={media.id}
                      handleSaveExerciseInfo={handleSaveExerciseInfo}
                      exerciseInfo={exerciseInfo}
                    />
                  ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
    </Box>
  );
}
