import { useCallback } from 'react';
import {
  callCloneTraining,
  callShowTraining,
  clearTraining,
  clearTrainings,
  createTraining,
  getTrainingById,
  getTrainings,
  sendTraining,
  updateTraining,
} from 'src/redux/slices/training';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useTraining() {
  const dispatch = useDispatch();
  const {
    trainings,
    trainingsStatus,
    trainingCreate,
    training,
    trainingStatus,
    updateTrainingSuccess,
    showTraining,
    cloneTraining,
    cloneTrainingStatus,
    sendTrainingSuccess,
    sendTrainingStatus,
  } = useSelector((state) => state.training);
  const onListTrainings = useCallback(
    (programId) => {
      dispatch(getTrainings(programId));
    },
    [dispatch],
  );

  const onCreateTraining = useCallback(
    (newTraining) => {
      dispatch(createTraining(newTraining));
    },
    [dispatch],
  );

  const onCloneTraining = useCallback(
    (newTraining) => {
      dispatch(callCloneTraining(newTraining));
    },
    [dispatch],
  );

  const onTrainingById = useCallback(
    (trainingId) => {
      dispatch(getTrainingById(trainingId));
    },
    [dispatch],
  );

  const onUpdateTraining = useCallback(
    (trainingUpdate, trainingId) => {
      dispatch(updateTraining(trainingUpdate, trainingId));
    },
    [dispatch],
  );

  const onClearTraining = useCallback(() => {
    dispatch(clearTraining());
  }, [dispatch]);

  const onClearTrainings = useCallback(() => {
    dispatch(clearTrainings());
  }, [dispatch]);

  const onShowTraining = useCallback(
    (status) => {
      dispatch(callShowTraining(status));
    },
    [dispatch],
  );

  const onSendTraining = useCallback(
    (newTraining) => {
      dispatch(sendTraining(newTraining));
    },
    [dispatch],
  );

  return {
    trainings,
    trainingsStatus,
    trainingCreate,
    training,
    trainingStatus,
    cloneTraining,
    cloneTrainingStatus,
    updateTrainingSuccess,
    onListTrainings,
    onClearTraining,
    onCreateTraining,
    onTrainingById,
    onUpdateTraining,
    onClearTrainings,
    onShowTraining,
    showTraining,
    onCloneTraining,
    onSendTraining,
    sendTrainingSuccess,
    sendTrainingStatus,
  };
}
