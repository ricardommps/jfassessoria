import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { clearVolume, getVolume } from 'src/redux/slices/finished';
import { useDispatch, useSelector } from 'src/redux/store';
import { createFeedback, getNewComments } from 'src/services/finished.service';
export default function useFinished() {
  const dispatch = useDispatch();
  const { volume } = useSelector((state) => state.finished);

  const onGetVolume = useCallback(
    async (customerId, programId, startDate, endDate) => {
      await dispatch(getVolume(customerId, programId, startDate, endDate));
    },
    [dispatch],
  );
  const onClearVolumeState = useCallback(async () => {
    await dispatch(clearVolume());
  }, [dispatch]);

  return {
    onGetVolume,
    onClearVolumeState,
    volume,
  };
}

export function useNewComments() {
  return useQuery({
    queryKey: ['new-comments'],
    queryFn: getNewComments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
export function useCreateFeedback() {
  const {
    mutateAsync,
    isLoading: isCreatingFeedback,
    error,
    data,
  } = useMutation({
    mutationFn: ({ customerId, finishedId, payload }) =>
      createFeedback(customerId, finishedId, payload),
  });

  return {
    createFeedback: mutateAsync,
    isCreatingFeedback,
    error,
    data,
  };
}
