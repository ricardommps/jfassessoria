import { useCallback } from 'react';
import {
  createWorkouts as createWorkoutsAction,
  deleteWorkouts as deleteWorkoutsAction,
  getWorkoutItem,
  getWorkouts as getWorkoutsAction,
  updateWorkouts,
} from 'src/redux/slices/workouts';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useWorkouts() {
  const dispatch = useDispatch();
  const {
    createWorkouts,
    createWorkoutsStatus,
    workoutsNew,
    workoutsNewStatus,
    workoutItem,
    workoutItemStatus,
    deleteWorkouts,
  } = useSelector((state) => state.workouts);

  const onCreateWorkouts = useCallback(
    async (payload) => {
      await dispatch(createWorkoutsAction(payload));
    },
    [dispatch],
  );

  const onDeleteWorkouts = useCallback(
    async (workoutId) => {
      await dispatch(deleteWorkoutsAction(workoutId));
    },
    [dispatch],
  );

  const onUpdateWorkouts = useCallback(
    async (payload, workoutId) => {
      await dispatch(updateWorkouts(payload, workoutId));
    },
    [dispatch],
  );

  const onGetWorkouts = useCallback(
    async (programId, type) => {
      await dispatch(getWorkoutsAction(programId, type));
    },
    [dispatch],
  );

  const onGetWorkoutItem = useCallback(
    async (id) => {
      await dispatch(getWorkoutItem(id));
    },
    [dispatch],
  );

  return {
    onCreateWorkouts,
    createWorkouts,
    createWorkoutsStatus,
    onGetWorkouts,
    workoutsNew,
    workoutsNewStatus,
    onGetWorkoutItem,
    workoutItem,
    workoutItemStatus,
    onUpdateWorkouts,
    onDeleteWorkouts,
    deleteWorkouts,
  };
}
