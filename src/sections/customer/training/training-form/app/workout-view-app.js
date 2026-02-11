import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useMemo, useState } from 'react';

import WorkoutItemApp from './workout-item-app';
import WorkoutViewGroupApp from './workout-view-group-app';

/**
 * WorkoutViewApp - Passes workoutIndex to children components
 */

export default function WorkoutViewApp({
  medias = [],
  mediaOrder = [],
  index, // workoutIndex
  handleReorderWorkout,
  groupWorkout,
  handleSaveMediasInfo,
  mediaInfo,
  onRemoveMedia,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // DATA MAPPING
  const mediaMap = useMemo(() => {
    const map = new Map();

    medias.forEach((mediaGroup) => {
      if (!Array.isArray(mediaGroup)) return;

      mediaGroup.forEach((mediaItem) => {
        if (mediaItem?.id) {
          map.set(String(mediaItem.id), mediaItem);
        }
      });
    });

    return map;
  }, [medias]);

  // ORGANIZED MEDIA
  const organizedMedia = useMemo(() => {
    if (!mediaOrder?.length || !mediaMap.size) {
      return medias;
    }

    return mediaOrder
      .map((orderItem) => {
        if (Array.isArray(orderItem)) {
          const groupItems = orderItem.map((id) => mediaMap.get(String(id))).filter(Boolean);

          return groupItems.length > 0 ? groupItems : null;
        }

        const mediaItem = mediaMap.get(String(orderItem));
        return mediaItem ? [mediaItem] : null;
      })
      .filter(Boolean);
  }, [mediaOrder, mediaMap, medias]);

  // EVENT HANDLERS
  const handleGroupWorkout = useCallback(() => {
    if (selectedMediaIds.length < 2) return;

    groupWorkout(selectedMediaIds, index);
    setSelectedMediaIds([]);
  }, [selectedMediaIds, groupWorkout, index]);

  const handleSaveMediaInfo = useCallback(
    (mediaInfo) => {
      handleSaveMediasInfo(mediaInfo, index);
    },
    [handleSaveMediasInfo, index],
  );

  const handleRemoveMedia = useCallback(
    (mediaIdToRemove) => {
      onRemoveMedia(mediaIdToRemove, index);
      setSelectedMediaIds((prev) => prev.filter((id) => id !== mediaIdToRemove));
    },
    [onRemoveMedia, index],
  );

  const toggleMediaSelection = useCallback((mediaId, isSelected) => {
    setSelectedMediaIds((prev) =>
      isSelected ? [...prev, mediaId] : prev.filter((id) => id !== mediaId),
    );
  }, []);

  // DRAG AND DROP
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;

      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      const newOrder = reorderMediaOrder({
        currentOrder: mediaOrder,
        source,
        destination,
        draggableId,
      });

      handleReorderWorkout(newOrder, index);
    },
    [mediaOrder, handleReorderWorkout, index],
  );

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {selectedMediaIds.length > 1 && (
        <Box py={1} display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={handleGroupWorkout}>
            Agrupar ({selectedMediaIds.length})
          </Button>
        </Box>
      )}

      <Stack spacing={2}>
        {!isMounted ? (
          <StaticMediaList
            organizedMedia={organizedMedia}
            handleRemoveMedia={handleRemoveMedia}
            handleSaveMediaInfo={handleSaveMediaInfo}
            mediaInfo={mediaInfo}
            toggleMediaSelection={toggleMediaSelection}
            workoutIndex={index}
          />
        ) : (
          <DraggableMediaList
            organizedMedia={organizedMedia}
            selectedMediaIds={selectedMediaIds}
            onDragEnd={onDragEnd}
            handleRemoveMedia={handleRemoveMedia}
            handleSaveMediaInfo={handleSaveMediaInfo}
            mediaInfo={mediaInfo}
            toggleMediaSelection={toggleMediaSelection}
            workoutIndex={index}
          />
        )}
      </Stack>
    </Box>
  );
}

// REORDER LOGIC
function reorderMediaOrder({ currentOrder, source, destination, draggableId }) {
  const newOrder = JSON.parse(JSON.stringify(currentOrder));

  const isGroupDrag = draggableId.startsWith('top-group-');
  const sourceIsNested = source.droppableId.startsWith('nested-group-');
  const destIsNested = destination.droppableId.startsWith('nested-group-');

  if (isGroupDrag) {
    return moveTopLevelItem(newOrder, source.index, destination.index);
  }

  if (sourceIsNested || destIsNested) {
    return handleNestedMovement(newOrder, source, destination);
  }

  return moveTopLevelItem(newOrder, source.index, destination.index);
}

function moveTopLevelItem(order, fromIndex, toIndex) {
  const [movedItem] = order.splice(fromIndex, 1);
  order.splice(toIndex, 0, movedItem);
  return cleanupOrder(order);
}

function handleNestedMovement(order, source, destination) {
  const sourceIsTopLevel = source.droppableId === 'top-level';
  const destIsTopLevel = destination.droppableId === 'top-level';

  const sourceGroupIndex = sourceIsTopLevel
    ? null
    : parseInt(source.droppableId.replace('nested-group-', ''));

  const destGroupIndex = destIsTopLevel
    ? null
    : parseInt(destination.droppableId.replace('nested-group-', ''));

  if (sourceIsTopLevel && destIsTopLevel) {
    return moveTopLevelItem(order, source.index, destination.index);
  }

  if (sourceIsTopLevel && !destIsTopLevel) {
    return moveFromTopToGroup(order, source.index, destGroupIndex, destination.index);
  }

  if (!sourceIsTopLevel && destIsTopLevel) {
    return moveFromGroupToTop(order, sourceGroupIndex, source.index, destination.index);
  }

  return moveBetweenGroups(
    order,
    sourceGroupIndex,
    source.index,
    destGroupIndex,
    destination.index,
  );
}

function moveFromTopToGroup(order, sourceIndex, destGroupIndex, destItemIndex) {
  const movedItem = order[sourceIndex];
  order.splice(sourceIndex, 1);

  const adjustedGroupIndex = sourceIndex < destGroupIndex ? destGroupIndex - 1 : destGroupIndex;

  let destGroup = order[adjustedGroupIndex];

  if (!Array.isArray(destGroup)) {
    destGroup = [destGroup];
    order[adjustedGroupIndex] = destGroup;
  }

  destGroup.splice(destItemIndex, 0, movedItem);
  return cleanupOrder(order);
}

function moveFromGroupToTop(order, sourceGroupIndex, sourceItemIndex, destIndex) {
  const sourceGroup = order[sourceGroupIndex];
  const [movedItem] = sourceGroup.splice(sourceItemIndex, 1);

  if (sourceGroup.length === 0) {
    order.splice(sourceGroupIndex, 1);
    const adjustedDestIndex = sourceGroupIndex < destIndex ? destIndex - 1 : destIndex;
    order.splice(adjustedDestIndex, 0, movedItem);
  } else if (sourceGroup.length === 1) {
    order[sourceGroupIndex] = sourceGroup[0];
    order.splice(destIndex, 0, movedItem);
  } else {
    order.splice(destIndex, 0, movedItem);
  }

  return cleanupOrder(order);
}

function moveBetweenGroups(
  order,
  sourceGroupIndex,
  sourceItemIndex,
  destGroupIndex,
  destItemIndex,
) {
  if (sourceGroupIndex === destGroupIndex) {
    const group = order[sourceGroupIndex];
    const [movedItem] = group.splice(sourceItemIndex, 1);
    group.splice(destItemIndex, 0, movedItem);
    return cleanupOrder(order);
  }

  const sourceGroup = order[sourceGroupIndex];
  const [movedItem] = sourceGroup.splice(sourceItemIndex, 1);

  let destGroup = order[destGroupIndex];

  if (!Array.isArray(destGroup)) {
    destGroup = [destGroup];
    order[destGroupIndex] = destGroup;
  }

  destGroup.splice(destItemIndex, 0, movedItem);

  if (sourceGroup.length === 0) {
    order.splice(sourceGroupIndex, 1);
  } else if (sourceGroup.length === 1) {
    order[sourceGroupIndex] = sourceGroup[0];
  }

  return cleanupOrder(order);
}

function cleanupOrder(order) {
  return order.filter((item) => {
    if (Array.isArray(item)) return item.length > 0;
    return item != null;
  });
}

// STATIC MEDIA LIST
function StaticMediaList({
  organizedMedia,
  handleRemoveMedia,
  handleSaveMediaInfo,
  mediaInfo,
  toggleMediaSelection,
  workoutIndex,
}) {
  return (
    <div>
      {organizedMedia.map((group, groupIndex) => {
        const isGroup = group.length > 1;

        if (isGroup) {
          return (
            <div key={`static-group-${groupIndex}`}>
              {group.map((media, itemIndex) => (
                <WorkoutItemApp
                  key={`static-item-${media.id || itemIndex}`}
                  media={media}
                  isMediaGroup={true}
                  providedItem={{ dragHandleProps: {} }}
                  handleRemoveMedia={handleRemoveMedia}
                  handleSaveMediaInfo={handleSaveMediaInfo}
                  mediaInfo={mediaInfo}
                  onToggleSelection={toggleMediaSelection}
                  workoutIndex={workoutIndex}
                />
              ))}
            </div>
          );
        }

        return (
          <WorkoutItemApp
            key={`static-single-${group[0].id || groupIndex}`}
            media={group[0]}
            providedItem={{ dragHandleProps: {} }}
            handleRemoveMedia={handleRemoveMedia}
            handleSaveMediaInfo={handleSaveMediaInfo}
            mediaInfo={mediaInfo}
            onToggleSelection={toggleMediaSelection}
            workoutIndex={workoutIndex}
          />
        );
      })}
    </div>
  );
}

// DRAGGABLE MEDIA LIST
function DraggableMediaList({
  organizedMedia,
  selectedMediaIds,
  onDragEnd,
  handleRemoveMedia,
  handleSaveMediaInfo,
  mediaInfo,
  toggleMediaSelection,
  workoutIndex,
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="top-level" type="GROUP">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {organizedMedia.map((group, groupIndex) => {
              const isGroup = group.length > 1;

              if (isGroup) {
                return (
                  <DraggableGroup
                    key={`top-group-${groupIndex}`}
                    group={group}
                    groupIndex={groupIndex}
                    handleRemoveMedia={handleRemoveMedia}
                    handleSaveMediaInfo={handleSaveMediaInfo}
                    mediaInfo={mediaInfo}
                    onToggleSelection={toggleMediaSelection}
                    workoutIndex={workoutIndex}
                  />
                );
              }

              return (
                <DraggableSingleItem
                  key={`top-item-${group[0].id || groupIndex}`}
                  media={group[0]}
                  index={groupIndex}
                  selectedMediaIds={selectedMediaIds}
                  handleRemoveMedia={handleRemoveMedia}
                  handleSaveMediaInfo={handleSaveMediaInfo}
                  mediaInfo={mediaInfo}
                  onToggleSelection={toggleMediaSelection}
                  workoutIndex={workoutIndex}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

// DRAGGABLE GROUP
function DraggableGroup({
  group,
  groupIndex,
  handleRemoveMedia,
  handleSaveMediaInfo,
  mediaInfo,
  onToggleSelection,
  workoutIndex,
}) {
  const groupId = `top-group-${groupIndex}`;

  return (
    <Draggable draggableId={groupId} index={groupIndex}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <WorkoutViewGroupApp
            medias={group}
            index={groupIndex}
            providedGroupDrag={provided}
            handleSaveMediasInfo={handleSaveMediaInfo}
            mediaInfo={mediaInfo}
            handleRemoveMedia={handleRemoveMedia}
            onToggleSelection={onToggleSelection}
            workoutIndex={workoutIndex}
          />
        </div>
      )}
    </Draggable>
  );
}

// DRAGGABLE SINGLE ITEM
function DraggableSingleItem({
  media,
  index,
  selectedMediaIds,
  handleRemoveMedia,
  handleSaveMediaInfo,
  mediaInfo,
  onToggleSelection,
  workoutIndex,
}) {
  const draggableId = `top-item-${media.id || index}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <WorkoutItemApp
            media={media}
            providedItem={provided}
            isSelected={selectedMediaIds.includes(media.id)}
            handleRemoveMedia={handleRemoveMedia}
            handleSaveMediaInfo={handleSaveMediaInfo}
            mediaInfo={mediaInfo}
            onToggleSelection={onToggleSelection}
            workoutIndex={workoutIndex}
          />
        </div>
      )}
    </Draggable>
  );
}
