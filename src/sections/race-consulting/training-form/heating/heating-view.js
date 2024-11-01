import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useCallback, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';

import HeatingViewGroup from './heating-view-group';
import HeatingViewItem from './heating-view-item';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function HeatingView({
  medias,
  mediaOrder,
  handleSaveExerciseInfo,
  exerciseInfo,
  groupHeatings,
  ungroupHeatings,
  handleRemoveHeatings,
  handleReorderHeatings,
}) {
  const [mediasSelected, setMediasSelected] = useState([]);
  const [mediaGroupSelected, setMediaGroupSelected] = useState([]);

  const handleGroupHeatings = () => {
    groupHeatings(mediasSelected);
    setMediasSelected([]);
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const newMedias = reorder(mediaOrder, result.source.index, result.destination.index);
      handleReorderHeatings(newMedias);
    },

    [medias],
  );

  return (
    <Box sx={{ p: 1, overflow: 'hidden' }}>
      {mediasSelected.length > 1 && (
        <Box py={1} justifyContent={'flex-end'} display={'flex'}>
          <Button variant="outlined" onClick={handleGroupHeatings}>
            Agrupar
          </Button>
        </Box>
      )}
      <Scrollbar sx={{ height: 320 }}>
        <Stack spacing={2}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {mediaOrder.map((orderItem, index) => {
                    if (Array.isArray(orderItem)) {
                      const groupedMedias = medias.filter((media) => orderItem.includes(media.id));
                      return (
                        <HeatingViewGroup
                          media={groupedMedias}
                          index={index}
                          key={`group-${index}`}
                          handleSaveExerciseInfo={handleSaveExerciseInfo}
                          exerciseInfo={exerciseInfo}
                          mediasSelected={mediasSelected}
                          setMediasSelected={setMediaGroupSelected}
                          handleRemoveHeatings={handleRemoveHeatings}
                          mediaGroupSelected={mediaGroupSelected}
                          setMediaGroupSelected={setMediaGroupSelected}
                          ungroupHeatings={ungroupHeatings}
                        />
                      );
                    } else {
                      const media = medias.find((m) => m.id === orderItem);
                      return (
                        <HeatingViewItem
                          media={media}
                          index={index}
                          key={media.id}
                          handleSaveExerciseInfo={handleSaveExerciseInfo}
                          exerciseInfo={exerciseInfo}
                          mediasSelected={mediasSelected}
                          setMediasSelected={setMediasSelected}
                          mediaGroupSelected={mediaGroupSelected}
                        />
                      );
                    }
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
      </Scrollbar>
    </Box>
  );
}
