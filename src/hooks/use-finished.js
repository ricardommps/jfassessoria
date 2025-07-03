import { useCallback } from 'react';
import { clearVolume, getVolume } from 'src/redux/slices/finished';
import { useDispatch, useSelector } from 'src/redux/store';
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
