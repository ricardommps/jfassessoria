import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import { useResponsive } from 'src/hooks/use-responsive';
import useWorkout from 'src/hooks/use-workout';

import TrainingList from './training-list';
import TrainingListMobile from './training-list-mobile';

export default function Training({ open, id, type, handleCloseTraining }) {
  const smDown = useResponsive('down', 'sm');

  const { onListWorkouts, workouts, workoutsStatus } = useWorkout();

  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onListWorkouts(id, type);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refreshList = () => {
    initialize();
  };

  useEffect(() => {
    if (id) {
      initialize();
    }
  }, [id, initialize]);

  return (
    <>
      {smDown ? (
        <Box>
          {loading && <LoadingProgress />}
          <TrainingListMobile
            open={open}
            handleClose={handleCloseTraining}
            loading={loading}
            trainings={workouts}
            trainingsStatus={workoutsStatus}
            refreshList={refreshList}
            programId={id}
            type={type}
          />
        </Box>
      ) : (
        <Box>
          {loading && <LoadingProgress />}
          <TrainingList
            trainings={workouts}
            trainingsStatus={workoutsStatus}
            handleClose={handleCloseTraining}
            programId={id}
            type={type}
            refreshList={refreshList}
          />
        </Box>
      )}
    </>
  );
}
