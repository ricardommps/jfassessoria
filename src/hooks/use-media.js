import { useCallback } from 'react';
import { createMedia, getListMedias } from 'src/redux/slices/medias';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useMedia() {
  const dispatch = useDispatch();
  const { medias, mediasStatus, mediaCreate, mediaCreateStatus } = useSelector(
    (state) => state.medias,
  );

  const onGetListMedias = useCallback(() => {
    dispatch(getListMedias());
  }, [dispatch]);

  const onCreateMedia = useCallback(
    (payload) => {
      dispatch(createMedia(payload));
    },
    [dispatch],
  );

  return {
    medias,
    mediasStatus,
    onGetListMedias,
    mediaCreate,
    mediaCreateStatus,
    onCreateMedia,
  };
}
