import { useCallback } from 'react';
import {
  createMedia,
  getListMedias,
  getMediaById,
  getMediasWithStretchTag,
} from 'src/redux/slices/medias';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useMedia() {
  const dispatch = useDispatch();
  const { medias, mediasStatus, mediaCreate, mediaCreateStatus, media, mediaStatus } = useSelector(
    (state) => state.medias,
  );

  const onGetListMedias = useCallback(
    (isStretches) => {
      if (isStretches) {
        dispatch(getMediasWithStretchTag());
      } else {
        dispatch(getListMedias());
      }
    },
    [dispatch],
  );

  const onCreateMedia = useCallback(
    (payload) => {
      dispatch(createMedia(payload));
    },
    [dispatch],
  );

  const onMediaById = useCallback(
    (id) => {
      dispatch(getMediaById(id));
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
    onMediaById,
    media,
    mediaStatus,
  };
}
