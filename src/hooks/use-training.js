import { useCallback } from 'react';
import {
  callCloneTrainingNew,
  callShowTraining,
  clearTraining,
  clearTrainings,
  createTraining,
  deleteTrainingReq,
  getTrainingById,
  getTrainings,
  listTrainings,
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
    deleteTraining,
    deleteTrainingStatus,
  } = useSelector((state) => state.training);
  const onListTrainings = useCallback(
    (programId) => {
      dispatch(getTrainings(programId));
    },
    [dispatch],
  );

  const onTrainingsList = useCallback(
    async (programId) => {
      await dispatch(listTrainings(programId));
    },
    [dispatch],
  );

  const onCreateTraining = useCallback(
    async (newTraining) => {
      await dispatch(createTraining(newTraining));
    },
    [dispatch],
  );

  const onCloneTraining = useCallback(
    (trainingId, qntCopy) => {
      dispatch(callCloneTrainingNew(trainingId, qntCopy));
    },
    [dispatch],
  );

  const onTrainingById = useCallback(
    async (trainingId) => {
      await dispatch(getTrainingById(trainingId));
    },
    [dispatch],
  );

  const onUpdateTraining = useCallback(
    async (trainingUpdate, trainingId) => {
      await dispatch(updateTraining(trainingUpdate, trainingId));
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
    async (newTraining) => {
      await dispatch(sendTraining(newTraining));
    },
    [dispatch],
  );

  const onDeleteTraining = useCallback(
    async (trainingId) => {
      await dispatch(deleteTrainingReq(trainingId));
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
    onDeleteTraining,
    deleteTraining,
    deleteTrainingStatus,
    onTrainingsList,
  };
}
