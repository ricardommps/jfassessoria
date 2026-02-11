import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

// CREATE (POST)
export function getMedias() {
  return jfApi.get(`${JF_APP_ENDPOINTS.media}/getMediasMusclesWorked`).then((res) => res.data);
}
