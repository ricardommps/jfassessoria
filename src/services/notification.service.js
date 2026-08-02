import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

export function getRunningFinishedAllNotifications() {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.notificationsV2}/running-finished-all`)
    .then((res) => res.data);
}

export function readNotification(notificationId) {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.notificationsV2}/readAt/${notificationId}`)
    .then((res) => res.data);
}
