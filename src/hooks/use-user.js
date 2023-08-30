import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from 'src/redux/slices/user';

export default function useUser() {
  const dispatch = useDispatch();
  const { changePasswordSuccess, changePasswordStatus } = useSelector((state) => state.user);

  const onChangePassword = useCallback(
    (updatePassword) => {
      dispatch(changePassword(updatePassword));
    },
    [dispatch],
  );
  return {
    changePasswordSuccess,
    changePasswordStatus,
    onChangePassword,
  };
}
