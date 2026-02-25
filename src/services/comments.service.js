import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

// CREATE (POST)
export function createComments(payload) {
  return jfApi.post(JF_APP_ENDPOINTS.comments, payload).then((res) => res.data);
}

export function markCommentsAsRead(payload) {
  return jfApi.put(`${JF_APP_ENDPOINTS.comments}/mark-as-read`, payload).then((res) => res.data);
}

export function getComments(finishedId) {
  return jfApi.get(`${JF_APP_ENDPOINTS.comments}/finished/${finishedId}`).then((res) => res.data);
}
