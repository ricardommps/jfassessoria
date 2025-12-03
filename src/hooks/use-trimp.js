import { useCallback } from 'react';
import { clearTrimp, getTrimp } from 'src/redux/slices/trimp';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useTrimp() {
  const dispatch = useDispatch();
  const { trimp } = useSelector((state) => state.trimp);

  const onGetTrimp = useCallback(
    async (customerId) => {
      await dispatch(getTrimp(customerId));
    },
    [dispatch],
  );
  const onClearTrimpState = useCallback(async () => {
    await dispatch(clearTrimp());
  }, [dispatch]);

  return {
    onGetTrimp,
    onClearTrimpState,
    trimp,
  };
}
