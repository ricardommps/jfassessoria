import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

const inFlightFeedbackRequests = new Map();

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function getFeedbackRequestKey(customerId, id, payload) {
  return `feedback:${customerId}:${id}:${hashString(stableStringify(payload))}`;
}

// CREATE (POST)
export function getNewComments() {
  return jfApi.get(`${JF_APP_ENDPOINTS.finished}/newComments`).then((res) => res.data);
}

export function createFeedback(customerId, id, payload) {
  const requestKey = getFeedbackRequestKey(customerId, id, payload);
  const pendingRequest = inFlightFeedbackRequests.get(requestKey);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = jfApi
    .put(`${JF_APP_ENDPOINTS.finished}/v2/reviewComment/${customerId}/${id}`, payload, {
      headers: {
        'Idempotency-Key': requestKey,
      },
    })
    .then((res) => res.data)
    .finally(() => {
      inFlightFeedbackRequests.delete(requestKey);
    });

  inFlightFeedbackRequests.set(requestKey, request);

  return request;
}

export function feedBackHistory(id) {
  return jfApi.get(`${JF_APP_ENDPOINTS.finished}/history/${id}`).then((res) => res.data);
}
