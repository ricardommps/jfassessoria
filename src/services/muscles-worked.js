import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

// CREATE (POST)
export function createMuscleWorked(payload) {
  return jfApi.post(JF_APP_ENDPOINTS.musclesWorked, payload).then((res) => res.data);
}

// UPDATE (PUT)
export function updateMuscleWorked(mediaId, musclesId) {
  return jfApi
    .put(`${JF_APP_ENDPOINTS.musclesWorked}/${mediaId}`, { musclesId })
    .then((res) => res.data);
}

// DELETE
export function deleteMuscleWorked(mediaId) {
  return jfApi.delete(`${JF_APP_ENDPOINTS.musclesWorked}/${mediaId}`);
}
