import { useCallback } from 'react';
import { getListMedias } from 'src/redux/slices/medias';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useMedia() {
  const dispatch = useDispatch();
  const { medias, mediasStatus } = useSelector((state) => state.medias);

  const onGetListMedias = useCallback(() => {
    dispatch(getListMedias());
  }, [dispatch]);

  return {
    medias,
    mediasStatus,
    onGetListMedias,
  };
}
