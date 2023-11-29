import { useCallback } from 'react';
import {
  clearTrainingReview,
  getListAllDone,
  getListByReview,
  getTrainingReview,
  updateFinishedTrainingReq,
} from 'src/redux/slices/finished-training';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useFinishedTraining() {
  const dispatch = useDispatch();
  const {
    listByReview,
    listByReviewStatus,
    trainingReview,
    trainingReviewStatus,
    updateFinishedTraining,
    updateFinishedTrainingStatus,
    allDone,
    allDoneStatus,
  } = useSelector((state) => state.finishedTraining);

  const onListByReview = useCallback(
    (programId) => {
      dispatch(getListByReview(programId));
    },
    [dispatch],
  );

  const onTrainingReview = useCallback(
    (id) => {
      dispatch(getTrainingReview(id));
    },
    [dispatch],
  );

  const onGetListAllDone = useCallback(
    (id) => {
      dispatch(getListAllDone(id));
    },
    [dispatch],
  );

  const onUpdateFinishedTraining = useCallback(
    (finishedUpadate) => {
      dispatch(updateFinishedTrainingReq(finishedUpadate));
    },
    [dispatch],
  );

  const onClearTrainingReview = useCallback(() => {
    dispatch(clearTrainingReview());
  }, [dispatch]);

  return {
    listByReview,
    listByReviewStatus,
    onListByReview,
    onTrainingReview,
    trainingReview,
    trainingReviewStatus,
    updateFinishedTraining,
    updateFinishedTrainingStatus,
    onUpdateFinishedTraining,
    onGetListAllDone,
    allDone,
    allDoneStatus,
    onClearTrainingReview,
  };
}
