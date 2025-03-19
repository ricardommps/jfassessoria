import { View } from '@react-pdf/renderer';
import { useMemo } from 'react';

import WorkoutSingleItem from './workoutSingleItem';
import WorkoutViewGroup from './workoutViewGroup';
export default function WorkoutViewItemPdf({
  medias,
  mediaOrder,
  exerciseInfo,
  isWorkoutLoad,
  handleCheckList,
  checkList,
}) {
  const orderedMedias = useMemo(() => {
    return mediaOrder.map((orderItem) => {
      if (Array.isArray(orderItem)) {
        return orderItem.map((id) => medias.find((media) => media.id === id)).filter(Boolean);
      } else {
        return medias.find((m) => m.id === orderItem) || null;
      }
    });
  }, [medias, mediaOrder]);

  return (
    <>
      {orderedMedias.map((mediaGroup, index) => {
        if (Array.isArray(mediaGroup) && mediaGroup.length > 0) {
          return (
            <View key={`group-${index}`} wrap={false}>
              <WorkoutViewGroup
                key={mediaGroup.id}
                media={mediaGroup}
                exerciseInfo={exerciseInfo}
                isWorkoutLoad={isWorkoutLoad}
              />
            </View>
          );
        } else {
          return (
            <View key={mediaGroup.id} wrap={false}>
              <WorkoutSingleItem
                key={mediaGroup.id}
                media={mediaGroup}
                exerciseInfo={exerciseInfo}
                isWorkoutLoad={isWorkoutLoad}
              />
            </View>
          );
        }
      })}
    </>
  );
}
