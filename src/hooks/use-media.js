import { useCallback } from 'react';
import {
  createMedia,
  deleteMediaById,
  getListMedias,
  getMediaById,
  getMediasWithTagFiltered,
} from 'src/redux/slices/medias';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useMedia() {
  const dispatch = useDispatch();
  const {
    medias,
    mediasStatus,
    mediaCreate,
    mediaCreateStatus,
    media,
    mediaStatus,
    deleteMedia,
    deleteStatus,
  } = useSelector((state) => state.medias);

  const onGetListMedias = useCallback(
    (tags) => {
      if (tags) {
        dispatch(getMediasWithTagFiltered(tags));
      } else {
        dispatch(getListMedias());
      }
    },
    [dispatch],
  );

  const onCreateMedia = useCallback(
    (payload, mediaId) => {
      dispatch(createMedia(payload, mediaId));
    },
    [dispatch],
  );

  const onMediaById = useCallback(
    (id) => {
      dispatch(getMediaById(id));
    },
    [dispatch],
  );

  const onDeleteMediaById = useCallback(
    (id) => {
      dispatch(deleteMediaById(id));
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
    onDeleteMediaById,
    deleteMedia,
    deleteStatus,
  };
}
