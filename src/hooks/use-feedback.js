import { useCallback } from 'react';
import { getUnreviewedFinished } from 'src/redux/slices/feedback';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useFeedback() {
  const dispatch = useDispatch();
  const { unreviewedFinished } = useSelector((state) => state.feedback);
  const onGetUnreviewedFinished = useCallback(async () => {
    await dispatch(getUnreviewedFinished());
  }, [dispatch]);

  return {
    onGetUnreviewedFinished,
    unreviewedFinished,
  };
}
