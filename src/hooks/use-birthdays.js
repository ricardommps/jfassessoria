import { useCallback } from 'react';
import { getBirthdays } from 'src/redux/slices/customers';
import { useDispatch, useSelector } from 'src/redux/store';

export default function useBirthdays() {
  const dispatch = useDispatch();
  const { birthdays, birthdaysStatus } = useSelector((state) => state.customer);

  const onGetBirthdays = useCallback(async () => {
    await dispatch(getBirthdays());
  }, [dispatch]);

  return {
    birthdays,
    birthdaysStatus,
    onGetBirthdays,
  };
}
