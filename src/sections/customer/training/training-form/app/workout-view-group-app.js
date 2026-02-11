import { Draggable, Droppable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { CardHeader } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';

import WorkoutItemApp from './workout-item-app';

/**
 * WorkoutViewGroupApp - Passes workoutIndex to child items
 */

export default function WorkoutViewGroupApp({
  medias,
  index,
  providedGroupDrag,
  handleSaveMediasInfo,
  mediaInfo,
  handleRemoveMedia,
  onToggleSelection,
  workoutIndex, // Passa para os filhos
}) {
  const groupType = getGroupType(medias.length);
  const droppableId = `nested-group-${index}`;

  return (
    <Paper
      variant="outlined"
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
      <IconButton {...providedGroupDrag.dragHandleProps}>
        <DragIndicatorIcon />
      </IconButton>

      <CardHeader
        title={groupType}
        sx={{
          p: 1,
        }}
      />

      <Droppable droppableId={droppableId} type="ITEM">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '50px' }}>
            {medias.map((media, itemIndex) => {
              const draggableId = `group-${index}-item-${media.id || itemIndex}`;

              return (
                <Draggable key={draggableId} draggableId={draggableId} index={itemIndex}>
                  {(providedDrag) => (
                    <div ref={providedDrag.innerRef} {...providedDrag.draggableProps}>
                      <WorkoutItemApp
                        media={media}
                        isMediaGroup={true}
                        providedItem={providedDrag}
                        handleSaveMediaInfo={handleSaveMediasInfo}
                        mediaInfo={mediaInfo}
                        handleRemoveMedia={handleRemoveMedia}
                        onToggleSelection={onToggleSelection}
                        workoutIndex={workoutIndex}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Paper>
  );
}

function getGroupType(count) {
  switch (count) {
    case 2:
      return 'BISET';
    case 3:
      return 'TRISET';
    default:
      return 'CIRCUITO';
  }
}
