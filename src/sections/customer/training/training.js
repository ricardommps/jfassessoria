import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import { useResponsive } from 'src/hooks/use-responsive';
import useWorkout from 'src/hooks/use-workout';
import useWorkouts from 'src/hooks/use-workouts';

import TrainingList from './training-list';
import TrainingListMobile from './training-list-mobile';

export default function Training({ open, program, handleCloseTraining }) {
  const smDown = useResponsive('down', 'sm');
  const { id, type, vs2 } = program;

  const { onListWorkouts, workouts, workoutsStatus } = useWorkout();
  const { onGetWorkouts, workoutsNew, workoutsNewStatus } = useWorkouts();

  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onListWorkouts(id, type);
      await onGetWorkouts(id, type);
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
      {loading ? (
        <LoadingProgress />
      ) : (
        <>
          {smDown ? (
            <Box>
              <TrainingListMobile
                open={open}
                handleClose={handleCloseTraining}
                loading={loading}
                trainings={workouts}
                trainingsStatus={workoutsStatus}
                refreshList={refreshList}
                program={program}
              />
            </Box>
          ) : (
            <Box>
              {loading && <LoadingProgress />}
              <TrainingList
                trainings={workouts}
                trainingsStatus={workoutsStatus}
                workouts={workoutsNew}
                workoutsNewStatus={workoutsNewStatus}
                handleClose={handleCloseTraining}
                program={program}
                refreshList={refreshList}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
