import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';

import WorkoutView from './workout-view';

const WorkoutNew = React.memo(({ workout, checkList }) => {
  return (
    <>
      <CardHeader title={workout?.name} subheader={workout?.subtitle} sx={{ pt: 0 }} />
      <CardContent sx={{ padding: 2 }}>
        <Stack spacing={2}>
          {workout.workoutItems.length > 0 && (
            <>
              {workout.workoutItems.map((item, index) => (
                <WorkoutSection
                  key={`${item.id}-${index}`}
                  title={item.category}
                  description={item.description}
                  medias={item.medias}
                  mediaOrder={item.mediaOrder}
                  exerciseInfo={item.mediaInfo}
                  isWorkoutLoad={item.isWorkoutLoad}
                  checkList={checkList}
                />
              ))}
            </>
          )}
        </Stack>
      </CardContent>
    </>
  );
});

function WorkoutSection({
  title,
  description,
  medias,
  mediaOrder,
  exerciseInfo,
  isWorkoutLoad,
  checkList,
}) {
  // if (!description && (!medias || medias.length === 0 || !mediaOrder?.length)) return null;

  return (
    <Accordion defaultExpanded elevation={0} sx={{ '&:before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {description && (
          <Stack p={2}>
            <Scrollbar>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{description}</Typography>
            </Scrollbar>
          </Stack>
        )}
        {medias && medias.length > 0 && (
          <WorkoutView
            medias={medias}
            mediaOrder={mediaOrder}
            mediaInfo={exerciseInfo}
            isWorkoutLoad={isWorkoutLoad}
            checkList={checkList}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default WorkoutNew;
