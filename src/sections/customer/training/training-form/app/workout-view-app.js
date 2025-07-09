import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';

import WorkoutItemApp from './workout-item-app';
import WorkoutViewGroupApp from './workout-view-group-app';

/**
 * WorkoutViewApp - Component for displaying workout media items in specified order
 * @param {Object} props - Component props
 * @param {Array} props.medias - Array of workout media groups
 * @param {Array} props.mediaOrder - Array specifying the order of media items (can contain strings or arrays of strings)
 * @returns {JSX.Element} Rendered component
 */

export default function WorkoutViewApp({
  medias = [],
  mediaOrder = [],
  index,
  handleReorderWorkout,
  groupWorkout,
  handleSaveMediasInfo,
  mediaInfo,
  onRemoveMedia,
}) {
  // State to ensure component is mounted before rendering DnD
  const [isMounted, setIsMounted] = useState(false);
  const [mediasSelected, setMediasSelected] = useState([]);
  const [mediaGroupSelected, setMediaGroupSelected] = useState([]);

  const handleGroupWorkout = () => {
    groupWorkout(mediasSelected, index);
    setMediasSelected([]);
  };

  const handleSaveMediaInfo = (mediaInfo) => {
    handleSaveMediasInfo(mediaInfo, index);
  };

  const handleRemoveMedia = (mediaIdToRemove) => {
    onRemoveMedia(mediaIdToRemove, index);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mediaMap = useMemo(() => {
    const map = new Map();

    if (medias && medias.length > 0) {
      medias.forEach((mediaGroup) => {
        if (Array.isArray(mediaGroup)) {
          mediaGroup.forEach((mediaItem) => {
            if (mediaItem && mediaItem.id) {
              map.set(mediaItem.id.toString(), mediaItem);
            }
          });
        }
      });
    }

    return map;
  }, [medias]);

  const organizedMedia = useMemo(() => {
    if (!mediaOrder || mediaOrder.length === 0 || !mediaMap.size) {
      return medias;
    }

    return mediaOrder
      .map((orderItem) => {
        if (Array.isArray(orderItem)) {
          const groupItems = orderItem
            .map((id) => mediaMap.get(id ? id.toString() : ''))
            .filter(Boolean);

          return groupItems.length > 0 ? groupItems : null;
        } else {
          const mediaItem = mediaMap.get(orderItem ? orderItem.toString() : '');
          return mediaItem ? [mediaItem] : null;
        }
      })
      .filter(Boolean);
  }, [mediaMap, mediaOrder]);

  /**
   * Função principal para lidar com o fim do drag
   */
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    let newMediaOrder = JSON.parse(JSON.stringify(mediaOrder));

    // Só aplica handleItemDrag se estiver movendo item individual para dentro de grupo (nested-group)
    const isGroupMove = result.draggableId.startsWith('top-group-');

    if (isGroupMove) {
      // Movimento de grupo inteiro no top-level
      const [movedGroup] = newMediaOrder.splice(source.index, 1);
      newMediaOrder.splice(destination.index, 0, movedGroup);
    } else if (
      destination.droppableId.startsWith('nested-group-') ||
      source.droppableId.startsWith('nested-group-')
    ) {
      // Só agrupa se for realmente dentro do grupo (nested)
      newMediaOrder = handleItemDrag(newMediaOrder, source, destination);
    } else {
      // Movimento livre no nível superior
      const [movedItem] = newMediaOrder.splice(source.index, 1);
      newMediaOrder.splice(destination.index, 0, movedItem);
    }

    // Limpa grupos vazios
    newMediaOrder = newMediaOrder.filter((item) => {
      if (Array.isArray(item)) return item.length > 0;
      return true;
    });

    handleReorderWorkout(newMediaOrder, index);
  };

  /**
   * Função para lidar com movimentação de itens
   */
  const handleItemDrag = (mediaOrder, source, destination) => {
    const sourceIsTopLevel = source.droppableId === 'top-level';
    const destIsTopLevel = destination.droppableId === 'top-level';
    let sourceGroupIndex = null;
    let destGroupIndex = null;

    if (!sourceIsTopLevel) {
      sourceGroupIndex = parseInt(source.droppableId.replace('nested-group-', ''));
    }

    if (!destIsTopLevel) {
      destGroupIndex = parseInt(destination.droppableId.replace('nested-group-', ''));
    }

    // CASO 1: Top-level para top-level
    if (sourceIsTopLevel && destIsTopLevel) {
      const [movedItem] = mediaOrder.splice(source.index, 1);
      mediaOrder.splice(destination.index, 0, movedItem);
      return mediaOrder;
    }

    // CASO 2: Top-level para grupo
    if (sourceIsTopLevel && !destIsTopLevel) {
      const movedItem = mediaOrder[source.index];
      mediaOrder.splice(source.index, 1);

      let adjustedDestGroupIndex = destGroupIndex;
      if (source.index < destGroupIndex) {
        adjustedDestGroupIndex -= 1;
      }

      let destGroup = mediaOrder[adjustedDestGroupIndex];
      if (!Array.isArray(destGroup)) {
        destGroup = [destGroup];
        mediaOrder[adjustedDestGroupIndex] = destGroup;
      }

      destGroup.splice(destination.index, 0, movedItem);
      return mediaOrder;
    }

    // CASO 3: Grupo para top-level
    if (!sourceIsTopLevel && destIsTopLevel) {
      const sourceGroup = mediaOrder[sourceGroupIndex];
      const itemToMove = sourceGroup[source.index];
      sourceGroup.splice(source.index, 1);

      if (sourceGroup.length === 0) {
        mediaOrder.splice(sourceGroupIndex, 1);
        if (sourceGroupIndex < destination.index) {
          destination.index -= 1;
        }
      } else if (sourceGroup.length === 1) {
        mediaOrder[sourceGroupIndex] = sourceGroup[0];
      }

      mediaOrder.splice(destination.index, 0, itemToMove);
      return mediaOrder;
    }

    // CASO 4: Grupo para grupo
    if (!sourceIsTopLevel && !destIsTopLevel) {
      if (sourceGroupIndex === destGroupIndex) {
        const group = mediaOrder[sourceGroupIndex];
        const [movedItem] = group.splice(source.index, 1);
        group.splice(destination.index, 0, movedItem);
      } else {
        const sourceGroup = mediaOrder[sourceGroupIndex];
        const [movedItem] = sourceGroup.splice(source.index, 1);

        let destGroup = mediaOrder[destGroupIndex];
        if (!Array.isArray(destGroup)) {
          destGroup = [destGroup];
          mediaOrder[destGroupIndex] = destGroup;
        }

        if (sourceGroup.length === 0) {
          mediaOrder.splice(sourceGroupIndex, 1);
          if (destGroupIndex > sourceGroupIndex) {
            destGroup = mediaOrder[destGroupIndex - 1];
          }
        } else if (sourceGroup.length === 1) {
          mediaOrder[sourceGroupIndex] = sourceGroup[0];
        }

        destGroup.splice(destination.index, 0, movedItem);
      }

      return mediaOrder;
    }

    return mediaOrder;
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {mediasSelected.length > 1 && (
        <Box py={1} justifyContent="flex-end" display="flex">
          <Button variant="outlined" onClick={handleGroupWorkout}>
            Agrupar
          </Button>
        </Box>
      )}
      <Stack spacing={2}>
        {!isMounted ? (
          <div>
            {organizedMedia.map((group, groupIndex) => {
              if (group.length > 1) {
                return (
                  <div key={`static-group-${groupIndex}`}>
                    {group.map((media, itemIndex) => (
                      <WorkoutItemApp
                        key={`static-item-${media.id || itemIndex}`}
                        media={media}
                        isMediaGroup={true}
                        providedItem={{ dragHandleProps: {} }}
                        handleRemoveMedia={handleRemoveMedia}
                      />
                    ))}
                  </div>
                );
              } else if (group.length === 1) {
                return (
                  <WorkoutItemApp
                    key={`static-single-${group[0].id || groupIndex}`}
                    media={group[0]}
                    providedItem={{ dragHandleProps: {} }}
                    handleRemoveMedia={handleRemoveMedia}
                  />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="top-level" type="GROUP">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {organizedMedia.map((group, groupIndex) => {
                    const groupId = `top-group-${groupIndex}`;
                    if (group.length > 1) {
                      return (
                        <Draggable key={groupId} draggableId={groupId} index={groupIndex}>
                          {(providedGroupDrag) => (
                            <div
                              ref={providedGroupDrag.innerRef}
                              {...providedGroupDrag.draggableProps}
                            >
                              <WorkoutViewGroupApp
                                medias={group}
                                index={groupIndex}
                                providedGroupDrag={providedGroupDrag}
                                handleSaveMediasInfo={handleSaveMediaInfo}
                                mediaInfo={mediaInfo}
                                handleRemoveMedia={handleRemoveMedia}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    } else if (group.length === 1) {
                      const mediaItem = group[0];
                      const itemId = mediaItem.id ? mediaItem.id.toString() : `item-${groupIndex}`;
                      const draggableId = `top-item-${itemId}`;

                      return (
                        <Draggable key={draggableId} draggableId={draggableId} index={groupIndex}>
                          {(providedItemDrag) => (
                            <div
                              ref={providedItemDrag.innerRef}
                              {...providedItemDrag.draggableProps}
                            >
                              <WorkoutItemApp
                                media={mediaItem}
                                providedItem={providedItemDrag}
                                setMediasSelected={setMediasSelected}
                                mediasSelected={mediasSelected}
                                mediaGroupSelected={mediaGroupSelected}
                                handleSaveMediaInfo={handleSaveMediaInfo}
                                mediaInfo={mediaInfo}
                                handleRemoveMedia={handleRemoveMedia}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    }
                    return null;
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Stack>
    </Box>
  );
}
