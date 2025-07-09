import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';

import WorkoutItem from './workout-item';
import WorkoutNewViewGroup from './workout-new-view-group';

export default function WorkoutView({
  medias = [],
  mediaOrder = [],
  mediaInfo,
  isWorkoutLoad,
  checkList = [],
  handleCheckList,
}) {
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

  return (
    <Box sx={{ p: 0 }}>
      <Stack spacing={2}>
        {organizedMedia.map((item, itemIndex) => {
          if (item.length > 1) {
            return (
              <WorkoutNewViewGroup
                key={`group-box-${itemIndex}`}
                media={item}
                mediaInfo={mediaInfo}
                isWorkoutLoad={isWorkoutLoad}
                checkList={checkList}
                handleCheckList={handleCheckList}
              />
            );
          } else {
            return (
              <WorkoutItem
                key={`item-${itemIndex}`}
                media={item[0]}
                mediaInfo={mediaInfo}
                isWorkoutLoad={isWorkoutLoad}
                checkList={checkList}
                handleCheckList={handleCheckList}
              />
            );
          }
        })}
      </Stack>
    </Box>
  );
}
