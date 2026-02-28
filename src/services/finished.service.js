import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

// CREATE (POST)
export function getNewComments() {
  return jfApi.get(`${JF_APP_ENDPOINTS.finished}/newComments`).then((res) => res.data);
}

export function createFeedback(customerId, id, payload) {
  return jfApi
    .put(`${JF_APP_ENDPOINTS.finished}/reviewComment/${customerId}/${id}`, payload)
    .then((res) => res.data);
}

export function feedBackHistory(id) {
  return jfApi.get(`${JF_APP_ENDPOINTS.finished}/history/${id}`).then((res) => res.data);
}
