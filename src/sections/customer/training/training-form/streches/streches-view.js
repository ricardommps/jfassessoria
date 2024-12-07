import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useCallback, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';

import StrechesViewGroup from './streches-view-group';
import StrechesViewItem from './streches-view-item';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function StrechesView({
  medias,
  mediaOrder,
  handleSaveExerciseInfo,
  exerciseInfo,
  groupStretches,
  ungroupStretches,
  handleRemoveStretches,
  handleReorderStretches,
}) {
  const [mediasSelected, setMediasSelected] = useState([]);
  const [mediaGroupSelected, setMediaGroupSelected] = useState([]);

  const handleGroupStreches = () => {
    groupStretches(mediasSelected);
    setMediasSelected([]);
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const newMedias = reorder(mediaOrder, result.source.index, result.destination.index);
      handleReorderStretches(newMedias);
    },

    [medias],
  );

  return (
    <Box sx={{ p: 1, overflow: 'hidden' }}>
      {mediasSelected.length > 1 && (
        <Box py={1} justifyContent={'flex-end'} display={'flex'}>
          <Button variant="outlined" onClick={handleGroupStreches}>
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
                        <StrechesViewGroup
                          media={groupedMedias}
                          index={index}
                          key={`group-${index}`}
                          handleSaveExerciseInfo={handleSaveExerciseInfo}
                          exerciseInfo={exerciseInfo}
                          mediasSelected={mediasSelected}
                          setMediasSelected={setMediaGroupSelected}
                          handleRemoveStreches={handleRemoveStretches}
                          mediaGroupSelected={mediaGroupSelected}
                          setMediaGroupSelected={setMediaGroupSelected}
                          ungroupStreches={ungroupStretches}
                        />
                      );
                    } else {
                      const media = medias.find((m) => m.id === orderItem);
                      return (
                        <StrechesViewItem
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
