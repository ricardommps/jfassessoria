import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Scrollbar from 'src/components/scrollbar';

import WorkoutItem from './workout-item';
import WorkoutViewGroup from './workout-view-group';

export default function WorkoutList({ medias, mediaOrder, exerciseInfo, isWorkoutLoad }) {
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
                    exerciseInfo={exerciseInfo}
                    isWorkoutLoad={isWorkoutLoad}
                  />
                );
              }
            } else {
              const media = medias.find((m) => m.id === orderItem);
              if (media?.id) {
                return (
                  <WorkoutItem
                    key={media.id}
                    media={media}
                    exerciseInfo={exerciseInfo}
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
}
