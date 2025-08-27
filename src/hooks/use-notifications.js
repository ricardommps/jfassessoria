import { useCallback } from 'react';
import {
  clearCreateNotification,
  createAndEditReq,
  deleteNoticifationReq,
  getNotificationReq,
  getNotificationsReq,
  readAtReq,
} from 'src/redux/slices/notification';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useNotifications() {
  const dispatch = useDispatch();
  const {
    notifications,
    notificationsStatus,
    readAtStatus,
    readAt,
    notification,
    notificationStatus,
    createAndEdit,
    createAndEditStatus,
    deleteNotification,
    deleteNotificationStatus,
  } = useSelector((state) => state.notifications);

  const onGetNotifications = useCallback(
    async (customerId) => {
      return dispatch(getNotificationsReq(customerId)); // Retorna a Promise
    },
    [dispatch],
  );

  const onGetNotification = useCallback(
    async (id) => {
      return dispatch(getNotificationReq(id)); // Retorna a Promise
    },
    [dispatch],
  );

  const onReadAt = useCallback(
    async (notificationId) => {
      dispatch(readAtReq(notificationId));
    },
    [dispatch],
  );

  const onDeleteNoticifation = useCallback(
    async (notificationId) => {
      await dispatch(deleteNoticifationReq(notificationId));
    },
    [dispatch],
  );

  const onCreateAndEdit = useCallback(
    async (payload, notificationId) => {
      await dispatch(createAndEditReq(payload, notificationId));
    },
    [dispatch],
  );

  const onClearCreateNotification = useCallback(() => {
    dispatch(clearCreateNotification());
  }, [dispatch]);

  return {
    onGetNotifications,
    onGetNotification,
    onReadAt,
    onCreateAndEdit,
    notifications,
    notificationsStatus,
    readAt,
    readAtStatus,
    notification,
    notificationStatus,
    createAndEdit,
    createAndEditStatus,
    onDeleteNoticifation,
    deleteNotification,
    deleteNotificationStatus,
    onClearCreateNotification,
  };
}
