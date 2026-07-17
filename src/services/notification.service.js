import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

export function getRunningFinishedAllNotifications() {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.notifications}/running-finished-all`)
    .then((res) => res.data);
}

export function readNotification(notificationId) {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.notifications}/readAt/${notificationId}`)
    .then((res) => res.data);
}
