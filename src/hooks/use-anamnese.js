import { useCallback } from 'react';
import { clearAnamnese, getAnamnese } from 'src/redux/slices/anamnese';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useAnamnese() {
  const dispatch = useDispatch();
  const { anamnese, anamneseStatus } = useSelector((state) => state.anamnese);

  const onGetAnamnese = useCallback(
    (customerId) => {
      dispatch(getAnamnese(customerId));
    },
    [dispatch],
  );

  const onClearAnamnese = useCallback(() => {
    dispatch(clearAnamnese());
  }, [dispatch]);

  return {
    onGetAnamnese,
    anamnese,
    anamneseStatus,
    onClearAnamnese,
  };
}
