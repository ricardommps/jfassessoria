import { useCallback } from 'react';
import {
  cloneWorkout,
  createWorkout,
  deleteWorkout,
  getWorkout,
  getWorkouts,
  reviewWorkout,
  sendWorkout,
  upDateWorkout,
} from 'src/redux/slices/workout';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useWorkout() {
  const dispatch = useDispatch();
  const { workouts, workoutsStatus, workoutAction, workoutActionStatus, workout, workousStatus } =
    useSelector((state) => state.workout);

  const onCreateWorkout = useCallback(
    async (payload) => {
      await dispatch(createWorkout(payload));
    },
    [dispatch],
  );

  const onReviewWorkout = useCallback(
    async (id, payload) => {
      await dispatch(reviewWorkout(id, payload));
    },
    [dispatch],
  );

  const onCloneTraining = useCallback(
    async (trainingId, qntCopy) => {
      await dispatch(cloneWorkout(trainingId, qntCopy));
    },
    [dispatch],
  );

  const onSendTraining = useCallback(
    async (payload) => {
      await dispatch(sendWorkout(payload));
    },
    [dispatch],
  );

  const onDeleteTraining = useCallback(
    async (trainingId) => {
      await dispatch(deleteWorkout(trainingId));
    },
    [dispatch],
  );

  const onUpdateWorkout = useCallback(
    async (payload, id) => {
      await dispatch(upDateWorkout(payload, id));
    },
    [dispatch],
  );

  const onListWorkouts = useCallback(
    async (programId, type) => {
      await dispatch(getWorkouts(programId, type));
    },
    [dispatch],
  );

  const onGetWorkout = useCallback(
    async (id) => {
      await dispatch(getWorkout(id));
    },
    [dispatch],
  );

  return {
    onCreateWorkout,
    onListWorkouts,
    onGetWorkout,
    workouts,
    workoutsStatus,
    workoutAction,
    workoutActionStatus,
    workout,
    workousStatus,
    onUpdateWorkout,
    onReviewWorkout,
    onCloneTraining,
    onDeleteTraining,
    onSendTraining,
  };
}
