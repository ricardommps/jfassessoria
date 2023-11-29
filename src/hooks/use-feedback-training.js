import { useCallback } from 'react';
import {
  clearFeedback,
  feedbackSaveReq,
  feedbackUpdateReq,
} from 'src/redux/slices/feedback-training';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useFeedbackTraining() {
  const dispatch = useDispatch();
  const { feedbackSave, feedbackSaveStatus, feedbackUpdate, feedbackUpdateStatus } = useSelector(
    (state) => state.feedbackTraining,
  );
  const onFeedbackSave = useCallback(
    (saveData) => {
      dispatch(feedbackSaveReq(saveData));
    },
    [dispatch],
  );

  const onFeedbackUpdate = useCallback(
    (updateData) => {
      dispatch(feedbackUpdateReq(updateData));
    },
    [dispatch],
  );

  const onClearFeedback = useCallback(() => {
    dispatch(clearFeedback());
  }, [dispatch]);

  return {
    onFeedbackSave,
    feedbackSave,
    feedbackSaveStatus,
    onFeedbackUpdate,
    feedbackUpdate,
    feedbackUpdateStatus,
    onClearFeedback,
  };
}
