import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React, { useMemo } from 'react';
import Scrollbar from 'src/components/scrollbar';

import WorkoutItem from './workout-item';
import WorkoutViewGroup from './workout-view-group';

const WorkoutList = React.memo(({ medias, mediaOrder, exerciseInfo, isWorkoutLoad }) => {
  const memoizedExerciseInfo = useMemo(() => {
    return exerciseInfo;
  }, [exerciseInfo]);

  return (
    <Box sx={{ p: 0, overflow: 'hidden' }}>
      <Scrollbar sx={{ height: 320 }}>
        <Stack spacing={2}>
          {mediaOrder.map((orderItem, index) => {
            if (Array.isArray(orderItem)) {
              const groupedMedias = orderItem
                .map((id) => medias.find((media) => media.id === id))
                .filter((media) => !!media);
              if (groupedMedias?.length > 0) {
                return (
                  <WorkoutViewGroup
                    key={`group-${index}`}
                    media={groupedMedias}
                    exerciseInfo={memoizedExerciseInfo} // Passando a versão memoizada
                    isWorkoutLoad={isWorkoutLoad}
                  />
                );
              }
            } else {
              const media = medias.find((m) => m.id === orderItem);
              if (media?.id) {
                return (
                  <WorkoutItem
                    key={media.id} // Garantindo que a chave seja única
                    media={media}
                    exerciseInfo={memoizedExerciseInfo} // Passando a versão memoizada
                    isWorkoutLoad={isWorkoutLoad}
                  />
                );
              }
            }
          })}
        </Stack>
      </Scrollbar>
    </Box>
  );
});

export default WorkoutList;
